import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  HardDrive,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Eye,
  X,
  FileImage,
  FolderSync,
  ShieldCheck,
  Search,
  Sparkles,
} from "lucide-react";
import {
  fetchBucketStorageStats,
  deleteSingleOrphanedImage,
  purgeOrphanedImages,
} from "@/utils/storageAnalytics";
import styles from "./BucketStorageWidget.module.css";

const BucketStorageWidget = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [error, setError] = useState(null);

  // Search filter for orphaned files list
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [previewImage, setPreviewImage] = useState(null);
  const [singleDeleteCandidate, setSingleDeleteCandidate] = useState(null);
  const [isBulkPurgeModalOpen, setIsBulkPurgeModalOpen] = useState(false);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Load storage stats
  const loadStats = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchBucketStorageStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load bucket storage stats:", err);
      setError("تعذر احتساب مساحة التخزين الخاصة بالـ Bucket حالياً.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadStats();
  };

  // Single file delete execution
  const executeSingleDelete = async () => {
    if (!singleDeleteCandidate) return;
    try {
      setIsPurging(true);
      await deleteSingleOrphanedImage(singleDeleteCandidate.path);
      showToast(`تم حذف الصورة "${singleDeleteCandidate.name}" بنجاح! 🗑️`);
      setSingleDeleteCandidate(null);
      // Reload stats
      await loadStats();
    } catch (err) {
      console.error("Error deleting image:", err);
      showToast("تعذر حذف الصورة من مساحة التخزين");
    } finally {
      setIsPurging(false);
    }
  };

  // Bulk purge execution
  const executeBulkPurge = async () => {
    if (!stats?.orphanedFiles || stats.orphanedFiles.length === 0) return;
    try {
      setIsPurging(true);
      const paths = stats.orphanedFiles.map((f) => f.path);
      const { deletedCount } = await purgeOrphanedImages(paths);
      showToast(`تم تنظيف (${deletedCount}) صورة غير مرتبطة وتوفير المساحة بنجاح! ✨`);
      setIsBulkPurgeModalOpen(false);
      // Reload stats
      await loadStats();
    } catch (err) {
      console.error("Error purging orphaned images:", err);
      showToast("حدث خطأ أثناء تنظيف الصور غير المرتبطة");
    } finally {
      setIsPurging(false);
    }
  };

  // Filtered orphaned files
  const filteredOrphanedFiles = useMemo(() => {
    if (!stats?.orphanedFiles) return [];
    if (!searchTerm.trim()) return stats.orphanedFiles;
    const term = searchTerm.trim().toLowerCase();
    return stats.orphanedFiles.filter(
      (f) =>
        f.name.toLowerCase().includes(term) ||
        f.path.toLowerCase().includes(term)
    );
  }, [stats?.orphanedFiles, searchTerm]);

  // Determine progress bar fill status
  const usagePercent = stats?.usagePercent || 0;
  let fillClass = styles.fillNormal;
  if (usagePercent > 90) fillClass = styles.fillDanger;
  else if (usagePercent > 70) fillClass = styles.fillWarning;

  if (loading && !stats) {
    return (
      <div className={styles.storageCard}>
        <div className="flex items-center gap-3 text-slate-500 py-6 justify-center">
          <RefreshCw size={22} className={styles.spin} />
          <span className="font-bold text-sm">
            جاري فحص ملفات الـ Bucket واحتساب إجمالي المساحة...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.storageCard}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 size={18} className="text-teal-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. Header Area ── */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <div className={styles.iconCircle}>
            <HardDrive size={24} />
          </div>
          <div className={styles.titleTextWrap}>
            <h2 className={styles.mainTitle}>
              <span>مساحة تخزين الصور والملفات (Bucket: studentImg)</span>
              <span className={styles.sudoBadge}>Sudo Admin Only</span>
            </h2>
            <p className={styles.subtitle}>
              مراقبة الحجم الإجمالي للصور على السيرفر، وتنظيف الصور والملفات المعلقة غير المرتبطة بأي طالب
            </p>
          </div>
        </div>

        <div className={styles.actionsGroup}>
          {stats?.orphanedCount > 0 && (
            <button
              type="button"
              className={styles.purgeAllBtn}
              onClick={() => setIsBulkPurgeModalOpen(true)}
              disabled={isPurging}
              title="تنظيف وحذف كافة الصور غير المرتبطة"
            >
              <Trash2 size={16} />
              <span>تنظيف الصور المعلقة ({stats.orphanedCount})</span>
            </button>
          )}

          <button
            type="button"
            className={styles.refreshBtn}
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="إعادة فحص واحتساب حجم الصور"
          >
            <RefreshCw
              size={15}
              className={isRefreshing ? styles.spin : ""}
            />
            <span>{isRefreshing ? "جاري الفحص..." : "تحديث المساحة"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── 2. Storage Progress Bar ── */}
      <div className={styles.progressSection}>
        <div className={styles.progressInfoRow}>
          <div className={styles.usageNumbers}>
            <span className={styles.currentUsage}>
              {stats?.formattedTotal || "0 ميجابايت"}
            </span>
            <span className={styles.limitTotal}>
              مستخدم من أصل {stats?.limitMB || 1024} ميجابايت (1 جيجابايت الحد الأقصى)
            </span>
          </div>

          <span className={styles.percentTag}>
            {stats?.usagePercent || 0}% مستهلك
          </span>
        </div>

        <div className={styles.progressBarTrack}>
          <div
            className={`${styles.progressBarFill} ${fillClass}`}
            style={{ width: `${Math.max(1, stats?.usagePercent || 0)}%` }}
          />
        </div>

        <div className={styles.progressLegendRow}>
          <span>المساحة المتبقية الحرة: {stats?.formattedRemaining || "0 ميجابايت"}</span>
          <span>الحد الأقصى للـ Bucket: 1,024 MB (1 GB)</span>
        </div>
      </div>

      {/* ── 3. Four Mini Metric Cards ── */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} bg-teal-50 text-teal-600`}>
            <HardDrive size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>إجمالي المساحة المستخدمة</span>
            <span className={styles.metricVal}>{stats?.totalMB || 0} MB</span>
            <span className={styles.metricSub}>{stats?.usagePercent}% من 1 GB</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} bg-blue-50 text-blue-600`}>
            <FileImage size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>إجمالي الصور والملفات</span>
            <span className={styles.metricVal}>{stats?.totalFiles || 0} صورة</span>
            <span className={styles.metricSub}>في مجلدات الـ Bucket</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} bg-emerald-50 text-emerald-600`}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>صور الطلاب المرتبطة</span>
            <span className={styles.metricVal}>{stats?.linkedCount || 0} صورة</span>
            <span className={styles.metricSub}>{stats?.linkedMB || 0} MB بيانات نشطة</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} bg-rose-50 text-rose-600`}>
            <Trash2 size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>صور معلقة غير مرتبطة</span>
            <span className={styles.metricVal}>{stats?.orphanedCount || 0} صورة</span>
            <span className={styles.metricSub}>تشغل {stats?.orphanedMB || 0} MB مساحة مهدرة</span>
          </div>
        </div>
      </div>

      {/* ── 4. Orphaned Images Gallery & Manager ── */}
      <div className={styles.orphanedHeaderRow}>
        <div className={styles.orphanedTitle}>
          <span>الصور المعلقة غير المرتبطة بقاعدة البيانات</span>
          <span className={styles.orphanedCountBadge}>
            {stats?.orphanedCount || 0} صورة
          </span>
        </div>

        {stats?.orphanedCount > 0 && (
          <div className="relative w-64">
            <input
              type="text"
              placeholder="بحث في الصور المعلقة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>
        )}
      </div>

      {stats?.orphanedCount === 0 ? (
        <div className={styles.cleanStateCard}>
          <div className={styles.cleanIconCircle}>
            <Sparkles size={22} />
          </div>
          <div>
            <div className={styles.cleanTextTitle}>
              مساحة التخزين نظيفة ومنظمة 100%! 🎉
            </div>
            <div className={styles.cleanTextSub}>
              جميع الصور الموجودة في الـ Bucket مرتبطة بحسابات واستمارات طلاب حقيقية، ولا توجد أي ملفات مهدرة.
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.orphanedGrid}>
          {filteredOrphanedFiles.map((file, idx) => (
            <div key={file.path || idx} className={styles.orphanCard}>
              <div
                className={styles.orphanImgThumbWrap}
                onClick={() => setPreviewImage(file)}
                title="اضغط للتكبير وعرض الصورة كاملة"
              >
                <img
                  src={file.publicUrl}
                  alt={file.name}
                  className={styles.orphanImgThumb}
                  loading="lazy"
                />
                <div className={styles.zoomOverlay}>
                  <Eye size={20} />
                </div>
              </div>

              <div className={styles.orphanCardBody}>
                <span className={styles.orphanFileName} title={file.path}>
                  {file.name}
                </span>

                <div className={styles.orphanMetaRow}>
                  <span className={styles.sizeBadge}>{file.formattedSize}</span>
                  <span>
                    {file.created_at
                      ? new Date(file.created_at).toLocaleDateString("ar-EG")
                      : "غير محدد"}
                  </span>
                </div>

                <button
                  type="button"
                  className={styles.orphanDeleteBtn}
                  onClick={() => setSingleDeleteCandidate(file)}
                  disabled={isPurging}
                >
                  <Trash2 size={14} />
                  <span>حذف الصورة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 5. Full Image Preview Modal ── */}
      {previewImage && (
        <div className={styles.modalBackdrop} onClick={() => setPreviewImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>معاينة الصورة</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setPreviewImage(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.previewImgWrap}>
              <img
                src={previewImage.publicUrl}
                alt={previewImage.name}
                className={styles.previewFullImg}
              />
            </div>

            <div className="text-xs text-slate-500 font-bold flex justify-between">
              <span>المسار: {previewImage.path}</span>
              <span>الحجم: {previewImage.formattedSize}</span>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={() => setPreviewImage(null)}
              >
                إغلاق
              </button>
              <button
                type="button"
                className={styles.btnDangerConfirm}
                onClick={() => {
                  const toDelete = previewImage;
                  setPreviewImage(null);
                  setSingleDeleteCandidate(toDelete);
                }}
              >
                <Trash2 size={16} />
                <span>حذف هذه الصورة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Single Delete Confirmation Modal ── */}
      {singleDeleteCandidate && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSingleDeleteCandidate(null)}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تأكيد حذف الصورة المعلقة</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSingleDeleteCandidate(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-sm text-slate-600 font-semibold leading-relaxed">
              هل أنت متأكد من حذف هذه الصورة نهائياً من الـ Bucket؟
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-3 text-xs font-mono direction-ltr text-right">
                <div>📁 <strong>الملف:</strong> {singleDeleteCandidate.name}</div>
                <div>💾 <strong>الحجم:</strong> {singleDeleteCandidate.formattedSize}</div>
                <div>🔗 <strong>المسار:</strong> {singleDeleteCandidate.path}</div>
              </div>
              <p className="text-xs text-red-600 font-bold mt-2">
                ⚠️ هذا الإجراء سيقوم بحذف الملف نهائياً ولن يمكن التراجع عنه.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={() => setSingleDeleteCandidate(null)}
                disabled={isPurging}
              >
                إلغاء
              </button>
              <button
                type="button"
                className={styles.btnDangerConfirm}
                onClick={executeSingleDelete}
                disabled={isPurging}
              >
                <Trash2 size={16} />
                <span>{isPurging ? "جاري الحذف..." : "نعم، احذف الصورة"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Bulk Purge Confirmation Modal ── */}
      {isBulkPurgeModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsBulkPurgeModalOpen(false)}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تنظيف كافة الصور غير المرتبطة (Bulk Purge)</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsBulkPurgeModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-sm text-slate-600 font-semibold leading-relaxed">
              بصفتك مسجلاً بصلاحية <strong className="text-purple-600">مسؤول رئيسي (Sudo Admin)</strong>، يمكنك تنظيف كافة الصور المعلقة التي لا تنتمي لأي طالب مسجل في قاعدة البيانات.
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 mt-3 text-sm text-rose-800 font-bold space-y-1">
                <div>🗑️ <strong>عدد الصور المراد حذفها:</strong> {stats?.orphanedCount} صورة</div>
                <div>💾 <strong>المساحة التي سيتم توفيرها:</strong> {stats?.formattedOrphaned || "0 MB"}</div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                ✅ لن تتأثر صور الطلاب المسجلين بالاستمارات نهائياً، وسيتم حذف الصور المهدرة فقط.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={() => setIsBulkPurgeModalOpen(false)}
                disabled={isPurging}
              >
                إلغاء
              </button>
              <button
                type="button"
                className={styles.btnDangerConfirm}
                onClick={executeBulkPurge}
                disabled={isPurging}
              >
                <Trash2 size={16} />
                <span>{isPurging ? "جاري التنظيف والحذف..." : "تأكيد تنظيف وحذف الكل"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BucketStorageWidget;
