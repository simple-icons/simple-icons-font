// npm packages
const puppeteer = require('puppeteer');

const capture = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:8080/");
  await page.screenshot({ path: "./screenshot.png" });
  await browser.close();
};

capture()
  .then(() => console.log("Screenshot token"))
  .catch((err) => console.error("Screenshot failed:", err));
