import React from "react";
import { useAdminStudents } from "./hooks/useAdminStudents";
import ControlsHeader from "./components/ControlsHeader";
import StudentsTable from "./components/StudentsTable";
import Pagination from "./components/Pagination";
import StudentFormModal from "./components/StudentFormModal";
import StudentDetailsModal from "./components/StudentDetailsModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import styles from "./AdminControls.module.css";

const AdminControls = () => {
  const {
    students,
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
    loadStudents,
  } = useAdminStudents();

  const handleSortToggle = (col) => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(true);
    }
  };

  return (
    <div className={styles.controlsContainer}>
      {/* Toast Notification */}
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
            animation: "fadeInModal 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* Header, Preset Filter Cards & Comprehensive Search Bar */}
      <ControlsHeader
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        university={university}
        onUniversityChange={handleUniversityChange}
        uniqueUniversities={uniqueUniversities}
        place={place}
        onPlaceChange={handlePlaceChange}
        uniquePlaces={uniquePlaces}
        academicYear={academicYear}
        onAcademicYearChange={handleAcademicYearChange}
        uniqueAcademicYears={uniqueAcademicYears}
        dayFilter={dayFilter}
        onDayFilterChange={handleDayFilterChange}
        uniqueRegistrationDays={uniqueRegistrationDays}
        certFilter={certFilter}
        onCertFilterChange={handleCertFilterChange}
        presetFilter={presetFilter}
        onSelectPreset={handleSelectPreset}
        presetStats={presetStats}
        onResetFilters={handleResetAllFilters}
        onOpenCreate={handleOpenCreate}
        onRefresh={loadStudents}
        loading={loading}
        studentsToExport={filteredStudents}
      />

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl font-bold text-sm">
          {error}
        </div>
      )}

      {/* Students Table with Expandable Row Drawer & Certificate View */}
      <StudentsTable
        students={students}
        loading={loading}
        selectedIds={selectedIds}
        expandedRowId={expandedRowId}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectOne={toggleSelectOne}
        onToggleRowExpansion={toggleRowExpansion}
        onOpenDetails={handleOpenDetails}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={handleOpenDelete}
        onSingleApproval={handleSingleApproval}
        onBulkApproval={handleBulkApproval}
        onOpenBulkDelete={handleOpenBulkDelete}
        sortBy={sortBy}
        sortAsc={sortAsc}
        onSortChange={handleSortToggle}
      />

      {/* Pagination Controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* Create / Edit Modal */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        student={editingStudent}
        onSave={handleSaveStudent}
      />

      {/* View Details, High-Res Certificate & WhatsApp Modal */}
      <StudentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        student={viewingStudent}
        onApprovalChange={handleSingleApproval}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        student={studentToDelete}
        selectedCount={selectedIds.length}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminControls;