import React, { useState, useRef, useEffect } from "react";
import {
  X,
  MessageCircle,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Building2,
  MapPin,
  GraduationCap,
  Mail,
  Phone,
  Copy,
  CheckCheck,
  FileText,
  Shuffle,
  UserCheck,
  ShieldCheck,
  Sliders,
  Edit3,
} from "lucide-react";
import {
  DEFAULT_WHATSAPP_TEMPLATE,
  compileWhatsAppMessage,
} from "@/utils/whatsAppTemplateManager";
import styles from "../../AdminControls.module.css";

// Pre-made ready templates
const PRESET_TEMPLATES = [
  {
    id: "friendly",
    name: "رسالة ودية (موصى بها) 🌟",
    text: `مرحباً {firstName} 👋
يسعدنا إبلاغك بأنه قد تم *قبول طلب تسجيلك* في إيفنت رسالة الطبي بنجاح! 🎉

📍 *نقطة التجمع والباص:* {place}
🎓 *الجامعة:* {university}
📚 *الفرقة الدراسية:* {academicYear}

نتطلع لرؤيتك ونتمنى لك يوماً رائعاً ومميزاً معنا! ✨
_فريق تنظيم أطباء الخير - جمعية رسالة_`,
  },
  {
    id: "official",
    name: "رسالة رسمية كاملة 📜",
    text: `السيد/ة {fullName} المحترم/ة 🎓
تحية طيبة وبعد،

يسر إدارة تنظيم إيفنت أطباء الخير بجمعية رسالة إشعاركم بـ *الموافقة واعتماد تسجيلكم* رسمياً.

📌 *بيانات الحضور والتجمع:*
• المقر المعتمد: {place}
• الكلية / الجامعة: {university}
• الفرقة: {academicYear}

يرجى الالتزام بالحضور في الموعد المحدد.
_إدارة جمعية رسالة - النشاط الطبي_`,
  },
  {
    id: "short",
    name: "رسالة مختصرة وسريعة ⚡",
    text: `أهلاً {firstName} 🎉
تم قبولك رسمياً في إيفنت رسالة الطبي!
ميعادنا في نقطة التجمع: *{place}*.
بانتظارك إن شاء الله ✨`,
  },
];

const WhatsAppTemplateModal = ({
  isOpen = false,
  onClose,
  template = DEFAULT_WHATSAPP_TEMPLATE,
  onSaveTemplate,
  allStudents = [],
}) => {
  const [currentTemplate, setCurrentTemplate] = useState(template);
  const [nameMode, setNameMode] = useState("first"); // "first" | "full"
  const [autoArabic, setAutoArabic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);

  // Active student for preview testing
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    setCurrentTemplate(template || DEFAULT_WHATSAPP_TEMPLATE);
  }, [template, isOpen]);

  useEffect(() => {
    if (allStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(allStudents[0].id);
    }
  }, [allStudents, selectedStudentId]);

  if (!isOpen) return null;

  // Selected student object or fallback dummy
  const activeStudent =
    allStudents.find((s) => s.id === selectedStudentId) ||
    allStudents[0] || {
      name: "LOJAIN AHMED FARAHAT 949",
      phone: "01012345678",
      email: "lojain@example.com",
      university: "جامعة القاهرة",
      academicYear: "فرقة أولى",
      place: "مسرح رسالة بالمقطم (مكان الإيفنت)",
    };

  // Random student picker
  const handlePickRandomStudent = () => {
    if (!allStudents || allStudents.length === 0) return;
    const randIndex = Math.floor(Math.random() * allStudents.length);
    setSelectedStudentId(allStudents[randIndex].id);
  };

  const compiledRaw = compileWhatsAppMessage(currentTemplate, activeStudent, {
    nameMode,
    autoArabic,
  });

  // Check template integrity / health
  const validateTemplateHealth = () => {
    const hasUnclosedTag =
      (currentTemplate.match(/\{/g) || []).length !==
      (currentTemplate.match(/\}/g) || []).length;
    return !hasUnclosedTag;
  };

  const isHealthy = validateTemplateHealth();

  // Convert WhatsApp markdown (*bold*, _italic_) into HTML for authentic preview
  const renderWhatsAppHtml = (text) => {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace *bold* with <strong>
    html = html.replace(/\*([^\*]+)\*/g, "<strong>$1</strong>");
    // Replace _italic_ with <em>
    html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
    // Replace newlines with <br/>
    html = html.replace(/\n/g, "<br/>");

    return { __html: html };
  };

  // Insert tag at cursor position safely
  const handleInsertTag = (tag) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentTemplate;
    const newText = text.substring(0, start) + tag + text.substring(end);

    setCurrentTemplate(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(compiledRaw);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2000);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSaveTemplate(currentTemplate, { nameMode, autoArabic });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const availableVariables = [
    {
      tag: "{name}",
      label: "اسم الطالب",
      icon: <UserCheck size={14} />,
      desc: "حسب الإعداد المختار",
    },
    {
      tag: "{firstName}",
      label: "الاسم الأول فقط",
      icon: <Sparkles size={14} />,
      desc: "مثال: لوجين أو أحمد",
    },
    {
      tag: "{fullName}",
      label: "الاسم كاملاً",
      icon: <FileText size={14} />,
      desc: "كامل بدون أرقام",
    },
    {
      tag: "{place}",
      label: "نقطة التجمع / المقر",
      icon: <MapPin size={14} />,
      desc: "المسجل بالاستمارة",
    },
    {
      tag: "{university}",
      label: "الجامعة",
      icon: <Building2 size={14} />,
      desc: "جامعة الطالب",
    },
    {
      tag: "{academicYear}",
      label: "الفرقة الدراسية",
      icon: <GraduationCap size={14} />,
      desc: "السنة الدراسية",
    },
    {
      tag: "{phone}",
      label: "رقم الهاتف",
      icon: <Phone size={14} />,
      desc: "رقم الطالب",
    },
    {
      tag: "{email}",
      label: "البريد الإلكتروني",
      icon: <Mail size={14} />,
      desc: "إيميل الطالب",
    },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalCard}
        style={{
          maxWidth: "960px",
          padding: "24px 28px",
          background: "#ffffff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div
              className={styles.modalIconBox}
              style={{ background: "#dcfce7", color: "#15803d" }}
            >
              <MessageCircle size={22} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>
                تخصيص قالب رسالة القبول عبر واتساب
              </h2>
              <p className={styles.modalSubtitle}>
                تحكم كامل في نص الرسالة والمتغيرات التلقائية وفحص الرسالة على الطلاب المسجلين
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.closeModalBtn}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. Quick Ready Presets */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#f8fafc",
            padding: "10px 14px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 800,
              color: "#334155",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ⚡ قوالب جاهزة سريعة:
          </span>

          {PRESET_TEMPLATES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setCurrentTemplate(preset.text)}
              style={{
                padding: "6px 12px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "0.78rem",
                fontWeight: 800,
                color: "#0f766e",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title="تطبيق هذا القالب الجاهز"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* 3. Visual Variable Insertion Palette */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 800,
                color: "#0f766e",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Sparkles size={15} />
              <span>إدراج معلومات الطالب (انقر على أي معلومة لإضافتها مباشرة دون كتابة):</span>
            </span>

            {/* Template Health Status Badge */}
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "8px",
                background: isHealthy ? "#dcfce7" : "#fee2e2",
                color: isHealthy ? "#15803d" : "#b91c1c",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {isHealthy ? (
                <>
                  <ShieldCheck size={13} />
                  <span>القالب سليم 100%</span>
                </>
              ) : (
                <span>⚠️ يوجد خطأ في أقواس المتغيرات</span>
              )}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            {availableVariables.map((v) => (
              <button
                key={v.tag}
                type="button"
                onClick={() => handleInsertTag(v.tag)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: "#f0fdfa",
                  border: "1px solid #99f6e4",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "right",
                }}
                title={`إدراج ${v.tag} في موضع المؤشر`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#0d9488" }}>{v.icon}</span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: "#0f766e",
                    }}
                  >
                    {v.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#64748b",
                    background: "#ffffff",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    border: "1px solid #ccfbf1",
                  }}
                >
                  {v.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Main 2-Column Area: Editor on Right / Live WhatsApp on Left */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* Editor & Smart Settings */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.84rem",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                نص الرسالة:
              </span>
              <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                (استخدم *لتغميق النص* و _لجعله مائلاً_)
              </span>
            </div>

            <textarea
              ref={textareaRef}
              rows={11}
              className={styles.fieldInput}
              style={{
                fontFamily: "inherit",
                fontSize: "0.88rem",
                lineHeight: "1.65",
                minHeight: "220px",
                border: "1.5px solid #cbd5e1",
                background: "#ffffff",
              }}
              value={currentTemplate}
              onChange={(e) => setCurrentTemplate(e.target.value)}
              placeholder="اكتب نص رسالة الواتساب هنا..."
            />

            {/* Smart Processing Box */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Sliders size={14} className="text-teal-600" />
                <span>خيارات المعالجة الذكية للاسم:</span>
              </div>

              {/* Name Format Choice */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  صيغة الاسم في الرسالة:
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setNameMode("first")}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      border: "1px solid",
                      background: nameMode === "first" ? "#0d9488" : "#ffffff",
                      color: nameMode === "first" ? "#ffffff" : "#475569",
                      borderColor: nameMode === "first" ? "#0d9488" : "#cbd5e1",
                    }}
                  >
                    الاسم الأول فقط (أكثر ودية)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNameMode("full")}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      border: "1px solid",
                      background: nameMode === "full" ? "#0d9488" : "#ffffff",
                      color: nameMode === "full" ? "#ffffff" : "#475569",
                      borderColor: nameMode === "full" ? "#0d9488" : "#cbd5e1",
                    }}
                  >
                    الاسم كاملاً
                  </button>
                </div>
              </div>

              {/* Auto Arabic Conversion */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  paddingTop: "6px",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "#0d9488",
                    cursor: "pointer",
                  }}
                  checked={autoArabic}
                  onChange={(e) => setAutoArabic(e.target.checked)}
                />
                <span>
                  تعريب الأسماء المكتوبة بالإنجليزية تلقائياً (مثال: LOJAIN ← لوجين)
                </span>
              </label>
            </div>
          </div>

          {/* Authentic WhatsApp Chat Preview with Student Selector & Randomizer */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.84rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <MessageCircle size={15} className="text-emerald-600" />
                <span>معاينة حية للمحادثة على واتساب:</span>
              </span>

              <button
                type="button"
                onClick={handleCopyPreview}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                title="نسخ نص الرسالة"
              >
                {copiedPreview ? (
                  <>
                    <CheckCheck size={14} color="#0d9488" />
                    <span style={{ color: "#0d9488" }}>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>
            </div>

            {/* Student Picker & Randomizer Bar */}
            <div
              style={{
                background: "#f0fdfa",
                border: "1px solid #99f6e4",
                borderRadius: "12px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#0f766e",
                    whiteSpace: "nowrap",
                  }}
                >
                  فحص على الطالب:
                </span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    background: "#ffffff",
                    color: "#0f172a",
                    outline: "none",
                  }}
                >
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name || s.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Random Student Button */}
              <button
                type="button"
                onClick={handlePickRandomStudent}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "5px 10px",
                  background: "#ffffff",
                  border: "1px solid #0d9488",
                  color: "#0d9488",
                  borderRadius: "8px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
                title="اختيار طالب عشوائي من قاعدة البيانات لاختبار الرسالة"
              >
                <Shuffle size={12} />
                <span>🎲 طالب عشوائي</span>
              </button>
            </div>

            {/* Simulated WhatsApp Phone Frame */}
            <div
              style={{
                background: "#0b141a",
                borderRadius: "18px",
                overflow: "hidden",
                border: "1px solid #222e35",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              {/* WhatsApp App Bar */}
              <div
                style={{
                  background: "#202c33",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderBottom: "1px solid #2a3942",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#00a884",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                  }}
                >
                  ر
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "#e9edef",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                    }}
                  >
                    أطباء الخير - رسالة
                  </span>
                  <span style={{ color: "#8696a0", fontSize: "0.68rem" }}>
                    متصل الآن (Online)
                  </span>
                </div>
              </div>

              {/* Chat Message Bubble */}
              <div
                style={{
                  padding: "16px",
                  minHeight: "260px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  background:
                    "radial-gradient(circle, #111b21 0%, #0b141a 100%)",
                }}
              >
                <div
                  style={{
                    background: "#005c4b",
                    color: "#e9edef",
                    padding: "12px 16px",
                    borderRadius: "12px 0 12px 12px",
                    fontSize: "0.84rem",
                    lineHeight: "1.65",
                    maxWidth: "96%",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={renderWhatsAppHtml(compiledRaw)}
                  />
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "#8696a0",
                      textAlign: "left",
                      marginTop: "6px",
                      direction: "ltr",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>12:30 PM</span>
                    <span style={{ color: "#53bdeb" }}>✓✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Modal Footer Actions */}
        <div className={styles.modalFooterActions}>
          <button
            type="button"
            className={styles.clearFilterBtn}
            onClick={() => setCurrentTemplate(DEFAULT_WHATSAPP_TEMPLATE)}
            title="استعادة النص الافتراضي الأصلي"
          >
            <RotateCcw size={13} />
            <span>استعادة القالب الافتراضي</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
              disabled={isSaving}
            >
              إلغاء
            </button>

            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handleSave}
              disabled={isSaving}
              style={{
                background: savedSuccess ? "#16a34a" : "#0d9488",
                minWidth: "130px",
                justifyContent: "center",
              }}
            >
              {savedSuccess ? (
                <>
                  <Check size={16} />
                  <span>تم الحفظ بالسيرفر!</span>
                </>
              ) : isSaving ? (
                <span>جاري الحفظ...</span>
              ) : (
                <>
                  <Save size={16} />
                  <span>حفظ القالب</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTemplateModal;
