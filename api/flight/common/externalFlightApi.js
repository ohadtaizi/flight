const axios = require('axios');
const {fetchRetry} = require('./common');
//מקבל את הנתונים מאתר airlabs
async function getFlight({flight_iata}){
    const res = await axios({
      method: "get",
      url:'https://airlabs.co/api/v9/flight',
      params:{
        api_key: 'fac1d14c-c2c2-483a-84ea-f5572526a753',
        flight_iata
      }
    });
  
    return res && res.data
}


async function getAirportDetails({iata_code}){
    const getData = async ({iata_code}) =>{
      const res =  await axios({
        method: "get",
        url:'https://airlabs.co/api/v9/airports',
        params:{
          api_key: 'fac1d14c-c2c2-483a-84ea-f5572526a753',
          iata_code
        }
      }).catch(err => console.log('getAirportDetails err',err));
      if(res.error){
        console.log('api restriction res',res)
      }
      return res && res.data && res.data.response;
    }
    const delay = 2000;
    const tries = 5;
    const data = await fetchRetry(() => getData({iata_code}),delay,tries).catch((error) => console.log('getAirportDetails final error',error));

    //console.log('getAirportDetails res && res.data res.data.response', res && res.data && res.data.response)
    console.log('getAirportDetails data',data)
    console.log('**********************************')
    return data
}
  

async function getArrivalAirportFlights({arr_iata}){
  const getData = async ({arr_iata}) =>{
    const res =  await axios({
      method: "get",
      url:'https://airlabs.co/api/v9/flights',
      params:{
        api_key: 'fac1d14c-c2c2-483a-84ea-f5572526a753',
        arr_iata
      }
    }).catch(err => console.log('getArrivalAirportFlights err',err));
    if(res.error){
      console.log('api restriction res',res)
    }
    // console.log('api restriction res',res)

    return res && res.data && res.data.response;
  }
  const delay = 2000;
  const tries = 5;
  const data = await fetchRetry(() => getData({arr_iata}),delay,tries).catch((error) => console.log('getArrivalAirportFlights final error',error));

  console.log('getArrivalAirportFlights data',data)
  console.log('**********************************')
  return data
    // const res =  await axios({
    //   method: "get",
    //   url:'https://airlabs.co/api/v9/flights',
    //   params:{
    //     api_key: '249abb86-dfa2-4125-8536-478c1e5e60d2',
    //     arr_iata
    //   }
    // }).catch(err => console.log('getArrivalAirportFlights err',err));
    // console.log('getArrivalAirportFlights res',res)
    // console.log('**********************************')
    // //console.log('getArrivalAirportFlights res && res.data', res && res.data && res.data.response)
    // return res && res.data  && res.data.response;
}

async function getDepartureAirportFlights({dep_iata}){
  const getData = async ({dep_iata}) =>{
    const res =  await axios({
      method: "get",
      url:'https://airlabs.co/api/v9/flights',
      params:{
        api_key: 'fac1d14c-c2c2-483a-84ea-f5572526a753',
        dep_iata
      }
    }).catch(err => console.log('getDepartureAirportFlights err',err));
    if(res.error){
      console.log('api restriction res',res)
    }
    return res && res.data && res.data.response;
  }
  const delay = 2000;
  const tries = 5;
  const data = await fetchRetry(() => getData({dep_iata}),delay,tries).catch((error) => console.log('getDepartureAirportFlights final error',error));

  console.log('getDepartureAirportFlights data',data)
  console.log('**********************************')
  return data
    // const res =  await axios({
    //   method: "get",
    //   url:'https://airlabs.co/api/v9/flights',
    //   params:{
    //     api_key: '249abb86-dfa2-4125-8536-478c1e5e60d2',
    //     dep_iata
    //   }
    // }).catch(err => console.log('getDepartureAirportFlights err',err));
    // //console.log('getDepartureAirportFlights res && res.data', res && res.data  && res.data.response)
    // console.log('getDepartureAirportFlights res',res)
    // console.log('**********************************')
    // return res && res.data  && res.data.response;
}

module.exports = {
  getFlight,
  getAirportDetails,
  getArrivalAirportFlights,
  getDepartureAirportFlights
}