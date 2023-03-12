import Kafka from 'node-rdkafka';
import eventTypeFlightNumber  from '../eventType/eventTypeFlightNumber.js';
import axios  from 'axios';

process.env.CLOUDKARAFKA_BROKERS= "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094";
process.env.CLOUDKARAFKA_USERNAME="qr6jojg6"
process.env.CLOUDKARAFKA_PASSWORD="qR_PQnz8EhuaTFS25-OXPPV_JlDRYkBV"
// process.env.CLOUDKARAFKA_TOPIC_PREFIX="username"



var kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094",//.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "qr6jojg6",
  "sasl.password": "qR_PQnz8EhuaTFS25-OXPPV_JlDRYkBV",
  "debug": "generic,broker,security"
};

async function getAirportDetails({id}){
  const res =  await axios({
    method: "get",
    url:'http://localhost:3000/flight',
    params:{
      id
    }
  });
  //console.log('getAirportDetails res && res.data res.data.response', res && res.data && res.data.response)

  return res && res.data;
}

var consumer = new Kafka.KafkaConsumer(kafkaConf, {});

consumer.connect();

consumer.on('ready', () => {
  console.log('consumer ready..')
  consumer.subscribe([ 'qr6jojg6-default']);
  // consumer.consume();
  setInterval(function() {
    consumer.consume(1);
  }, 1000);
}).on('data', function(data) {
  console.log(`received message: ${eventTypeFlightNumber.fromBuffer(data.value)}`);
  const {id} = eventTypeFlightNumber.fromBuffer(data.value)
  getAirportDetails({id}).then(data => console.log(data));
});
const id = { id: 10 }
getAirportDetails(id).then(data => console.log(data));
