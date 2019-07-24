const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

(async function main() {

  try {
    const browser = await puppeteer.launch();

    app.get('/', async (req, res) => {

      const url = 'https://libgen.is';
      const page = await browser.newPage();
      await page.goto(url); //, {waitUntil: 'networkidle0'});
      const fic = await page.$('a[href="/foreignfiction/index.php"]');
      await fic.click();
      await page.waitForNavigation();

      let img = await page.screenshot();
      res.set('Content-Type', 'image/png');
      res.send(img);
        
    });

  } catch (err) {
  console.error(err);
}

  const server = app.listen(process.env.PORT || 8080, err => {
    if (err) {
      return console.error(err);
    }
    const {port} = server.address();
    console.info(`App listening on port ${port}`);
  });

})();