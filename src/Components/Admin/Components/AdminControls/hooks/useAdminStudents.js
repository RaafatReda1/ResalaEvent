import { useState, useEffect, useCallback, useMemo } from "react";
import supabase from "@/utils/supabaseClient";
import {
  createStudentAdmin,
  updateStudentAdmin,
  setStudentApprovalStatus,
  bulkSetApprovalStatus,
  deleteStudentAdmin,
  bulkDeleteStudentsAdmin,
} from "@/utils/adminStudentActions";
import { smartSearchMatch, smartPhoneMatch } from "@/utils/arabicSearch";
import { normalizeUniversityName } from "@/utils/dashboardActions";
import {
  fetchAdminWhatsAppTemplate,
  saveAdminWhatsAppTemplate,
  DEFAULT_WHATSAPP_TEMPLATE,
} from "@/utils/whatsAppTemplateManager";
import { logActivity, ACTION_TYPES, ACTION_CATEGORIES } from "@/utils/activityLogger";

export const useAdminStudents = () => {
  // Master in-memory cache of all students (never fetches cookie)
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // "all" | "approved" | "pending" | "rejected"
  const [university, setUniversity] = useState("all");
  const [place, setPlace] = useState("all");
  const [academicYear, setAcademicYear] = useState("all");
  const [dayFilter, setDayFilter] = useState("all"); // "all" | "today" | "yesterday" | "YYYY-MM-DD"
  const [certFilter, setCertFilter] = useState("all"); // "all" | "has_cert" | "no_cert"
  const [presetFilter, setPresetFilter] = useState("all"); // "all" | "pending" | "today" | "approved" | "rejected" | "has_cert" | "incomplete"

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  // Selection & Row Expansion
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // WhatsApp Template State & Modal
  const [whatsAppTemplate, setWhatsAppTemplate] = useState(DEFAULT_WHATSAPP_TEMPLATE);
  const [whatsAppNameOptions, setWhatsAppNameOptions] = useState({
    nameMode: "full",
    autoArabic: true,
  });
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Toast / notification feedback
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Load all students into local memory for instant lag-free operations
  const loadAllStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("students")
        .select(
          "id, name, phone, email, university, academicYear, place, imgSrc, isApproved, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllStudents(data || []);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError("حدث خطأ أثناء تحميل بيانات الطلاب. يرجى التحقق من الاتصال.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load WhatsApp Template from public.admins table
  useEffect(() => {
    loadAllStudents();
    fetchAdminWhatsAppTemplate().then((tpl) => {
      if (tpl) setWhatsAppTemplate(tpl);
    });
  }, [loadAllStudents]);

  // Extract dynamic unique lists for dropdown filters
  const uniqueUniversities = useMemo(() => {
    const set = new Set();
    allStudents.forEach((s) => {
      if (s.university && s.university.trim()) {
        set.add(normalizeUniversityName(s.university));
      }
    });
    return Array.from(set).sort();
  }, [allStudents]);

  const uniquePlaces = useMemo(() => {
    const set = new Set();
    allStudents.forEach((s) => {
      if (s.place && s.place.trim()) set.add(s.place.trim());
    });
    return Array.from(set).sort();
  }, [allStudents]);

  const uniqueAcademicYears = useMemo(() => {
    const set = new Set();
    allStudents.forEach((s) => {
      if (s.academicYear && s.academicYear.trim()) set.add(s.academicYear.trim());
    });
    return Array.from(set).sort();
  }, [allStudents]);

  // Extract dynamic unique registration days (earliest to latest + today)
  const uniqueRegistrationDays = useMemo(() => {
    const daySet = new Set();
    const todayStr = new Date().toISOString().split("T")[0];
    daySet.add(todayStr);

    allStudents.forEach((s) => {
      if (s.created_at) {
        const dayStr = s.created_at.split("T")[0];
        if (dayStr) daySet.add(dayStr);
      }
    });

    // Sort descending (latest first)
    const sorted = Array.from(daySet).sort((a, b) => (a < b ? 1 : -1));

    return sorted.map((dayStr) => {
      const d = new Date(dayStr + "T12:00:00");
      const label = d.toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return {
        date: dayStr,
        label,
      };
    });
  }, [allStudents]);

  // Preset Stats Counts (Computed instantly)
  const presetStats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    let total = allStudents.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let today = 0;
    let hasCert = 0;
    let incomplete = 0;

    allStudents.forEach((s) => {
      if (s.isApproved === true) approved++;
      else if (s.isApproved === false) rejected++;
      else pending++;

      if (s.created_at && s.created_at.startsWith(todayStr)) today++;
      if (s.imgSrc && s.imgSrc.trim()) hasCert++;

      const isComplete =
        s.name && s.phone && s.university && s.place && s.academicYear && s.imgSrc;
      if (!isComplete) incomplete++;
    });

    return { total, pending, approved, rejected, today, hasCert, incomplete };
  }, [allStudents]);

  // Filtered & Sorted Students (Computed instantly in memory)
  const filteredStudents = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    return allStudents.filter((s) => {
      // 1. Preset Filter
      if (presetFilter === "pending" && s.isApproved !== null) return false;
      if (presetFilter === "approved" && s.isApproved !== true) return false;
      if (presetFilter === "rejected" && s.isApproved !== false) return false;
      if (presetFilter === "today" && !s.created_at?.startsWith(todayStr)) return false;
      if (presetFilter === "has_cert" && (!s.imgSrc || !s.imgSrc.trim())) return false;
      if (presetFilter === "incomplete") {
        const isComplete =
          s.name && s.phone && s.university && s.place && s.academicYear && s.imgSrc;
        if (isComplete) return false;
      }

      // 2. Status Filter
      if (status === "approved" && s.isApproved !== true) return false;
      if (status === "pending" && s.isApproved !== null) return false;
      if (status === "rejected" && s.isApproved !== false) return false;

      // 3. University Filter
      if (university !== "all") {
        const normUni = normalizeUniversityName(s.university);
        if (normUni !== university) return false;
      }

      // 4. Place Filter
      if (place !== "all" && s.place?.trim() !== place) return false;

      // 5. Academic Year Filter
      if (academicYear !== "all" && s.academicYear?.trim() !== academicYear) return false;

      // 6. Day Filter
      if (dayFilter === "today" && !s.created_at?.startsWith(todayStr)) return false;
      if (dayFilter === "yesterday" && !s.created_at?.startsWith(yesterdayStr)) return false;
      if (dayFilter !== "all" && dayFilter !== "today" && dayFilter !== "yesterday") {
        if (!s.created_at?.startsWith(dayFilter)) return false;
      }

      // 7. Certificate Filter
      if (certFilter === "has_cert" && (!s.imgSrc || !s.imgSrc.trim())) return false;
      if (certFilter === "no_cert" && s.imgSrc && s.imgSrc.trim()) return false;

      // 8. Smart Arabic Search (Name, Email, Phone, University, Place)
      if (search && search.trim()) {
        const q = search.trim();
        const matchName = smartSearchMatch(s.name, q);
        const matchEmail = smartSearchMatch(s.email, q);
        const matchPhone = smartPhoneMatch(s.phone, q);
        const matchUni = smartSearchMatch(s.university, q);
        const matchPlace = smartSearchMatch(s.place, q);

        if (!matchName && !matchEmail && !matchPhone && !matchUni && !matchPlace) {
          return false;
        }
      }

      return true;
    });
  }, [
    allStudents,
    presetFilter,
    status,
    university,
    place,
    academicYear,
    dayFilter,
    certFilter,
    search,
  ]);

  // Sort filtered students
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "created_at") {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = String(valA || "").toLowerCase();
        valB = String(valB || "").toLowerCase();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortBy, sortAsc]);

  // Paginated Slice
  const totalCount = sortedStudents.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedStudents = useMemo(() => {
    const from = (page - 1) * pageSize;
    return sortedStudents.slice(from, from + pageSize);
  }, [sortedStudents, page, pageSize]);

  // Row expansion toggle
  const toggleRowExpansion = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  // Preset Card click handler
  const handleSelectPreset = (presetKey) => {
    setPresetFilter((prev) => (prev === presetKey ? "all" : presetKey));
    setPage(1);
  };

  // Reset page when filters change
  const handleSearchChange = (val) => { setSearch(val); setPage(1); };
  const handleStatusChange = (val) => { setStatus(val); setPage(1); };
  const handleUniversityChange = (val) => { setUniversity(val); setPage(1); };
  const handlePlaceChange = (val) => { setPlace(val); setPage(1); };
  const handleAcademicYearChange = (val) => { setAcademicYear(val); setPage(1); };
  const handleDayFilterChange = (val) => { setDayFilter(val); setPage(1); };
  const handleCertFilterChange = (val) => { setCertFilter(val); setPage(1); };

  const handleResetAllFilters = () => {
    setSearch("");
    setStatus("all");
    setUniversity("all");
    setPlace("all");
    setAcademicYear("all");
    setDayFilter("all");
    setCertFilter("all");
    setPresetFilter("all");
    setPage(1);
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedStudents.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ── Optimistic Actions with Supabase Sync ──
  const handleOpenCreate = () => {
    setEditingStudent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setIsFormModalOpen(true);
  };

  const handleOpenDetails = (student) => {
    setViewingStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDelete = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleOpenBulkDelete = () => {
    setStudentToDelete(null);
    setIsDeleteModalOpen(true);
  };

  // Save student (Create or Edit)
  const handleSaveStudent = async (formData) => {
    try {
      if (editingStudent?.id) {
        const updated = await updateStudentAdmin(editingStudent.id, formData);
        setAllStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? { ...s, ...updated } : s))
        );
        showToast("تم تحديث بيانات الطالب بنجاح! ✅");
        logActivity({
          action_type: ACTION_TYPES.EDIT_STUDENT,
          action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
          description: `قام بتحديث بيانات الطالب "${formData.name || formData.email}"`,
          target_id: editingStudent.id,
          target_name: formData.name || formData.email,
          metadata: { updatedFields: Object.keys(formData) },
        });
      } else {
        const created = await createStudentAdmin(formData);
        setAllStudents((prev) => [created, ...prev]);
        showToast("تمت إضافة الطالب الجديد بنجاح! 🎉");
        logActivity({
          action_type: ACTION_TYPES.CREATE_STUDENT,
          action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
          description: `قام بإضافة طالب جديد يدوياً: "${formData.name || formData.email}"`,
          target_id: created.id,
          target_name: formData.name || formData.email,
        });
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Save student error:", err);
      throw err;
    }
  };

  // Save customized WhatsApp template to public.admins table
  const handleSaveWhatsAppTemplate = async (newTemplate, options) => {
    setWhatsAppTemplate(newTemplate);
    if (options) setWhatsAppNameOptions(options);
    await saveAdminWhatsAppTemplate(newTemplate);
    showToast("تم حفظ قالب رسالة الواتساب بنجاح في جدول المشرفين! 💬");
    logActivity({
      action_type: ACTION_TYPES.UPDATE_WHATSAPP_TEMPLATE,
      action_category: ACTION_CATEGORIES.SETTINGS,
      description: "قام بتعديل وتحديث قالب رسائل الواتساب المحفوظ",
      metadata: { options },
    });
  };

  // Single Approval change (Optimistic UI)
  const handleSingleApproval = async (id, isApproved) => {
    const targetStudent = allStudents.find((s) => s.id === id);

    // 1. Instant local update
    setAllStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isApproved } : s))
    );
    if (viewingStudent?.id === id) {
      setViewingStudent((prev) => ({ ...prev, isApproved }));
    }

    showToast(
      isApproved
        ? "تم قبول الطالب بنجاح! ✅"
        : isApproved === false
        ? "تم رفض طلب الطالب ❌"
        : "تمت إعادة الطالب لقائمة الانتظار ⏳"
    );

    logActivity({
      action_type:
        isApproved === true
          ? ACTION_TYPES.APPROVE_STUDENT
          : isApproved === false
          ? ACTION_TYPES.REJECT_STUDENT
          : ACTION_TYPES.PENDING_STUDENT,
      action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
      description:
        isApproved === true
          ? `قام باعتماد وقبول الطالب "${targetStudent?.name || targetStudent?.email || id}"`
          : isApproved === false
          ? `قام برفض طلب الطالب "${targetStudent?.name || targetStudent?.email || id}"`
          : `قام بإعادة الطالب "${targetStudent?.name || targetStudent?.email || id}" للانتظار`,
      target_id: id,
      target_name: targetStudent?.name || targetStudent?.email || null,
      metadata: { status: isApproved },
    });

    // 2. Background Supabase update
    try {
      await setStudentApprovalStatus(id, isApproved);
    } catch (err) {
      console.error("Approval error:", err);
      showToast("تعذر حفظ الحالة في الخادم، جاري إعادة التحميل");
      loadAllStudents();
    }
  };

  // Bulk Approval change (Optimistic UI)
  const handleBulkApproval = async (isApproved) => {
    if (selectedIds.length === 0) return;
    const targetIds = [...selectedIds];

    setAllStudents((prev) =>
      prev.map((s) => (targetIds.includes(s.id) ? { ...s, isApproved } : s))
    );
    setSelectedIds([]);

    showToast(
      isApproved
        ? `تم قبول (${targetIds.length}) طلاب بنجاح! ✅`
        : `تم رفض (${targetIds.length}) طلاب ❌`
    );

    logActivity({
      action_type: ACTION_TYPES.BULK_APPROVAL,
      action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
      description: `قام بتحديث حالة اعتماد جماعية لعدد (${targetIds.length}) طالب إلى: ${
        isApproved === true ? "مقبول" : isApproved === false ? "مرفوض" : "في الانتظار"
      }`,
      metadata: { count: targetIds.length, targetIds, isApproved },
    });

    try {
      await bulkSetApprovalStatus(targetIds, isApproved);
    } catch (err) {
      console.error("Bulk approval error:", err);
      showToast("تعذر إتمام التحديث الجماعي");
      loadAllStudents();
    }
  };

  // Delete Confirm execution (Optimistic UI)
  const handleConfirmDelete = async () => {
    if (studentToDelete?.id) {
      const delId = studentToDelete.id;
      const delName = studentToDelete.name || studentToDelete.email;
      setAllStudents((prev) => prev.filter((s) => s.id !== delId));
      setIsDeleteModalOpen(false);
      showToast("تم حذف الطالب بنجاح! 🗑️");

      logActivity({
        action_type: ACTION_TYPES.DELETE_STUDENT,
        action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
        description: `قام بحذف بيانات الطالب "${delName}" نهائياً من قاعدة البيانات`,
        target_id: delId,
        target_name: delName,
      });

      try {
        await deleteStudentAdmin(delId);
      } catch (err) {
        console.error("Delete error:", err);
        showToast("تعذر حذف الطالب من الخادم");
        loadAllStudents();
      }
    } else if (selectedIds.length > 0) {
      const delIds = [...selectedIds];
      setAllStudents((prev) => prev.filter((s) => !delIds.includes(s.id)));
      setSelectedIds([]);
      setIsDeleteModalOpen(false);
      showToast(`تم حذف (${delIds.length}) طلاب بنجاح! 🗑️`);

      logActivity({
        action_type: ACTION_TYPES.BULK_DELETE,
        action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
        description: `قام بحذف (${delIds.length}) طلاب نهائياً من قاعدة البيانات`,
        metadata: { count: delIds.length, deletedIds: delIds },
      });

      try {
        await bulkDeleteStudentsAdmin(delIds);
      } catch (err) {
        console.error("Bulk delete error:", err);
        showToast("تعذر حذف الطلاب المحددين");
        loadAllStudents();
      }
    }
  };

  return {
    allStudents,
    students: paginatedStudents,
    filteredStudents,
    totalCount,
    totalPages,
    loading,
    error,
    toastMsg,
    search,
    status,
    university,
    place,
    academicYear,
    dayFilter,
    certFilter,
    presetFilter,
    presetStats,
    uniqueUniversities,
    uniquePlaces,
    uniqueAcademicYears,
    uniqueRegistrationDays,
    whatsAppTemplate,
    whatsAppNameOptions,
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    handleSaveWhatsAppTemplate,
    page,
    pageSize,
    sortBy,
    sortAsc,
    selectedIds,
    expandedRowId,
    isFormModalOpen,
    editingStudent,
    isDetailsModalOpen,
    viewingStudent,
    isDeleteModalOpen,
    studentToDelete,
    setPage,
    setPageSize,
    setSortBy,
    setSortAsc,
    toggleRowExpansion,
    handleSelectPreset,
    handleSearchChange,
    handleStatusChange,
    handleUniversityChange,
    handlePlaceChange,
    handleAcademicYearChange,
    handleDayFilterChange,
    handleCertFilterChange,
    handleResetAllFilters,
    toggleSelectAll,
    toggleSelectOne,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetails,
    handleOpenDelete,
    handleOpenBulkDelete,
    handleSaveStudent,
    handleSingleApproval,
    handleBulkApproval,
    handleConfirmDelete,
    setIsFormModalOpen,
    setIsDetailsModalOpen,
    setIsDeleteModalOpen,
    loadStudents: loadAllStudents,
  };
};
