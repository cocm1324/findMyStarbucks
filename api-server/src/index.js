const Koa = require('koa')
const FormData = require('FormData');
const fs = require('fs');
const app = new Koa();

const axios = require('axios');


const data = {
    'ins_lat':'37.56682', 
    'ins_lng':'126.97865',
    'p_sido_cd':'01',
    'p_gugun_cd':'',  
    'in_biz_cd':'',
    'set_date':'',
    'iend':'1000',
}

let form = new URLSearchParams();

for (const [key, value] of Object.entries(data)){
    form.append(key, value);
}

let fetchedData;

const extract = (obj, ...keys) => {
    const newObject = Object.assign({});
    Object.keys(obj).forEach((key) => {
        if(keys.includes(key)){
            newObject[key] = obj[key];
            delete obj[key];
        }
    });
    return newObject;
}

const fetchData = async () => {
    try {
        fetchedData = await axios.post('https://www.starbucks.co.kr/store/getStore.do', form).then(function (response) {
        
        const storeList = response.data.list;
        const stores = storeList.map(store => {

            return extract(store, 
                's_name',
                'addr',
                'doro_address',
                'gugun_code',
                'gugun_name',
                'lat',
                'lot',
                'open_dt',
                'sido_code',
                'sido_name',
                'tel',
                's_code',
            );
        });

        fs.writeFile('storeData', JSON.stringify(stores), function(err){
            if(err) return console.log(err);
            console.log('✅ File Saved!');
        })
        
        })
        .catch(function (response) {
            //handle error
            console.error(response);
        });

    } catch (e) {
        console.error(e);
    }
}


const schedule = require('node-schedule');

let rule = new schedule.RecurrenceRule();
rule.minute = 20;

let fetchStores = schedule.scheduleJob(rule, fetchData);


app.listen(4000, () => {
    console.log('✅ API Server is listening to port 4000');
})