import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

export const handleMatchJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeText } = req.body; 

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 10) {
      res.status(400).json({ message: "Resume text too short or invalid." });
      return;
    }
    const filePath = path.join(__dirname, "../../skills.json");

    if (!fs.existsSync(filePath)) {
      res.status(500).json({ message: "skills.json file not found" });
      return;
    }

    const python = spawn("python", ["./src/services/spacy_matcher.py", resumeText]);

    let dataToSend = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      dataToSend += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", (code) => {
      if (errorOutput) {
        console.error("Python error:", errorOutput);
      }

      try {
        const jsonStart = dataToSend.indexOf("{");
        if (jsonStart === -1) {
          res.status(500).json({ message: "Invalid JSON from NLP script", details: dataToSend });
          return;
        }

        const parsed = JSON.parse(dataToSend.slice(jsonStart));
        res.json(parsed);
      } catch (err) {
        console.error("JSON Parse Error:", err);
        res.status(500).json({ message: "Error parsing NLP output", details: dataToSend });
      }
    });
  } catch (err) {
    console.error("Error in handleMatchJobs:", err);
    res.status(500).json({ message: "Error running NLP match" });
  }
};
