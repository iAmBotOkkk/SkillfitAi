import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Instance } from "@/lib/axios";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const Resume = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleClear = (e : React.FormEvent) => {
    e.preventDefault();
    setSkills([]);
    setSelectedFile(null);
    setIsUploaded(false);
    toast.success("Cleared successfully! You can now upload a new resume.");
  };
  



  const handlefileUpload = async (files: File[] | null) => {
  

    if (!files || files.length === 0) {
      toast.error("Upload your resume");
      return;
    }

    const file = files[0];
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setIsLoading(true);
      const response = await Instance.post("/uploadResume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
      setSkills(response.data.extractedSkills?.skills || []);
      setIsUploaded(true);
      toast.success("Skills extracted successfully!");
      
    } catch (error: any) {
      console.log("error", error);
      toast.error("Error in uploading resume or extracting skills");
    } finally {
      setIsLoading(false);
  
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
          Upload your resume and get hired
        </h1>
      </div>
    
      <div className="space-y-4 sm:space-y-6">
        <label className="block text-sm sm:text-base text-zinc-500">
          Upload here (PDF or DOCX format only)
        </label>
          <div className="w-full">
            <FileUpload onChange={handlefileUpload} accept=".pdf,.docx" maxFiles={1} />
          </div>

          {selectedFile && (
            <p className="text-sm text-gray-600">
              Selected file: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
      </div>
      <div className="mt-8 sm:mt-10 space-y-4">
        <Button
          disabled={isLoading}
          className="w-full px-4 py-4 sm:py-5 text-lg sm:text-xl text-white font-medium rounded-lg
            bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
            transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          {isLoading ? "Extracting..." : "Match!!"  }
         
        </Button>
         {isUploaded && (
             <Button
            onClick={handleClear}
            className="w-full px-4 py-4 sm:py-5 text-lg sm:text-xl text-white font-medium rounded-lg
              bg-red-500 hover:bg-red-600 active:bg-red-700 
              transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            Clear
          </Button>
          )}
        {skills.length > 0 && (
          <div className="my-10">
            <h3 className="text-lg font-semibold mb-2">Extracted Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
                 
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
