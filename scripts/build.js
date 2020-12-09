const fs = require('fs');
const path = require('path');

const { ucs2 } = require("punycode"); 
const SimpleIcons = require('simple-icons');
const svg2ttf = require('svg2ttf');
const SVGPath = require('svgpath');
const ttf2woff = require('ttf2woff');
const ttf2woff2 = require('ttf2woff2');


const DISTDIR = path.resolve(__dirname, '..', 'font');

const CSS_OUTPUT_FILEPATH = path.join(DISTDIR, 'simple-icons.css');
const SVG_OUTPUT_FILEPATH = path.join(DISTDIR, 'SimpleIcons.svg');
const TTF_OUTPUT_FILEPATH = path.join(DISTDIR, 'SimpleIcons.ttf');
const WOFF_OUTPUT_FILEPATH = path.join(DISTDIR, 'SimpleIcons.woff');
const WOFF2_OUTPUT_FILEPATH = path.join(DISTDIR, 'SimpleIcons.woff2');


const cssDecodeUnicode = (value) => {
  // &#xF26E; -> \f26e
  return value.replace('&#x', '\\').replace(';', '').toLowerCase();
}

const buildSimpleIconsSvgFontFile = () => {
  let svgFileContent = '<?xml version="1.0" standalone="no"?>\n'
                     + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
                     + '<svg xmlns="http://www.w3.org/2000/svg">\n'
                     + '<metadata>CC0 1.0 Universal | simple-icons contributors</metadata>\n'
                     + '<defs>\n'
                     + '<font id="Simple Icons" horiz-adv-x="1200">\n'
                     + '<font-face font-family="Simple Icons" units-per-em="1200" ascent="-1" descent="1200" />\n'
                     + '<missing-glyph horiz-adv-x="0" />\n';
  
  let startUnicode = 0xea01;
  let usedUnicodes = [];
  
  let unicodeHexBySlug = {}

  for (let iconTitle in SimpleIcons) {
    let nextUnicode = ucs2.decode(String.fromCodePoint(startUnicode++));
    let unicodeString = nextUnicode.map(point => `&#x${point.toString(16).toUpperCase()};`).join('');
    if (usedUnicodes.includes(unicodeString)) {
      throw Error(`Unicodes must be unique. Found '${unicodeString}' repeated`)
    }
    
    let icon = SimpleIcons[iconTitle];
    const verticalTransformedPath = SVGPath(icon.path).scale(50, -50).toString();
    
    svgFileContent += `<glyph glyph-name="${icon.slug}" unicode="${unicodeString}" d="${verticalTransformedPath}" horiz-adv-x="1200" />\n`;
    usedUnicodes.push(unicodeString);

    unicodeHexBySlug[icon.slug] = {
      unicode: unicodeString,
      hex: icon.hex
    };
  }
  svgFileContent += '</font>\n</defs>\n</svg>\n';

  fs.writeFileSync(SVG_OUTPUT_FILEPATH, svgFileContent);
  console.log(`'${SVG_OUTPUT_FILEPATH}' file built`);
  
  return {unicodeHexBySlug, svgFileContent};
}

const buildSimpleIconsCssFile = (unicodeHexBySlug) => {
  let simpleIconsCss = fs.readFileSync(
      path.resolve(__dirname, '..', 'preview', 'css', 'base.css'));
  
  for (let slug in unicodeHexBySlug) {
    let icon = unicodeHexBySlug[slug];

    simpleIconsCss += `
.simpleicons-${slug}::before { content: "${cssDecodeUnicode(icon.unicode)}"; }
.simpleicons-${slug}.simpleicons--color::before { color: #${icon.hex}; }`;
  }

  fs.writeFileSync(CSS_OUTPUT_FILEPATH, simpleIconsCss);
  console.log(`'${CSS_OUTPUT_FILEPATH}' file built`);
}

const buildSimpleIconsTtfFontFile = (svgFileContent) => {
  const ttf = svg2ttf(svgFileContent, {});
  const ttfFileContent = new Buffer(ttf.buffer);
  fs.writeFileSync(TTF_OUTPUT_FILEPATH, ttfFileContent);
  console.log(`'${TTF_OUTPUT_FILEPATH}' file built`);
  return {ttfFileContent};
}

const buildSimpleIconsWoffFontFile = (ttfFileContent) => {
  var woff = new Buffer(ttf2woff(new Uint8Array(ttfFileContent)).buffer);
  fs.writeFileSync(WOFF_OUTPUT_FILEPATH, woff);
  console.log(`'${WOFF_OUTPUT_FILEPATH}' file built`);
}

const buildSimpleIconsWoff2FontFile = (ttfFileContent) => {
  const woff2 = ttf2woff2(ttfFileContent);
  fs.writeFileSync(WOFF2_OUTPUT_FILEPATH, woff2);
  console.log(`'${WOFF2_OUTPUT_FILEPATH}' file built`);
}

const main = () => {
  if (!fs.existsSync(DISTDIR)) {
    fs.mkdirSync(DISTDIR)
  }
  
  const {unicodeHexBySlug, svgFileContent} = buildSimpleIconsSvgFontFile();
  buildSimpleIconsCssFile(unicodeHexBySlug);
  const {ttfFileContent} = buildSimpleIconsTtfFontFile(svgFileContent);
  buildSimpleIconsWoffFontFile(ttfFileContent);
  buildSimpleIconsWoff2FontFile(ttfFileContent);
}

main();
