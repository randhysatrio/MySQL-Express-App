const db = require('../database');

module.exports = {
  getProducts: (req, res) => {
    const getQuery = 'SELECT * FROM products;';

    db.query(getQuery, (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(result);
    });
  },
  getProductsByID: (req, res) => {
    const id = parseInt(req.params.id);

    const getQueryID = `SELECT * FROM products WHERE idproducts = ${id};`;

    db.query(getQueryID, (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(result);
    });
  },
  addProducts: (req, res) => {
    if (req.user.role !== 'Admin') {
      return res.status(403).send('You do not have the proper access to perform this action');
    }
    const { name, category, price } = req.body;

    const addQuery = `INSERT INTO products VALUES (null, ${db.escape(name)}, ${db.escape(category)}, ${db.escape(price)})`;

    db.query(addQuery, (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      db.query(`SELECT * FROM products;`, (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result);
      });
    });
  },
  editProducts: (req, res) => {
    if (req.user.role !== 'Admin') {
      return res.status(403).send('You do not have the proper access to perform this action');
    }
    const id = parseInt(req.params.id);
    const editData = [];

    for (let prop in req.body) {
      editData.push(`${prop} = ${db.escape(req.body[prop])}`);
    }

    const updateQuery = `UPDATE products SET ${editData} WHERE idproducts = ${id}`;

    db.query(updateQuery, (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      db.query(`SELECT * FROM products`, (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result);
      });
    });
  },
  deleteProducts: (req, res) => {
    if (req.user.role !== 'Admin') {
      return res.status(403).send('You dont have the proper access to perform this action');
    }
    const id = parseInt(req.params.id);

    const deleteQuery = `DELETE FROM products WHERE idproducts = ${req.params.id}`;

    db.query(deleteQuery, (err, result) => {
      if (err) {
        res.status(500).send(200);
      }
      db.query(`SELECT * FROM products`, (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result);
      });
    });
  },
};
