require('dotenv').config();

const Koa = require('koa')
const app = new Koa();

const scheduler = require('./scheduler');

/* For CSV to Json */
const csvjson = require('csvjson');
const readFileSync = require('fs').readFileSync;
const Iconv = require('iconv').Iconv;
const encode = new Iconv('utf-8', 'euc-kr');

const geocodingAPIURL = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode';


/* CSV to JSON - Universities In Seoul */

const addressToGPSLocation = async (addr) => {
    try{
        const returnData = await axios({
            method: 'get',
            url: geocodingAPIURL,
            headers: {
                'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID,
                'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET
            },
            params: {
                query: addr
            }
        });

        //console.log(returnData)
            const addressData = returnData.data.addresses[0];
            const lat = addressData.x;
            const lgt = addressData.y;
            return {lat, lgt};
      
    }catch(e){
        console.log(e);
    }
}

let univList=[];
let subwayList=[];

function getListfromFile(filePath){
    let fileData = readFileSync(filePath, 'utf-8');
    encode.convert(fileData)
    dataList = csvjson.toObject(fileData);

    return dataList;
}

univList = getListfromFile('/Users/danielseo/dev/findMyStarbucks/api-server/data/university_seoul.csv');
subwayList = getListfromFile('/Users/danielseo/dev/findMyStarbucks/api-server/data/metro2_seoul.csv');

console.log(univList.length);

const mergeGPSLocation = async(dataList) => {
    for(let i=0; i<dataList.length; i++){
        try{
            let gpsLocation = await addressToGPSLocation(dataList[i].address);
            dataList[i].lat = gpsLocation.lat;
            dataList[i].lgt = gpsLocation.lgt;
        }catch(e){
            console.log(e);
        }
    }

    return dataList;
}

//addressToGPSLocation('서울특별시 중구 서소문로 지하 127 (서소문동) (2호선 시청역)');

// mergeGPSLocation(univList).then(() => {
//     console.log(univList);
// });

scheduler.fetchStart();

app.listen(4000, () => {
    console.log('✅ API Server is listening to port 4000');
})