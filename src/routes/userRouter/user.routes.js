import express from 'express';
import * as userController from "../../controller/userController/user.controller.js";
const router = express.Router();

router.get('/get-all-users',userController.getAllUserProfile);
router.get('/get-user-pdf-profile/:id/download',userController.getPdfUserById);
router.get('/get-user-excel-profile/:id/download',userController.getExcelByUserId);

export default router;