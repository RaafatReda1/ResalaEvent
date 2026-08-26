import React from "react";
import { Search, RotateCcw } from "lucide-react";
import styles from "../../AdminReports.module.css";

const ReportsFilterBar = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  categoryFilter,
  onCategoryChange,
  dateFilter,
  onDateChange,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <div className={styles.filterCard}>
      <div className={styles.filterRow}>
        {/* Search */}
        <div className={styles.searchInputWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="بحث بالاسم، البريد، وصف الحدث، أو الطالب المستهدف..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <select
          className={styles.filterSelect}
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="all">👤 جميع الرتب والفاعلين</option>
          <option value="student">🎓 طلاب (Students)</option>
          <option value="admin">🛡️ مشرفين (Admins)</option>
          <option value="sudo_admin">👑 مسؤولي النظام (Sudo Admins)</option>
          <option value="anonymous">👁️ زوار غير معروفين (Anonymous)</option>
        </select>

        {/* Category Filter */}
        <select
          className={styles.filterSelect}
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">📂 جميع فئات الأحداث</option>
          <option value="STUDENT_ACTION">استمارات ونشاطات الطلاب</option>
          <option value="ADMIN_OPERATION">عمليات وإجراءات المشرفين</option>
          <option value="AUTH">تسجيلات الدخول والخروج</option>
          <option value="SETTINGS">إعدادات النظام والواتساب</option>
          <option value="LINK_CLICK">🔗 نقرات الروابط الخارجية (تتبع الزوار)</option>
        </select>

        {/* Date Filter */}
        <select
          className={styles.filterSelect}
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
        >
          <option value="all">📅 كل الفترات</option>
          <option value="today">اليوم</option>
          <option value="yesterday">أمس</option>
          <option value="7days">آخر 7 أيام</option>
          <option value="30days">آخر 30 يوماً</option>
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearFilterBtn}
            onClick={onResetFilters}
            title="إعادة ضبط الفلاتر"
          >
            <RotateCcw size={13} />
            <span>إعادة ضبط</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportsFilterBar;
