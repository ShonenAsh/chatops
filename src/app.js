const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const app = express();

const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};

const clickByText = async (page, text) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//a[contains(translate(text(),
  'ABCDEFGHIJKLMNOPURSTUWXYZ',
  'abcdefghijklmnopurstuwxyz'),
  ${escapedText})]`);  


  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    console.log("Link not found!");
  }
};

(async () => {

  try {
    const browser = await puppeteer.launch({headless:false});
    const url = 'http://libgen.is/search.php?req=java+oop&open=0&res=25&view=simple&phrase=1&column=def';

    app.get('/', async (req, res) => {

      const page = await browser.newPage();
      await page.goto(url); //, {waitUntil: 'networkidle0'});
      await clickByText(page,'java fundamentals');
      await page.waitForNavigation({waitUntil: 'load'});
      console.log("Current page:", page.url());
      
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