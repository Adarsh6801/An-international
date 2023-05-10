import express from 'express'
import dotenv from "dotenv"
import bodyParser from "body-parser";
dotenv.config()
const app=express();
app.use(bodyParser.json());

import { dbConnect } from './config/database.config.js';

//routes
import authRouter from "../src/routes/authRouter/auth.routes.js"
import userRouter from "../src/routes/userRouter/user.routes.js"

app.use(express.json())
app.use('/auth',authRouter);
app.use('/user',userRouter);

//connecting the mongodb
dbConnect()

//server connection setup
app.listen(process.env.PORT,()=>{
    console.log(`Server is connected to the PORT: ${process.env.PORT}`);
    
})