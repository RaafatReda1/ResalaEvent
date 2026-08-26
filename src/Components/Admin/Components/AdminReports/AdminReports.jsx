import React from "react";
import { useAdminReports } from "./hooks/useAdminReports";
import ReportsTopBar from "./components/header/ReportsTopBar";
import ReportsPresetCards from "./components/header/ReportsPresetCards";
import ReportsFilterBar from "./components/header/ReportsFilterBar";
import LogsTable from "./components/table/LogsTable";
import Pagination from "../AdminControls/components/Pagination";
import PurgeLogsModal from "./components/modals/PurgeLogsModal";
import DeleteLogModal from "./components/modals/DeleteLogModal";
import LogDetailsModal from "./components/modals/LogDetailsModal";
import styles from "./AdminReports.module.css";

const AdminReports = () => {
  const {
    logs,
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
    dateFilter,
    presetFilter,
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
  } = useAdminReports();

  const hasActiveFilters =
    Boolean(search) ||
    roleFilter !== "all" ||
    categoryFilter !== "all" ||
    dateFilter !== "all" ||
    presetFilter !== "all";

  return (
    <div className={styles.reportsContainer}>
      {/* Toast feedback */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            background: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "0.9rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            zIndex: 10000,
            animation: "fadeIn 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* 1. Header & Top Bar with Sudo Admin Privileges */}
      <ReportsTopBar
        isSudoAdmin={isSudoAdmin}
        adminProfile={adminProfile}
        onRefresh={loadLogs}
        onExportCSV={handleExportCSV}
        onOpenPurge={() => setIsPurgeModalOpen(true)}
        loading={loading}
        totalCount={totalCount}
      />

      {/* 2. Quick Preset Stat Cards */}
      <ReportsPresetCards
        presetFilter={presetFilter}
        onSelectPreset={setPresetFilter}
        stats={stats}
      />

      {/* 3. Multi-Criteria Filter Bar */}
      <ReportsFilterBar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Error alert */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "14px 18px",
            borderRadius: "14px",
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}

      {/* 4. Logs Table with Expandable Drawer */}
      <LogsTable
        logs={logs}
        loading={loading}
        expandedLogId={expandedLogId}
        isSudoAdmin={isSudoAdmin}
        onToggleExpand={handleToggleExpand}
        onOpenDetails={handleOpenDetails}
        onOpenDelete={handleOpenDelete}
      />

      {/* 5. Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* 6. Sudo Purge Logs Modal */}
      <PurgeLogsModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirmPurge={handlePurgeLogs}
      />

      {/* 7. Sudo Delete Log Modal */}
      <DeleteLogModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        log={logToDelete}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* 8. Log Details Inspector Modal */}
      <LogDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        log={viewingLog}
      />
    </div>
  );
};

export default AdminReports;