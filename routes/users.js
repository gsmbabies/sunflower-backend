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

router.route("/cart/:id")
  .post( 
    param('id').notEmpty().withMessage("user ID cannot be empty"),
    body('products').isArray().withMessage("must be an array"),
    cartController.addToCart
  )
  .get(
    param('id').notEmpty().withMessage("user ID cannot be empty"),
    cartController.getCart
  );



module.exports = router;
