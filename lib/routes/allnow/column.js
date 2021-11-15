import utils from './utils.js';

export default async (ctx) => {
    const {
        id
    } = ctx.params;

    ctx.state.data = await utils.processItems(ctx, `${utils.rootUrl}/column/${id}`);
};