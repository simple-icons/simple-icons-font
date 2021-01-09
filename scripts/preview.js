#!/usr/bin/env node
/**
 * @fileoverview
 * Produce a screenshot of the testpage. The screenshot will be saved in the
 * root of this repository.
 */

const path = require('path');
const puppeteer = require('puppeteer');

const SCREENSHOT_PATH = path.join(__dirname, '..', 'screenshot.png');
const TEST_PAGE_URL = 'http://localhost:8080/';
const VIEWPORT_720P = {
  height: 720,
  width: 1280,
  deviceScaleFactor: 2,
};

const capture = async () => {
  const browser = await puppeteer.launch({ defaultViewport: VIEWPORT_720P });
  const page = await browser.newPage();
  await page.goto(TEST_PAGE_URL);
  await page.screenshot({
    path: SCREENSHOT_PATH,
    fullPage: true,
  });
  await browser.close();
};

capture()
  .then(() => console.log('Screenshot token'))
  .catch((err) => console.error('Screenshot failed:', err));
