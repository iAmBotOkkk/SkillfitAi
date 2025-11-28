import sys
import io
import json
import re
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util
from pymongo import MongoClient


sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))

# === Input check ===
if len(sys.argv) < 2:
    print(json.dumps({"error": "No resume text provided"}))
    sys.exit(1)

resume_text = sys.argv[1].lower().strip()
if len(resume_text) < 10:
    print(json.dumps({"error": "Resume text too short"}))
    sys.exit(1)

# === MongoDB Connection ===
try:
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri)
    db = client["ResumeProject"]
    jobs = list(db["jobs"].find({}, {"_id": 0}))
except Exception as e:
    print(json.dumps({"error": f"Failed to load jobs from MongoDB: {str(e)}"}))
    sys.exit(1)

if not jobs:
    print(json.dumps({"error": "No job data found in MongoDB."}))
    sys.exit(1)

# === Extract all possible keywords from job skills/requirements ===
keywords = set()
for job in jobs:
    for req in job.get("skills", []) + job.get("requirements", []):
        cleaned = re.sub(r"[^a-zA-Z0-9+#.\-\s]", "", req.lower())
        if cleaned.strip():
            keywords.add(cleaned.strip())
keywords = list(keywords)

# === Filter resume keywords ===
resume_skills = [kw for kw in keywords if kw in resume_text]

# === Initialize model ===
model = SentenceTransformer("all-MiniLM-L6-v2")

# === Encode resume text + skill embeddings ===
resume_emb_full = model.encode(resume_text, convert_to_tensor=True)
if resume_skills:
    skill_embeddings = model.encode(resume_skills, convert_to_tensor=True)
else:
    skill_embeddings = model.encode([resume_text], convert_to_tensor=True)

results = []

# === Compare resume with each job ===
for job in jobs:
    job_text = " ".join([
        job.get("title", ""),
        job.get("description", ""),
        " ".join(job.get("skills", [])),
        " ".join(job.get("requirements", [])),
    ]).lower()

    # Embed job text
    job_emb = model.encode(job_text, convert_to_tensor=True)

    # --- (A) Semantic similarity between resume and job text ---
    text_sim = util.cos_sim(resume_emb_full, job_emb).item() * 100

    # --- (B) Max similarity between any resume skill and job text ---
    sims = util.cos_sim(skill_embeddings, job_emb).squeeze(1)
    max_sim = float(sims.max().item()) * 100 if sims.numel() > 0 else 0.0

    # --- (C) Combine both measures ---
    combined_sim = (0.7 * text_sim) + (0.3 * max_sim)
    combined_sim = max(0, min(combined_sim, 100))

    # --- Skill overlap analysis ---
    job_skills = [kw for kw in keywords if kw in job_text]
    matched_skills = list(set(resume_skills) & set(job_skills))
    missing_skills = list(set(job_skills) - set(matched_skills))

    results.append({
        "jobTitle": job.get("title"),
        "company": job.get("company"),
        "location": job.get("location"),
        "salary": job.get("salary"),
        "similarity": round(combined_sim, 2),
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "apply_link": job.get("apply_link"),
    })

# === Sort results by similarity and output ===
results = sorted(results, key=lambda x: x["similarity"], reverse=True)
print(json.dumps({"matchedJobs": results[:10]}, ensure_ascii=False))
