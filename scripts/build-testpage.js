#!/usr/bin/env node
/**
 * @fileoverview
 * Builds a test page to display the simple-icons-font.
 */

import fs from 'node:fs';
import path from 'node:path';
import pug from 'pug';
import { getIconsData, titleToSlug } from 'simple-icons/sdk';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = path.resolve(__dirname, '..');
const INPUT_FILE = path.join(ROOT_DIR, 'preview', 'html', 'testpage.pug');
const OUTPUT_FILE = path.join(ROOT_DIR, 'preview', 'testpage.html');

const iconsData = await getIconsData();
const icons = iconsData.map((icon) => ({
  title: icon.title,
  slug: icon.slug || titleToSlug(icon.title),
}));

pug.renderFile(INPUT_FILE, { icons }, (renderError, html) => {
  if (renderError) {
    throw renderError;
  }

  fs.writeFileSync(OUTPUT_FILE, html);
  console.info('Test page built.');
});
