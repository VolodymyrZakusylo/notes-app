import { create } from "zustand";
import { notesApi } from "../services/notesApi";
import type { Note, SaveNoteRequest } from "../types/note";

type NotesError = "errors.load" | "errors.generic";

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: NotesError | null;

  fetchNotes: () => Promise<void>;
  createNote: (request: SaveNoteRequest) => Promise<Note>;
  updateNote: (id: string, request: SaveNoteRequest) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });

    try {
      const notes = await notesApi.getAll();
      set({ notes });
    } catch {
      set({ error: "errors.load" });
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async (request) => {
    const note = await notesApi.create(request);

    set((state) => ({
      notes: [note, ...state.notes],
    }));

    return note;
  },

  updateNote: async (id, request) => {
    const updatedNote = await notesApi.update(id, request);

    set((state) => ({
      notes: state.notes.map((note) => (note.id === id ? updatedNote : note)),
    }));

    return updatedNote;
  },

  deleteNote: async (id) => {
    set({ error: null });

    try {
      await notesApi.delete(id);

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    } catch (error) {
      set({ error: "errors.generic" });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
