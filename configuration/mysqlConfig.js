//חיבור ל mysql
const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "127.0.0.1",
    user: "root",
    password: "Ohad0412",
    database: "big_data_flight",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  listPerPage: 10,
};

module.exports = config;
