const Paste = require("../models/Paste");
const { getNow } = require("../utils/time");
const { validateCreatePaste } = require("../utils/validate");

exports.createPaste = async (req, res) => {
  try {
    const error = validateCreatePaste(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const { content, ttl_seconds, max_views } = req.body;

    let expiresAt = null;
    if (ttl_seconds) {
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    const paste = await Paste.create({
      content,
      expiresAt,
      maxViews: max_views ?? null,
    });

    return res.status(201).json({
      id: paste._id.toString(),
      url: `${process.env.BASE_URL}/p/${paste._id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPasteApi = async (req, res) => {
  try {
    const now = getNow(req);

    const paste = await Paste.findOneAndUpdate(
      {
        _id: req.params.id,

        // Not expired
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],

        // Views remaining
        $or: [
          { maxViews: null },
          { $expr: { $lt: ["$viewsUsed", "$maxViews"] } },
        ],
      },
      { $inc: { viewsUsed: 1 } },
      { new: true }
    );

    if (!paste) {
      return res.status(404).json({ error: "Paste not found" });
    }

    const remainingViews =
      paste.maxViews === null
        ? null
        : Math.max(paste.maxViews - paste.viewsUsed, 0);

    res.json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt,
    });
  } catch (err) {
    res.status(404).json({ error: "Paste not found" });
  }
};

exports.getPasteHtml = async (req, res) => {
  try {
    const now = getNow(req);

    const paste = await Paste.findOne({
      _id: req.params.id,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      $or: [
        { maxViews: null },
        { $expr: { $lt: ["$viewsUsed", "$maxViews"] } },
      ],
    });

    if (!paste) {
      return res.status(404).send("Paste not found");
    }

    res.setHeader("Content-Type", "text/html");
    res.send(`
      <html>
        <body>
          <pre>${escapeHtml(paste.content)}</pre>
        </body>
      </html>
    `);
  } catch {
    res.status(404).send("Paste not found");
  }
};

