import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle, Save, RotateCcw, Check } from "lucide-react";
import {
  DEFAULT_WHATSAPP_TEMPLATE,
  compileWhatsAppMessage,
} from "@/utils/whatsAppTemplateManager";
import { pickRandomStudentId, copyToClipboard } from "./whatsapp/preview/chatPreviewActions";
import WhatsAppPresetBar from "./whatsapp/presets/WhatsAppPresetBar";
import WhatsAppVariablesPalette from "./whatsapp/palette/WhatsAppVariablesPalette";
import WhatsAppSmartSettings from "./whatsapp/settings/WhatsAppSmartSettings";
import WhatsAppChatPreview from "./whatsapp/preview/WhatsAppChatPreview";
import styles from "../../AdminControls.module.css";

const WhatsAppTemplateModal = ({
  isOpen = false,
  onClose,
  template = DEFAULT_WHATSAPP_TEMPLATE,
  onSaveTemplate,
  allStudents = [],
}) => {
  const [currentTemplate, setCurrentTemplate] = useState(template);
  const [nameMode, setNameMode] = useState("first");
  const [autoArabic, setAutoArabic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const textareaRef = useRef(null);

  // Body scroll lock while modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Sync template when prop changes or modal opens
  useEffect(() => {
    setCurrentTemplate(template || DEFAULT_WHATSAPP_TEMPLATE);
  }, [template, isOpen]);

  // Default to first student when list loads
  useEffect(() => {
    if (allStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(allStudents[0].id);
    }
  }, [allStudents, selectedStudentId]);

  if (!isOpen) return null;

  // Active student
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

  const compiledMessage = compileWhatsAppMessage(currentTemplate, activeStudent, {
    nameMode,
    autoArabic,
  });

  const isHealthy =
    (currentTemplate.match(/\{/g) || []).length ===
    (currentTemplate.match(/\}/g) || []).length;

  const handleInsertTag = (tag) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const newText = currentTemplate.slice(0, start) + tag + currentTemplate.slice(end);
    setCurrentTemplate(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const handleCopyPreview = async () => {
    const ok = await copyToClipboard(compiledMessage);
    if (ok) {
      setCopiedPreview(true);
      setTimeout(() => setCopiedPreview(false), 2000);
    }
  };

  const handlePickRandom = () => {
    const id = pickRandomStudentId(allStudents);
    if (id) setSelectedStudentId(id);
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

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalCard} ${styles.whatsappModalCard}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
          <button type="button" className={styles.closeModalBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className={styles.modalBody}>
          {/* 1. Quick preset templates */}
          <WhatsAppPresetBar onSelectPreset={setCurrentTemplate} />

          {/* 2. Variable insertion palette + health badge */}
          <WhatsAppVariablesPalette isHealthy={isHealthy} onInsertTag={handleInsertTag} />

          {/* 3. Two-column: editor + live preview (responsive) */}
          <div className={styles.whatsappModalGrid}>
            {/* Left: textarea + smart settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "#0f172a" }}>
                  نص الرسالة:
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                  (استخدم *لتغميق النص* و _لجعله مائلاً_)
                </span>
              </div>

              <textarea
                ref={textareaRef}
                rows={9}
                className={styles.fieldInput}
                style={{
                  fontFamily: "inherit",
                  fontSize: "0.88rem",
                  lineHeight: "1.65",
                  minHeight: "180px",
                  border: "1.5px solid #cbd5e1",
                  background: "#ffffff",
                }}
                value={currentTemplate}
                onChange={(e) => setCurrentTemplate(e.target.value)}
                placeholder="اكتب نص رسالة الواتساب هنا..."
              />

              <WhatsAppSmartSettings
                nameMode={nameMode}
                onNameModeChange={setNameMode}
                autoArabic={autoArabic}
                onAutoArabicChange={setAutoArabic}
              />
            </div>

            {/* Right: live WhatsApp chat preview */}
            <WhatsAppChatPreview
              compiledMessage={compiledMessage}
              allStudents={allStudents}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
              onPickRandomStudent={handlePickRandom}
              copied={copiedPreview}
              onCopyText={handleCopyPreview}
            />
          </div>
        </div>

        {/* Footer actions (Pinned bottom) */}
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
                <><Check size={16} /><span>تم الحفظ بالسيرفر!</span></>
              ) : isSaving ? (
                <span>جاري الحفظ...</span>
              ) : (
                <><Save size={16} /><span>حفظ القالب</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WhatsAppTemplateModal;
