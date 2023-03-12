const db = require("../../../common/db");
const helper = require("../../../common/helper");

class GetFlightData {
    constructor({id}){
        Object.assign(this,{id})
    }

    async getData(id) {
        try { 
            const rows = await db.query(
                `SELECT * FROM flight where id = '${id}'`
            );
            console.log(rows)

            const data = helper.emptyOrRows(rows);
            const [firstObject] = data;
            return firstObject
        } catch (error) {
            console.error('there was an issue on GetFlightData class function getData  error', error);
            throw error;
        }
    }
      
    async run(){
        try { 
            const data = await this.getData(this.id)
        
            return  data  //{...data , json : data && data.json && JSON.parse(data.json)};
        } catch (error) {
            console.error('there was an issue on GetFlightData class error', error);
            throw error;
        }
    }

    static run(params){
        return new GetFlightData(params).run();
    }
}

module.exports = GetFlightData;