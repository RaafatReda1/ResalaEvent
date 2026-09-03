import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../../../utils/supabaseClient";
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Search,
  RefreshCw,
  RotateCcw,
  QrCode,
  Phone,
  Mail,
  Hash,
  Building2,
  GraduationCap,
  MapPin,
  Eye,
  Undo2,
  Calendar,
  Download,
  ChevronDown,
  ChevronUp,
  UserX,
  Loader2,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCheck,
  User,
  ScanLine,
  Clock3,
  ExternalLink,
  MessageCircle,
  Filter,
  FileText,
} from "lucide-react";
import StudentDetailsModal from "../AdminControls/components/StudentDetailsModal";
import { exportAttendanceToPDF } from "@/utils/pdfExport";
import styles from "./AdminAttendance.module.css";

/* ─── Helpers ─── */
const fmt = (iso, opts) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ar-EG", opts);
};
const fmtFull = (iso) =>
  fmt(iso, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fmtDate = (iso) =>
  fmt(iso, { day: "numeric", month: "long", year: "numeric" });
const fmtTime = (iso) =>
  fmt(iso, { hour: "2-digit", minute: "2-digit" });

const getWhatsAppLink = (phone, name) => {
  const num = phone?.replace(/\D/g, "");
  if (!num) return null;
  const msg = encodeURIComponent(`السلام عليكم ${name}، تم تسجيل حضورك بنجاح في فعالية رسالة 🎉`);
  return `https://wa.me/${num}?text=${msg}`;
};

/* ─── Stat Card ─── */
const StatCard = ({ icon, label, value, color, sub, trend }) => (
  <div className={`${styles.statCard} ${styles[`stat_${color}`]}`}>
    <div className={styles.statTop}>
      <div className={`${styles.statIconWrap} ${styles[`icon_${color}`]}`}>{icon}</div>
      {trend !== undefined && (
        <span className={`${styles.trendBadge} ${trend >= 0 ? styles.trendUp : styles.trendDown}`}>
          <TrendingUp size={11} />
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statLabel}>{label}</div>
    {sub && <div className={styles.statSub}>{sub}</div>}
  </div>
);

/* ─── Main Attendance Component ─── */
const AdminAttendance = () => {
  const [all, setAll] = useState([]); // all scanned students
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | approved | pending
  const [universityFilter, setUniversityFilter] = useState("all");
  const [placeFilter, setPlaceFilter] = useState("all");
  const [academicYearFilter, setAcademicYearFilter] = useState("all");
  const [scannerFilter, setScannerFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // all | today | yesterday | custom YYYY-MM-DD
  const [sortBy, setSortBy] = useState("scannedAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [detailsStudent, setDetailsStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [totalApprovedInDB, setTotalApprovedInDB] = useState(0);

  /* ─── Fetch ─── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [scannedRes, approvedRes] = await Promise.all([
      supabase.from("students").select("*").eq("hasScannedQr", true).order("scannedAt", { ascending: false }),
      supabase.from("students").select("id", { count: "exact" }).eq("isApproved", true),
    ]);
    if (!scannedRes.error) setAll(scannedRes.data || []);
    if (!approvedRes.error) setTotalApprovedInDB(approvedRes.count || 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const ch = supabase
      .channel("attendance-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "students" }, fetchData)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [fetchData]);

  /* ─── Stats ─── */
  const totalScanned = all.length;
  const approvedScanned = all.filter((s) => s.isApproved).length;
  const pendingScanned = all.filter((s) => !s.isApproved).length;
  const attendanceRate = totalApprovedInDB > 0 ? Math.round((approvedScanned / totalApprovedInDB) * 100) : 0;

  /* ─── Derived unique lists for dropdown filters ─── */
  const uniqueUniversities = useMemo(
    () => [...new Set(all.map((s) => s.university).filter(Boolean))].sort(),
    [all]
  );
  const uniquePlaces = useMemo(
    () => [...new Set(all.map((s) => s.place).filter(Boolean))].sort(),
    [all]
  );
  const uniqueAcademicYears = useMemo(
    () => [...new Set(all.map((s) => s.academicYear).filter(Boolean))].sort(),
    [all]
  );
  const uniqueScanners = useMemo(
    () => [...new Set(all.map((s) => s.adminScanner).filter(Boolean))].sort(),
    [all]
  );

  const hasActiveFilters = Boolean(
    search.trim() ||
    statusFilter !== "all" ||
    universityFilter !== "all" ||
    placeFilter !== "all" ||
    academicYearFilter !== "all" ||
    scannerFilter !== "all" ||
    dateFilter !== "all"
  );

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setUniversityFilter("all");
    setPlaceFilter("all");
    setAcademicYearFilter("all");
    setScannerFilter("all");
    setDateFilter("all");
  };

  /* ─── Filter + Sort ─── */
  const filtered = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    return all
      .filter((s) => {
        // Status filter
        if (statusFilter === "approved" && !s.isApproved) return false;
        if (statusFilter === "pending" && s.isApproved) return false;

        // Dropdown filters
        if (universityFilter !== "all" && s.university !== universityFilter) return false;
        if (placeFilter !== "all" && s.place !== placeFilter) return false;
        if (academicYearFilter !== "all" && s.academicYear !== academicYearFilter) return false;
        if (scannerFilter !== "all" && s.adminScanner !== scannerFilter) return false;

        // Date filter
        if (dateFilter !== "all") {
          const scanDateStr = s.scannedAt ? new Date(s.scannedAt).toISOString().slice(0, 10) : "";
          if (dateFilter === "today" && scanDateStr !== todayStr) return false;
          if (dateFilter === "yesterday" && scanDateStr !== yesterdayStr) return false;
          if (dateFilter !== "today" && dateFilter !== "yesterday" && scanDateStr !== dateFilter) {
            return false;
          }
        }

        // Search text
        if (!search.trim()) return true;
        const q = search.toLowerCase().trim();
        return (
          s.name?.toLowerCase().includes(q) ||
          s.phone?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.university?.toLowerCase().includes(q) ||
          s.place?.toLowerCase().includes(q) ||
          s.academicYear?.toLowerCase().includes(q) ||
          s.adminScanner?.toLowerCase().includes(q) ||
          s.id?.toLowerCase().startsWith(q.replace(/^#/, ""))
        );
      })
      .sort((a, b) => {
        let av = a[sortBy] ?? "";
        let bv = b[sortBy] ?? "";
        if (["scannedAt", "created_at"].includes(sortBy)) {
          av = av ? new Date(av).getTime() : 0;
          bv = bv ? new Date(bv).getTime() : 0;
        } else {
          av = String(av).toLowerCase();
          bv = String(bv).toLowerCase();
        }
        return sortAsc ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
      });
  }, [
    all,
    search,
    statusFilter,
    universityFilter,
    placeFilter,
    academicYearFilter,
    scannerFilter,
    dateFilter,
    sortBy,
    sortAsc,
  ]);

  const handleSort = (field) => {
    if (sortBy === field) setSortAsc((v) => !v);
    else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  /* ─── Actions ─── */
  const handleUndoAttendance = async (student) => {
    if (!window.confirm(`هل تريد إلغاء تسجيل حضور "${student.name}"؟\nسيُحذف من قائمة الحاضرين.`)) return;
    setActionLoading(student.id + "_undo");
    await supabase
      .from("students")
      .update({ hasScannedQr: false, scannedAt: null, adminScanner: null })
      .eq("id", student.id);
    setAll((prev) => prev.filter((s) => s.id !== student.id));
    setActionLoading(null);
  };

  const handleApprove = async (student) => {
    setActionLoading(student.id + "_approve");
    await supabase.from("students").update({ isApproved: true }).eq("id", student.id);
    setAll((prev) => prev.map((s) => (s.id === student.id ? { ...s, isApproved: true } : s)));
    setActionLoading(null);
  };

  /* ─── Export CSV / Excel ─── */
  const handleExportCSV = () => {
    const header = [
      "#",
      "الاسم",
      "كود الحضور",
      "الهاتف",
      "الإيميل",
      "الجامعة",
      "الفرقة",
      "نقطة التجمع",
      "الحالة",
      "تاريخ التسجيل",
      "وقت الحضور",
      "المشرف",
    ];
    const rows = filtered.map((s, i) => [
      i + 1,
      s.name,
      `#${s.id ? s.id.split("-")[0].toUpperCase() : ""}`,
      s.phone,
      s.email,
      s.university,
      s.academicYear,
      s.place,
      s.isApproved ? "مقبول" : "قيد المراجعة",
      s.created_at ? new Date(s.created_at).toLocaleDateString("ar-EG") : "",
      s.scannedAt ? new Date(s.scannedAt).toLocaleString("ar-EG") : "",
      s.adminScanner || "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `سجل_الحاضرين_${new Date().toLocaleDateString("ar-EG").replace(/\//g, "-")}.csv`;
    a.click();
  };

  /* ─── Export PDF ─── */
  const handleExportPDF = () => {
    exportAttendanceToPDF(filtered, "كشف الحاضرين الفعلي - إيفنت أطباء الخير");
  };

  /* ─── Sort indicator ─── */
  const SortIndicator = ({ field }) =>
    sortBy === field ? (sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : null;

  return (
    <div className={styles.page}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <div className={styles.pageTitleIcon}>
            <ScanLine size={22} />
          </div>
          <div>
            <h2 className={styles.pageTitleText}>سجل الحاضرين</h2>
            <p className={styles.pageTitleSub}>جميع الطلاب الذين تم مسح تذاكرهم وتسجيل حضورهم بالماسح</p>
          </div>
        </div>
        <div className={styles.pageHeaderActions}>
          {/* PDF Export Button */}
          <button
            type="button"
            className={styles.btnPdf}
            onClick={handleExportPDF}
            title="تصدير كشف منظم وقابل للطباعة كـ PDF"
          >
            <FileText size={15} />
            <span>تقرير PDF</span>
          </button>

          {/* Excel Export Button */}
          <button
            type="button"
            className={styles.btnExport}
            onClick={handleExportCSV}
            title="تصدير ملف Excel / CSV"
          >
            <Download size={15} />
            <span>تصدير Excel</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            className={styles.btnRefresh}
            onClick={fetchData}
            disabled={loading}
            title="تحديث البيانات"
          >
            <RefreshCw size={15} className={loading ? styles.spin : ""} />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* ── Stats KPI Cards ── */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={<UserCheck size={20} />}
          label="إجمالي الحاضرين"
          value={totalScanned}
          color="teal"
          sub="تم تسجيلهم بالماسح"
        />
        <StatCard
          icon={<CheckCheck size={20} />}
          label="مقبولون حضروا"
          value={approvedScanned}
          color="green"
          sub={`من أصل ${totalApprovedInDB} مقبول في النظام`}
        />
        <StatCard
          icon={<AlertCircle size={20} />}
          label="حضروا دون قبول"
          value={pendingScanned}
          color="amber"
          sub="حضروا دون موافقة مسبقة"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="نسبة الحضور"
          value={`${attendanceRate}%`}
          color="blue"
          sub="من إجمالي المقبولين"
          trend={attendanceRate}
        />
      </div>

      {/* ── Quick Preset Chips ── */}
      <div className={styles.filterChips}>
        {[
          { val: "all", label: `الكل (${all.length})`, icon: <UserCheck size={13} /> },
          { val: "approved", label: `مقبولون (${approvedScanned})`, icon: <CheckCircle2 size={13} /> },
          { val: "pending", label: `قيد المراجعة (${pendingScanned})`, icon: <Clock size={13} /> },
        ].map((chip) => (
          <button
            key={chip.val}
            className={`${styles.chip} ${statusFilter === chip.val ? styles.chipActive : ""}`}
            onClick={() => setStatusFilter(chip.val)}
          >
            {chip.icon}
            {chip.label}
          </button>
        ))}
      </div>

      {/* ── Comprehensive Filter Bar (White Theme) ── */}
      <div className={styles.filterBarCard}>
        {/* Top Row: Search & Main Dropdowns */}
        <div className={styles.filterTopRow}>
          {/* Search Box */}
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="ابحث بالاسم، الهاتف، الإيميل، الكلية، نقطة التجمع، المشرف، أو الكود..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => setSearch("")}
                title="مسح البحث"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">كل الحالات</option>
            <option value="approved">✅ المقبولين فقط</option>
            <option value="pending">⏳ في الانتظار / مراجعة</option>
          </select>

          {/* University Dropdown */}
          <select
            className={styles.filterSelect}
            value={universityFilter}
            onChange={(e) => setUniversityFilter(e.target.value)}
          >
            <option value="all">جميع الجامعات</option>
            {uniqueUniversities.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>

          {/* Gathering Place Dropdown */}
          <select
            className={styles.filterSelect}
            value={placeFilter}
            onChange={(e) => setPlaceFilter(e.target.value)}
          >
            <option value="all">جميع نقاط التجمع</option>
            {uniquePlaces.map((pl) => (
              <option key={pl} value={pl}>
                {pl}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Row: Academic Year, Scanner Admin, Date Filter, Reset */}
        <div className={styles.filterSubRow}>
          <div className={styles.filterLabelWrap}>
            <Filter size={14} />
            <span>تصفية متقدمة:</span>
          </div>

          {/* Academic Year */}
          <select
            className={styles.filterSelect}
            value={academicYearFilter}
            onChange={(e) => setAcademicYearFilter(e.target.value)}
          >
            <option value="all">كل الفرق الدراسية</option>
            {uniqueAcademicYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Scanner / Admin Dropdown */}
          <select
            className={styles.filterSelect}
            value={scannerFilter}
            onChange={(e) => setScannerFilter(e.target.value)}
          >
            <option value="all">كل المشرفين (الماسحين)</option>
            {uniqueScanners.map((adm) => (
              <option key={adm} value={adm}>
                👤 {adm}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            className={styles.filterSelect}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">كل التواريخ والأيام</option>
            <option value="today">📅 اليوم</option>
            <option value="yesterday">📅 أمس</option>
          </select>

          {/* Custom Date Input */}
          <input
            type="date"
            className={styles.dateInput}
            title="اختيار تاريخ حضور مخصص من التقويم"
            value={dateFilter !== "all" && dateFilter !== "today" && dateFilter !== "yesterday" ? dateFilter : ""}
            onChange={(e) => setDateFilter(e.target.value || "all")}
          />

          {/* Result count badge */}
          <span className={styles.filterResultsCount}>
            {filtered.length} حاضر {hasActiveFilters ? `(من أصل ${all.length})` : ""}
          </span>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={handleResetFilters}
              title="إلغاء جميع خيارات الفلترة والبحث"
            >
              <RotateCcw size={12} />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Attendance Table Card ── */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={36} className={styles.spin} />
            <p>جاري تحميل بيانات الحاضرين...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <QrCode size={52} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>
              {hasActiveFilters ? "لا توجد نتائج مطابقة لشروط الفلترة الحالية" : "لم يُسجَّل حضور أي طالب بعد"}
            </p>
            <p className={styles.emptyHint}>
              {hasActiveFilters ? "جرب تعديل الفلاتر أو الضغط على إعادة ضبط الفلاتر" : "انتقل إلى ماسح الحضور لبدء تسجيل الطلاب"}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                className={styles.clearFilterBtnCenter}
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} />
                <span>إعادة ضبط كل الفلاتر</span>
              </button>
            )}
          </div>
        ) : (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thIdx}>#</th>
                  <th className={styles.thSortable} onClick={() => handleSort("name")}>
                    بيانات الطالب <SortIndicator field="name" />
                  </th>
                  <th className={styles.thSortable} onClick={() => handleSort("university")}>
                    الجامعة / الفرقة <SortIndicator field="university" />
                  </th>
                  <th>نقطة التجمع</th>
                  <th className={styles.thSortable} onClick={() => handleSort("isApproved")}>
                    الحالة <SortIndicator field="isApproved" />
                  </th>
                  <th className={styles.thSortable} onClick={() => handleSort("scannedAt")}>
                    وقت الحضور <SortIndicator field="scannedAt" />
                  </th>
                  <th>المشرف</th>
                  <th className={styles.thCenter}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => {
                  const expanded = expandedId === student.id;
                  const isActing = actionLoading?.startsWith(student.id);
                  const waLink = getWhatsAppLink(student.phone, student.name);
                  const shortId = student.id?.split("-")[0]?.toUpperCase();

                  return (
                    <React.Fragment key={student.id}>
                      <tr
                        className={`${styles.row} ${expanded ? styles.rowActive : ""}`}
                        onClick={() => setExpandedId(expanded ? null : student.id)}
                      >
                        {/* # */}
                        <td className={styles.tdIdx}>{idx + 1}</td>

                        {/* Student Info */}
                        <td className={styles.tdStudent}>
                          <div className={styles.studentCell}>
                            <div
                              className={`${styles.avatar} ${
                                student.isApproved ? styles.avatarGreen : styles.avatarGray
                              }`}
                            >
                              {student.name?.charAt(0) ?? "؟"}
                            </div>
                            <div>
                              <div className={styles.studentName}>{student.name}</div>
                              <div className={styles.studentSub}>
                                <span className={styles.hashCode}>#{shortId}</span>
                                <span className={styles.dot}>·</span>
                                <span>{student.phone || "—"}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* University & Academic Year */}
                        <td className={styles.tdUni}>
                          <div className={styles.uniName}>{student.university || "—"}</div>
                          {student.academicYear && (
                            <span className={styles.yearChip}>{student.academicYear}</span>
                          )}
                        </td>

                        {/* Gathering Place */}
                        <td>
                          <span className={styles.placeText}>
                            <MapPin size={12} style={{ color: "#94a3b8" }} />
                            {student.place || "—"}
                          </span>
                        </td>

                        {/* Approval Status */}
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              student.isApproved ? styles.badgeApproved : styles.badgePending
                            }`}
                          >
                            {student.isApproved ? (
                              <>
                                <CheckCircle2 size={12} /> مقبول
                              </>
                            ) : (
                              <>
                                <Clock size={12} /> قيد المراجعة
                              </>
                            )}
                          </span>
                        </td>

                        {/* Scanned Time */}
                        <td className={styles.tdTime}>
                          <div className={styles.timeMain}>{fmtTime(student.scannedAt)}</div>
                          <div className={styles.timeSub}>{fmtDate(student.scannedAt)}</div>
                        </td>

                        {/* Admin Scanner */}
                        <td>
                          <span className={styles.adminName}>
                            <Shield size={11} style={{ color: "#3ab9ac" }} />
                            {student.adminScanner || "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className={styles.tdActions} onClick={(e) => e.stopPropagation()}>
                          <div className={styles.actionBtns}>
                            <button
                              type="button"
                              className={styles.btnEye}
                              onClick={() => setDetailsStudent(student)}
                              title="عرض السجل الكامل"
                            >
                              <Eye size={14} />
                            </button>

                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnWa}
                                title="إرسال واتساب"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MessageCircle size={14} />
                              </a>
                            )}

                            {!student.isApproved && (
                              <button
                                type="button"
                                className={styles.btnApprove}
                                onClick={() => handleApprove(student)}
                                disabled={isActing}
                                title="قبول الطالب"
                              >
                                {actionLoading === student.id + "_approve" ? (
                                  <Loader2 size={13} className={styles.spin} />
                                ) : (
                                  <CheckCircle2 size={14} />
                                )}
                              </button>
                            )}

                            <button
                              type="button"
                              className={styles.btnUndo}
                              onClick={() => handleUndoAttendance(student)}
                              disabled={isActing}
                              title="إلغاء تسجيل الحضور"
                            >
                              {actionLoading === student.id + "_undo" ? (
                                <Loader2 size={13} className={styles.spin} />
                              ) : (
                                <Undo2 size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ─ Expanded Drawer ─ */}
                      {expanded && (
                        <tr className={styles.drawerRow}>
                          <td colSpan={8}>
                            <div className={styles.drawer}>
                              <div className={styles.drawerGrid}>
                                {/* ID & Attendance Code */}
                                <div className={styles.drawerBlock}>
                                  <div className={styles.drawerBlockTitle}>
                                    <Hash size={13} /> كود الطالب
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>كود الحضور</span>
                                    <code className={styles.drawerCode}>#{shortId}</code>
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>المعرّف الكامل</span>
                                    <code className={styles.drawerUUID}>{student.id}</code>
                                  </div>
                                </div>

                                {/* Contact Information */}
                                <div className={styles.drawerBlock}>
                                  <div className={styles.drawerBlockTitle}>
                                    <Phone size={13} /> التواصل
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>الهاتف</span>
                                    <a
                                      href={`tel:${student.phone}`}
                                      className={styles.drawerLink}
                                      dir="ltr"
                                    >
                                      {student.phone || "—"} <ExternalLink size={10} />
                                    </a>
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>الإيميل</span>
                                    <a
                                      href={`mailto:${student.email}`}
                                      className={styles.drawerLink}
                                      dir="ltr"
                                    >
                                      {student.email || "—"} <ExternalLink size={10} />
                                    </a>
                                  </div>
                                </div>

                                {/* Academic Information */}
                                <div className={styles.drawerBlock}>
                                  <div className={styles.drawerBlockTitle}>
                                    <GraduationCap size={13} /> الأكاديمية
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>الجامعة</span>
                                    <span className={styles.drawerVal}>
                                      <Building2 size={11} /> {student.university || "—"}
                                    </span>
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>الفرقة</span>
                                    <span className={styles.drawerVal}>
                                      {student.academicYear || "—"}
                                    </span>
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>التجمع</span>
                                    <span className={styles.drawerVal}>
                                      <MapPin size={11} /> {student.place || "—"}
                                    </span>
                                  </div>
                                </div>

                                {/* Attendance Information */}
                                <div className={styles.drawerBlock}>
                                  <div className={styles.drawerBlockTitle}>
                                    <ScanLine size={13} /> بيانات الحضور
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>تسجيل الحضور</span>
                                    <span className={styles.drawerVal}>
                                      {fmtFull(student.scannedAt)}
                                    </span>
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>تاريخ التقديم</span>
                                    <span className={styles.drawerVal}>
                                      {fmtDate(student.created_at)}
                                    </span>
                                  </div>
                                  <div className={styles.drawerKV}>
                                    <span className={styles.drawerKey}>المشرف</span>
                                    <span className={styles.drawerVal}>
                                      <Shield size={11} style={{ color: "#3ab9ac" }} />{" "}
                                      {student.adminScanner || "—"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Drawer Action Buttons */}
                              <div className={styles.drawerActions}>
                                <button
                                  type="button"
                                  className={styles.drawerBtnView}
                                  onClick={() => setDetailsStudent(student)}
                                >
                                  <Eye size={14} /> عرض السجل الكامل
                                </button>
                                {!student.isApproved && (
                                  <button
                                    type="button"
                                    className={styles.drawerBtnApprove}
                                    onClick={() => handleApprove(student)}
                                    disabled={isActing}
                                  >
                                    <CheckCircle2 size={14} /> قبول الطالب الآن
                                  </button>
                                )}
                                {waLink && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.drawerBtnWa}
                                  >
                                    <MessageCircle size={14} /> إرسال واتساب
                                  </a>
                                )}
                                <button
                                  type="button"
                                  className={styles.drawerBtnUndo}
                                  onClick={() => handleUndoAttendance(student)}
                                  disabled={isActing}
                                >
                                  <Undo2 size={14} /> إلغاء تسجيل الحضور
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table footer */}
        {!loading && filtered.length > 0 && (
          <div className={styles.tableFooter}>
            <span>
              يعرض {filtered.length} من أصل {all.length} حاضر
            </span>
            <span>آخر تحديث: {fmtTime(new Date().toISOString())}</span>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      <StudentDetailsModal
        isOpen={Boolean(detailsStudent)}
        onClose={() => setDetailsStudent(null)}
        student={detailsStudent}
        onApprovalChange={fetchData}
      />
    </div>
  );
};

export default AdminAttendance;
