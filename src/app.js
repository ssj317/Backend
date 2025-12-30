const express = require("express");
const cors = require("cors");
const pasteRoutes = require("./routes/paste.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

// Allow all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-test-now-ms"],
  })
);

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/", pasteRoutes);

module.exports = app;
