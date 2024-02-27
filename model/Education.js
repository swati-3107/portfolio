const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    percentage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("education", educationSchema);
