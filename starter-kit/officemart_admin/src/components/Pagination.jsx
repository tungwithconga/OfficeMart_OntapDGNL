export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="pagination" data-testid="pagination">
      <button
        type="button"
        data-testid="page-prev"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ‹ Trước
      </button>
      <span data-testid="page-current">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        data-testid="page-next"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Sau ›
      </button>
    </div>
  );
}
