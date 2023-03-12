const express = require("express");
const db = require("./common/db");
const kafkaConfig = require("./configuration/kafkaConfig");
const Kafka = require('node-rdkafka');
const {eventTypeFlightNumber} = require('./eventType/eventTypeFlightNumber');
const routes = require('./routes');
const app = express();
const port = 3000;
const { getWeather } = require('./api/flight/common/externalWeatherApi')
const { getJewishCalender } = require('./api/flight/common/externalJewishCalenderApi')
const {
  getFlight,
  getAirportDetails,
  getArrivalAirportFlights,
  getDepartureAirportFlights
} = require('./api/flight/common/externalFlightApi')


if(routes){
  console.log('routes',routes)
  routes(app);
}


const streamDefault = Kafka.Producer.createWriteStream(kafkaConfig, {}, {
  topic: 'qr6jojg6-default'
});

const streamY = Kafka.Producer.createWriteStream(kafkaConfig, {}, {
  topic: 'qr6jojg6-test'
});

streamDefault.on('error', (err) => {
  console.error('Error in our kafka stream');
  console.error(err);
});

streamY.on('error', (err) => {
  console.error('Error in our kafka stream');
  console.error(err);
});



// const wait = async delay =>{
//   return new Promise(resolve => setTimeout(resolve,delay));
// }

// const fetchRetry = async(func, delay, tries) =>{
//   function onError (err) {
//     let triesLeft = tries -1;
//     if(!triesLeft){
//       console.error('finish all retry err',err)
//       throw err;
//     }
//     return wait(delay).then(() => fetchRetry(func, delay, triesLeft));
//   }
//   return func().catch(onError);
// }

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.get("/", (req, res) => {
  
  res.json({ message: new Date() });
});

// app.use("/programming-languages", programmingLanguagesRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// async function getFlight({flight_iata}){
//   const res = await axios({
//     method: "get",
//     url:'https://airlabs.co/api/v9/flight',
//     params:{
//       api_key: '881f67fa-a380-4f84-8e60-0de124f7bad6',
//       flight_iata
//     }
//   });

//   return res && res.data
// }

// async function getWeather({lat,lon}){
//   console.log('getWeather',{lat,lon})

//   const getData = async ({lat,lon}) =>{
//     const res = await axios({
//       method: "get",
//       // https://api.openweathermap.org/data/2.5/forecast
//       // // url:'https://www.hebcal.com/hebcal',
//       url:'https://api.openweathermap.org/data/2.5/forecast',
//       params:{
//         units: 'metric',
//         appid: 'c787eae9d7c0bc48e3f7917fa9a4a43c',
//         lat,
//         lon
//       }
//     });
//     return res && res.data
//   }
//   const delay = 2000;
//   const tries = 5;
//   const data = await fetchRetry(() => getData({lat,lon}),delay,tries);

//   console.log('data',data)
//   return data;
// }

// async function getAirportDetails({iata_code}){
//   const res =  await axios({
//     method: "get",
//     url:'https://airlabs.co/api/v9/airports',
//     params:{
//       api_key: '249abb86-dfa2-4125-8536-478c1e5e60d2',
//       iata_code
//     }
//   });
//   //console.log('getAirportDetails res && res.data res.data.response', res && res.data && res.data.response)

//   return res && res.data  && res.data.response;
// }

// async function getArrivalAirportFlights({arr_iata}){
//   const res =  await axios({
//     method: "get",
//     url:'https://airlabs.co/api/v9/flights',
//     params:{
//       api_key: '249abb86-dfa2-4125-8536-478c1e5e60d2',
//       arr_iata
//     }
//   });

//   //console.log('getArrivalAirportFlights res && res.data', res && res.data && res.data.response)
//   return res && res.data  && res.data.response;
// }

// async function getDepartureAirportFlights({dep_iata}){
//   const res =  await axios({
//     method: "get",
//     url:'https://airlabs.co/api/v9/flights',
//     params:{
//       api_key: '249abb86-dfa2-4125-8536-478c1e5e60d2',
//       dep_iata
//     }
//   });
//   //console.log('getDepartureAirportFlights res && res.data', res && res.data  && res.data.response)

//   return res && res.data  && res.data.response;
// }

// async function getJewishCalender({
//   v = '1',
//   cfg = 'json',
//   maj= 'on',
//   min= 'on',
//   mod= 'on',
//   nx= 'on',
//   year= 'now',
//   month= 'x',
//   ss= 'on',
//   mf= 'now',
//   geo= 'geoname',
//   geonameid= '281184',
//   M= 'on',
//   s= 'now',
//   start= new Date().toISOString().split('T')[0],
//   end= new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
// }){
//   const res =  await axios({
//     method: "get",
//     url:' https://www.hebcal.com/hebcal',
//     params:{
//       v,
//       cfg,
//       maj,
//       min,
//       mod,
//       nx,
//       year,
//       month,
//       ss,
//       mf,
//       geo,
//       geonameid,
//       M,
//       s,
//       start,
//       end,
//     }
//   });
//   //console.log('getJewishCalender res && res.data', res && res.data)

//   return res && res.data;
// }

async function getFlightAllData(flight){
  const [departureAirportPromise, arrivalAirportPromise] = await Promise.allSettled([getAirportDetails({iata_code: flight.dep_iata}),  getAirportDetails({iata_code: flight.arr_iata})])
  const departureAirport = departureAirportPromise  && departureAirportPromise.status === 'fulfilled' && departureAirportPromise.value && departureAirportPromise.value.length  && departureAirportPromise.value.find(item => item);
  const arrivalAirport = arrivalAirportPromise && arrivalAirportPromise.status === 'fulfilled' && arrivalAirportPromise.value && arrivalAirportPromise.value.length && arrivalAirportPromise.value.find(item => item);
  // const flightInfo = flightInfoPromise && flightInfoPromise.status === 'fulfilled' && flightInfoPromise.value && flightInfoPromise.value

  if(!arrivalAirport || !departureAirport) {
    console.log(`there was a issue Airport api that base on ${JSON.stringify(flight)}`);
    if(departureAirportPromise  && departureAirportPromise.status === 'rejected') {
      console.log(`there was a issue departureAirportPromise reason ${departureAirportPromise.reason}`);
    }
    if(arrivalAirportPromise  && arrivalAirportPromise.status === 'rejected') {
      console.log(`there was a issue arrivalAirportPromise reason ${arrivalAirportPromise.reason}`);
    }
    return;
  } 

  const [arrivalAirportWeatherPromise, departureAirportWeatherPromise] = await Promise.allSettled([getWeather({lat:arrivalAirport.lat, lon:arrivalAirport.lng}), getWeather({lat: departureAirport.lat, lon: departureAirport.lng})]);
  const departureAirportWeather = departureAirportWeatherPromise  && departureAirportWeatherPromise.status === 'fulfilled' && departureAirportWeatherPromise.value;
  const arrivalAirportWeather = arrivalAirportWeatherPromise && arrivalAirportWeatherPromise.status === 'fulfilled' && arrivalAirportWeatherPromise.value;

  if(!arrivalAirportWeather || !departureAirportWeather) {
    console.log(`there was a issue Weather api that base on flight: ${JSON.stringify(flight)}`);
    if(arrivalAirportWeatherPromise  && arrivalAirportWeatherPromise.status === 'rejected') {
      console.log(`there was a issue Weather api that base on arrivalAirport: ${JSON.stringify(arrivalAirport)}`);
      console.log(`there was a issue arrivalAirportWeatherPromise reason ${arrivalAirportWeatherPromise.reason}`);
    }

    if(departureAirportWeatherPromise  && departureAirportWeatherPromise.status === 'rejected') {
      console.log(`there was a issue Weather api that base on departureAirport: ${JSON.stringify(departureAirport)}`);
      console.log(`there was a issue departureAirportWeatherPromise reason ${departureAirportWeatherPromise.reason}`);
    }

    return;
  } 
    
  return {

    flightData: flight,
    Airports:{
      arrivalAirport,
      departureAirport
    },
    flightWether:{
      arrivalAirportWeather,
      departureAirportWeather
    }
  }
}



async function someAction(){
  // const [arrivalTLVlAirportFlightsPromise, departureTLVAirportFlightsPromise, jewishCalenderPromise] = await Promise.allSettled([getArrivalAirportFlights({arr_iata: 'TLV'}),
  //                           getDepartureAirportFlights({dep_iata: 'TLV'}), 
  //                           getJewishCalender({})]);


  // const arrivalTLVlAirportFlights = arrivalTLVlAirportFlightsPromise  && arrivalTLVlAirportFlightsPromise.status === 'fulfilled' && arrivalTLVlAirportFlightsPromise.value;
  // const departureTLVAirportFlights = departureTLVAirportFlightsPromise && departureTLVAirportFlightsPromise.status === 'fulfilled' && departureTLVAirportFlightsPromise.value;
  // const jewishCalender = jewishCalenderPromise && jewishCalenderPromise.status === 'fulfilled' && jewishCalenderPromise.value;
  // console.log('arrivalTLVlAirportFlightsPromise',arrivalTLVlAirportFlightsPromise)

  // // console.log('arrivalTLVlAirportFlightsPromise',arrivalTLVlAirportFlightsPromise)
  // const arrival = await  Promise.all(arrivalTLVlAirportFlights.map(async item => await getFlightAllData(item)))
  // console.log('ok0')

  // const departure = await  Promise.all(departureTLVAirportFlights.map(async item => await getFlightAllData(item)))
  // console.log('ok1')

  // const nextFridey = jewishCalender.items.find(item => item && item.category === "candles" && !item.memo)
  // const nextHoliday = jewishCalender.items.find(item => item.category === "holiday" && !['Rosh Hashana LaBehemot','Leil Selichot'].includes(item.title))
  // console.log('ok2')

  
  // const data = {arrival,departure,jewishCalender,nextFridey,nextHoliday}

  // const result = await db.query(
  //   `INSERT INTO flight 
  //   (json) 
  //   VALUES 
  //   ("${JSON.stringify(data).replace(/[\\$'"]/g, "\\$&")}")`
  // );

  // let message = "Error in creating programming language";

  // if (result.affectedRows) {
  //   console.log('result.affectedRows',result.affectedRows)
  //   message = "flight data created successfully";
  // }

  // console.log('message',message)

  const id = 20//result && result.insertId || -1
  const event = { id}
  let success = streamDefault.write(eventTypeFlightNumber.toBuffer(event));     
  console.log('success',success)
  if (success) {
    console.log(`message streamDefault queued (${JSON.stringify(success)})`);
  } else {
    console.log('Too many messages in the queue already..');
  }

  success = streamY.write(eventTypeFlightNumber.toBuffer(event));     
  if (success) {
    console.log(`message streamY queued (${JSON.stringify(success)})`);
  } else {
    console.log('Too many messages in the queue already..');
  }
  
}


// someAction();

setInterval(() =>{
  someAction();
  console.log("90 sec ago");
}, 10000);
