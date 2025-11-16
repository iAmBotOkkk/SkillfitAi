import sys
import json
import os
import warnings
import logging
import re
from pdfminer.high_level import extract_text
from docx import Document
import spacy
from spacy.matcher import PhraseMatcher


warnings.filterwarnings("ignore", category=UserWarning, module="spacy")
logging.getLogger("spacy").setLevel(logging.ERROR)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CUSTOM_SKILL_PATH = os.path.join(BASE_DIR, "custom_skills.json")

print(f"Loading custom skills from: {CUSTOM_SKILL_PATH}")

if not os.path.exists(CUSTOM_SKILL_PATH):
    print(json.dumps({"error": f"custom_skills.json not found at {CUSTOM_SKILL_PATH}"}))
    sys.exit(1)

def normalize_skill(skill):
    """Normalize skill names to match common variations."""
    s = skill.lower().strip()
    s = s.replace(".", "").replace("-", " ")
    s = re.sub(r"\s+", " ", s)
    return s

def extract_text_from_file(file_path: str) -> str:
    """Extract plain text from a PDF or DOCX file."""
    try:
        if file_path.endswith(".pdf"):
            return extract_text(file_path)
        elif file_path.endswith(".docx"):
            doc = Document(file_path)
            return "\n".join([para.text for para in doc.paragraphs])
        else:
            raise ValueError("Unsupported file format.")
    except Exception as e:
        raise RuntimeError(f"Failed to extract text: {e}")

try:
    #  Load skills
    with open(CUSTOM_SKILL_PATH, "r", encoding="utf-8") as f:
        skills_data = json.load(f)

    if not isinstance(skills_data, dict):
        print(json.dumps({"error": "Invalid custom_skills.json format"}))
        sys.exit(1)

    #  Expand skill variants (react/reactjs/react.js)
    expanded_skills = set()
    for skill in skills_data.keys():
        base = normalize_skill(skill)
        expanded_skills.update({
            base,
            base.replace("js", ".js"),
            base.replace(" ", ""),
            base.replace(" ", "."),
            base.replace(".", ""),
            base + "js",
            base.replace(" ", "") + "js"
        })

    expanded_skills = {normalize_skill(s) for s in expanded_skills}
    print(f"Loaded {len(expanded_skills)} expanded skill variants.")

    # Setup spaCy
    nlp = spacy.load("en_core_web_lg", disable=["ner", "parser", "lemmatizer"])
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

    # Add all normalized skill phrases
    patterns = [nlp.make_doc(skill) for skill in expanded_skills if len(skill) > 1]
    matcher.add("SKILLS", patterns)
    print(f"Matcher ready with {len(patterns)} patterns.")

    #  File input
    if len(sys.argv) < 2:
        raise ValueError("No file path provided.")
    file_path = sys.argv[1]

    resume_text = extract_text_from_file(file_path)
    if not resume_text.strip():
        raise ValueError("No text extracted from resume.")
    
    clean_text = resume_text.lower()
    clean_text = clean_text.replace(".", " ").replace("-", " ")
    clean_text = re.sub(r"[^a-z0-9\s+]", " ", clean_text)
    clean_text = re.sub(r"\s+", " ", clean_text)

    doc = nlp(clean_text)
    matches = matcher(doc)

    matched_skills = sorted({normalize_skill(doc[start:end].text) for _, start, end in matches})

    print(json.dumps({"skills": matched_skills}, ensure_ascii=False))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
