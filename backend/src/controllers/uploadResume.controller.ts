import { Request, Response } from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export const handleUploadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = req.file?.path;

    if (!filePath) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    if (!filePath.toLowerCase().endsWith(".pdf") && !filePath.toLowerCase().endsWith(".docx")) {
      res.status(400).json({ message: "Invalid file type" });
      return;
    }

    console.log("Processing file:", filePath);

const absolutePath = path.join(process.cwd(), filePath);
console.log("Resolved absolute path for Python:", absolutePath);


const pythonScript = path.join(process.cwd(), "src", "services", "skillExtractor.py");
console.log("Running Python script:", pythonScript);

const python = spawn("python", [pythonScript, absolutePath]);

    let dataToSend = "";
    let errorOutput = "";


    python.stdout.on("data", (data) => {
      const output = data.toString();
      console.log("Python raw stdout:", output);
      dataToSend += output;
    });


    python.stderr.on("data", (data) => {
      const err = data.toString();
      console.error("Python stderr:", err);
      errorOutput += err;
    });

    python.on("close", (code) => {
      try {
        console.log(` Python process exited with code ${code}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        if (errorOutput && !dataToSend.trim()) {
          console.warn("Python Error Output:", errorOutput);
          res.status(500).json({ message: "Python execution error", details: errorOutput });
          return;
        }
        const jsonStart = dataToSend.indexOf("{");
        if (jsonStart === -1) {
          console.error("Invalid JSON from Python:", dataToSend);
          res.status(500).json({ message: "Invalid JSON from Python script", details: dataToSend });
          return;
        }

        const jsonOutput = dataToSend.slice(jsonStart);
        let parsedData;

        try {
          parsedData = JSON.parse(jsonOutput);
        } catch (err) {
          console.error(" JSON Parse Error:", err);
          res.status(500).json({ message: "Error parsing Python output", details: jsonOutput });
          return;
        }
        if (parsedData.error) {
          res.status(500).json({ message: "Error in Python script", details: parsedData.error });
          return;
        }

        if (Array.isArray(parsedData.skills)) {
          res.json({ extractedSkills: parsedData });
        } else {
          res.json({ extractedSkills: { skills: [] } });
        }

      } catch (err) {
        console.error(" Error handling resume:", err);
        res.status(500).json({ message: "Server error while handling resume" });
      }
    });
  } catch (error: any) {
    console.error("Error in uploadResume controller:", error.message);
    res.status(500).json({ message: "Error processing resume" });
  }
};
