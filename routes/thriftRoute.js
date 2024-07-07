const express = require("express");
const router = express.Router();
const { createThrift, joinThrift, deleteThrift, receiveThrift, paymentVerification, getAllThrifts} = require("../Controllers/ThriftController");

router.post("/create", createThrift);
router.post("/join/:id", joinThrift);
router.post("/recieve/:id", receiveThrift);
router.get("/verify", paymentVerification);
router.get("/", getAllThrifts);
router.delete("/:id", deleteThrift);

module.exports = router;