var express = require('express');
var router = express.Router();
const { checkSchema } =require('express-validator');
const {verify} = require('../auth');
const orderController = require('../controllers/order');

router.route("/order")
  .post( 
    verify,
    checkSchema({
      shipAdd: {
        optional: true,
        isString: true,
        isLength: { options: { max:200 } },
        escape: true
      },
      note: {
        isString: true,
        isLength: { options: { max:500 } },
        escape: true
      }
    }),
    orderController.checkOut
  );


module.exports = router;