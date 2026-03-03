// Prompt 39: Pixel-perfect boundary test
// Opens raw HTML at exactly 816x1056 (8.5in x 11in @ 96dpi) and measures edge distances
const puppeteer = require('./app/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 816, height: 1056 });

  const htmlPath = path.join(__dirname, 'app', 'current.html').replace(/\\/g, '/');
  await page.goto('file:///' + htmlPath, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  const metrics = await page.evaluate(() => {
    const body = document.body;
    const bodyRect = body.getBoundingClientRect();
    const children = Array.from(body.children);

    const first = children[0];
    const firstRect = first ? first.getBoundingClientRect() : null;
    const firstStyle = first ? getComputedStyle(first) : null;

    const allDivs = Array.from(body.querySelectorAll('body > div'));
    const last = allDivs[allDivs.length - 1];
    const lastRect = last ? last.getBoundingClientRect() : null;

    return {
      bodyWidth: bodyRect.width,
      bodyHeight: bodyRect.height,
      scrollHeight: body.scrollHeight,
      clientHeight: body.clientHeight,
      overflow: body.scrollHeight > body.clientHeight,
      childCount: children.length,
      firstTag: first ? first.tagName : null,
      firstBg: firstStyle ? firstStyle.backgroundColor : null,
      firstHeight: firstRect ? firstRect.height : null,
      topGap: firstRect ? firstRect.top : null,
      leftGapTop: firstRect ? firstRect.left : null,
      rightGapTop: firstRect ? (bodyRect.width - firstRect.right) : null,
      lastText: last ? last.textContent.substring(0, 50).trim() : null,
      bottomGap: lastRect ? Math.round(bodyRect.height - lastRect.bottom) : null,
      childInfo: children.slice(0, 12).map(c => {
        const r = c.getBoundingClientRect();
        return { tag: c.tagName, top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) };
      })
    };
  });

  console.log(JSON.stringify(metrics, null, 2));

  await page.screenshot({
    path: path.join(__dirname, 'screenshots', 'prompt39-raw.png'),
    clip: { x: 0, y: 0, width: 816, height: 1056 }
  });
  console.log('Screenshot saved: screenshots/prompt39-raw.png');
  await browser.close();
})();
