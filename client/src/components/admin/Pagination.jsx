import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
    if (totalPages <= 1) return null;

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex   = Math.min(currentPage * itemsPerPage, totalItems);

    const getPages = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
            <span className="text-sm text-slate-600">
                Menampilkan {startIndex}–{endIndex} dari {totalItems}
            </span>
            <div className="flex items-center gap-1">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {getPages().map((p, i) => (
                    <button key={i} onClick={() => typeof p === 'number' && onPageChange(p)} disabled={typeof p !== 'number'}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                            p === currentPage
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : typeof p === 'number'
                                    ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                    : 'border-transparent text-slate-400 cursor-default'
                        }`}>
                        {p}
                    </button>
                ))}
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
export default Pagination;
