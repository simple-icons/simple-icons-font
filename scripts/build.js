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
import * as simpleIcons from 'simple-icons/icons';
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
const START_UNICODE = 0xea01;

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'font');

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
const DATA_JSON_OUTPUT_FILE = path.join(DIST_DIR, 'SimpleIcons.json');
const DATA_JSON_MIN_OUTPUT_FILE = path.join(DIST_DIR, 'SimpleIcons.min.json');

const CSS_BASE_FILE = path.resolve(__dirname, 'templates', 'base.css');
const SVG_TEMPLATE_FILE = path.join(__dirname, 'templates', 'font.svg');

const cssDecodeUnicode = (value) => {
  // &#xF26E; -> \f26e
  return value.replace('&#x', '\\').replace(';', '').toLowerCase();
};

const { SI_FONT_SLUGS_FILTER = '', SI_FONT_PRESERVE_UNICODES } = process.env;
const siFontSlugs = new Set(SI_FONT_SLUGS_FILTER.split(',').filter(Boolean));
const siFontPreseveUnicodes = SI_FONT_PRESERVE_UNICODES !== 'false';

const icons = await getIconsData();

const buildSimpleIconsSvgFontFile = async () => {
  const usedUnicodes = [];
  const unicodeHexBySlug = [];
  let startUnicode = START_UNICODE;
  let glyphsContent = '';

  for (const iconData of icons) {
    const iconSlug = getIconSlug(iconData);
    const key = 'si' + iconSlug.at(0).toUpperCase() + iconSlug.slice(1);

    if (siFontSlugs.size && !siFontSlugs.has(iconSlug)) {
      if (siFontPreseveUnicodes) startUnicode++;
      continue;
    }

    const nextUnicode = punycode.ucs2.decode(
      String.fromCodePoint(startUnicode++),
    );
    const unicodeString = nextUnicode
      .map((point) => `&#x${point.toString(16).toUpperCase()};`)
      .join('');
    if (usedUnicodes.includes(unicodeString)) {
      throw Error(`Unicodes must be unique. Found '${unicodeString}' repeated`);
    }

    const icon = simpleIcons[key];
    const verticalTransformedPath = SVGPath(icon.path)
      .translate(0, -24)
      .scale(50, -50)
      .round(6)
      .toString();

    glyphsContent += `<glyph glyph-name="${icon.slug}" unicode="${unicodeString}" d="${verticalTransformedPath}" horiz-adv-x="1200"/>`;
    usedUnicodes.push(unicodeString);

    unicodeHexBySlug[icon.slug] = {
      unicode: unicodeString,
      hex: icon.hex,
    };
  }

  const svgFontTemplate = await fs.readFile(SVG_TEMPLATE_FILE, UTF8);
  const svgFileContent = util.format(svgFontTemplate, glyphsContent);
  await fs.writeFile(SVG_OUTPUT_FILE, svgFileContent);
  console.log(`'${SVG_OUTPUT_FILE}' file built`);

  return { unicodeHexBySlug, svgFileContent };
};

const buildSimpleIconsCssFile = (unicodeHexBySlug) =>
  new Promise(async (resolve, reject) => {
    try {
      let cssFileContent = await fs.readFile(CSS_BASE_FILE);

      for (let slug in unicodeHexBySlug) {
        let icon = unicodeHexBySlug[slug];

        cssFileContent += `
.si-${slug}::before { content: "${cssDecodeUnicode(icon.unicode)}"; }
.si-${slug}.si--color::before { color: #${icon.hex}; }`;
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

const buildSimpleIconsJsonFile = () => {
  new Promise(async (resolve, reject) => {
    try {
      const iconsWithSlugs = icons.map(({ title, slug, ...rest }, index) => ({
        title,
        slug: getIconSlug({ title, slug }),
        code: (START_UNICODE + index).toString(16),
        ...rest,
      }));
      const jsonFileContent = JSON.stringify(iconsWithSlugs, null, '\t');
      const minJsonFileContent = JSON.stringify(iconsWithSlugs);

      await Promise.all([
        fs.writeFile(DATA_JSON_OUTPUT_FILE, jsonFileContent).then(() => {
          console.log(`'${DATA_JSON_OUTPUT_FILE}' file built`);
        }),
        fs.writeFile(DATA_JSON_MIN_OUTPUT_FILE, minJsonFileContent).then(() => {
          console.log(`'${DATA_JSON_MIN_OUTPUT_FILE}' file built`);
        }),
      ]);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

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

  const { unicodeHexBySlug, svgFileContent } =
    await buildSimpleIconsSvgFontFile();

  Promise.all([
    buildSimpleIconsCssFile(unicodeHexBySlug),
    buildSimpleIconsTtfFontFile(svgFileContent),
    buildSimpleIconsJsonFile(),
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
