const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET_KEY, { expiresIn: '15s' });
  },
};
