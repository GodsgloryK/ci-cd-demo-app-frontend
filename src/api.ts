import type { Note, NoteInput } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    if (
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
    ) {
      throw new Error(payload.message);
    }
    throw new Error("Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const notesApi = {
  list: () => request<Note[]>("/notes"),
  create: (input: NoteInput) =>
    request<Note>("/notes", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: NoteInput) =>
    request<Note>(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<void>(`/notes/${id}`, {
      method: "DELETE",
    }),
};
