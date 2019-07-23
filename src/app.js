const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

async function main() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });

  app.use(async (req, res) => {
    const {url} = req.query;

    if (!url) {
      return res.send(
        'Please provide URL as GET parameter, for example: <a href="/?url=https://example.com">?url=https://example.com</a>'
      );
    }

    const page = await browser.newPage();
    await page.goto(url);
    const imageBuffer = await page.screenshot();

    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  });

  const server = app.listen(process.env.PORT || 8080, err => {
    if (err) {
      return console.error(err);
    }
    const {port} = server.address();
    console.info(`App listening on port ${port}`);
  });

}

main();