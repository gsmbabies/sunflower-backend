var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');
const { checkSchema, checkExact } = require("express-validator");
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

module.exports = router;
