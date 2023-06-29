const express = require("express");
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

const router = express.Router();

router
  .route("/order/new")
  .post(auth.isAuthenticatedUser, orderController.newOrder);

router
  .route("/order/:id")
  .get(auth.isAuthenticatedUser, orderController.getSingleOrder);

router
  .route("/orders/me")
  .get(auth.isAuthenticatedUser, orderController.myOrders);

//admin routes

router
  .route("/admin/orders")
  .get(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    orderController.getAllOrders
  );

router
  .route("/admin/order/:id")
  .put(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    orderController.updateOrder
  )
  .delete(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    orderController.deleteOrder
  );

module.exports = router;
