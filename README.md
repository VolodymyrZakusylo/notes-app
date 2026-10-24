# Notes App

A notes application for creating, editing, deleting, searching, and viewing notes, with support for English and Ukrainian.

## Tech Stack

- **Backend**: .NET 8 (ASP.NET Core Web API), Entity Framework Core
- **Database**: PostgreSQL 16 (Docker Compose)
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4
- **State Management**: Zustand
- **Localization**: i18next, react-i18next
- **E2E Testing**: Playwright (Chromium)

## Project Structure

```
notes-app/
├── backend/
│   ├── Notes.slnx
│   └── Notes.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── Dtos/
│       ├── Migrations/
│       ├── Program.cs
│       └── appsettings.Development.json
├── frontend/
│   ├── src/
│   │   ├── features/notes/
│   │   ├── i18n/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── e2e/
│   ├── tests/
│   │   └── notes.spec.ts
│   ├── package.json
│   └── playwright.config.ts
├── docker-compose.yml
└── README.md
```

## Prerequisites

- .NET 8 SDK
- Node.js (with npm)
- Docker and Docker Compose

PostgreSQL runs in a Docker container and does not need to be installed locally.

## Getting Started

### 1. Start the Database

Run from the repository root:

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container (`notes-db`) on host port `5433` (mapped to container port `5432`) with database `notes_db`, user `notes_user`, and password `notes_password`.

### 2. Apply Migrations and Run the Backend API

From the repository root, restore the local .NET tool manifest (which provides `dotnet-ef` from `.config/dotnet-tools.json`), navigate to the API project, apply EF Core migrations, and start the API:

```bash
dotnet tool restore
cd backend/Notes.Api
dotnet ef database update
dotnet run
```

- **API URL**: `http://localhost:5031`
- **Swagger UI**: `http://localhost:5031/swagger`
- **Health check**: `http://localhost:5031/` (returns `{"message":"Notes API is running"}`)

### 3. Configure and Start the Frontend

Create `frontend/.env.development` from the provided example template:

```bash
# On Windows PowerShell:
Copy-Item frontend/.env.example frontend/.env.development

# On bash:
cp frontend/.env.example frontend/.env.development
```

The file contains:

```env
VITE_API_URL=http://localhost:5031
```

The `.env.development` file contains local configuration and is ignored by git (`.env*`). Do not commit it.

From a new terminal, install dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

- **Frontend URL**: `http://localhost:5173`

The backend CORS policy is configured to allow requests from `http://localhost:5173` and `http://127.0.0.1:5173`.

## API Endpoints

All notes endpoints are mapped under the `/notes` route.

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/notes` | Get all notes ordered by creation date descending | `200 OK` |
| `GET` | `/notes/{id}` | Get a note by ID | `200 OK`, `404 Not Found` |
| `POST` | `/notes` | Create a new note | `201 Created`, `400 Bad Request` |
| `PUT` | `/notes/{id}` | Update an existing note | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/notes/{id}` | Delete a note by ID | `204 No Content`, `404 Not Found` |

### Request Example (`POST /notes`, `PUT /notes/{id}`)

```json
{
  "title": "Meeting notes",
  "content": "Discuss sprint goals and project timeline."
}
```

Validation rules:
- `title`: required, 1 to 100 characters.
- `content`: required, 1 to 5000 characters.
- Values are trimmed on the server; whitespace-only strings return `400 Bad Request`.

### Response Example

```json
{
  "id": "e0b3c66f-236b-4f9e-a89a-ec2bfadcf95b",
  "title": "Meeting notes",
  "content": "Discuss sprint goals and project timeline.",
  "createdAt": "2026-10-24T18:00:00Z",
  "updatedAt": null
}
```

## Running the E2E Test

The E2E test suite uses Playwright to verify creating, editing, and deleting a note through the UI.

### Prerequisites

PostgreSQL and the backend API must be running before starting the test. Playwright automatically starts the frontend Vite server if it is not already running.

1. Start PostgreSQL: `docker compose up -d`
2. Start the API: `cd backend/Notes.Api && dotnet run`

### Install Dependencies and Run

From the `e2e` directory:

```bash
cd e2e
npm install
npx playwright install chromium
npm test
```

What the test verifies (`e2e/tests/notes.spec.ts`):
1. Opens the application at `http://localhost:5173`.
2. Creates a new note with a title and content.
3. Asserts the note appears in the list.
4. Edits the note title and saves changes.
5. Asserts the updated note is displayed.
6. Opens the delete confirmation dialog, confirms deletion, and asserts the note is removed.

## Troubleshooting

- **Port 5433 already in use**: Stop the process using port 5433, or change the host port mapping in `docker-compose.yml` and update `ConnectionStrings:NotesDb` in `backend/Notes.Api/appsettings.Development.json`.
- **`dotnet ef` command not found**: Run `dotnet tool restore` in the repository root to restore the pinned local tool, or install it globally with `dotnet tool install --global dotnet-ef`.
- **API connection or CORS error**: Ensure the API is running at `http://localhost:5031` and `frontend/.env.development` contains `VITE_API_URL=http://localhost:5031`. The API CORS policy allows requests from `http://localhost:5173` and `http://127.0.0.1:5173`.
- **Playwright browser missing**: Run `npx playwright install chromium` inside the `e2e` directory.
