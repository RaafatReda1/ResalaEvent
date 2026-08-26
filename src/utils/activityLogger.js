import supabase from "./supabaseClient";

/**
 * Activity Logging Constants
 */
export const ACTION_CATEGORIES = {
  AUTH: "AUTH",
  STUDENT_ACTION: "STUDENT_ACTION",
  ADMIN_OPERATION: "ADMIN_OPERATION",
  SETTINGS: "SETTINGS",
  LINK_CLICK: "LINK_CLICK",
};

export const ACTION_TYPES = {
  // Student Actions
  STUDENT_SIGN_IN: "STUDENT_SIGN_IN",
  STUDENT_SIGN_OUT: "STUDENT_SIGN_OUT",
  STUDENT_SUBMIT_FORM: "STUDENT_SUBMIT_FORM",
  STUDENT_UPDATE_FORM: "STUDENT_UPDATE_FORM",

  // Admin Actions
  ADMIN_LOGIN: "ADMIN_LOGIN",
  ADMIN_LOGOUT: "ADMIN_LOGOUT",
  APPROVE_STUDENT: "APPROVE_STUDENT",
  REJECT_STUDENT: "REJECT_STUDENT",
  PENDING_STUDENT: "PENDING_STUDENT",
  BULK_APPROVAL: "BULK_APPROVAL",
  CREATE_STUDENT: "CREATE_STUDENT",
  EDIT_STUDENT: "EDIT_STUDENT",
  DELETE_STUDENT: "DELETE_STUDENT",
  BULK_DELETE: "BULK_DELETE",
  WHATSAPP_MSG_CLICKED: "WHATSAPP_MSG_CLICKED",
  UPDATE_WHATSAPP_TEMPLATE: "UPDATE_WHATSAPP_TEMPLATE",
  EXPORT_PDF: "EXPORT_PDF",
  EXPORT_CSV: "EXPORT_CSV",
  PURGE_LOGS: "PURGE_LOGS",
  DELETE_LOG: "DELETE_LOG",

  // Public Link Tracking
  LINK_CLICK_FACEBOOK_PAGE: "LINK_CLICK_FACEBOOK_PAGE",
  LINK_CLICK_FACEBOOK_DEV:  "LINK_CLICK_FACEBOOK_DEV",
  LINK_CLICK_GOOGLE_MAPS:   "LINK_CLICK_GOOGLE_MAPS",
};

/**
 * Helper to get browser & platform info
 */
const getClientInfo = () => {
  if (typeof window === "undefined") return {};
  const ua = navigator.userAgent || "";
  let browser = "Unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  return {
    browser,
    platform: navigator.platform || "Unknown",
    screen: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language || "ar",
    url: window.location.pathname,
  };
};

/**
 * Get current authenticated user profile and check if admin / sudo
 */
let cachedAdminProfile = null;
let lastAdminCheck = 0;

export const getAdminProfile = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cachedAdminProfile && now - lastAdminCheck < 60000) {
    return cachedAdminProfile;
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      cachedAdminProfile = null;
      return null;
    }

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error || !data) {
      cachedAdminProfile = null;
      return null;
    }

    cachedAdminProfile = data;
    lastAdminCheck = now;
    return data;
  } catch (err) {
    console.error("Error checking admin profile:", err);
    return null;
  }
};

/**
 * Core activity logger function.
 * Inserts an activity log record into public.activity_logs safely.
 * Non-blocking / fire-and-forget.
 */
export const logActivity = async ({
  action_type,
  action_category = ACTION_CATEGORIES.ADMIN_OPERATION,
  description,
  target_id = null,
  target_name = null,
  metadata = {},
  actorOverride = null,
}) => {
  try {
    const clientInfo = getClientInfo();
    let actor_id = null;
    let actor_email = null;
    let actor_name = null;
    let actor_role = "student";

    if (actorOverride) {
      actor_id = actorOverride.id || null;
      actor_email = actorOverride.email || null;
      actor_name = actorOverride.name || null;
      actor_role = actorOverride.role || "student";
    } else {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        actor_id = session.user.id;
        actor_email = session.user.email;
        actor_name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          actor_email?.split("@")[0] ||
          "مستخدم";

        const admin = await getAdminProfile();
        if (admin) {
          actor_name = admin.name || actor_name;
          actor_role = admin.sudo ? "sudo_admin" : "admin";
        }
      }
    }

    const payload = {
      actor_id,
      actor_email,
      actor_name,
      actor_role,
      action_type,
      action_category,
      description: description || `${action_type} executed`,
      target_id: target_id ? Number(target_id) : null,
      target_name: target_name || null,
      metadata: {
        ...metadata,
        client: clientInfo,
        timestamp: new Date().toISOString(),
      },
    };

    const { error } = await supabase.from("activity_logs").insert(payload);
    if (error) {
      console.warn("Activity logger insert warning:", error.message);
    }
  } catch (err) {
    console.error("Activity logger error:", err);
  }
};

/**
 * Logs a public footer link click.
 * Works for anonymous visitors — no auth required.
 * If an admin is signed in, their name appears instead of "زائر غير معروف".
 *
 * @param {string} action_type - One of the LINK_CLICK_* ACTION_TYPES
 * @param {string} linkLabel   - Human-readable link label (shown in the log table)
 * @param {string} href        - The actual URL that was opened
 */
export const logLinkClick = async (action_type, linkLabel, href) => {
  try {
    const clientInfo = getClientInfo();

    let actor_id    = null;
    let actor_email = null;
    let actor_name  = "زائر غير معروف";
    let actor_role  = "anonymous";

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        actor_id    = session.user.id;
        actor_email = session.user.email;
        actor_name  =
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "مستخدم";
        actor_role  = "student";

        const admin = await getAdminProfile();
        if (admin) {
          actor_name = admin.name || actor_name;
          actor_role = admin.sudo ? "sudo_admin" : "admin";
        }
      }
    } catch { /* anonymous — perfectly fine */ }

    const payload = {
      actor_id,
      actor_email,
      actor_name,
      actor_role,
      action_type,
      action_category: ACTION_CATEGORIES.LINK_CLICK,
      description: `تم النقر على: ${linkLabel}`,
      target_id:   null,
      target_name: linkLabel,
      metadata: {
        href,
        client: clientInfo,
        timestamp: new Date().toISOString(),
      },
    };

    // Fire-and-forget — never blocks navigation
    console.log("[logLinkClick] inserting →", action_type, linkLabel);
    supabase.from("activity_logs").insert(payload).then(({ data, error }) => {
      if (error) {
        console.error("[logLinkClick] Supabase error:", error.message, error);
      } else {
        console.log("[logLinkClick] ✅ inserted successfully", data);
      }
    });
  } catch (err) {
    console.error("logLinkClick error:", err);
  }
};
