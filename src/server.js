require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

let cachedConn = null;

async function connectDB() {
  if (cachedConn) return cachedConn;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  cachedConn = await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  return cachedConn;
}

/**
 * Vercel serverless handler
 */
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server initialization failed" });
  }
};

/**
 *  Local development only
 */
if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Local server running on port 3000");
    });
  });
}
