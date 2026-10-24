import { useEffect, useMemo, useState } from 'react'
import { useNotesStore } from './features/notes/store/notesStore'

function App() {
  const notes = useNotesStore((state) => state.notes)
  const isLoading = useNotesStore((state) => state.isLoading)
  const error = useNotesStore((state) => state.error)
  const fetchNotes = useNotesStore((state) => state.fetchNotes)
  const clearError = useNotesStore((state) => state.clearError)

  const [search, setSearch] = useState('')

  useEffect(() => {
    void fetchNotes()
  }, [fetchNotes])

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return notes
    }

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    )
  }, [notes, search])

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))

  return (
    <main className="min-h-screen bg-[#f8f7fb] text-[#24212b]">
      <header className="border-b border-gray-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white">
              N
            </span>
            <span className="text-xl font-bold tracking-tight">Notes</span>
          </a>

          <span className="text-sm text-gray-500">
            Your personal space
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-600">
              Your workspace
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              All notes
            </h1>

            <p className="mt-3 text-gray-500">
              Keep your thoughts and ideas in one place.
            </p>
          </div>

          <div className="flex h-11 items-center rounded-xl bg-violet-50 px-4 text-sm font-medium text-violet-700">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="note-search" className="sr-only">
            Search notes
          </label>

          <div className="relative max-w-xl">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              id="note-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your notes..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                clearError()
                void fetchNotes()
              }}
              className="shrink-0 font-semibold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {isLoading ? (
          <div
            role="status"
            className="py-24 text-center text-sm text-gray-500"
          >
            Loading your notes...
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <article
                key={note.id}
                className="group flex min-h-56 flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 text-lg font-semibold leading-snug">
                    {note.title}
                  </h2>

                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-400" />
                </div>

                <p className="mt-3 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-500 [overflow-wrap:anywhere]">
                  {note.content}
                </p>

                <div className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-400">
                  {note.updatedAt
                    ? `Updated ${formatDate(note.updatedAt)}`
                    : `Created ${formatDate(note.createdAt)}`}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-7 w-7"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
              </svg>
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              {search ? 'No matching notes' : 'Your notes will appear here'}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {search
                ? 'Try another search term.'
                : 'There are no notes yet. Once you create one, it will show up here.'}
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App