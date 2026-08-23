import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import styles from "../Form.module.css";

const ImageUploadDropzone = ({
  file,
  filePreview,
  onFileChange,
  onRemoveFile,
}) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>
        <span className={styles.labelIcon}>
          <ImageIcon size={16} />
        </span>
        <span>صورة بطاقه الترشيح او ما يثبت وجودك في الفرقه الاولي</span>
      </label>

      {filePreview ? (
        <div className={styles.previewBox}>
          <img
            src={filePreview}
            alt="Preview"
            className={styles.previewThumb}
          />
          <div className={styles.previewInfo}>
            <span className={styles.previewName}>
              {file?.name || "الصورة الشخصية الحالية"}
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
    </div>
  );
};

export default ImageUploadDropzone;
