
import { FaEdit, FaTrash } from "react-icons/fa";

export default function BookCard({
  book,
  deleteBook,
  setEditingBook,
  isDeleting,
}) {
  return (
    <div className="rounded-2xl border border-amber-900/70 bg-[#3b2418] p-5 text-amber-50 shadow-lg shadow-black/15 transition hover:scale-[1.01] hover:border-amber-500">
      <h2 className="text-2xl font-bold text-amber-300">{book.title}</h2>
      <p className="mt-2 text-amber-100/90">Author: {book.author}</p>
      <p className="text-amber-100/90">Genre: {book.genre}</p>
      <p className="text-amber-100/90">Year: {book.year}</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setEditingBook(book)}
          disabled={isDeleting}
          className="rounded bg-amber-300 p-3 text-[#2d1b12] hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FaEdit />
        </button>

        <button
          onClick={() => deleteBook(book.id)}
          disabled={isDeleting}
          className="rounded bg-amber-700 p-3 text-amber-50 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isDeleting ? "..." : <FaTrash />}
        </button>
      </div>
    </div>
  );
}
