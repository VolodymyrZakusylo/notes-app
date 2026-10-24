import type { Note } from "../types/note";
import { useTranslation } from "react-i18next";

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

function NoteCard({ note, onView, onEdit, onDelete }: NoteCardProps) {
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

  return (
    <article className="group flex min-h-56 flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md">
      <div
        onClick={() => onView(note)}
        className="flex flex-1 cursor-pointer flex-col"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-lg font-semibold leading-snug group-hover:text-violet-900">
            {note.title}
          </h2>

          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-400" />
        </div>

        <p className="mt-3 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-500 [overflow-wrap:anywhere] line-clamp-4">
          {note.content}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <span className="text-xs text-gray-400">
          {note.updatedAt
            ? t("note.updated", { date: formatDate(note.updatedAt) })
            : t("note.created", { date: formatDate(note.createdAt) })}
        </span>

        <div className="flex flex-wrap items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onView(note)}
            aria-label={`${t("note.view")}: ${note.title}`}
            className="rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            {t("note.view")}
          </button>

          <button
            type="button"
            onClick={() => onEdit(note)}
            aria-label={`${t("note.edit")}: ${note.title}`}
            className="rounded-lg px-2 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            {t("note.edit")}
          </button>

          <button
            type="button"
            onClick={() => onDelete(note)}
            aria-label={`${t("note.delete")}: ${note.title}`}
            className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            {t("note.delete")}
          </button>
        </div>
      </div>
    </article>
  );
}

export default NoteCard;
