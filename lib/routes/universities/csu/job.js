import got from '~/utils/got.js';
import cheerio from 'cheerio';
import {createCommons} from 'simport';

const {
    require
} = createCommons(import.meta.url);

const url = require('url').resolve;

const typeMaps = ['本部招聘', '湘雅招聘', '铁道招聘', '在线招聘', '事业招考'];

export default async (ctx) => {
    const {
        type = 1
    } = ctx.params;
    const link = 'http://jobsky.csu.edu.cn/Home/PartialArticleList';
    const response = await got.post(link, {
        form: 'pageindex=1&pagesize=10&typeid=' + type + '&followingdates=-1',
    });
    const $ = cheerio.load('<html><body><table>' + response.data + '</table></body></html>');
    const list = $('tr');
    ctx.state.data = {
        title: '中南大学招聘信息--' + typeMaps[parseInt(type) - 1],
        link,
        description: '中南大学招聘信息',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    const pubDate = item.find('.spanDate').text();
                    return {
                        title: item.find('a').text(),
                        description: item.find('a').text(),
                        pubDate: new Date(pubDate).toUTCString(),
                        link: url('http://jobsky.csu.edu.cn/', item.find('a').attr('href')),
                    };
                })
                .get(),
    };
};