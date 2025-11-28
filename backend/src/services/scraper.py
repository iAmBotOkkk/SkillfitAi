import os
from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")

local_files = [
    fr"D:\Wamp\www\job{i}.html" for i in range(1, 23)
]

client = MongoClient(mongo_uri)
db = client["ResumeProject"]
collection = db["jobs"]

def extract_job_data(file_path):
    """Parse a job posting HTML file and extract relevant fields."""
    with open(file_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    def safe_text(selector):
        el = soup.select_one(selector)
        return el.get_text(strip=True) if el else None

    job = {
        "title": safe_text("h1, .job-title, .title"),
        "company": safe_text(".company, .job-company, [itemprop='hiringOrganization']"),
        "location": safe_text(".location, [itemprop='jobLocation']"),
        "salary": safe_text(".salary, [itemprop='baseSalary']"),
        "posted": safe_text(".posted-date, .date, time"),
        "description": safe_text(".job-description, #job-desc, article, .desc"),
        "requirements": [
            li.get_text(strip=True)
            for li in soup.select(".requirements li, .qualifications li, ul li")
        ][:10],
        "apply_link": (
            (soup.select_one("a[href*='apply'], a.apply-btn") or {}).get("href", None)
        ),
    }
    return job


def insert_jobs():
    inserted_count = 0
    for file_path in local_files:
        if not os.path.exists(file_path):
            print(f"✗ File not found: {file_path}")
            continue

        job = extract_job_data(file_path)

        # Prevent duplicates by title+company
        if collection.find_one({"title": job["title"], "company": job["company"]}):
            print(f"⚠️ Skipping duplicate: {job['title']} at {job['company']}")
            continue

        collection.insert_one(job)
        inserted_count += 1
        print(f"✓ Inserted: {job['title']} from {file_path}")

    print(f"\n✅ Done! Inserted {inserted_count} new job documents.")


if __name__ == "__main__":
    insert_jobs()
