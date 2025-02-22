# ai-code-review

frontend:
npm create vite@latest ai-code-review --template react
cd ai-code-review
npm install
npm install monaco-editor axios


backend:
mkdir backend && cd backend
python -m venv venv 
source venv/bin/activate
pip install fastapi uvicorn openai pydantic python-multipart


fastapi: Backend framework
uvicorn: Runs the FastAPI server
openai: Interacts with GPT-4
pydantic: Data validation
python-multipart: Handles file uploads

