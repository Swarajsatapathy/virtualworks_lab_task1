# Quick Note Application

A simple, lightweight single-page application (SPA) for capturing and managing notes. The project features a clean, classic notepad aesthetic with an intuitive user interface.

## Features

- **Create Notes:** Instantly save your thoughts.
- **View Notes:** All saved notes are displayed sequentially.
- **Inline Editing:** Edit existing notes directly within the page using a seamless textarea interface.
- **Delete Notes:** Remove notes you no longer need.
- **Persistent Storage:** Notes are safely stored in a local SQLite database.
- **Legacy Aesthetic:** A clean, minimal, white-themed interface modeled after classic physical notepads.

## Technology Stack

- **Backend:** Python 3, Flask framework.
- **Database:** SQLite (built-in Python module `sqlite3`).
- **Frontend:** Vanilla HTML, CSS, and JavaScript.
- **Communication:** Fetch API for asynchronous HTTP requests.

## Project Structure

```
task_1/
├── app.py                 # The main Flask application and API routes
├── requirements.txt       # Python dependencies
├── notes.db               # SQLite database file (auto-generated on first run)
├── static/
│   ├── app.js             # Client-side JavaScript logic (CRUD operations)
│   └── style.css          # Styling for the application (legacy UI)
└── templates/
    └── index.html         # Main HTML layout
```

## Setup and Installation

1. **Clone or Download the Repository:** Ensure you have the `task_1` directory on your local machine.
2. **Ensure Python is Installed:** This application requires Python 3 to run.
3. **Install Dependencies:** Open your terminal, navigate to the `task_1` directory, and run:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. From within the `task_1` directory, start the Flask development server:
   ```bash
   python app.py
   ```
2. The server will launch and create the `notes.db` file automatically if it doesn't exist.
3. Open your web browser and navigate to: [http://127.0.0.1:5000](http://127.0.0.1:5000)

## API Endpoints

- `GET /api/notes` - Retrieve a list of all notes.
- `POST /api/notes` - Create a new note. Expects JSON: `{"content": "..."}`
- `PUT /api/notes/<id>` - Update an existing note. Expects JSON: `{"content": "..."}`
- `DELETE /api/notes/<id>` - Delete a specific note.
