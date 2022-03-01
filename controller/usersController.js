const db = require('../database');
const Crypto = require('crypto');
const { createToken } = require('../helper/createToken');
const { createRefreshToken } = require('../helper/createRefreshToken');
const transporter = require('../helper/nodemailer');
require('dotenv').config();

module.exports = {
  loginUser: (req, res) => {
    req.body.password = Crypto.createHmac('sha256', process.env.CRYPTO_SECRET_KEY).update(req.body.password).digest('hex');
    const { userInfo, password } = req.body;

    let loginQuery;

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userInfo)) {
      loginQuery = `SELECT * FROM users WHERE email = ${db.escape(userInfo)} AND password = ${db.escape(password)}`;
    } else {
      loginQuery = `SELECT * FROM users WHERE username = ${db.escape(userInfo)} AND password = ${db.escape(password)}`;
    }

    db.query(loginQuery, (err, result) => {
      if (err) return res.status(500).send(err);

      if (!result.length) {
        return res.status(404).send('Please check your username or email');
      }

      if (result.length) {
        const { idusers, firstName, lastName, username, email, password, role } = result[0];
        const token = createToken({ idusers, firstName, lastName, username, email, role });

        if (result[0].status !== 'Verified') {
          res.status(200).send({
            userData: { idusers, firstName, lastName, username, token, role },
            message: 'This account is not verified! Please verify your account so we can keeps you logged in',
          });
        } else {
          const getRefreshTokenQuery = `SELECT * FROM refreshtokens WHERE username = ${db.escape(username)} AND password = ${db.escape(
            password
          )}`;

          db.query(getRefreshTokenQuery, (err, result) => {
            if (err) return res.status(500).send(err);

            res
              .status(200)
              .send({ userData: { idusers, firstName, lastName, username, token, role }, refreshToken: result[0].refreshToken });
          });
        }
      }
    });
  },
  persistenLogin: (req, res) => {
    const { idusers, username } = req.user;

    const loginQuery = `SELECT * FROM users WHERE idusers = ${db.escape(idusers)} AND username = ${db.escape(username)}`;

    db.query(loginQuery, (err, result) => {
      if (err) return res.status(500).send(err);

      const { idusers, firstName, lastName, username, email, role } = result[0];
      const token = createToken({ idusers, firstName, lastName, username, email, role });

      res.status(200).send({ userData: { ...req.user, token } });
    });
  },
  registerUser: (req, res) => {
    req.body.password = Crypto.createHmac('sha256', process.env.CRYPTO_SECRET_KEY).update(req.body.password).digest('hex');
    const { firstName, lastName, email, username, password } = req.body;

    const usernameCheckQuery = `SELECT * FROM users WHERE username LIKE ${db.escape(username)};`;

    db.query(usernameCheckQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (result.length) {
        return res.status(409).send('This username has been taken!');
      }

      const registerQuery = `INSERT INTO users VALUES (null, ${db.escape(firstName)},${db.escape(lastName)},${db.escape(email)},${db.escape(
        username
      )},${db.escape(password)},'User','Unverified');`;

      db.query(registerQuery, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        if (result.insertId) {
          const getUserQuery = `SELECT * FROM users WHERE idusers = ${db.escape(result.insertId)};`;
          db.query(getUserQuery, (err, result) => {
            if (err) return res.status(500).send(err);

            const { idusers, firstName, lastName, username, email, password, role } = result[0];

            const token = createToken({ idusers, firstName, lastName, email, username, role });
            const refreshToken = createRefreshToken({ idusers, firstName, lastName, email, username, role });

            const insertRefreshTokenQuery = `INSERT INTO refreshtokens VALUES (null,${db.escape(refreshToken)},${db.escape(
              username
            )},${db.escape(password)});`;

            db.query(insertRefreshTokenQuery, (err, result) => {
              if (err) return res.status(500).send(err);

              const mail = {
                from: 'Admin',
                to: `${email}`,
                subject: 'Account Verification',
                html: `<a href="http://localhost:3000/verification/${refreshToken}">Click Here to verify your Account</a>`,
              };

              transporter.sendMail(mail, (errMail, resMail) => {
                if (errMail) res.status(500).send({ message: 'Registration Failed', success: false, err: errMail });

                res.status(200).send({
                  message: 'Registration Success!',
                  userData: { idusers, firstName, lastName, username, token, role },
                  idrefresh: result.insertId,
                  success: true,
                });
              });
            });
          });
        }
      });
    });
  },
  verification: (req, res) => {
    const { idusers } = req.user;
    const verifyQuery = `UPDATE users SET status = 'Verified' WHERE idusers = ${idusers}`;

    db.query(verifyQuery, (err, result) => {
      if (err) return res.status(500).send(err);

      const { idusers, firstName, lastName, username, email, role } = req.user;

      const token = createToken({ idusers, firstName, lastName, username, email, role });

      res.status(200).send({ message: 'Verification success!', userData: { ...req.user, token }, success: true });
    });
  },
  refreshToken: (req, res) => {
    const { idusers, firstName, lastName, username, email, role } = req.user;
    const token = createToken({ idusers, firstName, lastName, username, email, role });

    res.status(200).send({ userData: { ...req.user, token } });
  },
  getUserById: (req, res) => {
    const idusers = req.params.idusers;

    const getQueryId = `SELECT * FROM users WHERE idusers = ${db.escape(idusers)}`;

    db.query(getQueryId, (err, result) => {
      if (err) return res.status(500).send(err);

      res.status(200).send(result);
    });
  },
};
