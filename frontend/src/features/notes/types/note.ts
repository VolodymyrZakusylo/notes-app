export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string | null
}

export interface SaveNoteRequest {
  title: string
  content: string
}