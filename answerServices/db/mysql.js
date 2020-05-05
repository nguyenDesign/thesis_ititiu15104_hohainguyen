mysql = require('mysql')

const connection = mysql.createConnection({
    // host: "host.docker.internal",
    host:"host.docker.internal",
    user: "root",
    password:"1234",
    database:"questiondata",
});

module.exports = connection