import { useEffect, useState, type FormEvent } from "react";
import type { Note, NoteInput } from "../types";

interface NoteFormProps {
  note?: Note | null;
  saving?: boolean;
  onSave: (input: NoteInput) => void;
  onCancel?: () => void;
}

export function NoteForm({
  note,
  saving = false,
  onSave,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
    setError("");
  }, [note]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setError("");
    onSave({ title: title.trim(), content: content.trim() });
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          value={title}
          maxLength={120}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note title"
        />
      </div>

      <div className="field">
        <label htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          value={content}
          maxLength={10000}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your note"
          rows={5}
        />
      </div>

      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save note"}
        </button>
        {onCancel ? (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
