const request = require('request');
const cheerio = require('cheerio');

request(`http://libgen.is/search.php?req=java&open=0&res=25&view=simple&phrase=1&column=def`,
(error,response,html) => {
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.c > tbody:nth-child(1) > tr').each((i, el) => {
            const child = $(el).children('td:nth-child(1)');
            const id = child.text().toString();
            if(!isNaN(id)) {
                const link = $(`a[id=${id}]`);
                const title = link.children().remove().end().text();
                const href =  `libgen.is/${link.attr('href')}`;
                const res = `Title = ${title}\nLink= ${href}\n`;
                console.log(res);
            }
        });

    } else {
        console.log(error)
    }
});