const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "./.env" });

const app = express();

mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.use(cors());

app.use("/api/admin", require("./routes/adminRoutes"));

app.use(express.static(path.join(__dirname, "dist")));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
mongoose.connection.once("open", () => {
  console.log("MONGO CONNECTED");
  app.listen(process.env.PORT, console.log("SERVER RUNNING"));
});
