// const wait = async delay =>{
//     return new Promise(resolve => setTimeout(resolve,delay));
// }
  
//   const fetchRetry = async(func, delay, tries) =>{
//     function onError (err) {
//       let triesLeft = tries -1;
//       if(!triesLeft){
//         console.error('finish all retry err',err)
//         throw err;
//       }
//       return wait(delay).then(() => fetchRetry(func, delay, triesLeft));
//     }
//     return func().catch(onError);
// }
  

  async function getFlightAllData(flight){
    const [departureAirportPromise, arrivalAirportPromise] = await Promise.allSettled([getAirportDetails({iata_code: flight.dep_iata}),  getAirportDetails({iata_code: flight.arr_iata})])
    const departureAirport = departureAirportPromise  && departureAirportPromise.status === 'fulfilled' && departureAirportPromise.value && departureAirportPromise.value.length  && departureAirportPromise.value.find(item => item);
    const arrivalAirport = arrivalAirportPromise && arrivalAirportPromise.status === 'fulfilled' && arrivalAirportPromise.value && arrivalAirportPromise.value.length && arrivalAirportPromise.value.find(item => item);
  
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