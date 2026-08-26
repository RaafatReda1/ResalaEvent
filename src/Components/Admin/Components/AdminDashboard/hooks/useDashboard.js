import { useState, useEffect, useCallback } from "react";
import {
  fetchKPIStats,
  fetchRegistrationTrend,
  fetchUniversityDistribution,
  fetchAcademicYearDistribution,
  fetchPlaceDistribution,
  fetchPendingStudents,
  fetchRecentStudents,
  fetchProfileCompletion,
  fetchApprovalByUniversity,
  fetchLinkClickStats,
} from "@/utils/dashboardActions";
import { getAdminProfile } from "@/utils/activityLogger";

const makeLoading = (val = true) => ({
  kpi: val, trend: val, distributions: val,
  pending: val, recent: val, completion: val, approvalByUni: val, linkClicks: val,
});

export const useDashboard = () => {
  const [kpi,           setKpi]           = useState(null);
  const [trend,         setTrend]         = useState([]);
  const [universities,  setUniversities]  = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [places,        setPlaces]        = useState([]);
  const [pending,       setPending]       = useState([]);
  const [recent,        setRecent]        = useState([]);
  const [completion,    setCompletion]    = useState(null);
  const [approvalByUni, setApprovalByUni] = useState([]);
  const [linkClicks,    setLinkClicks]    = useState([]);
  const [loading,       setLoading]       = useState(makeLoading());
  const [errors,        setErrors]        = useState({});
  const [trendPeriod,   setTrendPeriod]   = useState("30d");
  const [trendDate,     setTrendDate]     = useState(
    new Date().toISOString().split("T")[0]
  );
  const [refreshSeed,   setRefreshSeed]   = useState(0);
  const [isRefreshing,  setIsRefreshing]  = useState(false);
  const [isSudoAdmin,   setIsSudoAdmin]   = useState(false);

  // Check sudo privilege once on mount
  useEffect(() => {
    getAdminProfile(true).then((profile) => {
      setIsSudoAdmin(Boolean(profile?.sudo));
    });
  }, []);

  const setL = (key, v) => setLoading((p) => ({ ...p, [key]: v }));
  const setE = (key, err) =>
    setErrors((p) => ({ ...p, [key]: err?.message || "خطأ في تحميل البيانات" }));
  const clearE = (key) => setErrors((p) => ({ ...p, [key]: null }));

  // Re-fetch trend whenever period or selected date changes
  useEffect(() => {
    setL("trend", true);
    clearE("trend");
    fetchRegistrationTrend(trendPeriod, trendDate)
      .then(setTrend)
      .catch((e) => setE("trend", e))
      .finally(() => setL("trend", false));
  }, [trendPeriod, trendDate]);

  const fetchAll = useCallback(async () => {
    setIsRefreshing(true);
    setLoading(makeLoading());

    await Promise.allSettled([
      fetchKPIStats()
        .then(setKpi)
        .catch((e) => setE("kpi", e))
        .finally(() => setL("kpi", false)),

      fetchRegistrationTrend(trendPeriod, trendDate)
        .then(setTrend)
        .catch((e) => setE("trend", e))
        .finally(() => setL("trend", false)),

      Promise.all([
        fetchUniversityDistribution(),
        fetchAcademicYearDistribution(),
        fetchPlaceDistribution(),
      ])
        .then(([u, a, p]) => { setUniversities(u); setAcademicYears(a); setPlaces(p); })
        .catch((e) => setE("distributions", e))
        .finally(() => setL("distributions", false)),

      fetchPendingStudents(8)
        .then(setPending)
        .catch((e) => setE("pending", e))
        .finally(() => setL("pending", false)),

      fetchRecentStudents(10)
        .then(setRecent)
        .catch((e) => setE("recent", e))
        .finally(() => setL("recent", false)),

      fetchProfileCompletion()
        .then(setCompletion)
        .catch((e) => setE("completion", e))
        .finally(() => setL("completion", false)),

      fetchApprovalByUniversity()
        .then(setApprovalByUni)
        .catch((e) => setE("approvalByUni", e))
        .finally(() => setL("approvalByUni", false)),

      fetchLinkClickStats()
        .then(setLinkClicks)
        .catch((e) => setE("linkClicks", e))
        .finally(() => setL("linkClicks", false)),
    ]);

    setIsRefreshing(false);
  }, [refreshSeed, trendPeriod, trendDate]); // eslint-disable-line

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const refresh = () => setRefreshSeed((k) => k + 1);

  return {
    data: { kpi, trend, universities, academicYears, places, pending, recent, completion, approvalByUni, linkClicks },
    loading,
    errors,
    trendPeriod,
    setTrendPeriod,
    trendDate,
    setTrendDate,
    refresh,
    isRefreshing,
    isSudoAdmin,
  };
};
