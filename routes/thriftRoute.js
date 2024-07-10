const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { createThrift, joinThrift, deleteThrift, recieveThrift, paymentVerification, getAllThrifts, getAdminThrifts} = require("../Controllers/ThriftController");

router.post("/create", verifyToken, isAdmin, createThrift);
router.post("/join/:id", joinThrift);
router.post("/recieve/:id", recieveThrift);
router.get("/verify", paymentVerification);
router.get("/", getAllThrifts);
router.get("/adminthrifts",verifyToken, isAdmin, getAdminThrifts);
router.delete("/:id", deleteThrift);

module.exports = router;
