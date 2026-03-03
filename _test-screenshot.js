// Take a screenshot of the OnePager app
// Usage: node _test-screenshot.js [filename] [port]
const puppeteer = require('./app/node_modules/puppeteer');
const path = require('path');

const filename = process.argv[2] || 'test-screenshot.png';
const port = process.argv[3] || '3005';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  const outPath = path.join(__dirname, filename);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('Saved: ' + outPath);
  await browser.close();
})();
