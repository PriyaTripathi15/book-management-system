
export default function SearchBar({
  query,
  selectedGenre,
  genres,
  onQueryChange,
  onGenreChange,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-8">
      <input
        type="text"
        placeholder="Search by title or author"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="flex-1 rounded border border-amber-900/60 bg-[#3b2418] p-3 text-amber-50 outline-none placeholder:text-amber-200/55"
      />

      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="rounded border border-amber-900/60 bg-[#3b2418] p-3 text-amber-50 outline-none"
      >
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}
