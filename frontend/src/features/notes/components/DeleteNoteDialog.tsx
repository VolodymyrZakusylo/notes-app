import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Note } from "../types/note";

interface DeleteNoteDialogProps {
  note: Note;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  error: string | null;
}

function DeleteNoteDialog({
  note,
  onConfirm,
  onCancel,
  isDeleting,
  error,
}: DeleteNoteDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDeleting, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="delete-dialog-title" className="text-lg font-bold">
          {t("deleteDialog.title")}
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {t("deleteDialog.message", { title: note.title })}
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {t(error)}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {t("note.cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting
              ? t("deleteDialog.deleting")
              : t("deleteDialog.confirm")}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteNoteDialog;
