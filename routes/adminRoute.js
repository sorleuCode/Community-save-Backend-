const express = require("express");
const router = express.Router();
const { adminRegister, adminLogin } = require("../Controllers/UserController");

router.post("/register", adminRegister);
router.post("/login", adminLogin);
