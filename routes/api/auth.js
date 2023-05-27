const express = require("express");
const { register, login } = require("..//..//controllers/auth");
const { validateBody } = require("..//..//middlewares");
const { schemas } = require("..//..//schemas/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), register);
router.post("/login", validateBody(schemas.loginSchema), login);

module.exports = router;
