import React from "react";
import { RefreshCw, LayoutDashboard, AlertCircle } from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";
import KPIGrid from "./components/KPIGrid";
import RegistrationTrend from "./components/RegistrationTrend";
import ApprovalStatusChart from "./components/ApprovalStatusChart";
import UniversityChart from "./components/UniversityChart";
import AcademicYearChart from "./components/AcademicYearChart";
import PlaceChart from "./components/PlaceChart";
import PendingStudents from "./components/PendingStudents";
import RecentRegistrations from "./components/RecentRegistrations";
import ProfileCompletion from "./components/ProfileCompletion";
import ApprovalByUniversityTable from "./components/ApprovalByUniversityTable";
import LinkClicksChart from "./components/LinkClicksChart";
import BucketStorageWidget from "./components/BucketStorageWidget";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const {
    data,
    loading,
    errors,
    trendPeriod,
    setTrendPeriod,
    trendDate,
    setTrendDate,
    refresh,
    isRefreshing,
    isSudoAdmin,
  } = useDashboard();

  const hasAnyError = Object.values(errors).some(Boolean);

  return (
    <div className={styles.dashboardContainer}>
      {/* ── 1. Header (Title, Subtitle, Refresh Action) ── */}
      <div className={styles.dashHeader}>
        <div className={styles.dashTitleBlock}>
          <h1 className={styles.dashTitle}>
            <LayoutDashboard size={26} className="text-teal-600" />
            <span>لوحة التحكم والإحصائيات</span>
          </h1>
          <p className={styles.dashSubtitle}>
            نظرة شاملة ولحظية على استمارات تسجيل الطلاب ومعدلات القبول والتوزيع الجغرافي
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className={styles.refreshBtn}
            title="تحديث كافة بيانات الإحصائيات"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? styles.spinIcon : ""}
            />
            <span>{isRefreshing ? "جاري التحديث..." : "تحديث البيانات"}</span>
          </button>
        </div>
      </div>

      {/* ── Error Banner (if any fetch failed) ── */}
      {hasAnyError && (
        <div className={styles.errorCard}>
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="shrink-0" />
            <span>
              حدث خطأ أثناء تحميل بعض بيانات لوحة التحكم. يرجى التحقق من الاتصال والمحاولة مجدداً.
            </span>
          </div>
          <button onClick={refresh} className={styles.retryBtn}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* ── 2. Primary KPI Stat Cards (4 Cards) ── */}
      <KPIGrid kpiData={data.kpi} loading={loading.kpi} />

      {/* ── 3. Charts Row 1: Trend Line (2/3) + Donut Status (1/3) ── */}
      <div className={styles.twoColGrid}>
        <RegistrationTrend
          data={data.trend}
          period={trendPeriod}
          onPeriodChange={setTrendPeriod}
          trendDate={trendDate}
          onDateChange={setTrendDate}
          loading={loading.trend}
        />
        <ApprovalStatusChart
          kpiData={data.kpi}
          loading={loading.kpi}
        />
      </div>

      {/* ── 4. Charts Row 2: Universities + Academic Years + Places (3 Columns) ── */}
      <div className={styles.threeColGrid}>
        <UniversityChart
          data={data.universities}
          loading={loading.distributions}
        />
        <AcademicYearChart
          data={data.academicYears}
          loading={loading.distributions}
        />
        <PlaceChart
          data={data.places}
          totalStudents={data.kpi?.total || 0}
          loading={loading.distributions}
        />
      </div>

      {/* ── 5. Tables Row: Pending Approvals (Active Action) + Recent Registrations ── */}
      <div className={styles.equalTwoColGrid}>
        <PendingStudents
          students={data.pending}
          loading={loading.pending}
        />
        <RecentRegistrations
          students={data.recent}
          loading={loading.recent}
        />
      </div>

      {/* ── 6. Analytical Row: Profile Data Quality + University Acceptance Rates ── */}
      <div className={styles.equalTwoColGrid}>
        <ProfileCompletion
          completionData={data.completion}
          loading={loading.completion}
        />
        <ApprovalByUniversityTable
          data={data.approvalByUni}
          loading={loading.approvalByUni}
        />
      </div>

      {/* ── 7. Link Click Analytics & Storage Manager — Sudo Admin only ── */}
      {isSudoAdmin && (
        <>
          <LinkClicksChart
            data={data.linkClicks}
            loading={loading.linkClicks}
          />
          <BucketStorageWidget />
        </>
      )}
    </div>
  );
};

export default AdminDashboard;