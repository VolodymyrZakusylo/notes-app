
import { useState, type FormEvent } from 'react'
import type { Note, SaveNoteRequest } from '../types/note'

interface NoteFormProps {
  note: Note | null
  onSave: (request: SaveNoteRequest) => Promise<void>
  onCancel: () => void
}

function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isEditing = note !== null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const request: SaveNoteRequest = {
      title: title.trim(),
      content: content.trim(),
    }

    if (!request.title || !request.content) {
      setSubmitError('Please fill in both fields.')
      return
    }

    setIsSaving(true)
    setSubmitError(null)

    try {
      await onSave(request)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onCancel()
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-form-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="note-form-title"
              className="text-xl font-bold tracking-tight"
            >
              {isEditing ? 'Edit note' : 'Create a note'}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {isEditing
                ? 'Make changes to your note.'
                : 'Capture a thought before it slips away.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Close form"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="note-title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="note-title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              required
              autoFocus
              placeholder="Give your note a title"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {title.length}/100
            </p>
          </div>

          <div>
            <label
              htmlFor="note-content"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Content
            </label>

            <textarea
              id="note-content"
              name="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={5000}
              required
              rows={6}
              placeholder="Write down your thoughts..."
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {content.length}/5000
            </p>
          </div>

          {submitError && (
            <p role="alert" className="text-sm text-red-600">
              {submitError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? 'Saving...'
                : isEditing
                  ? 'Save changes'
                  : 'Create note'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default NoteForm
