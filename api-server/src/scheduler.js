/* For Fetch Stacbucks Store Data */

const axios = require('axios');
const fs = require('fs');
const schedule = require('node-schedule');


/* Get Store API URL */
const getStarbucksListURL = 'https://www.starbucks.co.kr/store/getStore.do';


/* Get Store API Fecth Options */
const fetchOption = {
    'ins_lat':'37.56682', 
    'ins_lng':'126.97865',
    'p_sido_cd':'01',
    'p_gugun_cd':'',  
    'in_biz_cd':'',
    'set_date':'',
    'iend':'1000',
}


/* Make form-data to post parameters with API Call */

let form = new URLSearchParams();

for (const [key, value] of Object.entries(fetchOption))
    form.append(key, value);


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


/* Fetch Starbucks Store List and save into file */

const fetchData = async () => {
    try {
        await axios.post(getStarbucksListURL, form).then(function (response) {
        
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


/* Scheduler Period */
let rule = new schedule.RecurrenceRule();
rule.minute = 20;

/* Scheduler Start*/
module.exports.fetchStart = function (){
    schedule.scheduleJob(rule, fetchData);
    console.log('✅ Fetching Scheduler started. Fetches every 1 hour.');
};

