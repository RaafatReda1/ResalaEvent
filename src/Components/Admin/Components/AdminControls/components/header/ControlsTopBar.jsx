import React from "react";
import {
  Users,
  UserPlus,
  Download,
  FileText,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { exportStudentsToCSV } from "@/utils/adminStudentActions";
import { exportStudentsToPDF } from "@/utils/pdfExport";
import styles from "../../AdminControls.module.css";

const ControlsTopBar = ({
  onOpenCreate,
  onOpenWhatsAppSettings,
  onRefresh,
  loading = false,
  studentsToExport = [],
}) => {
  return (
    <div className={styles.headerRow}>
      <div className={styles.titleBlock}>
        <h1 className={styles.mainTitle}>
          <Users size={26} className="text-teal-600" />
          <span>إدارة وتأكيد الطلاب المسجلين</span>
        </h1>
        <p className={styles.subtitle}>
          مراجعة الشهادات، اعتماد الحضور، الفلترة الذكية، وتصدير التقارير المعتمدة
        </p>
      </div>

      <div className={styles.headerActions}>
        {/* WhatsApp Template Settings */}
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={onOpenWhatsAppSettings}
          title="تخصيص نص ورسالة الواتساب للقبول والتحكم في المتغيرات"
        >
          <MessageCircle size={16} className="text-emerald-600" />
          <span>إعدادات الواتساب 💬</span>
        </button>

        {/* PDF Export */}
        <button
          type="button"
          className={`${styles.btnSecondary} ${styles.btnPdf}`}
          onClick={() => exportStudentsToPDF(studentsToExport, "كشف الحضور المعتمد")}
          title="تصدير كشف منظم وقابل للطباعة كـ PDF"
          disabled={studentsToExport.length === 0}
        >
          <FileText size={16} />
          <span>تقرير PDF</span>
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
  );
};

export default ControlsTopBar;
