const nodemailer = require("nodemailer");

const sendEmail = ({ subject, message }) =>
  new Promise((ressolve, reject) => {
    try {
      const mailer = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.FROM_EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });
      mailer.sendMail(
        {
          from: process.env.FROM_EMAIL,
          to: process.env.FROM_EMAIL,
          subject,
          text: message,
        },
        (err) => {
          if (err) {
            console.log(err);
            reject(err.message);
          }
          console.log("email send success");
          ressolve("email send success");
        }
      );
    } catch (error) {
      console.log(error);
      reject(error.message);
    }
  });

module.exports = sendEmail;
