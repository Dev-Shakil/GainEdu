
export default function Pagination({ currentPage, totalPages, goToPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? 'bg-blue-600 text-white' : ''
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
