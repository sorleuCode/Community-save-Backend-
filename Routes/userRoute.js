const express = require("express");
const router = express.Router();
const { userRegister, userLogin, getAllUsers, updateUser } = require("../Controllers/UserController");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/", getAllUsers)
router.put("/update/:id", updateUser)

module.exports = router;

