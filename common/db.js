const mysql = require("mysql2/promise");
const config = require("../configuration/mysqlConfig");
let connection ;
// בריכת בקשות להכניס לתוך DB
async function createPool() {
  try{
    return await mysql.createPool(config.db);
  } catch(error){
    console.error(`unable to create pool connection on mysql config.db ${config.db} error`,error);
  }
}



async function query(sql, params) {
  try{
    connection = connection || await createPool();
    const [results] = await connection.execute(sql, params)
    return results;
  } catch(error){
    console.error(`unable to execute sql ${sql} , params ${params} on mysql config.db ${config.db} error`,error);
  }
}

module.exports = {
  query,
};

