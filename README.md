# SkillfitAi: AI-Powered Job Matching System 🤖


SkillfitAi is an open-source, AI-powered system designed to match a user's resume or CV with relevant job listings from a constantly updated database. By extracting key skills from your document, it provides job suggestions along with an **accuracy percentage** to indicate the quality of the match.

## ✨ Features

* **Resume/CV Parsing:** Handles standard formats (`.pdf`, `.docx`).
* **Skill Extraction:** Uses an internal component (referred to as `skillner` in the flowchart) to accurately identify and extract relevant skills.
* **Job Scraping:** Continuously scrapes the web for new job listings to maintain an up-to-date database.
* **Accuracy Calculation:** Provides a quantitative measure of how well a job listing matches your skill set.
* **Intuitive Display:** Presents matched jobs with their corresponding accuracy percentage.

---

## 🚀 How It Works

The system operates based on a two-pronged approach:

1.  **Job Data Ingestion (Right Side of Flow):** A dedicated **Scraper** component continuously scrapes the web for new job postings and stores this data in the **Database**.
2.  **User Matching (Left Side of Flow):**
    * **Start:** A user uploads their resume/CV.
    * The document is converted into a **machine-readable format**.
    * **Skillner** extracts skills from the document.
    * The extracted skills are used to search the **Database** for matching jobs.
    * A component calculates the **accuracy** of the match (e.g., based on the number of overlapping skills).
    * **End:** The matched jobs and their **Accuracy Percentage** are displayed to the user.


---

## 🛠️ Installation

### Prerequisites

* Python (3.8+)
* Database system (e.g., MongoDB)
* Required Python libraries (see `requirements.txt`)

### Steps

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/iAmBotOkkk/SkillfitAi.git](https://github.com/iAmBotOkkk/SkillfitAi.git)
    cd SkillfitAi
    ```

2.  **Create a Virtual Environment (Recommended):**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Database Setup:**
    * Configure your database connection details in a configuration file (e.g., `.env`).
    * Run initial database migrations/schema setup.

---

## 🏃 Usage

### 1. Start the Scraper (Job Data Ingestion)

The scraper needs to run continuously to populate the database with fresh job listings.

```bash
python run_scraper.py