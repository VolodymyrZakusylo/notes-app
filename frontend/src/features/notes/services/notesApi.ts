import axios from 'axios'
import type { Note, SaveNoteRequest } from '../types/note'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5031',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const notesApi = {
  async getAll(): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes')
    return response.data
  },

  async getById(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`)
    return response.data
  },

  async create(request: SaveNoteRequest): Promise<Note> {
    const response = await api.post<Note>('/notes', request)
    return response.data
  },

  async update(
    id: string,
    request: SaveNoteRequest,
  ): Promise<Note> {
    const response = await api.put<Note>(`/notes/${id}`, request)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/notes/${id}`)
  },
}