import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onChangePage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onChangePage,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onChangePage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalItems / pageSize)) {
      onChangePage(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        className={`rounded-md px-2 py-1`}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <BiChevronLeft />
      </button>
      {/* Display current page and total pages */}
      {totalItems && (
        <div className="flex items-center gap-2">
          {[...Array<number>(Math.ceil(totalItems / pageSize))].map(
            (_, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-md px-2 text-center ${
                  currentPage === index + 1
                    ? "bg-gray-300 text-gray-600"
                    : "text-gray-600"
                }`}
                onClick={() => void onChangePage(index + 1)}
              >
                {index + 1}
              </div>
            )
          )}
        </div>
      )}
      <button
        className={`rounded-md px-2 py-1`}
        onClick={handleNextPage}
        disabled={
          !totalItems || currentPage >= Math.ceil(totalItems / pageSize)
        }
      >
        <BiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
