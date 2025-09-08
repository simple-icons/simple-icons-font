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
import iconsData from 'simple-icons/icons.json' with { type: 'json' };
import { svgPathBbox } from 'svg-path-bbox';
import svg2ttf from 'svg2ttf';
import SVGPath from 'svgpath';
import ttf2eot from 'ttf2eot';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';
import woff2otf from 'woff2otf';
import util from 'util';

const UTF8 = 'utf8';
const START_UNICODE = 0xea01;

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'font');

const PACKAGE_JSON_FILE = path.join(ROOT_DIR, 'package.json');
const PACKAGE_JSON = JSON.parse(fsSync.readFileSync(PACKAGE_JSON_FILE, UTF8));

const OUTPUT_CSS_NAME = 'simple-icons.css';
const OUTPUT_CSS_MIN_NAME = 'simple-icons.min.css';
const OUTPUT_FILE_NAME = 'SimpleIcons';
const OUTPUT_DATA_JSON_NAME = 'simple-icons.json';
const OUTPUT_DATA_JSON_MIN_NAME = 'simple-icons.min.json';

const SVG_EXTENSION_NAME = '.svg';
const TTF_EXTENSION_NAME = '.ttf';
const EOT_EXTENSION_NAME = '.eot';
const OTF_EXTENSION_NAME = '.otf';
const WOFF_EXTENSION_NAME = '.woff';
const WOFF2_EXTENSION_NAME = '.woff2';

const REGULAR_STYLE_NAME = 'Regular';
const FIT_STYLE_NAME = 'Fit';

const TARGET_STYLES = [REGULAR_STYLE_NAME, FIT_STYLE_NAME];

const CSS_BASE_FILE = path.resolve(
  import.meta.dirname,
  'templates',
  'base.css',
);
const SVG_TEMPLATE_FILE = path.join(
  import.meta.dirname,
  'templates',
  'font.svg',
);

const cssDecodeUnicode = (value) => {
  // &#xF26E; -> \f26e
  return value.replace('&#x', '\\').replace(';', '').toLowerCase();
};

const { SI_FONT_SLUGS_FILTER = '', SI_FONT_PRESERVE_UNICODES } = process.env;
const siFontSlugs = new Set(SI_FONT_SLUGS_FILTER.split(',').filter(Boolean));
const siFontPreseveUnicodes = SI_FONT_PRESERVE_UNICODES !== 'false';

const verticalTransform = (pathInstance) =>
  pathInstance.translate(0, -24).scale(50, -50).round(6).toString();

const convertToAspectRatioViewbox = (pathInstance) => {
  const [x0, y0, x1, y1] = svgPathBbox(pathInstance);
  const width = x1 - x0;
  const height = y1 - y0;
  const scale = 24 / height;
  const pathRescale = width > height ? pathInstance.scale(scale) : pathInstance;
  const [offsetX, offsetY] = svgPathBbox(pathRescale);
  const pathReset = pathRescale.translate(-offsetX, -offsetY);
  const [x0Reset, , x1Reset] = svgPathBbox(pathReset);
  return {
    path: verticalTransform(pathReset),
    horizAdvX: ((x1Reset - x0Reset) / 24) * 1200,
  };
};

const transform = (pathInstance, style) => {
  switch (style) {
    case REGULAR_STYLE_NAME: {
      return { path: verticalTransform(pathInstance), horizAdvX: 1200 };
    }
    case FIT_STYLE_NAME: {
      return convertToAspectRatioViewbox(pathInstance);
    }
    default:
      throw new Error(`Invalid style: ${style}`);
  }
};

const getStyleSuffix = (style) =>
  `${style === REGULAR_STYLE_NAME ? '' : `-${style}`}`;

const buildSimpleIconsSvgFontFile = async (style) => {
  const usedUnicodes = [];
  const unicodeHexBySlug = [];
  let startUnicode = START_UNICODE;
  let glyphsContent = '';

  for (const iconData of iconsData) {
    const key =
      'si' + iconData.slug.at(0).toUpperCase() + iconData.slug.slice(1);

    if (siFontSlugs.size && !siFontSlugs.has(iconData.slug)) {
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
    const { path, horizAdvX } = transform(SVGPath(icon.path), style);

    glyphsContent += `<glyph glyph-name="${icon.slug}" unicode="${unicodeString}" d="${path}" horiz-adv-x="${horizAdvX}"/>`;
    usedUnicodes.push(unicodeString);

    unicodeHexBySlug[icon.slug] = {
      unicode: unicodeString,
      hex: icon.hex,
    };
  }

  const svgFontTemplate = await fs.readFile(SVG_TEMPLATE_FILE, UTF8);
  const svgFileContent = util.format(
    svgFontTemplate,
    style === REGULAR_STYLE_NAME ? '' : ` ${style}`, // font id
    style, // font style
    glyphsContent,
  );
  const svgFilename = `${OUTPUT_FILE_NAME}${getStyleSuffix(style)}${SVG_EXTENSION_NAME}`;
  await fs.writeFile(path.join(DIST_DIR, svgFilename), svgFileContent);
  console.log(`'${svgFilename}' file built`);

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

      await fs.writeFile(path.join(DIST_DIR, OUTPUT_CSS_NAME), cssFileContent);
      console.log(`'${OUTPUT_CSS_NAME}' file built`);

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

      await fs.writeFile(
        path.join(DIST_DIR, OUTPUT_CSS_MIN_NAME),
        cssMinifiedFile.styles,
      );
      console.log(`'${OUTPUT_CSS_MIN_NAME}' file built`);

      resolve();
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsJsonFile = () => {
  new Promise(async (resolve, reject) => {
    try {
      const iconsWithSlugs = iconsData.map(
        ({ title, slug, ...rest }, index) => ({
          title,
          slug,
          code: (START_UNICODE + index).toString(16),
          ...rest,
        }),
      );
      const jsonFileContent = JSON.stringify(iconsWithSlugs, null, '\t');
      const minJsonFileContent = JSON.stringify(iconsWithSlugs);

      await Promise.all([
        fs
          .writeFile(
            path.join(DIST_DIR, OUTPUT_DATA_JSON_NAME),
            jsonFileContent,
          )
          .then(() => {
            console.log(`'${OUTPUT_DATA_JSON_NAME}' file built`);
          }),
        fs
          .writeFile(
            path.join(DIST_DIR, OUTPUT_DATA_JSON_MIN_NAME),
            minJsonFileContent,
          )
          .then(() => {
            console.log(`'${OUTPUT_DATA_JSON_MIN_NAME}' file built`);
          }),
      ]);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const buildSimpleIconsTtfFontFile = (svgFileContent, style) =>
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
      const filename = `${OUTPUT_FILE_NAME}${getStyleSuffix(style)}${TTF_EXTENSION_NAME}`;
      await fs.writeFile(path.join(DIST_DIR, filename), ttfFileContent);
      console.log(`'${filename}' file built`);
      resolve(ttfFileContent);
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsWoffFontFile = (ttfFileContent, style) =>
  new Promise(async (resolve, reject) => {
    try {
      const woff = new Buffer.from(
        ttf2woff(new Uint8Array(ttfFileContent)).buffer,
      );
      const filename = `${OUTPUT_FILE_NAME}${getStyleSuffix(style)}${WOFF_EXTENSION_NAME}`;
      await fs.writeFile(path.join(DIST_DIR, filename), woff);
      console.log(`'${filename}' file built`);
      resolve(woff);
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsWoff2FontFile = (ttfFileContent, style) =>
  new Promise(async (resolve, reject) => {
    try {
      const woff2 = ttf2woff2(ttfFileContent);
      const filename = `${OUTPUT_FILE_NAME}${getStyleSuffix(style)}${WOFF2_EXTENSION_NAME}`;
      await fs.writeFile(path.join(DIST_DIR, filename), woff2);
      console.log(`'${filename}' file built`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsEotFontFile = (ttfFileContent, style) =>
  new Promise(async (resolve, reject) => {
    try {
      const ttf = new Uint8Array(ttfFileContent);
      const eot = new Buffer.from(ttf2eot(ttf).buffer);
      const filename = `${OUTPUT_FILE_NAME}${getStyleSuffix(style)}${EOT_EXTENSION_NAME}`;
      await fs.writeFile(path.join(DIST_DIR, filename), eot);
      console.log(`'${filename}' file built`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });

const buildSimpleIconsOtfFontFile = (woffFileContent, style) =>
  new Promise(async (resolve, reject) => {
    try {
      const otf = woff2otf(woffFileContent);
      const filename = `${OUTPUT_FILE_NAME}${getStyleSuffix(style)}${OTF_EXTENSION_NAME}`;
      await fs.writeFile(path.join(DIST_DIR, filename), otf);
      console.log(`'${filename}' file built`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });

const build = async (style) => {
  const { unicodeHexBySlug, svgFileContent } =
    await buildSimpleIconsSvgFontFile(style);

  const ttfFileContent = await buildSimpleIconsTtfFontFile(
    svgFileContent,
    style,
  );

  const [woffFileContent] = await Promise.all([
    buildSimpleIconsWoffFontFile(ttfFileContent, style),
    buildSimpleIconsWoff2FontFile(ttfFileContent, style),
    buildSimpleIconsEotFontFile(ttfFileContent, style),
  ]);

  await buildSimpleIconsOtfFontFile(woffFileContent, style);

  return unicodeHexBySlug;
};

const main = async () => {
  if (!fsSync.existsSync(DIST_DIR)) await fs.mkdir(DIST_DIR);

  const [unicodeHexBySlug] = await Promise.all(
    TARGET_STYLES.map((style) => build(style)),
  );

  await buildSimpleIconsJsonFile();
  const cssFileContent = await buildSimpleIconsCssFile(unicodeHexBySlug);
  await buildSimpleIconsMinCssFile(cssFileContent);
};

main();
