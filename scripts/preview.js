#!/usr/bin/env node
/**
 * @fileoverview
 * Produce a screenshot of the testpage. The screenshot will be saved in the
 * root of this repository.
 */

import path from 'node:path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCREENSHOT_PATH = path.join(__dirname, '..', 'screenshot.png');
const TEST_PAGE_URL = 'http://localhost:8080/';
const VIEWPORT_720P = {
  height: 720,
  width: 1280,
  deviceScaleFactor: 2,
};

(async () => {
  try {
    const browser = await puppeteer.launch({
      defaultViewport: VIEWPORT_720P,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(TEST_PAGE_URL);
    await page.screenshot({
      path: SCREENSHOT_PATH,
      fullPage: true,
    });
    await browser.close();
    console.log('Screenshot token');
  } catch (error) {
    console.error('Screenshot failed:', error);
    process.exit(1);
  }
})();
