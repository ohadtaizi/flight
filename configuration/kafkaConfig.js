//חיבור ל kafka
const kafkaConfig = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094",//.split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "qr6jojg6",
    "sasl.password": "qR_PQnz8EhuaTFS25-OXPPV_JlDRYkBV",
    "debug": "generic,broker,security"
  };
  

  module.exports = kafkaConfig;
