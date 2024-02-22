const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    hero: {
      type: String,
      required: true,
      //   default: "puppy.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("certificates", certificateSchema);
