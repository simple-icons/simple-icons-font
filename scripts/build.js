#!/usr/bin/env node
/**
 * @fileoverview
 * Builds the simple-icons-font package based on the installed simple-icons
 * dependency.
 */

const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');
const { ucs2 } = require('punycode/');
const simpleIcons = require('simple-icons');
const svg2ttf = require('svg2ttf');
const SVGPath = require('svgpath');
const ttf2eot = require('ttf2eot');
const ttf2woff = require('ttf2woff');
const ttf2woff2 = require('ttf2woff2');
const woff2otf = require('woff2otf');
const util = require('util');

const packageJson = require('./../package.json');

const UTF8 = 'utf8';

const DIST_DIR = path.resolve(__dirname, '..', 'font');

const CSS_OUTPUT_FILEPATH = path.join(DIST_DIR, 'simple-icons.css');
const CSS_MIN_OUTPUT_FILEPATH = path.join(DIST_DIR, 'simple-icons.min.css');
const SVG_OUTPUT_FILEPATH = path.join(DIST_DIR, 'SimpleIcons.svg');
const TTF_OUTPUT_FILEPATH = path.join(DIST_DIR, 'SimpleIcons.ttf');
const EOT_OUTPUT_FILEPATH = path.join(DIST_DIR, 'SimpleIcons.eot');
const OTF_OUTPUT_FILEPATH = path.join(DIST_DIR, 'SimpleIcons.otf');
const WOFF_OUTPUT_FILEPATH = path.join(DIST_DIR, 'SimpleIcons.woff');
const WOFF2_OUTPUT_FILEPATH = path.join(DIST_DIR, 'SimpleIcons.woff2');

const CSS_BASE_FILE = path.resolve(__dirname, 'templates', 'base.css');
const SVG_TEMPLATE_FILEPATH = path.join(__dirname, 'templates', 'font.svg');

function cssDecodeUnicode(value) {
  // &#xF26E; -> \f26e
  return value.replace('&#x', '\\').replace(';', '').toLowerCase();
}

function buildSimpleIconsSvgFontFile() {
  const usedUnicodes = [];
  const unicodeHexBySlug = [];
  let startUnicode = 0xea01;
  let glyphsContent = '';

  for (let iconSlug in simpleIcons) {
    let nextUnicode = ucs2.decode(String.fromCodePoint(startUnicode++));
    let unicodeString = nextUnicode
      .map((point) => `&#x${point.toString(16).toUpperCase()};`)
      .join('');
    if (usedUnicodes.includes(unicodeString)) {
      throw Error(`Unicodes must be unique. Found '${unicodeString}' repeated`);
    }

    const icon = simpleIcons.Get(iconSlug);
    const verticalTransformedPath = SVGPath(icon.path)
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

  const svgFontTemplate = fs.readFileSync(SVG_TEMPLATE_FILEPATH, UTF8);
  const svgFileContent = util.format(svgFontTemplate, glyphsContent);
  fs.writeFileSync(SVG_OUTPUT_FILEPATH, svgFileContent);
  console.log(`'${SVG_OUTPUT_FILEPATH}' file built`);

  return { unicodeHexBySlug, svgFileContent };
}

function buildSimpleIconsCssFile(unicodeHexBySlug) {
  let cssFileContent = fs.readFileSync(CSS_BASE_FILE);

  for (let slug in unicodeHexBySlug) {
    let icon = unicodeHexBySlug[slug];

    cssFileContent += `
.si-${slug}::before { content: "${cssDecodeUnicode(icon.unicode)}"; }
.si-${slug}.si--color::before { color: #${icon.hex}; }`;
  }

  fs.writeFileSync(CSS_OUTPUT_FILEPATH, cssFileContent);
  console.log(`'${CSS_OUTPUT_FILEPATH}' file built`);

  return cssFileContent;
}

function buildSimpleIconsMinCssFile(cssFileContent) {
  const cssMinifiedFile = new CleanCSS({
    compatibility: 'ie7',
  }).minify(cssFileContent);

  fs.writeFileSync(CSS_MIN_OUTPUT_FILEPATH, cssMinifiedFile.styles);
  console.log(`'${CSS_MIN_OUTPUT_FILEPATH}' file built`);
}

function buildSimpleIconsTtfFontFile(svgFileContent) {
  const ttf = svg2ttf(svgFileContent, {
    version: `Version ${packageJson.version.split('.').slice(0, 2).join('.')}`,
    description: packageJson.description,
    url: packageJson.homepage,
  });
  const ttfFileContent = new Buffer.from(ttf.buffer);
  fs.writeFileSync(TTF_OUTPUT_FILEPATH, ttfFileContent);
  console.log(`'${TTF_OUTPUT_FILEPATH}' file built`);
  return ttfFileContent;
}

function buildSimpleIconsWoffFontFile(ttfFileContent) {
  const woff = new Buffer.from(ttf2woff(new Uint8Array(ttfFileContent)).buffer);
  fs.writeFileSync(WOFF_OUTPUT_FILEPATH, woff);
  console.log(`'${WOFF_OUTPUT_FILEPATH}' file built`);
  return woff;
}

function buildSimpleIconsWoff2FontFile(ttfFileContent) {
  const woff2 = ttf2woff2(ttfFileContent);
  fs.writeFileSync(WOFF2_OUTPUT_FILEPATH, woff2);
  console.log(`'${WOFF2_OUTPUT_FILEPATH}' file built`);
}

function buildSimpleIconsEotFontFile(ttfFileContent) {
  const ttf = new Uint8Array(ttfFileContent);
  const eot = new Buffer.from(ttf2eot(ttf).buffer);
  fs.writeFileSync(EOT_OUTPUT_FILEPATH, eot);
  console.log(`'${EOT_OUTPUT_FILEPATH}' file built`);
}

function buildSimpleIconsOtfFontFile(woffFileContent) {
  const otf = woff2otf(woffFileContent);
  fs.writeFileSync(OTF_OUTPUT_FILEPATH, otf);
  console.log(`'${OTF_OUTPUT_FILEPATH}' file built`);
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR);
  }

  const { unicodeHexBySlug, svgFileContent } = buildSimpleIconsSvgFontFile();
  const cssFileContent = buildSimpleIconsCssFile(unicodeHexBySlug);
  const ttfFileContent = buildSimpleIconsTtfFontFile(svgFileContent);
  buildSimpleIconsMinCssFile(cssFileContent);
  const woffFileContent = buildSimpleIconsWoffFontFile(ttfFileContent);
  buildSimpleIconsWoff2FontFile(ttfFileContent);
  buildSimpleIconsEotFontFile(ttfFileContent);
  buildSimpleIconsOtfFontFile(woffFileContent);
}

main();
