const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/email");
const Certificates = require("../model/Certificates");
const { uploadProfile } = require("../utils/upload");
const path = require("path");
const fs = require("fs/promises");

exports.addUser = asyncHandler(async (req, res) => {
  const { name, email, mobile, message } = req.body;
  await sendEmail({
    subject: ` You got Enquiry email from ${email}`,
    message: `Hey, my name is ${name} : ${mobile} : I've message For uh  ${message} `,
  });
  await User.create(req.body);
  console.log(req.body);
  res.status(201).json({ message: "User Add Success" });
});

exports.getAllCertificates = asyncHandler(async (req, res) => {
  const result = await Certificates.find();
  res.json({ message: "Certificates fetch success", result });
});

exports.addCertificate = asyncHandler(async (req, res) => {
  uploadProfile(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: err.message || "unable to upload img" });
    }
    // console.log(req.file);
    await Certificates.create({ ...req.body, hero: req.file.filename });
    res.status(201).json({ message: "certificate upload Success" });
  });
});

exports.deleteCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await Certificates.findById(id);
  // console.log(result);
  if (result && result.hero) {
    await fs.unlink(path.join(__dirname, "..", "upload", result.hero));
    await Certificates.findByIdAndDelete(id);
    res.json({ message: "Certificates delete success" });
  } else {
    res.status(400).json({ message: "invalid ID" });
  }
});

exports.updateCertificate = asyncHandler(async (req, res) => {
  uploadProfile(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: "aaaaaaaaaaaaaaaaaa" || "unable" });
    }
    console.log(req.body);
    await Certificates.findByIdAndUpdate(req.params.id, req.body);
    // const { id } = req.params;
    // const result = await Certificates.findById(id);
    // await Certificates.findByIdAndUpdate(id);
    res.json({ message: "Certificates update success" });
  });
});
