var express = require("express");
var router = express.Router();
const {verify, verifyAdmin} = require("../auth");
const { checkSchema, param, body, checkExact, query } = require("express-validator");
const {
  schemaProducts
} = require("../utils/validators/productsValidatorSchema");
const {
  searchValidatorSchema
} = require("../utils/validators/searchValidatorSchema");
const productController = require("../controllers/products");

router
  .route("/")
  .get(
    checkSchema(searchValidatorSchema, ["query"]),
    productController.getAllProducts
  )
  .post(
    verify,
    verifyAdmin,
    checkSchema(schemaProducts),
    checkExact(),
    productController.addProducts
  );



router.get(
  "/details/:name",
  param("name").trim().escape(),
  productController.getProductByName
);

router.get(
  "/getProductsByArray",

  productController.getProductsByArray
);

router.get("/featured/all", productController.getFeaturedProducts);
router.get("/alsoLikeProduct/all", productController.getAlsoLikeProduct);
router.post("/upload", productController.upload);


router
  .route("/:id")
  .patch(body("*").escape(), productController.editProduct)
  .get(param("id").escape(), productController.getProductByID)
  .delete(productController.deleteProduct);







module.exports = router;
