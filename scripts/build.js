const fs = require('fs');
const path = require('path');

const { ucs2 } = require("punycode"); 
const SimpleIcons = require('simple-icons');
const svg2ttf = require('svg2ttf');
const SVGPath = require('svgpath');
const ttf2woff = require('ttf2woff');
const ttf2woff2 = require('ttf2woff2');


const DISTDIR = path.resolve(__dirname, '..', 'font');

const buildSimpleIconsSvgFontFile = () => {
  let fileContent = '<?xml version="1.0" standalone="no"?>\n'
                  + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
                  + '<svg xmlns="http://www.w3.org/2000/svg">\n'
                  + '<metadata>CC0 1.0 Universal | simple-icons contributors</metadata>\n'
                  + '<defs>\n'
                  + '<font id="iconfont" horiz-adv-x="2400">\n'
                  + '<font-face font-family="iconfont" units-per-em="2400" ascent="2400" descent="0" />\n'
                  + '<missing-glyph horiz-adv-x="0" />\n';
  
  let startUnicode = 0xea01;
  let usedUnicodes = [];
  
  let unicodeHexBySlug = {}
  
  for (let iconTitle in SimpleIcons) {
    let unicode = ucs2.decode(
      String.fromCodePoint(startUnicode++)).map(
        point => '&#x' + point.toString(16).toUpperCase() + ';')[0];
    if (usedUnicodes.includes(unicode)) {
      throw Error(`Unicodes must be unique. Found '${unicode}' repeated`)
    }
    
    let icon = SimpleIcons[iconTitle];
    const verticalTransformedPath = SVGPath(icon.path).scale(100, -100).toString();
    
    fileContent += `<glyph glyph-name="${icon.slug}" unicode="${unicode}" d="${verticalTransformedPath}" horiz-adv-x="2400" />\n`;
    usedUnicodes.push(unicode);

    unicodeHexBySlug[icon.slug] = {
      unicode: unicode,
      hex: icon.hex
    };
  }
  fileContent += '</font>\n</defs>\n</svg>\n';
  
  const outputFilePath = path.join(DISTDIR, 'SimpleIcons.svg');
  fs.writeFileSync(outputFilePath, fileContent);
  console.log(`'${outputFilePath}' file built`);
  
  return unicodeHexBySlug;
}

const buildSimpleIconsCssFile = (unicodeHexBySlug) => {
  let simpleIconsCss = fs.readFileSync(
      path.resolve(__dirname, '..', 'preview', 'css', 'base.css'));
  
  for (let slug in unicodeHexBySlug) {
    let icon = unicodeHexBySlug[slug];
    
    // &#xF26E; -> \f26e
    const cssDecodedUnidoce = icon.unicode.replace('&#x', '\\').replace(';', '').toLowerCase();
    simpleIconsCss += '\n'
		                +   `.simpleicons-${slug}::before { content: "${cssDecodedUnidoce}"; }\n`
		                +   `.simpleicons-${slug}.simpleicons--color::before { color: #${icon.hex}; }\n`;
  }
  
  const outputFilePath = path.join(DISTDIR, 'SimpleIcons.css');
  fs.writeFileSync(outputFilePath, simpleIconsCss);
  console.log(`'${outputFilePath}' file built`);
}

const buildSimpleIconsTtfFontFile = () => {
  const ttf = svg2ttf(fs.readFileSync(path.join(DISTDIR, 'SimpleIcons.svg'), 'utf8'), {});
  const outputFilePath = path.join(DISTDIR, 'SimpleIcons.ttf');
  fs.writeFileSync(outputFilePath, new Buffer(ttf.buffer));
  console.log(`'${outputFilePath}' file built`);
}

const buildSimpleIconsWoffFontFile = () => {
  var ttf = new Uint8Array(fs.readFileSync(path.join(DISTDIR, 'SimpleIcons.ttf')));
  var woff = Buffer.from ?
             Buffer.from(ttf2woff(ttf).buffer) :
             new Buffer(ttf2woff(ttf).buffer);
  const outputFilePath = path.join(DISTDIR, 'SimpleIcons.woff');
  fs.writeFileSync(outputFilePath, woff);
  console.log(`'${outputFilePath}' file built`);
}

const buildSimpleIconsWoff2FontFile = () => {
  const input = fs.readFileSync(path.join(DISTDIR, 'SimpleIcons.ttf'));
  const outputFilePath = path.join(DISTDIR, 'SimpleIcons.woff2');
  fs.writeFileSync(outputFilePath, ttf2woff2(input));
  console.log(`'${outputFilePath}' file built`);
}

const main = () => {
  buildSimpleIconsCssFile(buildSimpleIconsSvgFontFile());
  buildSimpleIconsTtfFontFile();
  buildSimpleIconsWoffFontFile();
  buildSimpleIconsWoff2FontFile();
}

main();
