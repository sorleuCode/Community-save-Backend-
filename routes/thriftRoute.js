const express = require("express");
const router = express.Router();
const { createThrift, joinThrift, deleteThrift, recieveThrift, contributeThrift } = require("../Controllers/ThriftController");

router.post("/create", createThrift);
router.post("/join/:id", joinThrift);
router.post("/recieve/:id", recieveThrift);
router.post("/contribute/:id", contributeThrift);
router.delete("/:id", deleteThrift);

module.exports = router;