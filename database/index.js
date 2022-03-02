const mysql = require('mysql');

const db = mysql.createConnection({
  host: '85.10.205.173',
  user: 'randhy_satrio',
  password: 'randhy86satrio',
  database: 'mysql_express_vl',
  port: 3306,
  multipleStatements: true,
});

db.connect((err, result) => {
  if (err) {
    return console.log(err);
  }
  console.log('Connected to MySQL');
});

module.exports = db;
