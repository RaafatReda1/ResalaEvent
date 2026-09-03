import React, { useState, useEffect, useRef, useCallback } from "react";
import supabase from "@/utils/supabaseClient";
import { logActivity, ACTION_TYPES, ACTION_CATEGORIES } from "@/utils/activityLogger";
import ScannerCamera from "./components/ScannerCamera";
import StudentScanPreview from "./components/StudentScanPreview";
import ScannerStatsHeader from "./components/ScannerStatsHeader";
import RecentScansList from "./components/RecentScansList";
import StudentDetailsModal from "../AdminControls/components/StudentDetailsModal";
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
    const fetchAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      setAdminUserId(session.user.id);

      const { data: adminRecord } = await supabase
        .from("admins")
        .select("name")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const name =
        adminRecord?.name || session.user.user_metadata?.name || "المشرف";
      setAdminName(name);
    };

    fetchAdmin();
  }, []);

  // 2. Fetch Aggregated Attendance Stats from Supabase
  const loadStats = useCallback(async () => {
    setIsRefreshingStats(true);
    try {
      // Count scanned attendees
      const { count: scannedCount } = await supabase
        .from("students")
        .select("id", { count: "exact", head: true })
        .eq("hasScannedQr", true);

      // Count approved students
      const { count: approvedCount } = await supabase
        .from("students")
        .select("id", { count: "exact", head: true })
        .eq("isApproved", true);

      setTotalScannedCount(scannedCount || 0);
      setTotalApprovedCount(approvedCount || 0);
    } catch (err) {
      console.error("Failed to load scanner stats:", err);
    } finally {
      setIsRefreshingStats(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Persist settings to localStorage
  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("admin_scanner_sound", String(next));
      return next;
    });
  };

  const handleToggleAutoCheckIn = () => {
    setAutoCheckIn((prev) => {
      const next = !prev;
      localStorage.setItem("admin_scanner_autocheck", String(next));
      return next;
    });
  };

  const handleToggleAutoNext = () => {
    setAutoNext((prev) => {
      const next = !prev;
      localStorage.setItem("admin_scanner_autonext", String(next));
      return next;
    });
  };

  // Clear any existing auto-next timer
  const clearAutoNextTimer = useCallback(() => {
    if (autoNextTimerRef.current) {
      clearInterval(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
    setAutoNextCountdown(0);
  }, []);

  // Resume camera & ready for next scan
  const handleScanNext = useCallback(() => {
    clearAutoNextTimer();
    setActiveStudent(null);
    setIsNotFound(false);
    setRawScannedCode(null);
    setIsPaused(false);
  }, [clearAutoNextTimer]);

  // Start 3-second countdown for auto next
  const triggerAutoNextCountdown = useCallback(() => {
    clearAutoNextTimer();
    let secondsLeft = 3;
    setAutoNextCountdown(secondsLeft);

    autoNextTimerRef.current = setInterval(() => {
      secondsLeft -= 1;
      setAutoNextCountdown(secondsLeft);

      if (secondsLeft <= 0) {
        clearAutoNextTimer();
        handleScanNext();
      }
    }, 1000);
  }, [clearAutoNextTimer, handleScanNext]);

  // 3. Main QR Code Scan Processor
  const processStudentLookup = async (identifier, rawText) => {
    clearAutoNextTimer();
    setIsPaused(true);
    setIsLoadingStudent(true);
    setIsNotFound(false);
    setActiveStudent(null);
    setRawScannedCode(rawText || identifier);

    try {
      let foundStudent = null;

      // Step A: Primary Lookup by UUID primary key
      const { data: byId } = await supabase
        .from("students")
        .select("*")
        .eq("id", identifier)
        .maybeSingle();

      if (byId) {
        foundStudent = byId;
      } else {
        // Step B: Fallback search by Phone or Email
        const { data: byContact } = await supabase
          .from("students")
          .select("*")
          .or(`phone.eq.${identifier},email.eq.${identifier}`)
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

      // Student FOUND
      setActiveStudent(foundStudent);
      setSessionScansCount((c) => c + 1);

      const alreadyScanned = Boolean(foundStudent.hasScannedQr);

      if (alreadyScanned) {
        // Duplicate scan alert
        if (soundEnabled) playWarningSound();
        triggerHaptic("warning");
        setDuplicatesBlockedCount((c) => c + 1);

        setRecentScans((prev) => [
          {
            id: foundStudent.id,
            student: foundStudent,
            rawCode: rawText || identifier,
            timestamp: new Date().toISOString(),
            type: "duplicate",
          },
          ...prev.slice(0, 19),
        ]);
      } else {
        // First-time valid scan
        if (soundEnabled) playSuccessSound();
        triggerHaptic("success");

        // If autoCheckIn is enabled, automatically mark attendance in DB
        if (autoCheckIn) {
          await handleConfirmAttendance(foundStudent.id, foundStudent);
        } else {
          setRecentScans((prev) => [
            {
              id: foundStudent.id,
              student: foundStudent,
              rawCode: rawText || identifier,
              timestamp: new Date().toISOString(),
              type: "success",
            },
            ...prev.slice(0, 19),
          ]);
        }
      }

      // If auto-next mode is active, start the countdown
      if (autoNext) {
        triggerAutoNextCountdown();
      }
    } catch (err) {
      console.error("Student scan lookup error:", err);
      setIsNotFound(true);
    } finally {
      setIsLoadingStudent(false);
    }
  };

  const handleScanSuccess = (decodedText) => {
    const studentId = extractStudentIdFromScan(decodedText);
    processStudentLookup(studentId, decodedText);
  };

  const handleManualSearch = (inputText) => {
    processStudentLookup(inputText.trim(), inputText.trim());
  };

  // 4. Action: Confirm Attendance (Check-in)
  const handleConfirmAttendance = async (studentId, currentStudentObj) => {
    setIsProcessingAction(true);
    const nowIso = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from("students")
        .update({
          hasScannedQr: true,
          scannedAt: nowIso,
          adminScanner: adminName || "مشرف النظام",
        })
        .eq("id", studentId)
        .select()
        .single();

      if (error) throw error;

      // Update active student in state
      setActiveStudent((prev) => (prev ? { ...prev, ...data } : data));
      setTotalScannedCount((c) => c + 1);

      // Update in recent scans list
      setRecentScans((prev) => {
        const targetStudent = data || currentStudentObj;
        const exists = prev.find((item) => item.student?.id === studentId);
        if (exists) {
          return prev.map((item) =>
            item.student?.id === studentId
              ? { ...item, student: targetStudent, type: "success" }
              : item
          );
        }
        return [
          {
            id: studentId,
            student: targetStudent,
            rawCode: studentId,
            timestamp: nowIso,
            type: "success",
          },
          ...prev.slice(0, 19),
        ];
      });

      // Log action in activity logger
      try {
        await logActivity(
          "SCAN_STUDENT_ATTENDANCE",
          ACTION_CATEGORIES.ADMIN_OPERATION,
          {
            studentId,
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
      alert("حدث خطأ أثناء حفظ تسجيل الحضور: " + err.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 5. Action: Reset / Undo Attendance
  const handleResetAttendance = async (studentId) => {
    if (!window.confirm("هل أنت متأكد من إلغاء تسجيل حضور هذا الطالب؟")) {
      return;
    }

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
      alert("حدث خطأ أثناء إلغاء الحضور: " + err.message);
    } finally {
      setIsProcessingAction(false);
    }
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
      alert("حدث خطأ أثناء تحديث حالة القبول: " + err.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 7. Action: Open Full Student Record Modal
  const handleOpenFullRecord = (student) => {
    setModalStudent(student);
    setIsDetailsModalOpen(true);
  };

  // Selecting a student from the recent scans feed
  const handleSelectRecentStudent = (student) => {
    clearAutoNextTimer();
    setIsPaused(true);
    setActiveStudent(student);
    setIsNotFound(false);
    setRawScannedCode(student.id);
  };

  return (
    <div className={styles.scannerLayout}>
      {/* ── Top Bar: KPIs, Toggles, and Settings ── */}
      <ScannerStatsHeader
        totalScannedCount={totalScannedCount}
        totalApprovedCount={totalApprovedCount}
        sessionScansCount={sessionScansCount}
        duplicatesBlockedCount={duplicatesBlockedCount}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        autoCheckIn={autoCheckIn}
        onToggleAutoCheckIn={handleToggleAutoCheckIn}
        autoNext={autoNext}
        onToggleAutoNext={handleToggleAutoNext}
        onRefreshStats={loadStats}
        isRefreshing={isRefreshingStats}
      />

      {/* ── Main Scanner Workspace: Camera + Verification Card ── */}
      <div className={styles.mainWorkspace}>
        {/* Left Column (Camera + Viewfinder + Manual Input) */}
        <div className={styles.cameraColumn}>
          <ScannerCamera
            onScanSuccess={handleScanSuccess}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused((prev) => !prev)}
            onManualSearch={handleManualSearch}
            isSearching={isLoadingStudent}
            soundEnabled={soundEnabled}
          />
        </div>

        {/* Right Column (Student Verification Preview + Session History) */}
        <div className={styles.previewColumn}>
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
    </div>
  );
};

export default AdminScanner;
