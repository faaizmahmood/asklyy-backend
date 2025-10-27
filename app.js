const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const errorHandler = require("./src/middleware/error.middleware");
const registerRoutes = require("./src/routes");

const app = express();

// ✅ Core middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Secure headers but widget-compatible
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ✅ Define allowed origins for sensitive routes (signin/signup/dashboard)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://asklyy.vercel.app", // production SaaS frontend
];

// ✅ Smart CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // 🟢 Allow no-origin requests (like mobile apps, curl, or your public widget)
      if (!origin) return callback(null, true);

      // 🟢 Allow known frontends (auth requests, dashboard)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // 🟢 Allow widget requests from *any* website
      if (origin.includes("http")) {
        return callback(null, true);
      }

      // ❌ Otherwise block
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Allow cross-origin embedding (for widget iframe / script)
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// ✅ Serve chatbot widget
app.get("/widget.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  res.sendFile(path.join(__dirname, "public/widget.js"));
});

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Asklyy API is running ✅" });
});

// ✅ Register all routes
registerRoutes(app);

// ✅ Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found ❌" });
});

// ✅ Global error handler
app.use(errorHandler);

module.exports = app;
