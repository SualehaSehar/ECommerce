const express = require("express");
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(productController.getAllProducts);

router
  .route("/admin/product/new")
  .post(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    productController.createProduct
  );

router
  .route("/admin/product/:id")
  .put(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    productController.updateProduct
  )
  .delete(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    productController.deleteProduct
  );

router.route("/product/:id").get(productController.getProductDetails);

router
  .route("/review")
  .put(auth.isAuthenticatedUser, productController.createProductReview);

router
  .route("/reviews")
  .get(productController.getProductReviews)
  .delete(auth.isAuthenticatedUser, productController.deleteReview);

module.exports = router;
