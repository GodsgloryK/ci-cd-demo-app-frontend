import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { notesApi } from "./api";
import type { Note } from "./types";

vi.mock("./api", () => ({
  notesApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const mockedApi = vi.mocked(notesApi);

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: "note-1",
    title: "First note",
    content: "Body",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("notes app", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.list.mockResolvedValue([]);
    mockedApi.create.mockResolvedValue(makeNote());
    mockedApi.update.mockResolvedValue(makeNote({ title: "Changed note" }));
    mockedApi.remove.mockResolvedValue(undefined);
  });

  it("creates a note", async () => {
    render(<App />);

    fireEvent.change(await screen.findByLabelText(/title/i), {
      target: { value: "First note" },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "Body" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save note/i }));

    await waitFor(() =>
      expect(mockedApi.create).toHaveBeenCalledWith({
        title: "First note",
        content: "Body",
      }),
    );
    expect(await screen.findByText("First note")).toBeInTheDocument();
  });

  it("updates a note", async () => {
    mockedApi.list.mockResolvedValue([makeNote()]);
    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: /edit/i }));
    fireEvent.change(await screen.findByLabelText(/title/i), {
      target: { value: "Changed" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save note/i }));

    await waitFor(() =>
      expect(mockedApi.update).toHaveBeenCalledWith("note-1", {
        title: "Changed",
        content: "Body",
      }),
    );
    expect(await screen.findByText("Changed note")).toBeInTheDocument();
  });

  it("deletes a note", async () => {
    mockedApi.list.mockResolvedValue([makeNote()]);
    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: /delete/i }));

    await waitFor(() =>
      expect(mockedApi.remove).toHaveBeenCalledWith("note-1"),
    );
    await waitFor(() =>
      expect(screen.queryByText("First note")).not.toBeInTheDocument(),
    );
  });

  it("requires a title", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /save note/i }));

    expect(await screen.findByText("Title is required.")).toBeInTheDocument();
    expect(mockedApi.create).not.toHaveBeenCalled();
  });
});
