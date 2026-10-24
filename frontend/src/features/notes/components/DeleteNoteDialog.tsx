import type { Note } from '../types/note'

interface DeleteNoteDialogProps {
  note: Note
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
  error: string | null
}

function DeleteNoteDialog({
  note,
  onConfirm,
  onCancel,
  isDeleting,
  error,
}: DeleteNoteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-sm">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="delete-dialog-title" className="text-lg font-bold">
          Delete this note?
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Are you sure you want to delete "{note.title}"? This action cannot
          be undone.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete note'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default DeleteNoteDialog