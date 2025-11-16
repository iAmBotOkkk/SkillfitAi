import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { ratio } from "fuzzball";

export const handleMatchJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      res.status(400).json({ message: "No skills provided for matching." });
      return;
    }

    // Read your local JSON file
    const filePath = path.join(__dirname, "../../skills.json"); // adjust path if needed
    const fileData = fs.readFileSync(filePath, "utf8");
    const jobs = JSON.parse(fileData);

    if (!Array.isArray(jobs)) {
      res.status(500).json({ message: "Invalid job data format in JSON file." });
      return;
    }

    // Matching logic
    const matchedJobs = jobs.map((job: any) => {
      const jobSkills = job.requirements || job.skills || [];
      let matchedCount = 0;
      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];

      jobSkills.forEach((jobSkill: string) => {
        const bestMatch = skills.some(
          (userSkill: string) =>
            ratio(userSkill.toLowerCase(), jobSkill.toLowerCase()) >= 60
        );

        if (bestMatch) {
          matchedCount++;
          matchedSkills.push(jobSkill);
        } else {
          missingSkills.push(jobSkill);
        }
      });

      const total = jobSkills.length || 1;
      const accuracy = ((matchedCount / total) * 100).toFixed(2);

      return {
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        matchedSkills,
        missingSkills,
        accuracy: Number(accuracy),
        apply_link: job.apply_link,
      };
    });

    matchedJobs.sort((a, b) => b.accuracy - a.accuracy);

    console.log("Matched Jobs:", matchedJobs);

    res.json({
      totalJobs: matchedJobs.length,
      matchedJobs,
    });
  } catch (err) {
    console.error("Error in handleMatchJobs:", err);
    res.status(500).json({ message: "Error matching jobs" });
  }
};
