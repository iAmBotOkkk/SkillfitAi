
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Instance } from "@/lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "lucide-react";


interface MatchedJob {
  jobTitle: string;
  company?: string;
  location?: string;
  skills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  similarity: number;
  apply_link:string
}


export const AddResume = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleClear = () => {
    setSkills([]);
    setSelectedFile(null);
    setMatchedJobs([]);
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

      const extracted = response.data.extractedSkills?.skills || [];
      if (extracted.length === 0) {
        toast.error("No skills extracted from resume");
        return;
      }
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

  const handleMatchJobs = async () => {
    try {
      console.log("Sending skills to backend", skills)
      const matchRes = await Instance.post("/matchJob", { resumeText: skills.join(" ") });
      console.log("Backend logic ", matchRes.data)
      setMatchedJobs(matchRes.data?.matchedJobs || []);
      toast.success("Matched jobs loaded!");
    } catch (err) {
      toast.error("Error matching jobs");
    }
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="mb-8 sm:mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
          Upload your resume and get hired
        </h1>
      </motion.div>

      <motion.div
        className="space-y-4 sm:space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm sm:text-base text-zinc-500">
          Upload here (PDF or DOCX format only)
        </label>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <FileUpload
            onChange={handlefileUpload}
            accept=".pdf,.docx"
            maxFiles={1}
          />
        </motion.div>

        <AnimatePresence>
          {selectedFile && (
            <motion.p
              className="text-sm text-gray-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Selected file:{" "}
              <span className="font-medium">{selectedFile.name}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="mt-8 sm:mt-10 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button onClick={() => {
          if (!skills.length) {
            toast.error("Upload resume first")
            return;
          }
          handleMatchJobs();
        }}
          disabled={isLoading}
          className="w-full px-4 py-4 sm:py-5 text-lg sm:text-xl text-white font-medium rounded-lg
            bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
            transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          {isLoading ? "Extracting..." : "Match!!"}
        </Button>

        <AnimatePresence>
          {isUploaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Button
                onClick={handleClear}
                className="w-full px-4 py-4 sm:py-5 text-lg sm:text-xl text-white font-medium rounded-lg
                bg-red-500 hover:bg-red-600 active:bg-red-700 
                transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                Clear
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {skills.length > 0 && (
            <motion.div
              className="my-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-2">Your Skills:</h3>
              <motion.div
                className="flex flex-wrap gap-2"
                layout
              >
                {skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {matchedJobs.length > 0 && (
            <motion.div
              className="mt-8 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-3">
                Matched Jobs ({matchedJobs.length})
              </h3>
              <div className="space-y-3">
                {matchedJobs.map((match, index) => (
                  <motion.div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ">
                        <h4 className="text-lg font-semibold">{match.jobTitle}</h4>
                        <span className="text-blue-600 font-medium">{match.similarity?.toFixed(2)}% Match</span>
                      </div>
                      <p className="text-sm text-gray-600">{match.company || "Unknown Company"} • {match.location || ""}</p>
                      <p>{match.matchedSkills}</p>
                      <p>{match.missingSkills}</p>
                      <a href={match.apply_link} className="text-blue-500 flex items-center">Apply
                      <Link className="size-3 "/>
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {Array.isArray(match.matchedSkills) && match.matchedSkills.length > 0 ? (
                        match.matchedSkills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{skill}</span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-xs">No skill breakdown available</span>
                      )}

                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};  