const express = require("express");
const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("..//..//controllers/auth");
const { validateBody, authenticate, upload } = require("..//..//middlewares");
const { schemas } = require("..//..//schemas/auth");

const router = express.Router();

router.route("/register").post(validateBody(schemas.registerSchema), register);
router.route("/verify/:verificationToken").get(verifyEmail);
router
  .route("/verify")
  .post(validateBody(schemas.emailSchema), resendVerifyEmail);
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
router
  .route("/avatars")
  .patch(authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
