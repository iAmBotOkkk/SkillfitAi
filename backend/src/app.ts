import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./utils/db";
import uploadResume from "./routes/uploadResume.routes"
import getMatchingJobs from "./routes/matchJobs.routes"

dotenv.config();
const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cors());


app.use("/api/uploadResume" , uploadResume);
app.use("/api/matchJob", getMatchingJobs)


app.listen(PORT , () =>{
    console.log(`Server is running on PORT ${PORT}`);
    connectDb();
});