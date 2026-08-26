import React, { useState, useRef } from "react";
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Move,
  ExternalLink,
} from "lucide-react";
import styles from "../../AdminControls.module.css";

const CertificateViewer = ({ imgSrc }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Zoom & Rotation controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 4));
  const handleZoomOut = () =>
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.3, 0.6);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleResetImage = () => {
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoomLevel((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.6), 4);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className={styles.modalCertSection}>
      <div className={styles.modalCertHeader}>
        <div className={styles.modalCertTitle}>
          <FileText size={16} />
          <span>معاينة شهادة القيد / بطاقة الترشيح:</span>
          <span
            style={{
              fontSize: "0.72rem",
              color: "#64748b",
              fontWeight: 600,
              marginRight: "8px",
            }}
          >
            (اسحب الصورة للتحريك ✋ أو استخدم عجلة الماوس للتكبير)
          </span>
        </div>

        {imgSrc && (
          <div className={styles.modalToolbar}>
            <button
              type="button"
              onClick={handleZoomIn}
              className={styles.modalToolBtn}
              title="تكبير (+)"
            >
              <ZoomIn size={15} />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className={styles.modalToolBtn}
              title="تصغير (-)"
            >
              <ZoomOut size={15} />
            </button>
            <button
              type="button"
              onClick={handleRotate}
              className={styles.modalToolBtn}
              title="تدوير 90 درجة"
            >
              <RotateCw size={15} />
            </button>
            <button
              type="button"
              onClick={handleResetImage}
              className={styles.modalToolBtn}
              style={{ fontSize: "0.75rem", fontWeight: 700, gap: "4px" }}
              title="إعادة للوضع الافتراضي"
            >
              <RotateCcw size={13} />
              <span>إعادة ضبط</span>
            </button>
          </div>
        )}
      </div>

      {imgSrc ? (
        <div
          className={styles.modalCertViewer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
          }}
        >
          <img
            src={imgSrc}
            alt="شهادة الطالب"
            draggable={false}
            className={styles.modalCertImg}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
              transition: isDragging ? "none" : "transform 0.15s ease-out",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(0, 0, 0, 0.6)",
              color: "#ffffff",
              fontSize: "0.72rem",
              padding: "4px 8px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              pointerEvents: "none",
            }}
          >
            <Move size={12} />
            <span>{Math.round(zoomLevel * 100)}%</span>
          </div>

          <a
            href={imgSrc}
            target="_blank"
            rel="noreferrer"
            className={styles.modalCertFullLink}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={13} />
            <span>فتح بجودة أصلية</span>
          </a>
        </div>
      ) : (
        <div className={styles.noCertBox}>
          <FileText size={32} />
          <span>لم يتم إرفاق صورة شهادة أو كارنيه</span>
        </div>
      )}
    </div>
  );
};

export default CertificateViewer;
