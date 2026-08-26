import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import styles from "../AdminControls.module.css";

const Pagination = ({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalCount === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className={styles.paginationBar}>
      <div className={styles.paginationInfo}>
        عرض <strong>{start}</strong> إلى <strong>{end}</strong> من إجمالي{" "}
        <strong>{totalCount}</strong> طالب
      </div>

      <div className="flex items-center gap-4">
        {/* Page Size selector */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>العدد في الصفحة:</span>
          <select
            className={styles.filterSelect}
            style={{ padding: "4px 8px", fontSize: "0.8rem" }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Page navigation */}
        <div className={styles.pageButtons}>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            title="الصفحة السابقة"
          >
            <ChevronRight size={16} />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
            let pageNum = idx + 1;
            if (totalPages > 5 && page > 3) {
              pageNum = page - 2 + idx;
              if (pageNum > totalPages) pageNum = totalPages - (4 - idx);
            }
            if (pageNum <= 0) return null;

            return (
              <button
                key={pageNum}
                type="button"
                className={`${styles.pageBtn} ${
                  page === pageNum ? styles.activePage : ""
                }`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            title="الصفحة التالية"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
