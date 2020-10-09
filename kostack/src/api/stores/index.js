const Router = require('koa-router');

const stores = new Router();
const storesCtrl = require('./stores.controller');

stores.get('/', storesCtrl.list);
stores.post('/', storesCtrl.create);
stores.delete('/', storesCtrl.delete);
stores.put('/', storesCtrl.replace);
stores.patch('/', storesCtrl.update);

module.exports = stores;
