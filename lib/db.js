var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rudehs97!',
    database: 'seniorproject'
});
db.connect();

module.exports = db;