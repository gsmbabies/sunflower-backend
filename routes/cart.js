var express = require('express');
var router = express.Router();
const {verify} = require('../auth');
const cartController = require('../controllers/cart');
const { body } = require("express-validator");

router.route("/cart")
  .post( 
    verify,
    cartController.addToCart
  ) 
  .get(
    verify,
    cartController.getCart
  )
  .put(
    verify,
    cartController.editQuantity
  );

router.put(
  "/cart/editShipAdd",
  verify,
  body('shipAdd')
  .notEmpty()
  .withMessage("Shipping address is required")
  .escape(),
  cartController.editShipAdd
);

router.patch(
  "/cart/:id",
  verify,
  cartController.removeProduct
);

module.exports = router;