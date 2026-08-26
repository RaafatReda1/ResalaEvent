import React from "react";
import ControlsTopBar from "./header/ControlsTopBar";
import PresetFilterCards from "./header/PresetFilterCards";
import FilterBar from "./header/FilterBar";

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
  uniqueRegistrationDays = [],
  certFilter,
  onCertFilterChange,
  presetFilter,
  onSelectPreset,
  presetStats = {},
  onResetFilters,
  onOpenCreate,
  onOpenWhatsAppSettings,
  onRefresh,
  loading,
  studentsToExport = [],
}) => {
  const hasActiveFilters =
    Boolean(search) ||
    status !== "all" ||
    university !== "all" ||
    place !== "all" ||
    academicYear !== "all" ||
    dayFilter !== "all" ||
    certFilter !== "all" ||
    presetFilter !== "all";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 1. Header Title & Export / Action Buttons */}
      <ControlsTopBar
        onOpenCreate={onOpenCreate}
        onOpenWhatsAppSettings={onOpenWhatsAppSettings}
        onRefresh={onRefresh}
        loading={loading}
        studentsToExport={studentsToExport}
      />

      {/* 2. Quick Preset Filter Cards with live counts */}
      <PresetFilterCards
        presetFilter={presetFilter}
        onSelectPreset={onSelectPreset}
        presetStats={presetStats}
      />

      {/* 3. Smart Search & Multi-Criteria Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={onSearchChange}
        status={status}
        onStatusChange={onStatusChange}
        university={university}
        onUniversityChange={onUniversityChange}
        uniqueUniversities={uniqueUniversities}
        place={place}
        onPlaceChange={onPlaceChange}
        uniquePlaces={uniquePlaces}
        academicYear={academicYear}
        onAcademicYearChange={onAcademicYearChange}
        uniqueAcademicYears={uniqueAcademicYears}
        dayFilter={dayFilter}
        onDayFilterChange={onDayFilterChange}
        uniqueRegistrationDays={uniqueRegistrationDays}
        certFilter={certFilter}
        onCertFilterChange={onCertFilterChange}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
      />
    </div>
  );
};

export default ControlsHeader;
