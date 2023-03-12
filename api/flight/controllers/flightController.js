
const GetFlightData = require("../interactions/GetFlightData");
//מקבל את את המידע על הטיסטת
async function getFlightData (req, res, next) {
    try {
        const id = req.query.id
        const data = await GetFlightData.run({id});
        res.status(200).json(data);
    } catch (err) {
        console.error(`Error while getting flight data `, err.message);
        next(err);
    }
};

module.exports = { getFlightData };