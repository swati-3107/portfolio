const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    gallery: {
      type: [String],
      required: true,
    },
    link: {
      type: String,
      //   required: true,
    },
    name: {
      type: String,
      //   required: true,
    },
    client: {
      type: String,
      //   required: true,
    },
    aboutproject: {
      type: String,
      //   required: true,
    },
    achievements: {
      type: String,
      //   required: true,
    },
    languages: {
      type: [String],
      //   required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("projects", projectSchema);
