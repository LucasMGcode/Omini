import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    windowSize?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    windowSize = 3, // Número de botões de página visíveis
}) => {
    if (totalPages <= 1) return null;

    const half = Math.floor(windowSize / 2);
    let start = Math.max(0, currentPage - half);
    let end = start + windowSize - 1;

    if (end >= totalPages - 1) {
        end = totalPages - 1;
        start = Math.max(0, end - windowSize + 1);
    }

    const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [];

    if (start > 0) {
        pages.push(0);
        if (start > 1) pages.push("ellipsis-left");
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) {
        if (end < totalPages - 2) pages.push("ellipsis-right");
        pages.push(totalPages - 1);
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-4">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
                disabled={currentPage === 0}
                className="px-3 py-1 rounded-md border text-purple-700 border-purple-300 hover:bg-purple-100 disabled:opacity-50 flex items-center gap-1"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
            </button>
            {pages.map((p, idx) =>
                typeof p === "number" ? (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`px-3 py-1 rounded-md border text-sm ${
                            currentPage === p
                                ? "bg-purple-600 text-white"
                                : "text-purple-700 border-purple-300 hover:bg-purple-100"
                        }`}
                    >
                        {p + 1}
                    </button>
                ) : (
                    <MoreHorizontal
                        key={`${p}-${idx}`}
                        className="w-4 h-4 text-purple-400 mx-1 hidden sm:inline"
                    />
                )
            )}
            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 rounded-md border text-purple-700 border-purple-300 hover:bg-purple-100 disabled:opacity-50 flex items-center gap-1"
            >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;
