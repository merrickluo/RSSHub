import got from '~/utils/got.js';

export default async (ctx) => {
    const {
        id = '32'
    } = ctx.params;

    const apiUrl = `https://app.yinxiang.com/third/discovery/client/restful/public/discovery/card-holder?cardHolderId=${id}`;
    const response = await got({
        method: 'get',
        url: apiUrl,
    });

    const list = response.data.card.map((item) => ({
        title: item.title,
        link: item.url,
        author: item.userNickname,
    }));

    const items = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const detailResponse = await got({
                    method: 'get',
                    url: `https://app.yinxiang.com/third/discovery/client/restful/public/blog-note?noteGuid=${item.link.split('/note/')[1]}`,
                });

                item.pubDate = new Date(parseInt(detailResponse.data.blogNote.publishTime)).toUTCString();

                const description = detailResponse.data.blogNote.htmlContent;
                if (description.indexOf('<?xml') < 0) {
                    item.description = description;
                } else {
                    [, item.description] = description.match(/<en-note>(.*)<\/en-note>/);
                }

                return item;
            })
        )
    );

    ctx.state.data = {
        title: `${response.data.name} - 印象识堂`,
        link: 'https://www.yinxiang.com/everhub/',
        item: items,
    };
};