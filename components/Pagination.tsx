import React, { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number | null | undefined;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const maxButtons = 5;

  const showPrevious = currentPage > 1;
  const showNext = currentPage < (totalPages || 0);

  const { startPage, endPage } = useMemo(() => {
    let start = 1;
    let end = totalPages || 0;
    if (totalPages) {
      start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      end = Math.min(totalPages, start + maxButtons - 1);
    }
    return { startPage: start, endPage: end };
  }, [currentPage, maxButtons, totalPages]);

  const btnClass =
    "btn btn-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-opacity-50";

  if (totalPages === null || totalPages === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pagination flex justify-center items-center mt-4">
      {showPrevious && (
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`${btnClass} text-white bg-green-500 hover:bg-green-600`}
        >
          Previous
        </button>
      )}
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
        <button
          key={index}
          className={`${btnClass} ${
            currentPage === startPage + index
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
          onClick={() => setCurrentPage(startPage + index)}
          style={{ margin: "0 0.1rem" }}
        >
          {startPage + index}
        </button>
      ))}
      {showNext && (
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`${btnClass} text-white bg-green-500 hover:bg-green-600`}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
