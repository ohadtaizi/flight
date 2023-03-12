
const flightController = require("../controllers/flightController");

module.exports = app => {
    app.route('/flight').get(flightController.getFlightData);
}