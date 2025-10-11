import sys , json;
from pdfminer.high_level import extract_text;
from docx import Document;
from skillNer.skill_extractor_class import SkillExtractor;
from rapidfuzz import fuzz;


def extract_text_from_file(file_path):
    if file_path.endswith(".pdf"):
        return extract_text(file_path)
    elif file_path.endswith(".docx"):
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    else:
        return ""

file_path = sys.argv[1]
resume_text = extract_text_from_file(file_path)

skill_extractor = SkillExtractor()
annotations = skill_extractor.annotate(resume_text)

skills = list(set([
    s['doc_node_value']
    for s in annotations['results']['full_matches']
]))

print(json.dumps(skills))