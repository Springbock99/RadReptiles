import React, { useState } from 'react';
import styles from "@/styles/Home.module.css";

// Let's assume this is your data array for demonstration purposes
const data = new Array(100).fill(null).map((_, index) => ({
  id: index,
  content: `Item ${index + 1}`,
}));

const itemsPerPage = 6; // Number of items you want per page

export default function PaginatedContent() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  return (
    <div className={styles.paginationContainer}>
      {/* Render the current items */}
      <div className={styles.pageContent}>
        {currentItems.map((item) => (
          <div key={item.id} className={styles.item}>
            {item.content}
          </div>
        ))}
      </div>
      
      {/* Pagination controls */}
      <div className={styles.paginationControls}>
        <button onClick={goToPreviousPage} disabled={currentPage === 0}>
          Previous
        </button>
        <span>Page {currentPage + 1} of {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
}
