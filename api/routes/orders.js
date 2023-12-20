const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

router.get('/',checkAuth,OrdersController.order_get_all);

router.post('/',checkAuth,OrdersController.order_create);

router.get('/:orderId',checkAuth,OrdersController.order_get_one);

router.patch('/:orderId',checkAuth,OrdersController.order_update);

router.delete('/:orderId',checkAuth,OrdersController.order_delete);

module.exports = router;