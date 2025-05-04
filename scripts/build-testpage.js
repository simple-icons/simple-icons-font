#!/usr/bin/env node
/**
 * @fileoverview
 * Builds a test page to display the simple-icons-font.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import pug from 'pug';
import { getIconsData, getIconSlug } from 'simple-icons/sdk';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = path.resolve(__dirname, '..');
const INPUT_FILE = path.join(ROOT_DIR, 'preview', 'html', 'testpage.pug');
const OUTPUT_FILE = path.join(ROOT_DIR, 'preview', 'testpage.html');

const { SI_FONT_SLUGS_FILTER = '' } = process.env;
const siFontSlugs = new Set(SI_FONT_SLUGS_FILTER.split(',').filter(Boolean));

const iconsData = await getIconsData();
const icons = iconsData
  .map((icon) => ({
    title: icon.title,
    slug: getIconSlug(icon),
  }))
  .filter((icon) => siFontSlugs.size === 0 || siFontSlugs.has(icon.slug));

pug.renderFile(INPUT_FILE, { icons }, (renderError, html) => {
  if (renderError) {
    throw renderError;
  }

  fs.writeFileSync(OUTPUT_FILE, html);
  console.info('Test page built.');
});
