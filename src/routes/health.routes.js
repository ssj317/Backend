const router = require("express").Router();
const mongoose = require("mongoose");

router.get("/healthz", (req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.status(200).json({ ok });
});

module.exports = router;
