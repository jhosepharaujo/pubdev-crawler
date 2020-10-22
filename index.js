const puppeteer = require('puppeteer');

async function robo(pageNumber=1) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://pub.dev/flutter/favorites?page=${pageNumber}`);

    const itens = await page.evaluate((pageNumber) => {
        const data = [];
        const itemList = document.querySelectorAll('.packages-item');
        if (itemList.length === 0) {
            return {
                hasError: true,
                message: 'Packages not found'
            }
        }
        const pagination = document.querySelectorAll('ul.pagination > li');
        const lastChildPagination = pagination[pagination.length-1];
       
        const hasNextPage = !lastChildPagination.classList.contains('-disabled')

        itemList.forEach((item, index) => {
            let objeto = {
                index,
                name: item.querySelector('div.packages-header > h3.packages-title').innerText,
                description: item.querySelector('p.packages-description').innerText,
                link: item.querySelector('div.packages-header > h3.packages-title > a').href,
                likes: item.querySelector('div.packages-header > a.packages-scores > div.packages-score.packages-score-like > div.packages-score-value.-has-value > span.packages-score-value-number').innerText,
                pub_points: item.querySelector('div.packages-header > a.packages-scores > div.packages-score.packages-score-health > div.packages-score-value.-has-value > span.packages-score-value-number').innerText,
                popularity: item.querySelector('div.packages-header > a.packages-scores > div.packages-score.packages-score-popularity > div.packages-score-value.-has-value > span.packages-score-value-number').innerText + '%',
            }
            data.push(objeto);
        })
        return {
            hasNextPage,
            hasError: false,
            data
        };
    });

    const response = {
        page: pageNumber,
        nextPage: itens.hasNextPage ? ++pageNumber : null,
        ...itens,
    }

    console.log(response);

    await browser.close();
}

robo(1);