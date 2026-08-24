import { useState } from "react";
import { UploadCloud, Image as ImageIcon, X, RefreshCw, ShieldCheck, ExternalLink } from "lucide-react";
import styles from "../Form.module.css";

const ImageUploadDropzone = ({
  file,
  filePreview,
  existingImgUrl,
  onFileChange,
  onRemoveFile,
  isEditing,
}) => {
  const [imgError, setImgError] = useState(false);

  // Determine effective current image URL from Supabase / filePreview
  const currentSupabaseImg =
    existingImgUrl ||
    (typeof filePreview === "string" && filePreview.trim().length > 0 ? filePreview : null);

  // isExistingImage = in edit mode, image exists on server and user hasn't chosen a replacement yet
  const isExistingImage = isEditing && Boolean(currentSupabaseImg) && !file;
  // isNewPick = user just picked a new file during edit (can still revert by removing)
  const isNewPick = isEditing && file;

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>
        <span className={styles.labelIcon}>
          <ImageIcon size={16} />
        </span>
        <span>صورة بطاقة الترشيح أو ما يثبت وجودك في الفرقة الأولى</span>
      </label>

      {/* ── EDIT MODE: existing server image from Supabase ── */}
      {isExistingImage && (
        <div className={styles.imgEditCard}>
          {/* Left: large preview */}
          <div className={styles.imgEditPreviewWrap}>
            {!imgError && currentSupabaseImg ? (
              <img
                src={currentSupabaseImg}
                alt="البطاقة الحالية"
                className={styles.imgEditThumb}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={styles.imgEditPlaceholder}>
                <ImageIcon size={32} className="text-teal-400 opacity-70" />
                <span className="text-[10px] text-slate-400 mt-1">البطاقة المرفوعة</span>
              </div>
            )}
            <div className={styles.imgEditBadge}>
              <ShieldCheck size={12} />
              <span>مرفوعة</span>
            </div>
          </div>

          {/* Right: info + action */}
          <div className={styles.imgEditInfo}>
            <div className="flex items-center justify-between gap-2">
              <p className={styles.imgEditTitle}>البطاقة المرفوعة مسبقاً</p>
              {currentSupabaseImg && currentSupabaseImg.startsWith("http") && (
                <a
                  href={currentSupabaseImg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewImgLink}
                  title="عرض الصورة بالحجم الكامل"
                >
                  <ExternalLink size={13} />
                  <span>معاينة</span>
                </a>
              )}
            </div>
            <p className={styles.imgEditNote}>
              يمكنك استبدال الصورة بصورة جديدة. لن يتم حذف الصورة الحالية تلقائياً حتى تختار بديلاً.
            </p>
            <label className={styles.replaceBtn}>
              <RefreshCw size={14} />
              <span>استبدال الصورة</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImgError(false);
                  onFileChange(e);
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
      )}

      {/* ── EDIT MODE: new file just picked — show preview with revert option ── */}
      {isNewPick && (
        <div className={styles.previewBox}>
          <img
            src={filePreview}
            alt="Preview"
            className={styles.previewThumb}
          />
          <div className={styles.previewInfo}>
            <span className={styles.previewName}>{file.name}</span>
            <span className={styles.previewSize}>
              {(file.size / (1024 * 1024)).toFixed(2)} MB — صورة جديدة
            </span>
          </div>
          {/* X here reverts to the original server image */}
          <button
            type="button"
            onClick={onRemoveFile}
            className={styles.removeImgBtn}
            title="إلغاء الاستبدال والعودة للصورة السابقة"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── FRESH UPLOAD (not editing, or editing with no existing image) ── */}
      {!isExistingImage && !isNewPick && (
        <>
          {filePreview ? (
            /* Preview of a freshly picked file */
            <div className={styles.previewBox}>
              <img
                src={filePreview}
                alt="Preview"
                className={styles.previewThumb}
              />
              <div className={styles.previewInfo}>
                <span className={styles.previewName}>
                  {file?.name || "البطاقة المرفوعة مسبقاً"}
                </span>
                <span className={styles.previewSize}>
                  {file
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    : "تم الرفع مسبقاً"}
                </span>
              </div>
              <button
                type="button"
                onClick={onRemoveFile}
                className={styles.removeImgBtn}
                title="حذف / تغيير الصورة"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            /* Empty dropzone */
            <div className={styles.fileDropzone}>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className={styles.fileInputHidden}
              />
              <div className={styles.uploadIconCircle}>
                <UploadCloud size={24} />
              </div>
              <div className={styles.uploadTitle}>
                اضغط لاختيار صورة أو اسحبها هنا
              </div>
              <div className={styles.uploadDesc}>
                صيغ الصور المدعومة: PNG, JPG, JPEG (بحد أقصى 5MB)
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUploadDropzone;


