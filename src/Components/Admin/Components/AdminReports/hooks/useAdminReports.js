import { useState, useEffect, useCallback, useMemo } from "react";
import supabase from "@/utils/supabaseClient";
import { getAdminProfile, logActivity, ACTION_TYPES, ACTION_CATEGORIES } from "@/utils/activityLogger";
import { normalizeArabic } from "@/utils/arabicSearch";

export const useAdminReports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // 'all' | 'student' | 'admin' | 'sudo_admin'
  const [categoryFilter, setCategoryFilter] = useState("all"); // 'all' | 'AUTH' | 'STUDENT_ACTION' | 'ADMIN_OPERATION' | 'SETTINGS'
  const [actionTypeFilter, setActionTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // 'all' | 'today' | 'yesterday' | '7days' | '30days'
  const [presetFilter, setPresetFilter] = useState("all"); // 'all' | 'students' | 'admins' | 'deletions' | 'auth'

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [expandedLogId, setExpandedLogId] = useState(null);

  // Modals State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingLog, setViewingLog] = useState(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // 1. Fetch current admin profile & check sudo privilege
  const checkAdmin = useCallback(async () => {
    const profile = await getAdminProfile(true);
    setAdminProfile(profile);
  }, []);

  // 2. Load all activity logs from Supabase
  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Failed to load activity logs:", err);
      setError("تعذر تحميل سجل النشاطات. يرجى التأكد من الصلاحيات والاتصال.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdmin();
    loadLogs();
  }, [checkAdmin, loadLogs]);

  // Is current admin a Sudo Admin?
  const isSudoAdmin = Boolean(adminProfile?.sudo);

  // 3. Computed Unique Action Types
  const uniqueActionTypes = useMemo(() => {
    const set = new Set();
    logs.forEach((l) => {
      if (l.action_type) set.add(l.action_type);
    });
    return Array.from(set).sort();
  }, [logs]);

  // 4. Live Stats for Quick Preset Cards
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const total = logs.length;
    const todayCount = logs.filter((l) => l.created_at?.startsWith(todayStr)).length;
    const studentActions = logs.filter(
      (l) => l.actor_role === "student" || l.action_category === "STUDENT_ACTION"
    ).length;
    const adminOperations = logs.filter(
      (l) => l.actor_role === "admin" || l.actor_role === "sudo_admin"
    ).length;
    const deletions = logs.filter(
      (l) =>
        l.action_type === ACTION_TYPES.DELETE_STUDENT ||
        l.action_type === ACTION_TYPES.BULK_DELETE ||
        l.action_type === ACTION_TYPES.PURGE_LOGS
    ).length;
    const authLogs  = logs.filter((l) => l.action_category === "AUTH").length;
    const linkClicks = logs.filter((l) => l.action_category === "LINK_CLICK").length;

    return {
      total,
      todayCount,
      studentActions,
      adminOperations,
      deletions,
      authLogs,
      linkClicks,
    };
  }, [logs]);

  // 5. Multi-criteria Filtering
  const filteredLogs = useMemo(() => {
    const query = normalizeArabic(search.trim());
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

    return logs.filter((log) => {
      // Preset Filter
      if (presetFilter === "students") {
        if (log.actor_role !== "student" && log.action_category !== "STUDENT_ACTION")
          return false;
      } else if (presetFilter === "admins") {
        if (log.actor_role !== "admin" && log.actor_role !== "sudo_admin")
          return false;
      } else if (presetFilter === "deletions") {
        if (
          log.action_type !== ACTION_TYPES.DELETE_STUDENT &&
          log.action_type !== ACTION_TYPES.BULK_DELETE &&
          log.action_type !== ACTION_TYPES.PURGE_LOGS
        )
          return false;
      } else if (presetFilter === "auth") {
        if (log.action_category !== "AUTH") return false;
      } else if (presetFilter === "linkClicks") {
        if (log.action_category !== "LINK_CLICK") return false;
      }

      // Role Filter
      if (roleFilter !== "all" && log.actor_role !== roleFilter) return false;

      // Category Filter
      if (categoryFilter !== "all" && log.action_category !== categoryFilter)
        return false;

      // Action Type Filter
      if (actionTypeFilter !== "all" && log.action_type !== actionTypeFilter)
        return false;

      // Date Filter
      if (dateFilter === "today") {
        if (!log.created_at?.startsWith(todayStr)) return false;
      } else if (dateFilter === "yesterday") {
        if (!log.created_at?.startsWith(yesterdayStr)) return false;
      } else if (dateFilter === "7days") {
        const days7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (new Date(log.created_at) < days7Ago) return false;
      } else if (dateFilter === "30days") {
        const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (new Date(log.created_at) < days30Ago) return false;
      }

      // Smart Search in description, actor name, actor email, target name
      if (query) {
        const descNorm = normalizeArabic(log.description || "");
        const nameNorm = normalizeArabic(log.actor_name || "");
        const emailNorm = (log.actor_email || "").toLowerCase();
        const targetNorm = normalizeArabic(log.target_name || "");
        const actionNorm = (log.action_type || "").toLowerCase();

        const match =
          descNorm.includes(query) ||
          nameNorm.includes(query) ||
          emailNorm.includes(query) ||
          targetNorm.includes(query) ||
          actionNorm.includes(query);

        if (!match) return false;
      }

      return true;
    });
  }, [
    logs,
    search,
    roleFilter,
    categoryFilter,
    actionTypeFilter,
    dateFilter,
    presetFilter,
  ]);

  // 6. Pagination
  const totalCount = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, categoryFilter, actionTypeFilter, dateFilter, presetFilter, pageSize]);

  // 7. Actions & Handlers
  const handleToggleExpand = (id) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  const handleOpenDetails = (log) => {
    setViewingLog(log);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDelete = (log) => {
    if (!isSudoAdmin) {
      showToast("عذراً، حذف السجلات مقتصر فقط على المشرف الرئيسي (Sudo Admin)");
      return;
    }
    setLogToDelete(log);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!logToDelete?.id || !isSudoAdmin) return;
    const delId = logToDelete.id;

    // Optimistic UI update
    setLogs((prev) => prev.filter((l) => l.id !== delId));
    setIsDeleteModalOpen(false);
    showToast("تم حذف السجل بنجاح! 🗑️");

    try {
      const { error } = await supabase.from("activity_logs").delete().eq("id", delId);
      if (error) throw error;
    } catch (err) {
      console.error("Delete log error:", err);
      showToast("تعذر حذف السجل من الخادم");
      loadLogs();
    }
  };

  const handlePurgeLogs = async (olderThanDays = 30) => {
    if (!isSudoAdmin) {
      showToast("عذراً، تنظيف السجلات مقتصر فقط على المشرف الرئيسي (Sudo Admin)");
      return;
    }

    try {
      const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from("activity_logs")
        .delete()
        .lt("created_at", cutoffDate);

      if (error) throw error;

      showToast(`تم تنظيف السجلات الأقدم من ${olderThanDays} يوماً بنجاح! 🧹`);
      setIsPurgeModalOpen(false);

      logActivity({
        action_type: ACTION_TYPES.PURGE_LOGS,
        action_category: ACTION_CATEGORIES.SETTINGS,
        description: `قام بتنظيف السجلات القديمة الأقدم من (${olderThanDays}) يوماً`,
        metadata: { olderThanDays, cutoffDate },
      });

      loadLogs();
    } catch (err) {
      console.error("Purge logs error:", err);
      showToast("حدث خطأ أثناء تنظيف السجلات القديمة");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setCategoryFilter("all");
    setActionTypeFilter("all");
    setDateFilter("all");
    setPresetFilter("all");
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      showToast("لا توجد سجلات لتصديرها");
      return;
    }

    const headers = [
      "رقم السجل",
      "التاريخ والوقت",
      "نوع الفاعل",
      "اسم الفاعل",
      "بريد الفاعل",
      "فئة العملية",
      "نوع العملية",
      "الوصف",
      "الهدف المستهدف",
    ];

    const rows = filteredLogs.map((l) => [
      l.id,
      new Date(l.created_at).toLocaleString("ar-EG"),
      l.actor_role,
      `"${l.actor_name || ""}"`,
      `"${l.actor_email || ""}"`,
      l.action_category,
      l.action_type,
      `"${(l.description || "").replace(/"/g, '""')}"`,
      `"${l.target_name || ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `تقرير_سجل_النشاطات_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("تم تصدير ملف CSV بنجاح! 📊");
  };

  return {
    logs: paginatedLogs,
    allFilteredLogs: filteredLogs,
    totalCount,
    totalPages,
    page,
    pageSize,
    loading,
    error,
    toastMsg,
    adminProfile,
    isSudoAdmin,
    stats,
    search,
    roleFilter,
    categoryFilter,
    actionTypeFilter,
    dateFilter,
    presetFilter,
    uniqueActionTypes,
    expandedLogId,
    isDeleteModalOpen,
    logToDelete,
    isPurgeModalOpen,
    isDetailsModalOpen,
    viewingLog,
    setPage,
    setPageSize,
    setSearch,
    setRoleFilter,
    setCategoryFilter,
    setActionTypeFilter,
    setDateFilter,
    setPresetFilter,
    handleToggleExpand,
    handleOpenDetails,
    handleOpenDelete,
    handleConfirmDelete,
    handlePurgeLogs,
    handleResetFilters,
    handleExportCSV,
    setIsDeleteModalOpen,
    setIsPurgeModalOpen,
    setIsDetailsModalOpen,
    loadLogs,
  };
};
