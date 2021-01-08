const fs = require('fs');
const pug = require('pug');
const path = require('path');
const simpleIcons = require('simple-icons');

const BASE_PATH = path.join(__dirname, '..');
const INPUT_FILE = path.join(BASE_PATH, 'preview', 'html', 'testpage.pug');
const OUTPUT_FILE = path.join(BASE_PATH, 'preview', 'testpage.html');

const attributedIcons = Object.values(simpleIcons).map((icon) => {
  return {
    name: icon.title,
    cssClass: icon.slug,
  };
});

pug.renderFile(INPUT_FILE, { icons: attributedIcons }, (err, html) => {
  if (err) throw err;

  fs.writeFile(OUTPUT_FILE, html, (err) => {
    if (err) throw err;
    console.info('Test page built.');
  });
});
