import got from '~/utils/got.js';
import cheerio from 'cheerio';

const HOME_PAGE = 'http://www.js.sgcc.com.cn';

export default async (ctx) => {
    const url = `${HOME_PAGE}/html/njgdgs/col152/column_152_1.html`;

    const {
        data
    } = await got.get(url);
    const $ = cheerio.load(data);
    const list = $('.rightarea ul li');

    ctx.state.data = {
        title: $('head title').text(),
        link: url,
        item: list
            .map((index, item) => {
                const $item = $(item);
                const $aTag = $item.find('a');
                const link = $aTag.attr('href');
                const title = $aTag.text();

                let pubDate = $item.find('span').text();
                pubDate = new Date(pubDate).toUTCString();

                return {
                    title,
                    description: '南京市停电通知',
                    link: `${HOME_PAGE}${link}`,
                    pubDate,
                };
            })
            .get(),
    };
};