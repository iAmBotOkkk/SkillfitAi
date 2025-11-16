import express from "express";
import { handleMatchJobs } from "../controllers/matchJobs.controller";

const router = express.Router();


router.post("/matchJob" , handleMatchJobs)
export default router;