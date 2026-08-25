import { ShieldCheck, LogIn, PlusCircle, Sparkles, UserCheck, AlertCircle } from "lucide-react";
import styles from "../Form.module.css";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const AnonSavedNotice = ({
  anonData,
  onSignIn,
  onStartNew,
  loadingAuth,
}) => {
  const registeredName = anonData?.name || "صديقنا العزيز";
  const registeredEmail = anonData?.email || "";

  return (
    <div className={styles.anonNoticeContainer}>
      {/* Top Badge */}
      <div className={styles.anonNoticeBadge}>
        <ShieldCheck size={16} className="text-teal-400" />
        <span>بيانات التسجيل محفوظة ومؤمنة</span>
      </div>

      {/* Main Notice Content */}
      <div className={styles.anonNoticeHeader}>
        <div className={styles.anonAvatarCircle}>
          <UserCheck size={28} className="text-teal-300" />
        </div>
        <h3 className={styles.anonNoticeTitle}>
          مرحباً بك، <span className="text-teal-300">{registeredName}</span>!
        </h3>
        <p className={styles.anonNoticeDesc}>
          تم استلام طلب تسجيلك مسبقاً من هذا الجهاز وهو محفوظ بأمان في قاعدة البيانات.
        </p>
      </div>

      {/* Info Card with Email reminder */}
      <div className={styles.anonEmailCard}>
        <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
          <Sparkles size={15} className="text-amber-400 shrink-0" />
          <span>
            لعرض بطاقة الحضور أو تعديل بياناتك ومكان الباص، يرجى تسجيل الدخول بنفس البريد الإلكتروني:
          </span>
        </div>
        {registeredEmail && (
          <div className={styles.anonEmailTag}>
            {registeredEmail}
          </div>
        )}
      </div>

      {/* Primary CTA: Google Sign In */}
      <div className={styles.anonActions}>
        <button
          type="button"
          onClick={onSignIn}
          disabled={loadingAuth}
          className={styles.anonGoogleBtn}
        >
          <div className={styles.googleIconCircle}>
            <GoogleIcon />
          </div>
          <span className="font-bold">
            {loadingAuth ? "جاري تسجيل الدخول..." : "تسجيل الدخول بـ Google لعرض أو تعديل البيانات"}
          </span>
          <LogIn size={18} className="mr-auto opacity-75" />
        </button>

        {/* Secondary CTA: Reset/Register someone else */}
        <button
          type="button"
          onClick={onStartNew}
          className={styles.anonNewRegBtn}
        >
          <PlusCircle size={15} className="text-slate-400" />
          <span>هل تريد تسجيل استمارة جديدة لشخص آخر؟ اضغط هنا</span>
        </button>
      </div>
    </div>
  );
};

export default AnonSavedNotice;
