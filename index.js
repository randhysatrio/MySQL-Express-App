require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bearerToken = require('express-bearer-token');

const app = express();
const PORT = process.env.PORT || 8800;

app.use(cors());
app.use(express.json());
app.use(bearerToken());
// apabila ada request dari url localhost:8800/public, maka express akan men-serve static file dari folder 'public' sesuai path req url
// krn kita specify /public, maka dr FE jg hrs menggunakan localhost:8800/public/${image.path}
app.use('/public', express.static('public'));

const { productsRouter, usersRouter, uploadRouter } = require('./router');
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);

app.listen(PORT, () => {
  console.log('API running at ' + PORT);
});
