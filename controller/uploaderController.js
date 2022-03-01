const db = require('../database');
const fs = require('fs');
const { uploader } = require('../helper/multer');

module.exports = {
  uploadFile: (req, res) => {
    const { file } = req.files;
    const filepath = `/images/${file[0].filename}`;

    const data = JSON.parse(req.body.data);

    const insertQuery = `INSERT INTO albums VALUES (null, ${db.escape(data.title)},${db.escape(data.description)},${db.escape(
      data.artist
    )},${db.escape(filepath)});`;

    db.query(insertQuery, data, (err, result) => {
      if (err) {
        console.log(err);
        fs.unlinkSync('./public' + filepath);
        return res.status(500).send(err);
      }

      const getQuery = `SELECT * FROM albums;`;

      db.query(getQuery, (err, result) => {
        if (err) return res.status(500).send(err);

        res.status(200).send({ message: 'Upload Success', result });
      });
    });
  },
  getUploadFile: (req, res) => {
    const getQuery = `SELECT * FROM albums;`;

    db.query(getQuery, (err, result) => {
      if (err) return res.status(500).send(err);

      res.status(200).send(result);
    });
  },
};
