# AI BugFlow — AI-Powered Bug Tracking & Software Defect Prediction

A portfolio-ready MVP with:
- Spring Boot REST API (Java 21)
- H2 file database (no separate database installation needed)
- React + Vite dashboard
- Python FastAPI + scikit-learn severity prediction service
- Docker Compose support

## Requirements
- Java 21+
- Node.js 20+
- Python 3.10+
- Git (optional)
- Docker Desktop (optional)

## Run locally (three terminals)

### 1. Start the ML prediction service
```bash
cd ml-service
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Windows CMD:
.venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```
Check `http://localhost:8001/health`.

### 2. Start the Java backend
Open a second terminal:
```bash
cd backend
mvn spring-boot:run
```
Install Maven 3.9+ if the `mvn` command is not recognized.
API: `http://localhost:8080/api/bugs`
H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/bugflowdb`, username `sa`, blank password).

### 3. Start the React frontend
Open a third terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite, usually `http://localhost:5173`.

## Use it
- Add a bug with title, description, component, and environment.
- Click **Predict severity** to request an ML prediction.
- Save the bug and update its status from the table.
- Filter by status and search the list.
- Dashboard cards show totals and open/resolved counts.

## API endpoints
- `GET /api/bugs` — list bugs; optional `?status=OPEN`
- `GET /api/bugs/{id}` — one bug
- `POST /api/bugs` — create bug
- `PATCH /api/bugs/{id}/status` — update status
- `DELETE /api/bugs/{id}` — delete bug
- `POST /api/predict` — calls ML service; falls back to a transparent heuristic if service is offline
- `GET /api/health` — backend health

## Antigravity workflow
1. Extract the ZIP.
2. Open the extracted `ai-bugflow` folder in Antigravity.
3. Ask the agent to inspect `README.md` and the project structure before making edits.
4. Open three terminals and follow the local run steps above.
5. If Antigravity asks permission to run commands, review them and approve only commands you understand.
6. Commit the project to Git after confirming all three services run.

## Notes for a resume
This is an MVP, not a production security-hardened system. Before calling it production-ready, add authentication/authorization, pagination, audit logs, stronger validation, automated tests, and deployment secrets management. The initial ML model is trained on a small synthetic sample for demonstration; replace it with labelled historical defect data for meaningful real-world predictions.
