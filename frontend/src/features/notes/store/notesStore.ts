import { create } from 'zustand'
import { notesApi } from '../services/notesApi'
import type { Note, SaveNoteRequest } from '../types/note'

interface NotesState {
  notes: Note[]
  isLoading: boolean
  error: string | null

  fetchNotes: () => Promise<void>
  createNote: (request: SaveNoteRequest) => Promise<Note>
  updateNote: (id: string, request: SaveNoteRequest) => Promise<Note>
  deleteNote: (id: string) => Promise<void>
  clearError: () => void
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null })

    try {
      const notes = await notesApi.getAll()
      set({ notes })
    } catch {
      set({ error: 'Failed to load notes.' })
    } finally {
      set({ isLoading: false })
    }
  },

  createNote: async (request) => {
    set({ error: null })

    try {
      const note = await notesApi.create(request)

      set((state) => ({
        notes: [note, ...state.notes],
      }))

      return note
    } catch (error) {
      set({ error: 'Failed to create note.' })
      throw error
    }
  },

  updateNote: async (id, request) => {
    set({ error: null })

    try {
      const updatedNote = await notesApi.update(id, request)

      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? updatedNote : note,
        ),
      }))

      return updatedNote
    } catch (error) {
      set({ error: 'Failed to update note.' })
      throw error
    }
  },

  deleteNote: async (id) => {
    set({ error: null })

    try {
      await notesApi.delete(id)

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }))
    } catch (error) {
      set({ error: 'Failed to delete note.' })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))