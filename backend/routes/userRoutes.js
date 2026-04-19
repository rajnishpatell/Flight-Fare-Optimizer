import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  getMyProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAccount,
  requestEmailChange,confirmEmailChange
} from "../controllers/userController.js";


const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/update", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), uploadAvatar);
router.delete("/delete", authMiddleware, deleteAccount);
router.post("/request-email-change", authMiddleware, requestEmailChange);
router.get("/confirm-email-change/:token", confirmEmailChange);

export default router;
