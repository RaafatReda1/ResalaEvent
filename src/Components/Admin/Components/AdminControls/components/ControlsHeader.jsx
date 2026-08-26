import React from "react";
import {
  Users,
  UserPlus,
  Download,
  FileText,
  RefreshCw,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Award,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { exportStudentsToCSV } from "@/utils/adminStudentActions";
import { exportStudentsToPDF } from "@/utils/pdfExport";
import styles from "../AdminControls.module.css";

const ControlsHeader = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  university,
  onUniversityChange,
  uniqueUniversities = [],
  place,
  onPlaceChange,
  uniquePlaces = [],
  academicYear,
  onAcademicYearChange,
  uniqueAcademicYears = [],
  dayFilter,
  onDayFilterChange,
  certFilter,
  onCertFilterChange,
  presetFilter,
  onSelectPreset,
  presetStats = {},
  onResetFilters,
  onOpenCreate,
  onRefresh,
  loading,
  studentsToExport = [],
}) => {
  const hasActiveFilters =
    search ||
    status !== "all" ||
    university !== "all" ||
    place !== "all" ||
    academicYear !== "all" ||
    dayFilter !== "all" ||
    certFilter !== "all" ||
    presetFilter !== "all";

  return (
    <div className="flex flex-col gap-4">
      {/* Top Title & Actions */}
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1 className={styles.mainTitle}>
            <Users size={26} className="text-teal-600" />
            <span>إدارة وتأكيد الطلاب المسجلين</span>
          </h1>
          <p className={styles.subtitle}>
            مراجعة الشهادات والبطاقات، اعتماد الحضور، الفلترة الذكية، وتصدير التقارير المعتمدة
          </p>
        </div>

        <div className={styles.headerActions}>
          {/* PDF Export */}
          <button
            type="button"
            className={`${styles.btnSecondary} ${styles.btnPdf}`}
            onClick={() => exportStudentsToPDF(studentsToExport, "كشف الحضور المعتمد")}
            title="تصدير كشف منظم وقابل للطباعة كـ PDF"
            disabled={studentsToExport.length === 0}
          >
            <FileText size={16} />
            <span>تقرير PDF 🖨️</span>
          </button>

          {/* CSV Export */}
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => exportStudentsToCSV(studentsToExport)}
            title="تصدير القائمة كملف إكسل"
            disabled={studentsToExport.length === 0}
          >
            <Download size={16} />
            <span>Excel / CSV</span>
          </button>

          {/* Refresh */}
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onRefresh}
            title="تحديث البيانات"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>تحديث</span>
          </button>

          {/* Add Student */}
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onOpenCreate}
          >
            <UserPlus size={16} />
            <span>إضافة طالب جديد</span>
          </button>
        </div>
      </div>

      {/* Preset Quick-Filter Cards */}
      <div className={styles.presetGrid}>
        {/* 1. All */}
        <div
          className={`${styles.presetCard} ${presetFilter === "all" ? styles.activePreset : ""
            }`}
          onClick={() => onSelectPreset("all")}
        >
          <div className={styles.presetLeft}>
            <Users size={16} className="text-teal-600" />
            <span className={styles.presetTitle}>جميع الطلاب</span>
          </div>
          <span className={styles.presetBadge}>{presetStats.total || 0}</span>
        </div>

        {/* 2. Pending */}
        <div
          className={`${styles.presetCard} ${presetFilter === "pending" ? styles.activePreset : ""
            }`}
          onClick={() => onSelectPreset("pending")}
        >
          <div className={styles.presetLeft}>
            <Clock size={16} className="text-amber-500" />
            <span className={styles.presetTitle}>في الانتظار</span>
          </div>
          <span
            className={styles.presetBadge}
            style={{ background: "#fef3c7", color: "#b45309" }}
          >
            {presetStats.pending || 0}
          </span>
        </div>

        {/* 3. Today */}
        <div
          className={`${styles.presetCard} ${presetFilter === "today" ? styles.activePreset : ""
            }`}
          onClick={() => onSelectPreset("today")}
        >
          <div className={styles.presetLeft}>
            <Calendar size={16} className="text-blue-500" />
            <span className={styles.presetTitle}>مسجلي اليوم</span>
          </div>
          <span
            className={styles.presetBadge}
            style={{ background: "#e0f2fe", color: "#0369a1" }}
          >
            {presetStats.today || 0}
          </span>
        </div>

        {/* 4. Approved */}
        <div
          className={`${styles.presetCard} ${presetFilter === "approved" ? styles.activePreset : ""
            }`}
          onClick={() => onSelectPreset("approved")}
        >
          <div className={styles.presetLeft}>
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span className={styles.presetTitle}>المقبولين</span>
          </div>
          <span
            className={styles.presetBadge}
            style={{ background: "#dcfce7", color: "#15803d" }}
          >
            {presetStats.approved || 0}
          </span>
        </div>

        {/* 5. Has Certificate */}
        <div
          className={`${styles.presetCard} ${presetFilter === "has_cert" ? styles.activePreset : ""
            }`}
          onClick={() => onSelectPreset("has_cert")}
        >
          <div className={styles.presetLeft}>
            <Award size={16} className="text-indigo-600" />
            <span className={styles.presetTitle}>مرفق شهادة</span>
          </div>
          <span
            className={styles.presetBadge}
            style={{ background: "#ede9fe", color: "#6d28d9" }}
          >
            {presetStats.hasCert || 0}
          </span>
        </div>

        {/* 6. Incomplete Data */}
        <div
          className={`${styles.presetCard} ${presetFilter === "incomplete" ? styles.activePreset : ""
            }`}
          onClick={() => onSelectPreset("incomplete")}
        >
          <div className={styles.presetLeft}>
            <AlertTriangle size={16} className="text-rose-500" />
            <span className={styles.presetTitle}>بيانات ناقصة</span>
          </div>
          <span
            className={styles.presetBadge}
            style={{ background: "#ffe4e6", color: "#be123c" }}
          >
            {presetStats.incomplete || 0}
          </span>
        </div>
      </div>

      {/* Comprehensive Filter Bar */}
      <div className={styles.filterBarCard}>
        {/* Top: Smart Search Input */}
        <div className={styles.filterTopRow}>
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="ابحث بالاسم، الإيميل، الهاتف، أو الكلية..." className={styles.searchInput}
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

        {/* Sub Row: Academic Year, Day Filter, Cert Presence, Reset */}
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

          {/* Day / Date Filter */}
          <select
            className={styles.filterSelect}
            value={dayFilter}
            onChange={(e) => onDayFilterChange(e.target.value)}
          >
            <option value="all">كل التواريخ والأيام</option>
            <option value="today">📅 اليوم</option>
            <option value="yesterday">📅 أمس</option>
            <option value="2026-08-26">26 أغسطس</option>
            <option value="2026-08-25">25 أغسطس</option>
            <option value="2026-08-24">24 أغسطس</option>
            <option value="2026-08-23">23 أغسطس</option>
            <option value="2026-08-22">22 أغسطس</option>
          </select>

          {/* Custom Date Input if needed */}
          <input
            type="date"
            className={styles.dateInput}
            title="اختيار تاريخ محدد"
            value={
              dayFilter !== "all" && dayFilter !== "today" && dayFilter !== "yesterday"
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
    </div>
  );
};

export default ControlsHeader;
