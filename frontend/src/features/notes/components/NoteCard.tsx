import type { Note } from '../types/note'

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
}

function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))

  return (
    <article className="group flex min-h-56 flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h2 className="line-clamp-2 text-lg font-semibold leading-snug">
          {note.title}
        </h2>

        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-400" />
      </div>

      <p className="mt-3 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-500 [overflow-wrap:anywhere]">
        {note.content}
      </p>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <span className="text-xs text-gray-400">
          {note.updatedAt
            ? `Updated ${formatDate(note.updatedAt)}`
            : `Created ${formatDate(note.createdAt)}`}
        </span>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(note)}
            aria-label={`Edit ${note.title}`}
            className="rounded-lg px-2 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(note)}
            aria-label={`Delete ${note.title}`}
            className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

export default NoteCard
