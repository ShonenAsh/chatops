const express = require('express');
const scraper = require('./scraper');

const app = express();


function main() {
  try {

    // The /bookname Get route
    app.get('/books', async (req, res) => {

      let bookname = req.query.name;

      scraper(bookname,res,true);

      // const link = await page.$eval('a[title="Gen.lib.rus.ec"]', a => a.getAttribute('href'));

    });

    app.get('/book', async (req,res) => {
      const bookname = req.query.name;
      scraper(bookname,res,false);
    });

    app.get('/author', async (req,res) => {
      const authorname = req.query.name;
      res.send(authorname);
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

}

main();