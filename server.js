const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const routes = require("./routes");
const birthdayCheckerJob = require("./jobs/BirthdayCheckerJob");

const app = express();

// Database connection
const uri = config.db.uri;
if (!uri) {
  console.error("MONGODB_URI is undefined. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(config.db.uri)
  .then(() => {
    console.log("Connected to MongoDB");
    birthdayCheckerJob.init();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routes
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
