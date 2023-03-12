
const avro = require('avsc');

const eventTypeFlightNumber = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'id',
      type : 'int' 
    },
  ]
});

module.exports = {eventTypeFlightNumber}