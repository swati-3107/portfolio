const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/email");
const Certificates = require("../model/Certificates");
const { uploadProfile, uploadGallery } = require("../utils/upload");
const path = require("path");
const fs = require("fs/promises");
const Projects = require("../model/Projects");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../model/Admin");
const Experience = require("../model/Experience");
const Education = require("../model/Education");

// CONTACT USER DATA
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

// CERTIFICATES
exports.getCertDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await Certificates.findById(id);
  res.json({ message: "Project fetch success", result });
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

// PROJECTS
exports.getAllProjects = asyncHandler(async (req, res) => {
  const result = await Projects.find();
  res.json({ message: "Project fetch success", result });
});
// exports.getProjects = asyncHandler(async (req, res) => {
//   const result = await Projects.find();
//   res.json({ message: "Project fetch success", result });
// });

exports.getProjectsDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await Projects.findById(id);
  res.json({ message: "Project fetch success", result });
});

exports.addProject = asyncHandler(async (req, res) => {
  uploadGallery(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: err.message || "unable to upload file" });
    }
    const arr = [];
    for (const item of req.files) {
      arr.push(item.filename);
    }

    const languagesArray = req.body.languages
      .split(",")
      .map((lang) => lang.trim());

    await Projects.create({
      name: req.body.name,
      title: req.body.title,
      link: req.body.link,
      client: req.body.client,
      aboutproject: req.body.aboutproject,
      achievements: req.body.achievements,
      languages: languagesArray,
      gallery: arr,
    });
    console.log(req.files);
    res.status(201).json({ message: "Project add success" });
  });
});

exports.deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await Projects.findById(id);
  console.log(result);
  if (result && result.gallery) {
    for (const item of result.gallery) {
      await fs.unlink(path.join(__dirname, "..", "gallery", item));
    }
    await Projects.findByIdAndDelete(id);
    res.json({ message: "Project delete success" });
  } else {
    res.status(400).json({ message: "invalid ID" });
  }
});

exports.updateProject = asyncHandler(async (req, res) => {
  uploadGallery(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: "aaaaaaaaaaaaaaaaaa" || "unable" });
    }
    console.log(req.body);
    const { id } = req.params;
    const { removeItems = [], name } = req.body;
    console.log(removeItems);
    console.log(name);
    const result = await Projects.findById(id);
    for (const item of removeItems) {
      await fs.unlink(path.join(__dirname, "..", "gallery", item));
    }
    const arr = result.gallery.filter((item) => !removeItems.includes(item));
    // const arr = [];
    for (const item of req.files) {
      arr.push(item.filename);
    }
    await Projects.findByIdAndUpdate(id, { name, gallery: arr });
    res.json({ message: "Project update success" });
  });
});

// AUTHENTICATION
exports.registerAdmin = async (req, res) => {
  try {
    const { password } = req.body;
    //its called as salt which generate length of password
    const hashPass = await bcrypt.hash(password, 10);
    await Admin.create({ ...req.body, password: hashPass });
    res.status(201).json({ message: "Admin Register Success" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "something went wrong",
    });
  }
};

exports.loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(password);
  // check email & pass validation then login
  const result = await Admin.findOne({ email });
  if (!result) {
    return res.status(401).json({ message: "invalid email" });
  }
  // check pass
  const verify = await bcrypt.compare(password, result.password);
  if (!verify) {
    return res.status(401).json({ message: "invalid password" });
  }
  // console.log(result.password);
  // token/ login
  // generate token
  const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
  // await Admin.create(req.body);
  res.cookie("auth", token, { maxAge: 60 * 60 * 60 * 15 });
  res.status(201).json({
    message: "Admin Login Success",
    result: {
      email: result.email,
      id: result._id,
    },
  });
});

exports.logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("auth");
    res.status(201).json({ message: "User logout Success" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "something went wrong",
    });
  }
};

// EXPERIENCE
exports.getAllExper = asyncHandler(async (req, res) => {
  const result = await Experience.find();
  res.json({ message: "Experience fetch success", result });
});

exports.addExper = asyncHandler(async (req, res) => {
  const { name, role, desc, time } = req.body;
  await Experience.create(req.body);
  res.status(201).json({ message: "Experience add Success" });
});

exports.deleteExper = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // await Experience.findById(id);
  await Experience.findByIdAndDelete(id);
  res.json({ message: "Certificates delete success" });
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

// EDUCATION
exports.getAllEducate = asyncHandler(async (req, res) => {
  const result = await Education.find();
  res.json({ message: "Education fetch success", result });
});

exports.addEducate = asyncHandler(async (req, res) => {
  const { name, degree, year, percentage } = req.body;
  await Education.create(req.body);
  res.status(201).json({ message: "Education add Success" });
});

exports.deleteEducate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // await Education.findById(id);
  await Education.findByIdAndDelete(id);
  res.json({ message: "Certificates delete success" });
});

exports.updateEducate = asyncHandler(async (req, res) => {
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
