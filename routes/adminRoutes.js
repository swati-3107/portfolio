const {
  addUser,
  getAllCertificates,
  updateCertificate,
  deleteCertificate,
  addCertificate,
} = require("../controller/adminController");

const router = require("express").Router();

router
  .post("/user-add", addUser)

  .get("/certificate", getAllCertificates)
  .post("/add-certificate", addCertificate)
  .put("/update-certificate/:id", updateCertificate)
  .delete("/delete-certificate/:id", deleteCertificate);

module.exports = router;
