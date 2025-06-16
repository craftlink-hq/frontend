"use client"

import { IoChevronBack, IoChevronForward } from "react-icons/io5"

interface PaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  itemType: string
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
}

const MarketplacePagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  itemType,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) => {
  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }

    return pages
  }

  return (
    <div className="flex justify-between items-center mt-6 text-[#F9F1E2]">
      {/* Items per page info */}
      <div className="flex items-center gap-2 text-[#B5B4AD] text-sm">
        <span>Showing per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-[#1A1A1A] border border-[#444444] rounded px-2 py-1 text-[#F9F1E2] text-sm"
        >
          <option value={4}>4 {itemType}</option>
          <option value={8}>8 {itemType}</option>
          <option value={12}>12 {itemType}</option>
          <option value={20}>20 {itemType}</option>
        </select>
        <span>of {totalItems.toLocaleString()}</span>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center bg-[#444444] text-[#F9F1E2] rounded hover:bg-[#555555] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <IoChevronBack className="h-4 w-4" />
        </button>

        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm transition-colors ${
              page === currentPage ? "bg-yellow text-[#1A1203]" : "bg-[#444444] text-[#F9F1E2] hover:bg-[#555555]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center bg-[#444444] text-[#F9F1E2] rounded hover:bg-[#555555] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <IoChevronForward className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default MarketplacePagination
