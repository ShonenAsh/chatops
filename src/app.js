const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

async function main() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });

  app.get('/', async (req, res) => {

    const url = 'https://libgen.is';
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    const fic = page.$('a[href="/foreignfiction/index.php"]');
    page.click('a[href="/foreignfiction/index.php"]');

    var html = page.content();

    //res.set('Content-Type', 'image/png');
    res.send(html);
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