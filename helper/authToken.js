const jwt = require('jsonwebtoken');
const db = require('../database');

module.exports = {
  auth: (req, res, next) => {
    if (!req.token) {
      return res.status(401).send('You are not authorized');
    }
    jwt.verify(req.token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).send(err);
      }

      req.user = decoded;
      next();
    });
  },
  authRefresh: (req, res, next) => {
    if (!req.token) {
      return res.status(401).send('You are not authenticated');
    }
    const checkTokenQuery = `SELECT * FROM refreshtokens WHERE refreshToken = ${db.escape(req.token)}`;

    db.query(checkTokenQuery, (err, result) => {
      if (!result.length) {
        return res.status(403).send('Refresh Token is not valid!');
      }
      jwt.verify(req.token, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(500).send(err);
        }

        req.user = decoded;
        next();
      });
    });
  },
};
