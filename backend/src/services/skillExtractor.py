import sys , json , warnings
from pdfminer.high_level import extract_text
from docx import Document
from skillNer.skill_extractor_class import SkillExtractor
from skillNer.general_params import SKILL_DB
import spacy
from spacy.matcher import PhraseMatcher;


warnings.filterwarnings("ignore", category=UserWarning, module='spacy')


def extract_text_from_file(file_path):
    try:
        if file_path.endswith(".pdf"):
            return extract_text(file_path)
        elif file_path.endswith(".docx"):
            doc = Document(file_path)
            return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        return ""
    return ""
    


try:
    file_path = sys.argv[1]

    nlp = spacy.load("en_core_web_lg")

    skill_extractor = SkillExtractor(nlp, SKILL_DB, PhraseMatcher)

    resume_text = extract_text_from_file(file_path)
    if not resume_text.strip():
        raise ValueError("No text could be extracted from the resume file.")

    annotations = skill_extractor.annotate(resume_text)

    skills = []
    results = annotations.get('results', {})
    full_matches = results.get('full_matches', [])
    if full_matches:
        skills = list(set([s['doc_node_value'] for s in full_matches if s]))

    print(json.dumps({"skills": skills}))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
