const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

// // ROUTES
// app.get('/',(req,res) => {
//     res.send('Me and the boizzz!.');
// });

// //Listening
// app.listen(1080);

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://libgen.is';
    await page.goto(url);
    await browser.close();
})();