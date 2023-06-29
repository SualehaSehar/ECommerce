const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(userController.registerUser);

router.route("/login").post(userController.loginUser);

router.route("/password/forgot").post(userController.forgotPassword);

router.route("/password/reset/:token").put(userController.resetPassword);

router.route("/logout").get(userController.logout);

// user details routes

router
  .route("/me")
  .get(auth.isAuthenticatedUser, userController.getUserDetails);

router
  .route("/password/update")
  .put(auth.isAuthenticatedUser, userController.updatePassword);

router
  .route("/me/update")
  .put(auth.isAuthenticatedUser, userController.updateProfile);

// admin routes

router
  .route("/admin/users")
  .get(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    userController.getAllUsers
  );

router
  .route("/admin/user/:id")
  .get(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    userController.getSingleUser
  )
  .put(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    userController.updateUserRole
  )
  .delete(
    auth.isAuthenticatedUser,
    auth.authorizeRoles("admin"),
    userController.deleteUser
  );

module.exports = router;
