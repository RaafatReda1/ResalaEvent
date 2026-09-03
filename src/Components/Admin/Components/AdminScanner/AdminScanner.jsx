import React, { useState, useEffect, useRef, useCallback } from "react";
import supabase from "@/utils/supabaseClient";
import { logActivity, ACTION_TYPES, ACTION_CATEGORIES } from "@/utils/activityLogger";
import ScannerCamera from "./components/ScannerCamera";
import StudentScanPreview from "./components/StudentScanPreview";
import ScannerStatsHeader from "./components/ScannerStatsHeader";
import RecentScansList from "./components/RecentScansList";
import StudentDetailsModal from "../AdminControls/components/StudentDetailsModal";
import AdminModal from "../Common/AdminModal";
import {
  playSuccessSound,
  playWarningSound,
  playErrorSound,
  triggerHaptic,
} from "./utils/scannerAudio";
import { extractStudentIdFromScan } from "./utils/scannerHelpers";
import styles from "./AdminScanner.module.css";

const AdminScanner = () => {
  // Current admin session
  const [adminName, setAdminName] = useState("المشرف");
  const [adminUserId, setAdminUserId] = useState(null);

  // Scanner States
  const [isPaused, setIsPaused] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [rawScannedCode, setRawScannedCode] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Stats Counters
  const [totalScannedCount, setTotalScannedCount] = useState(0);
  const [totalApprovedCount, setTotalApprovedCount] = useState(0);
  const [sessionScansCount, setSessionScansCount] = useState(0);
  const [duplicatesBlockedCount, setDuplicatesBlockedCount] = useState(0);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);

  // Session Recent Scans Feed
  const [recentScans, setRecentScans] = useState([]);

  // Full Details Modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);

  // Alert / Confirm Modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    confirmText: "تأكيد",
    cancelText: "إلغاء",
    onConfirm: null,
  });

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Scanner Settings (persisted in localStorage)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("admin_scanner_sound") !== "false";
  });
  const [autoCheckIn, setAutoCheckIn] = useState(() => {
    return localStorage.getItem("admin_scanner_autocheck") === "true";
  });
  const [autoNext, setAutoNext] = useState(() => {
    return localStorage.getItem("admin_scanner_autonext") === "true";
  });

  // Auto-next countdown timer
  const [autoNextCountdown, setAutoNextCountdown] = useState(0);
  const autoNextTimerRef = useRef(null);

  // 1. Fetch current logged-in admin identity
  useEffect(() => {
    const fetchAdminIdentity = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setAdminUserId(session.user.id);

          // Priority 1: admins table name
          const { data: adminRow } = await supabase
            .from("admins")
            .select("name")
            .eq("user_id", session.user.id)
            .maybeSingle();

          if (adminRow?.name) {
            setAdminName(adminRow.name);
            return;
          }

          // Priority 2: Google OAuth metadata fields
          const meta = session.user.user_metadata || {};
          const resolvedName =
            meta.full_name ||          // Google OAuth standard
            meta.name ||               // Generic OAuth
            meta.display_name ||       // Some providers
            meta.given_name ||         // First name only fallback
            (session.user.email        // Email prefix as last resort
              ? session.user.email.split("@")[0]
              : null);

          if (resolvedName) {
            setAdminName(resolvedName);
          }
        }
      } catch (e) {
        console.warn("Could not fetch admin identity:", e);
      }
    };
    fetchAdminIdentity();
  }, []);

  // 2. Fetch Aggregated Live Counts
  const fetchStats = useCallback(async () => {
    setIsRefreshingStats(true);
    try {
      const [scannedRes, approvedRes] = await Promise.all([
        supabase
          .from("students")
          .select("id", { count: "exact", head: true })
          .eq("hasScannedQr", true),
        supabase
          .from("students")
          .select("id", { count: "exact", head: true })
          .eq("isApproved", true),
      ]);

      if (!scannedRes.error && scannedRes.count !== null) {
        setTotalScannedCount(scannedRes.count);
      }
      if (!approvedRes.error && approvedRes.count !== null) {
        setTotalApprovedCount(approvedRes.count);
      }
    } catch (e) {
      console.warn("Stats fetch failed:", e);
    } finally {
      setIsRefreshingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Persist Settings
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("admin_scanner_sound", String(next));
      return next;
    });
  };

  const toggleAutoCheckIn = () => {
    setAutoCheckIn((prev) => {
      const next = !prev;
      localStorage.setItem("admin_scanner_autocheck", String(next));
      return next;
    });
  };

  const toggleAutoNext = () => {
    setAutoNext((prev) => {
      const next = !prev;
      localStorage.setItem("admin_scanner_autonext", String(next));
      return next;
    });
  };

  // 3. Process Code Lookup
  const processStudentLookup = async (identifier, rawText) => {
    if (!identifier) return;

    // Pause camera stream & show loading
    setIsPaused(true);
    setIsLoadingStudent(true);
    setIsNotFound(false);
    setActiveStudent(null);
    setRawScannedCode(rawText || identifier);

    try {
      let foundStudent = null;

      // Step A: Primary Lookup by exact UUID
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          identifier
        );
      if (isUuid) {
        const { data: byId } = await supabase
          .from("students")
          .select("*")
          .eq("id", identifier)
          .maybeSingle();
        if (byId) foundStudent = byId;
      }

      // Step B: Short 8-character ID matching (e.g. 9477FF3E from event pass card)
      if (!foundStudent) {
        const cleanShort = String(identifier).trim().replace(/^#/, "").trim();
        if (/^[0-9a-fA-F]{8}$/.test(cleanShort)) {
          const prefix = cleanShort.toLowerCase();
          const startUuid = `${prefix}-0000-0000-0000-000000000000`;
          const endUuid = `${prefix}-ffff-ffff-ffff-ffffffffffff`;
          const { data: byShortId } = await supabase
            .from("students")
            .select("*")
            .gte("id", startUuid)
            .lte("id", endUuid)
            .maybeSingle();
          if (byShortId) foundStudent = byShortId;
        }
      }

      // Step C: Fallback search by Phone, Email, or Name
      if (!foundStudent) {
        const cleanSearch = String(identifier).trim();
        const { data: byContact } = await supabase
          .from("students")
          .select("*")
          .or(`phone.eq.${cleanSearch},email.eq.${cleanSearch},name.ilike.%${cleanSearch}%`)
          .limit(1)
          .maybeSingle();

        if (byContact) {
          foundStudent = byContact;
        }
      }

      // If NOT FOUND
      if (!foundStudent) {
        setIsNotFound(true);
        if (soundEnabled) playErrorSound();
        triggerHaptic("error");

        // Record in session recent scans
        setRecentScans((prev) => [
          {
            id: identifier,
            student: null,
            rawCode: rawText || identifier,
            timestamp: new Date().toISOString(),
            type: "not_found",
          },
          ...prev.slice(0, 19),
        ]);
        setSessionScansCount((c) => c + 1);
        return;
      }

      // If FOUND
      setActiveStudent(foundStudent);
      setSessionScansCount((c) => c + 1);

      // Check for Duplicate / Prior Scan
      if (foundStudent.hasScannedQr) {
        setDuplicatesBlockedCount((c) => c + 1);
        if (soundEnabled) playWarningSound();
        triggerHaptic("warning");

        setRecentScans((prev) => [
          {
            id: `${foundStudent.id}_${Date.now()}`,
            student: foundStudent,
            rawCode: rawText || identifier,
            timestamp: new Date().toISOString(),
            type: "duplicate",
          },
          ...prev.filter((i) => i.student?.id !== foundStudent.id).slice(0, 19),
        ]);
      } else {
        // Valid First-Time Pass!
        if (soundEnabled) playSuccessSound();
        triggerHaptic("success");

        setRecentScans((prev) => [
          {
            id: `${foundStudent.id}_${Date.now()}`,
            student: foundStudent,
            rawCode: rawText || identifier,
            timestamp: new Date().toISOString(),
            type: "success",
          },
          ...prev.filter((i) => i.student?.id !== foundStudent.id).slice(0, 19),
        ]);

        // Auto Check-In Trigger if enabled
        if (autoCheckIn) {
          handleConfirmAttendance(foundStudent.id);
        }
      }

      // Start Auto-Next timer if enabled
      if (autoNext) {
        startAutoNextTimer();
      }
    } catch (err) {
      console.error("Scanner lookup error:", err);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "خطأ في البحث",
        message: "حدث خطأ أثناء البحث في قاعدة البيانات: " + err.message,
        onConfirm: null,
      });
    } finally {
      setIsLoadingStudent(false);
    }
  };

  // Start Auto-Next Countdown (3 seconds)
  const startAutoNextTimer = () => {
    if (autoNextTimerRef.current) clearInterval(autoNextTimerRef.current);
    setAutoNextCountdown(3);

    autoNextTimerRef.current = setInterval(() => {
      setAutoNextCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(autoNextTimerRef.current);
          handleScanNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop Auto-Next Countdown
  const stopAutoNextTimer = () => {
    if (autoNextTimerRef.current) {
      clearInterval(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
    setAutoNextCountdown(0);
  };

  // Camera Decoded Event Handler
  const handleScanSuccess = (decodedText) => {
    const studentId = extractStudentIdFromScan(decodedText);
    processStudentLookup(studentId, decodedText);
  };

  // Manual Search Handler
  const handleManualSearch = (inputText) => {
    processStudentLookup(inputText, inputText);
  };

  // 4. Action: Confirm Student Attendance
  const handleConfirmAttendance = async (studentId) => {
    stopAutoNextTimer();
    setIsProcessingAction(true);
    const nowIso = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from("students")
        .update({
          hasScannedQr: true,
          scannedAt: nowIso,
          adminScanner: adminName,
        })
        .eq("id", studentId)
        .select()
        .single();

      if (error) throw error;

      setActiveStudent((prev) => (prev ? { ...prev, ...data } : data));
      setTotalScannedCount((c) => c + 1);
      if (soundEnabled) playSuccessSound();
      triggerHaptic("success");

      // Update in recent scans list
      setRecentScans((prev) =>
        prev.map((item) =>
          item.student?.id === studentId
            ? { ...item, student: data, type: "success" }
            : item
        )
      );

      // Log in Activity log
      try {
        await logActivity(
          ACTION_TYPES.STUDENT_CHECKIN,
          ACTION_CATEGORIES.ATTENDANCE,
          `تم تسجيل حضور الطالب ${data.name || data.id} بواسطة ${adminName}`,
          {
            studentId: data.id,
            studentName: data.name,
            adminScanner: adminName,
            scannedAt: nowIso,
          },
          adminUserId
        );
      } catch {
        // ignore log error
      }
    } catch (err) {
      console.error("Failed to confirm student attendance:", err);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "خطأ في تسجيل الحضور",
        message: "حدث خطأ أثناء حفظ تسجيل الحضور: " + err.message,
        onConfirm: null,
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 5. Action: Reset / Undo Attendance
  const handleResetAttendance = async (studentId) => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "تأكيد إلغاء الحضور",
      message: "هل أنت متأكد من إلغاء تسجيل حضور هذا الطالب؟",
      confirmText: "نعم، إلغاء الحضور",
      cancelText: "تراجع",
      onConfirm: async () => {
        closeModal();
        setIsProcessingAction(true);
        try {
          const { data, error } = await supabase
            .from("students")
            .update({
              hasScannedQr: false,
              scannedAt: null,
              adminScanner: null,
            })
            .eq("id", studentId)
            .select()
            .single();

          if (error) throw error;

          setActiveStudent((prev) => (prev ? { ...prev, ...data } : data));
          setTotalScannedCount((c) => Math.max(0, c - 1));

          // Update in recent scans list
          setRecentScans((prev) =>
            prev.map((item) =>
              item.student?.id === studentId
                ? { ...item, student: data, type: "success" }
                : item
            )
          );
        } catch (err) {
          console.error("Failed to reset student attendance:", err);
          setModalConfig({
            isOpen: true,
            type: "error",
            title: "خطأ في إلغاء الحضور",
            message: "حدث خطأ أثناء إلغاء الحضور: " + err.message,
            onConfirm: null,
          });
        } finally {
          setIsProcessingAction(false);
        }
      },
    });
  };

  // 6. Action: Quick Toggle Approval (Approve student on the spot)
  const handleToggleApproval = async (studentId, isApprovedVal) => {
    setIsProcessingAction(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .update({ isApproved: isApprovedVal })
        .eq("id", studentId)
        .select()
        .single();

      if (error) throw error;
      setActiveStudent((prev) => (prev ? { ...prev, ...data } : data));
      setTotalApprovedCount((c) => (isApprovedVal ? c + 1 : Math.max(0, c - 1)));
    } catch (err) {
      console.error("Failed to update approval status:", err);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "خطأ في التحديث",
        message: "حدث خطأ أثناء تحديث حالة القبول: " + err.message,
        onConfirm: null,
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 7. Action: Open Full Student Record Modal
  const handleOpenFullRecord = (student) => {
    setModalStudent(student);
    setIsDetailsModalOpen(true);
  };

  // 8. Action: Next Scan / Resume Camera
  const handleScanNext = () => {
    stopAutoNextTimer();
    setActiveStudent(null);
    setRawScannedCode(null);
    setIsNotFound(false);
    setIsPaused(false);
  };

  // 9. Select a recent student from the history feed
  const handleSelectRecentStudent = (item) => {
    stopAutoNextTimer();
    if (item.student) {
      setActiveStudent(item.student);
      setRawScannedCode(item.rawCode || item.student.id);
      setIsNotFound(false);
      setIsPaused(true);
    } else {
      setActiveStudent(null);
      setRawScannedCode(item.rawCode);
      setIsNotFound(true);
      setIsPaused(true);
    }
  };

  return (
    <div className={styles.scannerLayout}>
      {/* ── Top Metric Stats & Controls Strip ── */}
      <ScannerStatsHeader
        totalScannedCount={totalScannedCount}
        totalApprovedCount={totalApprovedCount}
        sessionScansCount={sessionScansCount}
        duplicatesBlockedCount={duplicatesBlockedCount}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        autoCheckIn={autoCheckIn}
        onToggleAutoCheckIn={toggleAutoCheckIn}
        autoNext={autoNext}
        onToggleAutoNext={toggleAutoNext}
        onRefreshStats={fetchStats}
        isRefreshing={isRefreshingStats}
      />

      {/* ── Main Two-Column Workspace ── */}
      <div className={styles.mainWorkspace}>
        {/* Left Column: Camera Viewport + Search */}
        <div className={styles.cameraColumn}>
          <ScannerCamera
            onScanSuccess={handleScanSuccess}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused((prev) => !prev)}
            onManualSearch={handleManualSearch}
            isSearching={isLoadingStudent}
          />
        </div>

        {/* Right Column: Live Student Scan Preview + Session Feed */}
        <div className={styles.previewColumn}>
          {/* Active Student Card / Result Feedback */}
          <StudentScanPreview
            student={activeStudent}
            rawScannedCode={rawScannedCode}
            isNotFound={isNotFound}
            isLoading={isLoadingStudent}
            onConfirmAttendance={handleConfirmAttendance}
            onResetAttendance={handleResetAttendance}
            onToggleApproval={handleToggleApproval}
            onOpenFullRecord={handleOpenFullRecord}
            onScanNext={handleScanNext}
            autoNextActive={autoNext && Boolean(activeStudent)}
            autoNextSecondsRemaining={autoNextCountdown}
            isProcessingAction={isProcessingAction}
            adminName={adminName}
          />

          {/* Session History Feed */}
          <RecentScansList
            recentScans={recentScans}
            onSelectStudent={handleSelectRecentStudent}
            activeStudentId={activeStudent?.id}
          />
        </div>
      </div>

      {/* ── Full Student Details Modal (without leaving the scanner) ── */}
      {isDetailsModalOpen && (
        <StudentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          student={modalStudent}
          onApprovalChange={(studentId, newStatus) => {
            handleToggleApproval(studentId, newStatus);
            if (activeStudent?.id === studentId) {
              setActiveStudent((prev) =>
                prev ? { ...prev, isApproved: newStatus } : null
              );
            }
          }}
        />
      )}

      {/* ── Universal Admin Confirmation / Alert Modal ── */}
      <AdminModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
    </div>
  );
};

export default AdminScanner;
