#!/usr/bin/env node
/**
 * @fileoverview
 * Builds the simple-icons-font package based on the installed simple-icons
 * dependency.
 */

import CleanCSS from 'clean-css';
import fsSync, { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import punycode from 'punycode/punycode.js';
import * as simpleIcons from 'simple-icons';
import { getIconsData, getIconSlug } from 'simple-icons/sdk';
import svg2ttf from 'svg2ttf';
import SVGPath from 'svgpath';
import ttf2eot from 'ttf2eot';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';
import woff2otf from 'woff2otf';
import { fileURLToPath } from 'node:url';
import util from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const UTF8 = 'utf8';

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'font');
const MIN_UNICODE = 59905;
const MAX_UNICODE = 1112063;
const RESERVED_UNICODES = 3000;
const UNICODE_START = MIN_UNICODE;
const UNICODE_RANGE = MAX_UNICODE - MIN_UNICODE;

const PACKAGE_JSON_FILE = path.join(ROOT_DIR, 'package.json');
const PACKAGE_JSON = JSON.parse(fsSync.readFileSync(PACKAGE_JSON_FILE, UTF8));

const CSS_OUTPUT_FILE = path.join(DIST_DIR, 'simple-icons.css');
const CSS_MIN_OUTPUT_FILE = path.join(DIST_DIR, 'simple-icons.min.css');
const SVG_OUTPUT_FILE = path.join(DIST_DIR, 'SimpleIcons.svg');
const TTF_OUTPUT_FILE = path.join(DIST_DIR, 'SimpleIcons.ttf');
const EOT_OUTPUT_FILE = path.join(DIST_DIR, 'SimpleIcons.eot');
const OTF_OUTPUT_FILE = path.join(DIST_DIR, 'SimpleIcons.otf');
const WOFF_OUTPUT_FILE = path.join(DIST_DIR, 'SimpleIcons.woff');
const WOFF2_OUTPUT_FILE = path.join(DIST_DIR, 'SimpleIcons.woff2');

const CSS_BASE_FILE = path.resolve(__dirname, 'templates', 'base.css');
const SVG_TEMPLATE_FILE = path.join(__dirname, 'templates', 'font.svg');

const { SI_FONT_SLUGS_FILTER = '' } = process.env;
const siFontSlugs = new Set(SI_FONT_SLUGS_FILTER.split(',').filter(Boolean));

const cssDecodeUnicode = (value) => {
  // &#xF26E; -> \f26e
  return value.replace('&#x', '\\').replace(';', '').toLowerCase();
};

/**
 * Check if a file exists.
 * @param {string} fpath File path to check.
 * @returns {Promise<boolean>} True if the file exists, false otherwise.
 */
const fileExists = async (fpath) => {
  try {
    await fs.access(fpath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Build the data needed for the font.
 *
 * To guarantee that the unicodes are unique between executions, we need to
 * load the previous slugs with their unicodes computed via hash + mapping.
 *
 * Note that when a slug is removed, the unicodes that are missing now will
 * not be used again. This could lead to a situation where the map has grown
 * beyond the number of available unicodes, which are 1052158. This number
 * if computed from `1112063 - 59905` where:
 *
 *  - 1112063 is the maximum unicode value for a glyph in a UTF-16 encoding.
 *  - 59905   is the first unicode value used prevent conflicts with other fonts.
 *
 * In the case of a collision, the hashes file must be removed and built again,
 * which will lead to a new set of unicodes. This must be done manually and
 * published to the changelog in a breaking major version. A warning will be
 * triggered if the number of slugs exceeds the maximum available minus a convenient
 * number of reserved unicodes to prevent collisions.
 */
const buildData = async () => {
  const unicodesBySlugFile = path.join(ROOT_DIR, 'unicodes.json');
  const unicodesBySlug = (await fileExists(unicodesBySlugFile))
    ? JSON.parse(await fs.readFile(unicodesBySlugFile, UTF8))
    : {};

  const usedUnicodes = Object.values(unicodesBySlug);
  const dataBySlug = [];

  /**
   * Computes the FNV-1a hash of a string.
   * @param {string} string_
   * @returns
   */
  const fnv1aHash = (string_) => {
    let hash = 0x811c9dc5; // initial seed (offset basis)
    for (let i = 0; i < string_.length; i++) {
      hash ^= string_.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0; // multiply by FNV prime
    }
    return hash;
  };

  /**
   * Assigns a unique and persistent number to a slug.
   * @param {*} slug Slug to be converted to unicode.
   * @returns
   */
  const slugToUnicode = (slug) => {
    let attempt = 0;
    let candidate, hash;

    while (true) {
      const input = attempt === 0 ? slug : `${slug}${attempt}`;
      hash = fnv1aHash(input);
      candidate = UNICODE_START + (hash % UNICODE_RANGE);

      if (!usedUnicodes.includes(candidate)) {
        usedUnicodes.push(candidate);
        unicodesBySlug[slug] = candidate;
        return candidate;
      }

      attempt++;
    }
  };

  const iconsData = await getIconsData();
  for (const iconData of iconsData) {
    const iconSlug = getIconSlug(iconData);
    const iconKey = 'si' + iconSlug.at(0).toUpperCase() + iconSlug.slice(1);
    const icon = simpleIcons[iconKey];

    if (siFontSlugs.size && !siFontSlugs.has(iconSlug)) {
      continue;
    }

    const unicode = unicodesBySlug.hasOwnProperty(iconSlug)
      ? unicodesBySlug[iconSlug]
      : slugToUnicode(iconSlug);
    const unicodeString = punycode.ucs2
      .decode(String.fromCodePoint(unicode))
      .map((point) => `&#x${point.toString(16).toUpperCase()};`)
      .join('');

    dataBySlug[iconSlug] = {
      unicodeString,
      hex: iconData.hex,
      path: icon.path,
    };
  }

  const numberOfSlugs = Object.keys(dataBySlug).length;
  const maxNumberOfSlugs = UNICODE_RANGE - RESERVED_UNICODES;
  if (numberOfSlugs > maxNumberOfSlugs) {
    const warningMessage =
      `[WARNING] The number of unicodes (${numberOfSlugs}) exceeds the maximum` +
      ` available to guarantee that there will not be unicode collisions in the` +
      `  next major version (${maxNumberOfSlugs}).\n` +
      `Please, remove the ${unicodesBySlugFile} file in the next major version` +
      ` and publish in the CHANGELOG that the unicodes have been changed.\n`;

    let prefix = '';
    if (process.env.GITHUB_ACTIONS) {
      prefix = '::warning file=unicodes.json::';
    }

    // TODO: save the maximum allowed major version in a file and exit before
    //       building if the version has been reached.

    console.error(`${prefix}${warningMessage}`);
  }

  // Save the unicodes by slug to a file
  if (!siFontSlugs.size) {
    await fs.writeFile(
      unicodesBySlugFile,
      `${JSON.stringify(unicodesBySlug, null, 2)}\n`,
    );
  }

  return dataBySlug;
};

const buildSimpleIconsSvgFontFile = async (dataBySlug) => {
  let glyphsContent = '';

  for (const iconSlug in dataBySlug) {
    const { unicodeString, path } = dataBySlug[iconSlug];

    const verticalTransformedPath = SVGPath(path)
      .translate(0, -24)
      .scale(50, -50)
      .round(6)
      .toString();

    glyphsContent += `<glyph glyph-name="${iconSlug}" unicode="${unicodeString}" d="${verticalTransformedPath}" horiz-adv-x="1200"/>`;
  }

  const svgFontTemplate = await fs.readFile(SVG_TEMPLATE_FILE, UTF8);
  const svgFileContent = util.format(svgFontTemplate, glyphsContent);
  await fs.writeFile(SVG_OUTPUT_FILE, svgFileContent);
  console.log(`'${SVG_OUTPUT_FILE}' file built`);

  return svgFileContent;
};

const buildSimpleIconsCssFile = (dataBySlug) =>
  new Promise(async (resolve, reject) => {
    try {
      let cssFileContent = await fs.readFile(CSS_BASE_FILE);

      for (const slug in dataBySlug) {
        const { unicodeString, hex } = dataBySlug[slug];
        cssFileContent += `
.si-${slug}::before { content: "${cssDecodeUnicode(unicodeString)}"; }
.si-${slug}.si--color::before { color: #${hex}; }`;
      }

      await fs.writeFile(CSS_OUTPUT_FILE, cssFileContent);
      console.log(`'${CSS_OUTPUT_FILE}' file built`);

      resolve(cssFileContent);
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsMinCssFile = (cssFileContent) =>
  new Promise(async (resolve, reject) => {
    try {
      const cssMinifiedFile = new CleanCSS({
        compatibility: 'ie7',
      }).minify(cssFileContent);

      await fs.writeFile(CSS_MIN_OUTPUT_FILE, cssMinifiedFile.styles);
      console.log(`'${CSS_MIN_OUTPUT_FILE}' file built`);

      resolve();
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsTtfFontFile = (svgFileContent) =>
  new Promise(async (resolve, reject) => {
    try {
      const ttf = svg2ttf(svgFileContent, {
        version: `Version ${PACKAGE_JSON.version
          .split('.')
          .slice(0, 2)
          .join('.')}`,
        description: PACKAGE_JSON.description,
        url: PACKAGE_JSON.homepage,
      });
      const ttfFileContent = new Buffer.from(ttf.buffer);
      await fs.writeFile(TTF_OUTPUT_FILE, ttfFileContent);
      console.log(`'${TTF_OUTPUT_FILE}' file built`);
      resolve(ttfFileContent);
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsWoffFontFile = (ttfFileContent) =>
  new Promise(async (resolve, reject) => {
    try {
      const woff = new Buffer.from(
        ttf2woff(new Uint8Array(ttfFileContent)).buffer,
      );
      await fs.writeFile(WOFF_OUTPUT_FILE, woff);
      console.log(`'${WOFF_OUTPUT_FILE}' file built`);
      resolve(woff);
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsWoff2FontFile = (ttfFileContent) =>
  new Promise(async (resolve, reject) => {
    try {
      const woff2 = ttf2woff2(ttfFileContent);
      await fs.writeFile(WOFF2_OUTPUT_FILE, woff2);
      console.log(`'${WOFF2_OUTPUT_FILE}' file built`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsEotFontFile = (ttfFileContent) =>
  new Promise(async (resolve, reject) => {
    try {
      const ttf = new Uint8Array(ttfFileContent);
      const eot = new Buffer.from(ttf2eot(ttf).buffer);
      await fs.writeFile(EOT_OUTPUT_FILE, eot);
      console.log(`'${EOT_OUTPUT_FILE}' file built`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsOtfFontFile = (woffFileContent) =>
  new Promise(async (resolve, reject) => {
    try {
      const otf = woff2otf(woffFileContent);
      await fs.writeFile(OTF_OUTPUT_FILE, otf);
      console.log(`'${OTF_OUTPUT_FILE}' file built`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });

const main = async () => {
  if (!fsSync.existsSync(DIST_DIR)) {
    await fs.mkdir(DIST_DIR);
  }

  const dataBySlug = await buildData();

  const svgFileContent = await buildSimpleIconsSvgFontFile(dataBySlug);

  Promise.all([
    buildSimpleIconsCssFile(dataBySlug),
    buildSimpleIconsTtfFontFile(svgFileContent),
  ]).then(([cssFileContent, ttfFileContent]) => {
    Promise.all([
      buildSimpleIconsWoffFontFile(ttfFileContent),
      buildSimpleIconsMinCssFile(cssFileContent),
      buildSimpleIconsWoff2FontFile(ttfFileContent),
      buildSimpleIconsEotFontFile(ttfFileContent),
    ]).then(async ([woffFileContent]) => {
      await buildSimpleIconsOtfFontFile(woffFileContent);
    });
  });
};

main();
