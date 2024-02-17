const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const app = express();

mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.use(cors());

app.use("/api/admin", require("./routes/adminRoutes"));

mongoose.connection.once("open", () => {
  console.log("MONGO CONNECTED");
  app.listen(process.env.PORT, console.log("SERVER RUNNING"));
});
