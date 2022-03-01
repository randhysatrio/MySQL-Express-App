const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'lewishamilton',
  database: 'mysql_express_practice',
  multipleStatements: true,
});

db.connect((err, result) => {
  if (err) {
    console.log(err);
  }
  console.log('Connected to MySQL');
});

module.exports = db;
