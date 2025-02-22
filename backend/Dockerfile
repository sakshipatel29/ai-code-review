# Use Python base image
FROM python:3.9

# Set working directory
WORKDIR /app

# Copy project files to container
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Expose port 8000
EXPOSE 8000

# Run FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
