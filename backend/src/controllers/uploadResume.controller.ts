import {Request , Response} from "express";
import {spawn} from "child_process"
import fs from "fs"

export const handleUploadResume = async (req : Request, res: Response): Promise<void> => {
    try {
        const filePath = req.file?.path;
        if(!filePath){
            res.status(400).json({message : "No file uploaded"});
            return
        }

        if(!(filePath?.endsWith(".pdf") || filePath?.endsWith(".docx"))) {
            res.status(400).json({message : "Invalid file type"});
            return
        }

        const python = spawn("python" , ["services/skillExtractor.py" ,filePath]);
        
        let dataToSend = "";
        python.stdout.on("data" , (data) => (dataToSend += data.toString()));

        python.on("close" , () => {
            fs.unlinkSync(filePath);
            res.json({extractedSkills : JSON.parse(dataToSend)});
            return;
        })

    } catch (error : any) {
        console.log("Error in uploadResume controller" , error.message);
        res.status(500).json({message : "Error uploading resume"})
    }
}

