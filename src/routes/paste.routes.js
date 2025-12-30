const router = require("express").Router();
const {
  createPaste,
  getPasteApi,
  getPasteHtml,
} = require("../controllers/paste.controller");

router.post("/pastes", createPaste);
router.get("/pastes/:id", getPasteApi);
router.get("/p/:id", getPasteHtml);

module.exports = router;
