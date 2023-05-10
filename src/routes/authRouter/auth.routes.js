import express from 'express';

const router = express.Router();
import * as authController from "../../controller/authController/auth.controller.js";


router.post('/register',authController.register)

export default router;