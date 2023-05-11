import User from "../../model/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
dotenv.config();
//store user details store after email verification
var Store_firstname;
var Store_lastname;
var Store_Email;
var Store_DateOfBirth;
var Store_Hobbies;
var Store_Password;
var Store_Projects;
var Store_ProfilePicture;

//generate otp function
function generateOTP() {
  // Generate a random 6-digit number between 100000 and 999999
  const otp = Math.floor(Math.random() * 900000) + 100000;

  return otp.toString();
}
//Store Otp
var Store_Otp;

//node mailer
let mailTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: process.env.EMAIL_OTP,
    pass: process.env.APP_PASSWORD_EMAIL,
  },
});

//generate jsonwebtoken
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name, role: user.role },
    process.env.JWT_SECREAT_KEY,
    {
      expiresIn: "1h",
    }
  );
};

//register
export const register = async (req, res) => {
  try {
    console.log(req.body, "req bodyyy");
    const { firstName, lastName, dob, hobbies, projects, email, password } =
      req.body;
    const image = req.file;
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .send(
          "Email address already exists in the system. Please use a different email address or log in to your existing account."
        );
    } else {
      Store_firstname = firstName;
      Store_lastname = lastName;
      Store_Email = email;
      Store_DateOfBirth = dob;
      Store_Hobbies = hobbies;
      Store_Password = password;
      Store_Projects = projects;
      Store_ProfilePicture = image;
      Store_Otp = generateOTP();
      console.log(Store_Otp, "otp of the otp");

      let details = {
        from: process.env.EMAIL_OTP,
        to: email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          Store_Otp +
          "</h1>", // html body
      };
      mailTransport.sendMail(details, (err) => {
        if (err) {
          console.log(err);
          res.status(500).send({ status: false, error: err });
        } else {
          console.log("email is sent");
          res
            .status(200)
            .send({ status: true, email: true, msg: "email sent succesfuly" });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

//email verify
export const emailOtp = async (req, res) => {
  try {
    const otp = req.body.otp;
    if (otp == Store_Otp) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(Store_Password, salt);

      new User({
        firstName: Store_firstname,
        lastName: Store_lastname,
        email: Store_Email,
        dateOfBirth: Store_DateOfBirth,
        hobbies: Store_Hobbies,
        projects: Store_Projects,
        profilePicture: Store_ProfilePicture.filename,
        password: hashedPassword,
      })
        .save()
        .then(() => {
          res.status(200).send({ msg: "user registered succesfully" });
        });
    } else {
      res.status(400).send({ msg: "The email is not verified" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          return res
            .status(401)
            .send({ status: false, error: "Password does not match" });
        } else {
          const token = generateToken(user);
          return res.status(200).send({
            msg: " Login Successful...!",
            token,
          });
        }
      });
    } else {
      res.status(404).send({ msg: "User is not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};
