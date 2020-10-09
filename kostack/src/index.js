require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');


const mongoose = require('mongoose');

/* Mongo DB Connection */

mongoose.Promise = global.Promise;

//Mongo DB Connect
mongoose.connect(process.env.MONGO_URI, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
}).then(
    (response) => {
        console.log('✅ Successfully connected to MongoDB.')
    }
).catch( e => {console.error(e);});

const port = process.env.PORT || 4000;

router.use('/api', api.routes());



app.use(router.routes());
app.use(router.allowedMethods());

app.listen(4000, ()=> {
    console.log('✅ FMS Server is listening to port 4000');
})