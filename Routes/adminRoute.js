const express = require("express");
const router = express.Router();

const {adminRegister, adminLogin, getAdmins, getAdmin} = require("../Controllers/AdminController")

router.post("/register", adminRegister)
router.post("/login", adminLogin)
router.get("/", getAdmins)
router.get("/:adminId", getAdmin)


module.exports = router;
