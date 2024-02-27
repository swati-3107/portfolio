const {
  addUser,
  getAllCertificates,
  updateCertificate,
  deleteCertificate,
  addCertificate,
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
  getProjectsDetails,
  getCertDetails,
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  getProjects,
  getAllExper,
  addExper,
  deleteExper,
  getAllEducate,
  addEducate,
  deleteEducate,
} = require("../controller/adminController");
const { userProtected } = require("../middleware/Protected");

const router = require("express").Router();

router
  // USER ADMIN ROUTES
  .post("/user-add", addUser)
  .post("/admin-login", loginAdmin)
  .post("/admin-register", registerAdmin)
  .post("/admin-logout", logoutAdmin)

  // CERTIFICATIONS
  .get("/certificate", getAllCertificates)
  .get("/get-certificate/:id", getCertDetails)
  .post("/add-certificate", addCertificate)
  .put("/update-certificate/:id", updateCertificate)
  .delete("/delete-certificate/:id", deleteCertificate)

  // PROJECTS
  .get("/project", getAllProjects)
  // .get("/admin-project", userProtected, getProjects)
  .post("/add-project", addProject)
  .put("/update-project/:id", updateProject)
  .delete("/delete-project/:id", deleteProject)
  .get("/get-project/:id", getProjectsDetails)

  // EXPERIENCE
  .get("/exper", getAllExper)
  .post("/add-exper", addExper)
  .delete("/delete-exper/:id", deleteExper)
  // .put("/update-exper/:id", updateexper)

  // EDUCATION
  .get("/edu", getAllEducate)
  .post("/add-edu", addEducate)
  .delete("/delete-edu/:id", deleteEducate);
// .put("/update-edu/:id", updateEducate)

module.exports = router;
