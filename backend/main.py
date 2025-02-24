from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import logging
import os
import difflib
import re

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set.")

client = OpenAI(api_key=api_key)

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    codeA: str
    codeB: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}

@app.post("/analyze")
def analyze_code(request: CodeRequest):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Analyze the given code for errors and improvements."},
            {"role": "user", "content": request.code},
        ],
    )
    return {"suggestions": response.choices[0].message.content}

@app.post("/lint")
def lint_code(request: CodeRequest):
    with open("temp.py", "w") as f:
        f.write(request.code)

    result = subprocess.run(["pylint", "temp.py"], capture_output=True, text=True)
    return {"linting_results": result.stdout}

@app.post("/autodoc")
def auto_comment(request: CodeRequest):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Generate comments for this code."},
            {"role": "user", "content": request.code},
        ],
    )
    return {"comments": response.choices[0].message.content}

@app.post("/optimize")
def optimize_code(request: CodeRequest):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Optimize and refactor the given code for better performance and readability."},
            {"role": "user", "content": request.code},
        ],
    )
    return {"optimized_code": response.choices[0].message.content}

@app.post("/security-scan")
def security_scan(request: CodeRequest):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Scan the given code for potential security vulnerabilities like SQL injection, XSS, or buffer overflows."},
            {"role": "user", "content": request.code},
        ],
    )
    vulnerabilities = response.choices[0].message.content
    return {"security_vulnerabilities": vulnerabilities}

@app.post("/similarity-check")
def similarity_check(request: CodeRequest):
    print(request)  # Check that both codeA and codeB are being sent
    codeA = request.codeA
    codeB = request.codeB

    # Function to normalize code by removing function names and string literals for better comparison
    def normalize_code(code):
        # Remove function names and variable names
        code = re.sub(r'\bdef\s+\w+\s*\(.*\):', 'def function_name_placeholder():', code)
        # Remove string literals
        code = re.sub(r"'[^']*'", "'string_placeholder'", code)
        return code
    
    # Normalize both code snippets
    normalized_codeA = normalize_code(codeA)
    normalized_codeB = normalize_code(codeB)
    
    def check_similarity(code1, code2):
        try:
            # Use difflib to compare the normalized code based on lines
            sequence_matcher = difflib.SequenceMatcher(None, code1.splitlines(), code2.splitlines())
            similarity_score = sequence_matcher.ratio()

            # Create a detailed comparison of matching lines
            matching_blocks = sequence_matcher.get_matching_blocks()
            detailed_comparison = "\n".join([f"Matching block: {code1.splitlines()[start]} <-> {code2.splitlines()[start]}"
                                            for start, _, length in matching_blocks if length > 0])
            
            return similarity_score, detailed_comparison
        except Exception as e:
            return 0.0, str(e)

    # Get similarity score and detailed comparison
    similarity_score, detailed_comparison = check_similarity(normalized_codeA, normalized_codeB)

    return JSONResponse(content={
        "similarity_score": f"{similarity_score * 100:.2f}%",
        "detailed_comparison": detailed_comparison
    })