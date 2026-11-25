import { useCallback, useEffect, useState } from "react";
import { notesApi } from "./api";
import { NoteForm } from "./components/NoteForm";
import { NoteList } from "./components/NoteList";
import type { Note, NoteInput } from "./types";
import { getErrorMessage } from "./utils";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editing, setEditing] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setNotes(await notesApi.list());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  async function saveNote(input: NoteInput) {
    setSaving(true);
    setError("");
    try {
      if (editing) {
        const updated = await notesApi.update(editing.id, input);
        setNotes((current) =>
          current.map((note) => (note.id === updated.id ? updated : note)),
        );
        setEditing(null);
      } else {
        const created = await notesApi.create(input);
        setNotes((current) => [created, ...current]);
      }
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote(id: string) {
    setError("");
    try {
      await notesApi.remove(id);
      setNotes((current) => current.filter((note) => note.id !== id));
      if (editing?.id === id) {
        setEditing(null);
      }
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  return (
    <main className="app-shell">
      <header>
        <h1>Notes</h1>
        <p>A small full-stack app for practicing CI/CD.</p>
      </header>

      <section className="editor">
        <h2>{editing ? "Edit note" : "New note"}</h2>
        <NoteForm
          key={editing?.id ?? "new"}
          note={editing}
          saving={saving}
          onSave={saveNote}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </section>

      {error ? (
        <p className="error banner" role="alert">
          {error}
        </p>
      ) : null}

      <section className="notes">
        <h2>Your notes</h2>
        {loading ? <p>Loading notes...</p> : null}
        {!loading ? (
          <NoteList notes={notes} onEdit={setEditing} onDelete={deleteNote} />
        ) : null}
      </section>
    </main>
  );
}
