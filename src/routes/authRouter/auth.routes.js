import express from 'express';

const router = express.Router();
import * as authController from "../../controller/authController/auth.controller.js";


router.post('/register',authController.register)
router.post('/email-verify',authController.emailOtp);
router.post('/login',authController.login)

export default router;