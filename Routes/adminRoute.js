const express = require("express");
const router = express.Router();

const { adminRegister, adminLogin, logoutAdmin, updateAdmin } = require("../Controllers/AdminController");

router.post("/register", adminRegister)
router.post("/login", adminLogin)
router.post("/logout", logoutAdmin)
router.put("/update/:id", updateAdmin)


module.exports = router;
