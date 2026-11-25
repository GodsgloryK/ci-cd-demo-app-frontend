import type { Note } from "../types";

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteList({ notes, onEdit, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return <p className="empty">No notes yet. Add your first one above.</p>;
  }

  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li key={note.id}>
          <article className="note-card">
            <div className="note-heading">
              <h2>{note.title}</h2>
              <time dateTime={note.updatedAt}>
                {new Date(note.updatedAt).toLocaleString()}
              </time>
            </div>
            {note.content ? <p>{note.content}</p> : null}
            <div className="note-actions">
              <button type="button" onClick={() => onEdit(note)}>
                Edit
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => onDelete(note.id)}
              >
                Delete
              </button>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
