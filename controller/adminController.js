const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/email");

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
