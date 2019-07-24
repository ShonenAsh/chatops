const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

(async function main() {

  try {
    const browser = await puppeteer.launch({headless:false});
    const url = 'https://libgen.is';

    app.get('/', async (req, res) => {

      const page = await browser.newPage();
      await page.goto(url); //, {waitUntil: 'networkidle0'});
      const fic = await page.$('a[href="/foreignfiction/index.php"]');
      await fic.click();
      await page.waitForNavigation();

      let img = await page.screenshot();
      res.set('Content-Type', 'image/png');
      res.send(img);
        
    });

    // "/bookname/genre"
    app.get('/:bookname/:genre', async (req,res) => {
      let bookname=req.params.bookname;
      let genre = req.params.genre;

      res.send({Name: bookname, Genre: genre});

    });

    app.get('/:bookname', async (req,res) => {
      let bookname=req.params.bookname;

      const page = await browser.newPage();
      await page.goto(url, {waitUntil: 'networkidle0'});
      const selector = '#searchform';
      await page.waitForSelector(selector);
      await page.type(selector,bookname);

      // const input = await page.$('input[name="req"]');
      // input.value = await bookname;

      const searchButton = await page.$('input[type="submit"]');
      await searchButton.click();
      await page.waitForNavigation();

      const html = await page.content();
      res.send(html);
      console.log(html);
    });

  } catch (err) {
  console.error(err);
}

    // Listening to requests
  const server = app.listen(process.env.PORT || 8080, err => {
    if (err) {
      return console.error(err);
  }
  const {port} = server.address();
  console.info(`App listening on port ${port}`);
  });

})();