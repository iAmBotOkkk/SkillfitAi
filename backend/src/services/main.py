from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import requests
from requests.exceptions import RequestException
from scraper import extract_job_data, scrape_jobs, parse_job_page
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv


load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))

app = FastAPI(title="Job Scraper API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScrapeResponse(BaseModel):
    title: str | None = None
    company: str | None = None
    location: str | None = None
    salary: str | None = None
    posted: str | None = None
    description: str | None = None
    requirements: list[str] = []
    apply_link: str | None = None


HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; JobScraper/1.0; +https://yourdomain.example/)"
}

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(mongo_uri)
db = client["ResumeProject"]
collection = db["jobs"]


@app.get("/")
def home():
    return {"message": "Welcome to Job Scraper API!"}


@app.get("/scrape", response_model=list[ScrapeResponse])
def scrape_local():
    """
    Scrape local/known job sources and automatically insert into MongoDB.
    """
    jobs = scrape_jobs()

    inserted_count = 0
    for job in jobs:
        if not job.get("title"):
            continue
        # Avoid duplicates based on title + company
        existing = collection.find_one({
            "title": job.get("title"),
            "company": job.get("company")
        })
        if not existing:
            collection.insert_one(job)
            inserted_count += 1

    return {"inserted": inserted_count, "total_scraped": len(jobs)}


@app.get("/scrape-job", response_model=ScrapeResponse)
def scrape_job(url: str = Query(..., description="URL of the job posting to scrape")):
    """
    Scrape a single job from URL and insert it into MongoDB if new.
    """
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching URL: {str(e)}")

    parsed = parse_job_page(resp.text, base_url=url)
    parsed.setdefault("requirements", [])


    if not collection.find_one({"title": parsed.get("title"), "company": parsed.get("company")}):
        collection.insert_one(parsed)

    return parsed
