const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();


router.get('/', (ctx, next) => {
    ctx.body = 'Home';
})

router.get('/about', (ctx, next) => {
    ctx.body = 'Intro';
})

router.get('/about/:name', (ctx, next) => {
    const { name } = ctx.params;
    ctx.body = name + "'s Intro";
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(4000, ()=> {
    console.log('FMS Server is listening to port 4000');
})