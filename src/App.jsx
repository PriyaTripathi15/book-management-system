
import { useEffect, useMemo, useState } from "react";
import BookForm from "./components/BookForm";
import BookCard from "./components/BookCard";
import SearchBar from "./components/SearchBar";
import {
  BOOKS_ENDPOINT,
  createBook,
  deleteBookById,
  getBooks,
  getApiErrorMessage,
  updateBookById,
} from "./services/booksApi";

export default function App() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setError("");
      setIsLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "fetch books"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async (book) => {
    try {
      setError("");
      setIsSaving(true);
      const created = await createBook(book);
      setBooks((currentBooks) => [...currentBooks, created]);
    } catch (err) {
      setError(getApiErrorMessage(err, "add book"));
    } finally {
      setIsSaving(false);
    }
  };

  const updateBook = async (book) => {
    try {
      setError("");
      setIsSaving(true);
      const updatedBook = await updateBookById(book.id, book);
      setBooks((currentBooks) =>
        currentBooks.map((currentBook) =>
          currentBook.id === book.id ? updatedBook : currentBook
        )
      );
      setEditingBook(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "update book"));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBook = async (id) => {
    try {
      setError("");
      setDeletingId(id);
      await deleteBookById(id);
      setBooks((currentBooks) =>
        currentBooks.filter((currentBook) => currentBook.id !== id)
      );

      if (editingBook?.id === id) {
        setEditingBook(null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "delete book"));
    } finally {
      setDeletingId(null);
    }
  };

  const genres = useMemo(
    () => ["All", ...new Set(books.map((book) => book.genre).filter(Boolean))],
    [books]
  );

  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const parts = normalizedQuery === "" ? [] : normalizedQuery.split(/\s+/);

    return books.filter((book) => {
      const title = String(book.title || "").toLowerCase();
      const author = String(book.author || "").toLowerCase();

      // If there are search parts, ensure each part appears in either title or author
      const matchesQuery =
        parts.length === 0 ||
        parts.every((p) => title.includes(p) || author.includes(p));

      const matchesGenre = selectedGenre === "All" ? true : book.genre === selectedGenre;

      return matchesQuery && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <div className="min-h-screen bg-transparent p-6 text-amber-50">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-center text-4xl font-bold text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]">
          Book Management System
        </h1>
        <p className="mb-8 text-center text-amber-100/80">
          Manage your collection with CRUD operations, search, and genre filtering.
        </p>

        <BookForm
          addBook={addBook}
          editingBook={editingBook}
          updateBook={updateBook}
          onCancelEdit={handleCancelEdit}
          isSaving={isSaving}
        />

        <SearchBar
          query={searchQuery}
          selectedGenre={selectedGenre}
          genres={genres}
          onQueryChange={setSearchQuery}
          onGenreChange={setSelectedGenre}
        />

        <div className="mt-3 text-center text-sm text-amber-200/70">
          <span className="italic">Filtering:</span>{" "}
          <strong className="text-amber-100">{searchQuery || <em>""</em>}</strong>
          {"  |  "}
          <span className="italic">Genre:</span>{" "}
          <strong className="text-amber-100">{selectedGenre}</strong>
          {"  |  "}
          <span className="italic">Results:</span>{" "}
          <strong className="text-amber-100">{filteredBooks.length}</strong>
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-red-400/60 bg-red-950/45 p-3 text-center text-red-100">
            {error}
          </p>
        )}

        <p className="mt-3 text-center text-xs text-slate-400">
          Active books endpoint: {BOOKS_ENDPOINT}
        </p>

        {isLoading ? (
          <p className="mt-8 text-center text-amber-100">Loading books...</p>
        ) : null}

        {!isLoading && !error && filteredBooks.length === 0 ? (
          <p className="mt-8 rounded-lg border border-amber-900/60 bg-[#3b2418]/85 p-6 text-center text-amber-100/85 shadow-lg shadow-black/10">
            No books found for this search/filter.
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              deleteBook={deleteBook}
              setEditingBook={setEditingBook}
              isDeleting={deletingId === book.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
