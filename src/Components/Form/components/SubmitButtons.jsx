import { Loader2, Save, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import styles from "../Form.module.css";

const STAGE_MESSAGES = {
  uploading_image: "جاري رفع صورة بطاقة الترشيح...",
  saving_data: "جاري إرسال بيانات طلب الحضور...",
  completing: "جاري استكمال وحفظ الطلب...",
  updating: "جاري تحديث وتأكيد بياناتك...",
};

const SubmitButtons = ({ loading, loadingStage, isEditing, onCancelEdit, onTriggerUpdateConfirm }) => {
  const currentStageText =
    STAGE_MESSAGES[loadingStage] ||
    (isEditing ? "جاري حفظ التعديلات..." : "جاري إرسال طلب الحضور...");

  return (
    <div className="flex items-center gap-4 w-full flex-wrap">
      <button
        type={isEditing ? "button" : "submit"}
        onClick={isEditing && !loading ? onTriggerUpdateConfirm : undefined}
        disabled={loading}
        className={`${styles.submitBtn} flex-1`}
      >
        <div className={`${styles.submitBtnInner} ${loading ? styles.btnLoadingActive : ""}`}>
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 size={22} className="animate-spin text-teal-300" />
              <span className="text-sm font-bold tracking-wide animate-pulse">
                {currentStageText}
              </span>
            </div>
          ) : isEditing ? (
            <>
              <Save size={20} />
              <span>مراجعة وتأكيد التعديلات</span>
              <ArrowLeft size={18} />
            </>
          ) : (
            <>
              <span className={styles.btnDot} />
              <span>إرسال طلب تسجيل الحضور</span>
              <Sparkles size={20} />
            </>
          )}
          <div className={styles.btnShine} />
        </div>
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={onCancelEdit}
          disabled={loading}
          className={styles.cancelBtn}
        >
          إلغاء
        </button>
      )}
    </div>
  );
};

export default SubmitButtons;

