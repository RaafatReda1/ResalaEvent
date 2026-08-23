import { Loader2, Save, Sparkles } from "lucide-react";
import styles from "../Form.module.css";

const SubmitButtons = ({ loading, isEditing, onCancelEdit }) => {
  return (
    <div className="flex items-center gap-4 w-full flex-wrap">
      <button
        type="submit"
        disabled={loading}
        className={`${styles.submitBtn} flex-1`}
      >
        <div className={styles.submitBtnInner}>
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>جاري معالجة وحفظ البيانات...</span>
            </>
          ) : isEditing ? (
            <>
              <Save size={20} />
              <span>حفظ التعديلات في تذكرتي</span>
            </>
          ) : (
            <>
              <span className={styles.btnDot} />
              <span>تأكيد تسجيل الحضور وحفظ التذكرة</span>
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
          className={styles.cancelBtn}
        >
          إلغاء التعديل
        </button>
      )}
    </div>
  );
};

export default SubmitButtons;
