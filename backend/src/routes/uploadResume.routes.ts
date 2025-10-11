import express from "express";
import multer from "multer";
import { handleUploadResume } from "../controllers/uploadResume.controller";

const router = express.Router();
const uploads = multer({dest : "uploads/"});

router.post("/" , uploads.single("resume"), handleUploadResume)

export default router;