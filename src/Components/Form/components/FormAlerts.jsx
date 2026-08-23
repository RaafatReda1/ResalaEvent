import { AlertCircle, CheckCircle2 } from "lucide-react";
import styles from "../Form.module.css";

const FormAlerts = ({ errorMsg, successToast }) => {
  return (
    <>
      {errorMsg && (
        <div className={styles.errorMessage}>
          <AlertCircle size={20} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successToast && (
        <div className="bg-teal-500/20 border border-teal-400/40 text-teal-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shadow-lg mb-6">
          <CheckCircle2 size={20} className="text-teal-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
    </>
  );
};

export default FormAlerts;
