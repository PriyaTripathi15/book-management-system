
import { useEffect, useState } from "react";

const EMPTY_FORM = {
  title: "",
  author: "",
  genre: "",
  year: "",
};

export default function BookForm({
  addBook,
  editingBook,
  updateBook,
  onCancelEdit,
  isSaving,
}) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
  });

  useEffect(() => {
    if (editingBook) {
      setForm(editingBook);
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingBook]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      year: String(form.year).trim(),
    };

    if (editingBook) {
      updateBook(payload);
    } else {
      addBook(payload);
    }

    if (!editingBook) {
      setForm(EMPTY_FORM);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-amber-900/60 bg-[#3b2418] p-6 shadow-lg shadow-black/10 md:grid-cols-4"
    >
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="rounded bg-[#5b3826] p-3 text-amber-50 outline-none placeholder:text-amber-200/55"
        maxLength={100}
        disabled={isSaving}
        required
      />

      <input
        type="text"
        placeholder="Author"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
        className="rounded bg-[#5b3826] p-3 text-amber-50 outline-none placeholder:text-amber-200/55"
        maxLength={80}
        disabled={isSaving}
        required
      />

      <input
        type="text"
        placeholder="Genre"
        value={form.genre}
        onChange={(e) => setForm({ ...form, genre: e.target.value })}
        className="rounded bg-[#5b3826] p-3 text-amber-50 outline-none placeholder:text-amber-200/55"
        maxLength={40}
        disabled={isSaving}
        required
      />

      <input
        type="number"
        placeholder="Year"
        value={form.year}
        onChange={(e) => setForm({ ...form, year: e.target.value })}
        className="rounded bg-[#5b3826] p-3 text-amber-50 outline-none placeholder:text-amber-200/55"
        min="1000"
        max="2100"
        disabled={isSaving}
        required
      />

      <div className="col-span-full flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 rounded bg-amber-300 p-3 font-semibold text-[#2d1b12] transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : editingBook ? "Update Book" : "Add Book"}
        </button>

        {editingBook ? (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSaving}
            className="rounded border border-amber-700 px-5 py-3 font-semibold text-amber-100 hover:bg-amber-900/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
