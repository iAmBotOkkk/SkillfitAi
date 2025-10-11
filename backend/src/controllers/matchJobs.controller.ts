import express,{Request , Response} from "express";
import Job from "../models/schema";
import {ratio} from "fuzzball"


export const handleMatchJobs = async(req : Request, res: Response):Promise<void> => {
    try{
        const {skills} = req.body;
        const jobs = await Job.find();
    
        const matchedJobs = jobs.map((job) => {
            let matchedCount = 0;
    
            job.skills.forEach((jobskill) => {
                skills.forEach((userSkill : string) => {
                    if(ratio(userSkill , jobskill) > 50){
                        matchedCount++;
                    }
                });
            });
    
            const accuracy = ((matchedCount / job.skills.length) * 100).toFixed(2);
            return {job , accuracy}
        });
         matchedJobs.sort((a, b) => Number(b.accuracy) - Number(a.accuracy));
        res.json(matchedJobs);

    }
    catch(err) {
    console.error(err);
    res.status(500).json({ message: "Error matching jobs" });
}
}