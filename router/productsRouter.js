const router = require('express').Router();

const { productsController } = require('../controller');
const { auth } = require('../helper/authToken');

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductsByID);
router.post('/add', auth, productsController.addProducts);
router.patch('/edit/:id', auth, productsController.editProducts);
router.post('/delete/:id', auth, productsController.deleteProducts);

module.exports = router;
