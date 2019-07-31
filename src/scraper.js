const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
function scrapeBook(bookname, res, list) {
    let flag = 0;
    let bookObj = [];

    request(`http://libgen.is/search.php?req=${bookname}&open=0&res=25&view=simple&phrase=1&column=def`,
    (error,response,html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            if(list == true){
                // Author    '.c > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)'
                $('.c > tbody:nth-child(1) > tr').each((i, el) => {
                    const child = $(el).children('td:nth-child(1)');
                    const author = $(el).children('td:nth-child(2)');
                    const id = child.text().toString();
                    if(!isNaN(id) && flag<4) {
                        const link = $(`a[id=${id}]`);
                        const title = link.children().remove().end().text();
                        const href =  `https://libgen.is/${link.attr('href')}`;

                        bookObj.push({Title: title, Author: author.text() ,Link : href});
                        flag = 1;
                    }
                }); 
            } else {
                // Author    '.c > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)'
                const id = $('.c > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)').text();
                const link = $(`a[id=${id}]`);
                const title = link.children().remove().end().text();
                const author = $('.c > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)');
                console.log(author.text());
                
                const href =  `https://libgen.is/${link.attr('href')}`;
                //getImage(href.toString());
                bookObj = {Title: title, Link : href};
                flag = 1;
            }

            if(flag == 0) {
                res.status(404);
                res.send({});
            }
            else {
                res.json(bookObj);
            }

        } else {
            console.log(error);
            res.statusCode = 500;
        }
    });
}

async function getImage(url){
    let image = 'Link Not found';
    await axios.get(url.toString())
    	.then((resp) => {
        if(resp.status === 200) {
            const $ = cheerio.load(resp.data);
            const link = $('img').attr('src');
            console.log('Image Link: '+link);
            const img = `https://libgen.is${link}`;
            console.log(img.toString());
            image = img.toString();
        }
    }, (error) => console.log('Image: ' + error) );
    return image;
}

function author(authorName, res){
    let flag = 0;
    let bookObj = [];

    console.log(`http://libgen.is/search.php?req=${authorName}&column=author`);

    request(`http://libgen.is/search.php?req=${authorName}&column=author`,
    (error,response,html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            $('.c > tbody:nth-child(1) > tr').each((i, el) => {
                const child = $(el).children('td:nth-child(1)');
                const id = child.text().toString();
                if(!isNaN(id)) {
                    const link = $(`a[id=${id}]`);
                    const title = link.children().remove().end().text();
                    const href =  `https://libgen.is/${link.attr('href')}`;
                    bookObj.push({Title: title, Link : href});
                    flag = 1;
                }
            });

            if(flag == 0) {
                res.status(404);
                res.send({});
            }
            else {
                res.json(bookObj);
            }

        }else {
            console.log(error);
            res.status(500);
        }
    });
}

module.exports = {scrapeBook, author};