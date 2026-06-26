document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note-form');
    const noteContentInput = document.getElementById('note-content');
    const notesList = document.getElementById('notes-list');

    // Fetch and display existing notes on load
    fetchNotes();

    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const content = noteContentInput.value.trim();
        if (!content) return;

        const saveBtn = document.getElementById('save-btn');
        const originalText = saveBtn.innerText;
        saveBtn.innerText = 'Saving...';
        saveBtn.disabled = true;

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                const newNote = await response.json();
                
                // Clear input
                noteContentInput.value = '';
                
                // Refresh notes list
                fetchNotes();
            } else {
                console.error('Failed to save note');
                alert('Failed to save note. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please check your connection.');
        } finally {
            saveBtn.innerText = originalText;
            saveBtn.disabled = false;
        }
    });

    async function fetchNotes() {
        try {
            const response = await fetch('/api/notes');
            if (response.ok) {
                const notes = await response.json();
                renderNotes(notes);
            } else {
                console.error('Failed to fetch notes');
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    function renderNotes(notes) {
        notesList.innerHTML = ''; // Clear existing notes
        
        if (notes.length === 0) {
            notesList.innerHTML = '<p style="color: #64748b; grid-column: 1 / -1; text-align: center;">No notes yet. Create one above!</p>';
            return;
        }

        notes.forEach(note => {
            const date = new Date(note.created_at + 'Z'); // SQLite returns UTC if configured, adjust if needed
            const formattedDate = date.toLocaleString();

            const noteElement = document.createElement('div');
            noteElement.className = 'note-card';
            
            // Basic sanitization by using textContent
            const contentDiv = document.createElement('div');
            contentDiv.className = 'note-content';
            contentDiv.textContent = note.content;

            const dateDiv = document.createElement('div');
            dateDiv.className = 'note-date';
            dateDiv.textContent = formattedDate;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'note-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';

            editBtn.onclick = () => startEdit(note.id, contentDiv, editBtn, deleteBtn);
            deleteBtn.onclick = () => deleteNote(note.id);

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            noteElement.appendChild(contentDiv);
            noteElement.appendChild(dateDiv);
            noteElement.appendChild(actionsDiv);
            
            notesList.appendChild(noteElement);
        });
    }

    async function deleteNote(id) {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchNotes();
            } else {
                alert('Failed to delete note');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting note');
        }
    }

    function startEdit(id, contentDiv, editBtn, deleteBtn) {
        const originalContent = contentDiv.textContent;
        const textarea = document.createElement('textarea');
        textarea.value = originalContent;
        textarea.style.minHeight = '100px';
        textarea.style.width = '100%';
        textarea.style.marginBottom = '1rem';
        textarea.style.fontSize = '1rem';
        textarea.style.padding = '0.5rem';
        
        contentDiv.replaceWith(textarea);
        textarea.focus();

        editBtn.textContent = 'Save';
        deleteBtn.textContent = 'Cancel';

        // Update handlers
        editBtn.onclick = async () => {
            const newContent = textarea.value.trim();
            if (!newContent || newContent === originalContent) {
                cancelEdit();
                return;
            }
            
            editBtn.textContent = 'Saving...';
            editBtn.disabled = true;
            
            try {
                const response = await fetch(`/api/notes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newContent })
                });
                if (response.ok) {
                    fetchNotes();
                } else {
                    alert('Failed to update note');
                    cancelEdit();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating note');
                cancelEdit();
            }
        };

        deleteBtn.onclick = cancelEdit;

        function cancelEdit() {
            textarea.replaceWith(contentDiv);
            editBtn.textContent = 'Edit';
            deleteBtn.textContent = 'Delete';
            editBtn.disabled = false;
            editBtn.onclick = () => startEdit(id, contentDiv, editBtn, deleteBtn);
            deleteBtn.onclick = () => deleteNote(id);
        }
    }
});
