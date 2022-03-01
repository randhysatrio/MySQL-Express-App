require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = {
  createRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY);
  },
};
