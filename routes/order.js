var express = require('express');
var router = express.Router();
const {verify} = require('../auth');
const orderController = require('../controllers/order');

router.route("/order")
  .post( 
    verify,
    orderController.checkOut
  );


module.exports = router;