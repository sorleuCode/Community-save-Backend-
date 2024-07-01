const express = require("express");
const router = express.Router();
const { adminRegister, adminLogin } = require("../Controllers/UserController");

router.post("/register", userRegister);
router.post("/login", userLogin);
