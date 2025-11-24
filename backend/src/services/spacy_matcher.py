import json, sys, re
from sentence_transformers import SentenceTransformer, util

sys.stdout.reconfigure(encoding="utf-8")

resume_text = sys.argv[1].lower()

with open("skills.json", "r", encoding="utf-8") as f:
    jobs = json.load(f)

keywords = set()
for job in jobs:
    for req in job.get("requirements", []):
        cleaned = re.sub(r"[^a-zA-Z0-9+\-#.\s]", "", req.lower())
        if cleaned.strip():
            keywords.add(cleaned.strip())
keywords = list(keywords)


resume_skills = [kw for kw in keywords if kw in resume_text]


model = SentenceTransformer("all-MiniLM-L6-v2")
resume_emb = model.encode(resume_text, convert_to_tensor=True)

results = []
for job in jobs:
    job_text = " ".join([
        job.get("title", ""),
        job.get("description", ""),
        " ".join(job.get("requirements", []))
    ]).lower()

    job_emb = model.encode(job_text, convert_to_tensor=True)
    sim = util.cos_sim(resume_emb, job_emb).item() * 100
    sim = max(0, min(sim, 100)) 


    job_skills = [kw for kw in keywords if kw in job_text]
    matched_skills = list(set(resume_skills) & set(job_skills))
    missing_skills = list(set(job_skills) - set(matched_skills))

    results.append({
        "jobTitle": job.get("title"),
        "company": job.get("company"),
        "location": job.get("location"),
        "salary": job.get("salary"),
        "similarity": round(sim, 2),
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "apply_link": job.get("apply_link"),
    })

results = sorted(results, key=lambda x: x["similarity"], reverse=True)
print(json.dumps({"matchedJobs": results[:10]}, ensure_ascii=False))
