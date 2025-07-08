import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center ${canPrev ? 'bg-white hover:bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPrev}
        aria-label="Anterior"
      >
        {/* Flecha izquierda SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <span className="px-4 py-1 text-sm text-gray-700">
        Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
      </span>
      <button
        className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center ${canNext ? 'bg-white hover:bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNext}
        aria-label="Siguiente"
      >
        {/* Flecha derecha SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
} 