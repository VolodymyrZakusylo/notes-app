import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Note } from "../types/note";

interface NoteDetailsDialogProps {
  note: Note;
  onClose: () => void;
}

function NoteDetailsDialog({ note, onClose }: NoteDetailsDialogProps) {
  const { t, i18n } = useTranslation();

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(
      i18n.resolvedLanguage?.startsWith("uk") ? "uk-UA" : "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    ).format(new Date(date));

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-details-title"
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-600">
              {t("note.detailsTitle")}
            </span>
            <h2
              id="note-details-title"
              className="mt-1 break-words text-xl font-bold tracking-tight text-gray-900"
            >
              {note.title}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              {note.updatedAt
                ? t("note.updated", { date: formatDate(note.updatedAt) })
                : t("note.created", { date: formatDate(note.createdAt) })}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("note.close")}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
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

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-600 [overflow-wrap:anywhere]">
            {note.content}
          </p>
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            {t("note.close")}
          </button>
        </div>
      </section>
    </div>
  );
}

export default NoteDetailsDialog;
