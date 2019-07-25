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

    app.get('/', async (req, res) => {

      const browser = await puppeteer.launch();
      const url = 'http://libgen.is/search.php?req=java+oop&open=0&res=25&view=simple&phrase=1&column=def';

      const page = await browser.newPage();
      await page.goto(url); //, {waitUntil: 'networkidle0'});
      await clickByText(page,'fundamentals');
      await page.waitForNavigation({waitUntil: 'load'});
      console.log("Current page:", page.url());

      const link = await page.$eval('a[title="Gen.lib.rus.ec"]', a => a.getAttribute('href'));
      console.log(link);
      res.send(link);
      await browser.close();

    });

    // "/bookname/genre"
    app.get('/:bookname/:genre', async (req,res) => {
      let bookname=req.params.bookname;
      let genre = req.params.genre;

      res.send({Name: bookname, Genre: genre});

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