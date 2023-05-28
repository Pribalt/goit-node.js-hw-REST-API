const express = require("express");
const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
} = require("..//..//controllers/auth");
const { validateBody, authenticate } = require("..//..//middlewares");
const { schemas } = require("..//..//schemas/auth");

const router = express.Router();

router.route("/register").post(validateBody(schemas.registerSchema), register);
router.route("/login").post(validateBody(schemas.loginSchema), login);
router.route("/current").get(authenticate, getCurrent);
router.route("/logout").post(authenticate, logout);
router
  .route("/subscription")
  .patch(
    authenticate,
    validateBody(schemas.updateSubscriptionSchema),
    updateSubscription
  );

module.exports = router;
