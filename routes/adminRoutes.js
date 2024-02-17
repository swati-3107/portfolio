const { addUser } = require("../controller/adminController");

const router = require("express").Router();

router.post("/user-add", addUser);

module.exports = router;
