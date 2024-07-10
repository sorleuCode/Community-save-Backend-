const express = require("express");
const router = express.Router();
const { userRegister, userLogin, getAllUsers, updateUser,logoutUser } = require("../Controllers/UserController");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/", getAllUsers)
router.put("/update/:id", updateUser)
router.post("/logout", logoutUser)

module.exports = router;

