import express from "express";
import { handleMatchJobs } from "../controllers/matchJobs.controller";

const router = express.Router();


router.post("/" , handleMatchJobs)
export default router;