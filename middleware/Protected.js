const jwt = require("jsonwebtoken");

exports.userProtected = async (req, res, next) => {
  // console.log(req.cookies.auth);
  try {
    if (!req.cookies.auth) {
      return res.status(401).json({ message: "No Cookie Found" });
    }
    jwt.verify(req.cookies.auth, process.env.JWT_KEY, (err, decode) => {
      if (err) {
        return res.status(401).json({
          message: "kuch toh dadbd hai gaya",
        });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "User Protected Error" });
  }
};
