import { useEffect, useMemo, useState } from "react";
import { useNotesStore } from "./features/notes/store/notesStore";
import NoteForm from "./features/notes/components/NoteForm";
import NoteCard from "./features/notes/components/NoteCard";
import DeleteNoteDialog from "./features/notes/components/DeleteNoteDialog";
import NoteDetailsDialog from "./features/notes/components/NoteDetailsDialog";
import type { Note, SaveNoteRequest } from "./features/notes/types/note";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  function handleLanguageChange(language: "en" | "uk") {
    void i18n.changeLanguage(language);
  }

  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);
  const error = useNotesStore((state) => state.error);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const clearError = useNotesStore((state) => state.clearError);
  const createNote = useNotesStore((state) => state.createNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    );
  }, [notes, search]);

  async function handleSaveNote(request: SaveNoteRequest) {
    if (editingNote) {
      await updateNote(editingNote.id, request);
    } else {
      await createNote(request);
    }

    setIsFormOpen(false);
    setEditingNote(null);
  }

  function handleCreateNote() {
    clearError();
    setEditingNote(null);
    setIsFormOpen(true);
  }

  function handleEditNote(note: Note) {
    clearError();
    setEditingNote(note);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingNote(null);
    clearError();
  }

  async function handleConfirmDelete() {
    if (!deletingNote || isDeleting) {
      return;
    }

    setIsDeleting(true);
    clearError();

    try {
      await deleteNote(deletingNote.id);
      setDeletingNote(null);
    } catch {
      return;
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancelDelete() {
    if (isDeleting) {
      return;
    }

    setDeletingNote(null);
    clearError();
  }

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

          <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="sr-only">
              {t("language.label")}
            </label>

            <select
              id="language-select"
              value={i18n.resolvedLanguage?.startsWith("uk") ? "uk" : "en"}
              onChange={(event) =>
                handleLanguageChange(event.target.value as "en" | "uk")
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option value="en">{t("language.english")}</option>
              <option value="uk">{t("language.ukrainian")}</option>
            </select>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-600">
              {t("home.eyebrow")}
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("home.title")}
            </h1>

            <p className="mt-3 text-gray-500">{t("home.description")}</p>
          </div>

          <button
            type="button"
            onClick={handleCreateNote}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              +
            </span>
            {t("home.newNote")}
          </button>
        </div>

        <div className="mt-8">
          <label htmlFor="note-search" className="sr-only">
            {t("home.searchPlaceholder")}
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
              placeholder={t("home.searchPlaceholder")}
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </div>

        {error && !deletingNote && (
          <div
            role="alert"
            className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{t(error)}</p>
            <button
              type="button"
              onClick={() => {
                clearError();
                void fetchNotes();
              }}
              className="shrink-0 font-semibold underline underline-offset-4"
            >
              {t("home.retry")}
            </button>
          </div>
        )}

        {isLoading ? (
          <div
            role="status"
            className="py-24 text-center text-sm text-gray-500"
          >
            {t("home.loading")}
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onView={(noteToView) => setViewingNote(noteToView)}
                onEdit={handleEditNote}
                onDelete={(noteToDelete) => {
                  clearError();
                  setDeletingNote(noteToDelete);
                }}
              />
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
              {search.trim()
              ? t("home.noResults")
              : t("home.emptyTitle")}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {search.trim()
                ? t("home.noResultsHint")
                : t("home.emptyDescription")}
            </p>
          </div>
        )}
      </section>

      {isFormOpen && (
        <NoteForm
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={handleCloseForm}
        />
      )}

      {deletingNote && (
        <DeleteNoteDialog
          note={deletingNote}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
          error={error}
        />
      )}

      {viewingNote && (
        <NoteDetailsDialog
          note={viewingNote}
          onClose={() => setViewingNote(null)}
        />
      )}
    </main>
  );
}

export default App;
