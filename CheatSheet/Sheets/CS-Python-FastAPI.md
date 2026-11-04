# Python & FastAPI Cheatsheet

## Server & Environment
- **Run FastAPI with Uvicorn** (`uvicorn main:app --reload --port 8000`): Starts the ASGI server; `main:app` points to `main.py` and `app` instance, `--reload` enables live-reload on file save.
- **Install FastAPI & Uvicorn** (`pip install fastapi uvicorn`): Installs the FastAPI framework and the high-performance Uvicorn ASGI server.
- **Generate requirements.txt** (`pip freeze > requirements.txt`): Exports all currently installed Python packages and exact versions to requirements.txt.
