var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');
const cartController = require('../controllers/cart');
const { checkSchema, checkExact,body, param } = require("express-validator");
const {schemaUser} = require("../utils/validators/usersValidatorSchema");
const {schemaLogin} = require("../utils/validators/loginValidatorSchema");
const {verify,verifyAdmin} = require('../auth');

/* GET users listing. */
router.get('/',
  verify,
  userController.getUserDetails
);


router.post(
  '/register', 
  checkSchema(schemaUser), 
  checkExact(), 
  userController.register
);

router.post(
  '/login', 
  checkSchema(schemaLogin), 
  checkExact(), 
  userController.login
);

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
  )
  .delete(
    verify,
    cartController.removeProduct
  );

module.exports = router;
