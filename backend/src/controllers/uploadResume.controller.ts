import { Request, Response } from "express";
import { spawn } from "child_process";
import fs from "fs";

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

    const python = spawn("python", ["./src/services/skillExtractor.py", filePath]);

    let dataToSend = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      dataToSend += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", () => {
      try {
        // Delete temporary file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Handle Python errors
        if (errorOutput) {
        console.warn("Python Warning:", errorOutput);
      }

        // Safely extract JSON from stdout
        const jsonStart = dataToSend.indexOf("{"); // find the start of JSON
        if (jsonStart === -1) {
          res.status(500).json({ message: "Invalid JSON from Python script", details: dataToSend });
          return;
        }

        const jsonOutput = dataToSend.slice(jsonStart);
        let parsedData;
        try {
          parsedData = JSON.parse(jsonOutput);
        } catch (err) {
          console.error("JSON Parse Error:", err);
          res.status(500).json({ message: "Error parsing Python output", details: jsonOutput });
          return;
        }

        res.json({ extractedSkills: parsedData });
      } catch (err) {
        console.error("Error handling resume:", err);
        res.status(500).json({ message: "Server error while handling resume" });
      }
    });
  } catch (error: any) {
    console.error("Error in uploadResume controller:", error.message);
    res.status(500).json({ message: "Error processing resume" });
  }
};
