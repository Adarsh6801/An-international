import express from 'express'
import dotenv from "dotenv"
import bodyParser from "body-parser";
import multer from 'multer';
import cookieParser from "cookie-parser"
import path from 'path';

dotenv.config()

const app=express();

import { dbConnect } from './config/database.config.js';

//routes
import authRouter from "../src/routes/authRouter/auth.routes.js"
import userRouter from "../src/routes/userRouter/user.routes.js"

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// Set up multer middleware for file uploads and form data
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  },
});
app.use(multer({storage: storage}).single("image"))

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// setup routes
app.use('/auth', authRouter);
app.use('/user', userRouter);

//connecting the mongodb
dbConnect()

//server connection setup
app.listen(process.env.PORT, () => {
  console.log(`Server is connected to the PORT: ${process.env.PORT}`);
})
