import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Instance } from "@/lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Loader2Icon } from "lucide-react";

interface MatchedJob {
  jobTitle: string;
  company?: string;
  location?: string;
  skills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  similarity: number;
  apply_link: string;
}

export const AddResume = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClear = () => {
    setSkills([]);
    setSelectedFile(null);
    setMatchedJobs([]);
    toast.success("Cleared successfully! You can now upload a new resume.");
  };

  // ✅ Extract and Match Jobs Combined
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

      // Step 1️⃣ Extract skills
      const response = await Instance.post("/uploadResume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extracted = response.data.extractedSkills?.skills || [];
      if (extracted.length === 0) {
        toast.error("No skills extracted from resume");
        setIsLoading(false);
        return;
      }

      setSkills(extracted);
      toast.success("Skills extracted successfully!");

      // Step 2️⃣ Automatically match jobs
      const matchRes = await Instance.post("/matchJob", {
        resumeText: extracted.join(" "),
      });

      setMatchedJobs(matchRes.data?.matchedJobs || []);
      toast.success("Matched jobs loaded!");
    } catch (error: any) {
      console.error(error);
      toast.error("Error processing resume or matching jobs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div className="mb-8 sm:mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
          Upload your resume and get hired
        </h1>
      </motion.div>

      {/* Upload */}
      <label className="block text-sm sm:text-base text-zinc-500">Upload here (PDF or DOCX format only)</label>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
        <FileUpload onChange={handlefileUpload} accept=".pdf,.docx" maxFiles={1} />
      </motion.div>

      {selectedFile && (
        <p className="text-sm text-gray-600 mt-2">
          Selected file: <span className="font-medium">{selectedFile.name}</span>
        </p>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center items-center gap-2 mt-5 text-blue-600 font-medium">
          <Loader2Icon className="animate-spin w-5 h-5" />
          Processing your resume...
        </div>
      )}

      {/* Skills */}
      {!isLoading && skills.length > 0 && (
        <motion.div className="my-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold mb-2">Your Skills:</h3>
            <button onClick={handleClear} className="font-semibold cursor-pointer text-red-500 hover:underline">
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Matched Jobs */}
      {!isLoading && matchedJobs.length > 0 && (
        <motion.div className="mt-8 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h3 className="text-lg font-semibold mb-3">Matched Jobs ({matchedJobs.length})</h3>
          <div className="space-y-3">
            {matchedJobs.map((match, index) => (
              <motion.div
                key={index}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="space-y-2 w-full">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">{match.jobTitle}</h4>
                    <span className="text-blue-600 font-medium">{match.similarity?.toFixed(2)}% Match</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {match.company || "Unknown Company"} • {match.location || ""}
                  </p>

                  <p>{match.missingSkills}</p>
             

                  <div className="flex flex-wrap gap-2 mt-3">
                    {Array.isArray(match.matchedSkills) && match.matchedSkills.length > 0 ? (
                      match.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-xs">No skill breakdown available</span>
                    )}
                  </div>

                  <a href={match.apply_link} target="_blank" className="text-blue-500 flex items-center mt-2">
                    Apply <Link className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
