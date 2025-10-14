import express from "express";
import multer from "multer";
import { handleUploadResume } from "../controllers/uploadResume.controller";
import { upload } from "../middlewares/upload";

const router = express.Router();
const uploads = multer({dest : "uploads/"});

router.post("/" , upload.single("resume"), handleUploadResume)

export default router;