import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv('.env')
mongo_uri = os.getenv('MONGO_URI')

client = MongoClient(mongo_uri)
db = client['ResumeProject']
collection = db['skills']

jobs = collection.find()
count = collection.count_documents({})

print(f'\n=== Total Jobs in Database: {count} ===\n')

for i, job in enumerate(jobs, 1):
    print(f'{i}. Title: {job.get("title")}')
    print(f'   Company: {job.get("company")}')
    print(f'   Location: {job.get("location")}')
    print(f'   Salary: {job.get("salary")}')
    print(f'   Requirements: {job.get("requirements", [])}')
    print()
