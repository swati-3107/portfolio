const multer = require("multer");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");

const profileStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname));
  },
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
});

const galleryStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname));
  },
  destination: (req, file, cb) => {
    // check folder present or not use existsSync
    if (!fs.existsSync("gallery")) {
      fs.mkdirSync("gallery");
    }
    cb(null, "gallery");
  },
});

const uploadProfile = multer({ storage: profileStorage }).single("hero");
const uploadGallery = multer({ storage: galleryStorage }).array("image", 5);

module.exports = { uploadProfile, uploadGallery };
