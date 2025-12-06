const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("user's router ok");
})

module.exports = router;