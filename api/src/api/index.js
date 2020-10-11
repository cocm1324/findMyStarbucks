const Router = require('koa-router');

const stores = new Router();

const handler = (ctx, next) => {
    ctx.body = `${ctx.request.method} ${ctx.request.path}`
};

stores.get('/', handler);
stores.post('/', handler);
stores.delete('/', handler);
stores.put('/', handler);
stores.patch('/', handler);

module.exports = stores;
