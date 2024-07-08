const express = require("express");
const router = express.Router();

const {adminRegister, adminLogin, getAdmins, getAdmin, logoutAdmin} = require("../Controllers/AdminController")
const {adminRegister, adminLogin, logoutAdmin} = require("../Controllers/AdminController")

router.post("/register", adminRegister)
router.post("/login", adminLogin)
router.post("/logout", logoutAdmin)
// router.get("/", getAdmins)
// router.get("/:adminId", getAdmin)


module.exports = router;
