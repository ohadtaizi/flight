const axios = require('axios');
const {fetchRetry} = require('./common');
//מקבל את הנתונים מאתר hebcal
async function getJewishCalender({
    v = '1',
    cfg = 'json',
    maj= 'on',
    min= 'on',
    mod= 'on',
    nx= 'on',
    year= 'now',
    month= 'x',
    ss= 'on',
    mf= 'now',
    geo= 'geoname',
    geonameid= '281184',
    M= 'on',
    s= 'now',
    start= new Date().toISOString().split('T')[0],
    end= new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  }){

    const getData = async({v,
        cfg,
        maj,
        min,
        mod,
        nx,
        year,
        month,
        ss,
        mf,
        geo,
        geonameid,
        M,
        s,
        start,
        end}) =>{
        const res =  await axios({
            method: "get",
            url:' https://www.hebcal.com/hebcal',
            params:{
              v,
              cfg,
              maj,
              min,
              mod,
              nx,
              year,
              month,
              ss,
              mf,
              geo,
              geonameid,
              M,
              s,
              start,
              end,
            }
          });
        return res && res.data
      }
      const delay = 2000;
      const tries = 5;
      const data = await fetchRetry(() => getData({v,
        cfg,
        maj,
        min,
        mod,
        nx,
        year,
        month,
        ss,
        mf,
        geo,
        geonameid,
        M,
        s,
        start,
        end}),delay,tries);

    //console.log('getJewishCalender res && res.data', res && res.data)
  
    return data;
}

module.exports = {
    getJewishCalender
}