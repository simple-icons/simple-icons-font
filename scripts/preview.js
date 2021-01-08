#!/usr/bin/env node
/**
 * @fileoverview
 * Produce a screenshot of the testpage. The screenshot will be saved in the
 * root of this repository.
 */

// npm packages
const puppeteer = require('puppeteer');

const capture = async () => {
  const browser = await puppeteer.launch({
    // 720p screen
    defaultViewport: {
      height: 720,
      width: 1280,
      deviceScaleFactor: 2,
    },
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/');
  await page.screenshot({
    path: './screenshot.png',
    fullPage: true,
  });
  await browser.close();
};

capture()
  .then(() => console.log('Screenshot token'))
  .catch((err) => console.error('Screenshot failed:', err));
