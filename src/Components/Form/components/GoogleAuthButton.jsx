import { LogOut, User, Sparkles } from "lucide-react";
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

const GoogleAuthButton = ({
  authUser,
  onSignIn,
  onSignOut,
  loadingAuth,
}) => {
  if (authUser) {
    const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture;
    const displayName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0];

    return (
      <div className={styles.authBannerLoggedIn}>
        <div className="flex items-center gap-3.5">
          <div className={styles.authAvatarWrap}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className={styles.authAvatarImg}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <User size={18} className="text-teal-300" />
            )}
            <span className={styles.authOnlineDot} />
          </div>

          <div className={styles.authUserInfo}>
            <span className={styles.authUserName}>
              {displayName}
            </span>
            <span className={styles.authUserEmail}>
              {authUser.email}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          disabled={loadingAuth}
          className={styles.authSignOutBtn}
          title="تسجيل الخروج من الحساب"
        >
          <LogOut size={13} />
          <span>تسجيل خروج</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.authBanner}>
      <button
        type="button"
        onClick={onSignIn}
        disabled={loadingAuth}
        className={styles.googleSignInBtn}
      >
        <div className={styles.googleIconCircle}>
          <GoogleIcon />
        </div>
        <div className="flex flex-col items-start text-right">
          <span className={styles.googleBtnText}>
            تسجيل الدخول باستخدام Google
          </span>
          <span className={styles.googleBtnSubtext}>
            لتحميل بيانات طلبك تلقائياً بحسابك
          </span>
        </div>
        <Sparkles size={16} className="text-amber-400 mr-auto opacity-75" />
      </button>
    </div>
  );
};

export default GoogleAuthButton;
