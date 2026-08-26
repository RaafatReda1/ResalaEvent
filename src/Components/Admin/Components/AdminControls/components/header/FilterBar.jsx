import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import styles from "../../AdminControls.module.css";

const FilterBar = ({
  search = "",
  onSearchChange,
  status = "all",
  onStatusChange,
  university = "all",
  onUniversityChange,
  uniqueUniversities = [],
  place = "all",
  onPlaceChange,
  uniquePlaces = [],
  academicYear = "all",
  onAcademicYearChange,
  uniqueAcademicYears = [],
  dayFilter = "all",
  onDayFilterChange,
  uniqueRegistrationDays = [],
  certFilter = "all",
  onCertFilterChange,
  hasActiveFilters = false,
  onResetFilters,
}) => {
  return (
    <div className={styles.filterBarCard}>
      {/* Top Row: Search & Main Dropdowns */}
      <div className={styles.filterTopRow}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="ابحث بالاسم، الإيميل، الهاتف، أو الكلية..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <select
          className={styles.filterSelect}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">كل الحالات</option>
          <option value="pending">⏳ في انتظار المراجعة</option>
          <option value="approved">✅ المقبولين فقط</option>
          <option value="rejected">❌ المرفوضين فقط</option>
        </select>

        {/* University Dropdown */}
        <select
          className={styles.filterSelect}
          value={university}
          onChange={(e) => onUniversityChange(e.target.value)}
        >
          <option value="all">جميع الجامعات</option>
          {uniqueUniversities.map((uni) => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>

        {/* Place Dropdown */}
        <select
          className={styles.filterSelect}
          value={place}
          onChange={(e) => onPlaceChange(e.target.value)}
        >
          <option value="all">جميع نقاط التجمع</option>
          {uniquePlaces.map((pl) => (
            <option key={pl} value={pl}>
              {pl}
            </option>
          ))}
        </select>
      </div>

      {/* Sub Row: Academic Year, Date Filter, Certificate Presence, Reset Button */}
      <div className={styles.filterSubRow}>
        <div className={styles.filterLabelWrap}>
          <Filter size={14} />
          <span>تصفية إضافية:</span>
        </div>

        {/* Academic Year */}
        <select
          className={styles.filterSelect}
          value={academicYear}
          onChange={(e) => onAcademicYearChange(e.target.value)}
        >
          <option value="all">كل الفرق الدراسية</option>
          {uniqueAcademicYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>

        {/* Day / Date Filter (Dynamic from first registration to latest + today) */}
        <select
          className={styles.filterSelect}
          value={dayFilter}
          onChange={(e) => onDayFilterChange(e.target.value)}
        >
          <option value="all">كل التواريخ والأيام</option>
          <option value="today">📅 اليوم</option>
          <option value="yesterday">📅 أمس</option>
          {uniqueRegistrationDays.map((d) => (
            <option key={d.date} value={d.date}>
              {d.label}
            </option>
          ))}
        </select>

        {/* Custom Date Input */}
        <input
          type="date"
          className={styles.dateInput}
          title="اختيار تاريخ مخصص من التقويم"
          value={
            dayFilter !== "all" &&
            dayFilter !== "today" &&
            dayFilter !== "yesterday"
              ? dayFilter
              : ""
          }
          onChange={(e) => onDayFilterChange(e.target.value || "all")}
        />

        {/* Certificate Filter */}
        <select
          className={styles.filterSelect}
          value={certFilter}
          onChange={(e) => onCertFilterChange(e.target.value)}
        >
          <option value="all">شهادة الإثبات: الكل</option>
          <option value="has_cert">📜 مرفق شهادة/كارنيه</option>
          <option value="no_cert">⚠️ بدون شهادة</option>
        </select>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearFilterBtn}
            onClick={onResetFilters}
          >
            <RotateCcw size={12} />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
