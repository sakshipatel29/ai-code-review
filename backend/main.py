from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import logging
import os

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

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
