const axios = require('axios');
const {fetchRetry} = require('./common');

//מקבל את הנתונים מאתר openweathermap

// async function getWeather({lat,lon}){
//     const res = await axios({
//         method: "get",
//         // https://api.openweathermap.org/data/2.5/forecast
//         // // url:'https://www.hebcal.com/hebcal',
//         url:'https://api.openweathermap.org/data/2.5/forecast',
//         params:{
//           units: 'metric',
//           appid: 'c787eae9d7c0bc48e3f7917fa9a4a43c',
//           lat,
//           lon
//         }
//       });
//       return res && res.data
// }

async function getWeather({lat,lon}){
  console.log('getWeather',{lat,lon})

  const getData = async ({lat,lon}) =>{
    const res = await axios({
      method: "get",
      // https://api.openweathermap.org/data/2.5/forecast
      // // url:'https://www.hebcal.com/hebcal',
      url:'https://api.openweathermap.org/data/2.5/forecast',
      params:{
        units: 'metric',
        appid: 'c787eae9d7c0bc48e3f7917fa9a4a43c',
        lat,
        lon
      }
    });
    return res && res.data
  }

  const delay = 2000;
  const tries = 5;
  const data = await fetchRetry(() => getData({lat,lon}),delay,tries);

  console.log('data',data)
  return data;
}


module.exports = {
  getWeather
}