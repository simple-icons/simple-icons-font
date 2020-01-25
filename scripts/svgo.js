// core packages
const fs = require('fs')
const path = require('path')

// npm packages
const SVGO = require('svgo')
const yaml = require('js-yaml')

// values
const UTF8 = 'utf8';

const SVG_FILES = (filename) => filename.endsWith('.svg')

const configFile = path.join(__dirname, '..', '.svgo.yml')
const iconsDir = path.join(path.dirname(require.resolve('simple-icons')), 'icons')

// script
module.exports = function() {
  const rawConfig = fs.readFileSync(configFile, UTF8);
  const config = yaml.safeLoad(rawConfig);
  const svgo = new SVGO(config);

  const promises = []
  for (const filename of fs.readdirSync(iconsDir).filter(SVG_FILES)) {
    const iconPath = path.join(iconsDir, filename)
    const data = fs.readFileSync(iconPath, UTF8)
    const promise = svgo.optimize(data).then(function(result) {
        fs.writeFileSync(iconPath, result.data, {encoding: UTF8})
    });

    promises.push(promise)
  }

  return Promise.all(promises)
}
