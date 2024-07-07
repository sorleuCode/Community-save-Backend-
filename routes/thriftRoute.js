const express = require("express");
const router = express.Router();
const { createThrift, joinThrift, deleteThrift, recieveThrift, paymentVerification, getAllThrifts} = require("../Controllers/ThriftController");

router.post("/create", verifyToken, isAdmin, createThrift);
router.post("/join/:id", joinThrift);
router.post("/recieve/:id", recieveThrift);
router.get("/verify", paymentVerification);
router.get("/", getAllThrifts);
router.delete("/:id", deleteThrift);

module.exports = router;
