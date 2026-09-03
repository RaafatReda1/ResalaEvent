import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  Flashlight,
  FlashlightOff,
  SwitchCamera,
  Pause,
  Play,
  RefreshCw,
  Upload,
  Monitor,
  Smartphone,
} from "lucide-react";
import { decodeQrFromImageFile } from "../utils/imageQrScanner";
import ScannerSearch from "./ScannerSearch";
import AdminModal from "../../Common/AdminModal";
import styles from "./ScannerCamera.module.css";

const READER_ID = "admin-qr-reader-viewport";

const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || ""
  );
};

const isAppleDevice = () => {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent || "");
};

const ScannerCamera = ({
  onScanSuccess,
  isPaused,
  onTogglePause,
  onManualSearch,
  isSearching,
}) => {
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMobile = isMobileDevice();
  const isIOS = isAppleDevice();

  const [cameras, setCameras] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isStarting, setIsStarting] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Keep track of active scan lock to avoid duplicate triggering within 1.2s
  const lastScanTimeRef = useRef(0);
  const isOperatingRef = useRef(false);

  // QR config: scan whole frame on mobile/iPhone for maximum recognition sensitivity
  const getQrConfig = () => ({
    fps: 20,
    aspectRatio: 1.0,
    disableFlip: false,
    qrbox: (viewfinderWidth, viewfinderHeight) => {
      // Return comfortable box that covers 85% of viewport
      const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
      const edge = Math.floor(minEdge * 0.85);
      return { width: Math.max(220, edge), height: Math.max(220, edge) };
    },
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true,
    },
  });

  const handleDecoded = useCallback(
    (decodedText, decodedResult) => {
      const now = Date.now();
      if (now - lastScanTimeRef.current < 1200) {
        return;
      }
      lastScanTimeRef.current = now;
      if (onScanSuccess) {
        onScanSuccess(decodedText, decodedResult);
      }
    },
    [onScanSuccess]
  );

  // Helper to safely stop scanner without throwing
  const stopScannerSafely = async () => {
    if (!scannerRef.current) return;
    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
    } catch {
      // Ignore if not running
    }
  };

  // Helper to start scanning with a given target
  const startScannerWith = async (cameraTarget) => {
    setIsStarting(true);
    setCameraError(null);
    setIsCameraActive(false);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(READER_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        });
      }

      await stopScannerSafely();

      try {
        await scannerRef.current.start(
          cameraTarget,
          getQrConfig(),
          handleDecoded,
          () => {}
        );
      } catch (primaryErr) {
        console.warn("Primary camera target failed, trying fallback constraints:", primaryErr);

        // Fallback 1: Direct facingMode constraint (critical for iPhone Safari)
        try {
          const targetFacing =
            typeof cameraTarget === "object" && cameraTarget.facingMode === "user"
              ? "user"
              : "environment";

          await scannerRef.current.start(
            { facingMode: { exact: targetFacing } },
            getQrConfig(),
            handleDecoded,
            () => {}
          );
        } catch (fbErr1) {
          // Fallback 2: Loose facingMode
          console.warn("Exact facingMode failed, trying loose facingMode:", fbErr1);
          await scannerRef.current.start(
            { facingMode: "environment" },
            getQrConfig(),
            handleDecoded,
            () => {}
          );
        }
      }

      // Ensure playsinline and autoplay on iOS Safari video element
      try {
        const videoEl = document.querySelector(`#${READER_ID} video`);
        if (videoEl) {
          videoEl.setAttribute("playsinline", "true");
          videoEl.setAttribute("webkit-playsinline", "true");
          videoEl.setAttribute("autoplay", "true");
          videoEl.setAttribute("muted", "true");
          videoEl.play().catch(() => {});
        }
      } catch {
        // ignore
      }

      setIsCameraActive(true);
      setIsStarting(false);

      // Check torch capability
      try {
        const capabilities = scannerRef.current.getRunningTrackCapabilities?.();
        setHasTorch(Boolean(capabilities && capabilities.torch));
      } catch {
        setHasTorch(false);
      }
    } catch (err) {
      console.error("Camera start error:", err);
      setIsStarting(false);
      setIsCameraActive(false);
      setCameraError(
        isMobile
          ? "تعذر تشغيل كاميرا الهاتف. تأكد من منح إذن الكاميرا في إعدادات Safari / Chrome."
          : "شاشة الكاميرا معطلة أو غير متصلة بالكمبيوتر (يمكنك استخدام البحث اليدوي أو رفع صورة QR)."
      );
    }
  };

  // Initial Camera Mount
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        // On iOS Safari: directly start with { facingMode: "environment" } for fastest hardware camera capture
        if (isIOS) {
          await startScannerWith({ facingMode: "environment" });
          return;
        }

        const devices = await Html5Qrcode.getCameras();
        if (!isMounted) return;

        if (devices && devices.length > 0) {
          setCameras(devices);

          // On mobile: prefer back camera
          const backCam = isMobile
            ? devices.find((d) =>
                d.label?.toLowerCase().includes("back") ||
                d.label?.toLowerCase().includes("rear") ||
                d.label?.toLowerCase().includes("environment") ||
                d.label?.toLowerCase().includes("0")
              )
            : null;

          const chosenCam = backCam ? backCam : devices[0];
          setCurrentCameraId(chosenCam.id);
          await startScannerWith(chosenCam.id);
        } else {
          // No devices listed explicitly, try standard facingMode
          const defaultTarget = isMobile
            ? { facingMode: "environment" }
            : { facingMode: "user" };
          await startScannerWith(defaultTarget);
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn("Camera enum error:", err);
        // Try fallback facingMode
        await startScannerWith({ facingMode: "environment" });
      }
    };

    init();

    return () => {
      isMounted = false;
      stopScannerSafely().then(() => {
        try {
          scannerRef.current?.clear();
        } catch {
          // ignore
        }
        scannerRef.current = null;
      });
    };
  }, [isMobile, isIOS]);

  // Handle Pause / Resume state
  useEffect(() => {
    if (!scannerRef.current || !isCameraActive) return;
    try {
      if (isPaused) {
        scannerRef.current.pause(true);
      } else {
        scannerRef.current.resume();
      }
    } catch {
      // ignore
    }
  }, [isPaused, isCameraActive]);

  // Toggle Torch
  const handleToggleTorch = async () => {
    if (!scannerRef.current || !isCameraActive) return;
    try {
      const nextState = !isTorchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState }],
      });
      setIsTorchOn(nextState);
    } catch (err) {
      console.warn("Flashlight error:", err);
    }
  };

  // Flip / Switch Camera
  const handleFlipCamera = async () => {
    if (isOperatingRef.current || isSwitching) return;
    isOperatingRef.current = true;
    setIsSwitching(true);
    setIsTorchOn(false);

    try {
      const nextFacing = facingMode === "environment" ? "user" : "environment";
      setFacingMode(nextFacing);

      let nextTarget;

      if (!isIOS && cameras.length > 1) {
        // Find matching camera in list by label
        const targetCam = cameras.find((c) => {
          const lbl = (c.label || "").toLowerCase();
          if (nextFacing === "user") {
            return (
              lbl.includes("front") ||
              lbl.includes("user") ||
              lbl.includes("selfie") ||
              lbl.includes("face")
            );
          } else {
            return (
              lbl.includes("back") ||
              lbl.includes("rear") ||
              lbl.includes("environment") ||
              lbl.includes("main")
            );
          }
        });

        if (targetCam) {
          nextTarget = targetCam.id;
          setCurrentCameraId(targetCam.id);
        } else {
          // Cycle to next camera ID in array
          const curIndex = cameras.findIndex((c) => c.id === currentCameraId);
          const nextIndex = (curIndex + 1) % cameras.length;
          nextTarget = cameras[nextIndex].id;
          setCurrentCameraId(cameras[nextIndex].id);
        }
      } else {
        // On iOS: use standard facingMode
        nextTarget = { facingMode: nextFacing };
        setCurrentCameraId(null);
      }

      await startScannerWith(nextTarget);
    } catch (err) {
      console.error("Camera flip error:", err);
    } finally {
      setIsSwitching(false);
      isOperatingRef.current = false;
    }
  };

  const [fileModal, setFileModal] = useState({ isOpen: false, title: "", message: "", type: "info" });

  // Scan from uploaded file / image
  const handleFileScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsStarting(true);
      const decodedText = await decodeQrFromImageFile(file);
      if (decodedText && onScanSuccess) {
        onScanSuccess(decodedText);
      } else {
        setFileModal({
          isOpen: true,
          title: "تعذر قراءة الرمز",
          message: "لم يتم العثور على رمز QR واضح في الصورة. يمكنك كتابة كود الحضور الظاهر على البطاقة (مثل 9477FF3E) في شريط البحث بالأسفل.",
          type: "warning",
        });
      }
    } catch (err) {
      console.warn("File QR scan error:", err);
      setFileModal({
        isOpen: true,
        title: "خطأ في قراءة الصورة",
        message: "حدث خطأ أثناء فحص الصورة. يرجى إدخال الكود يدوياً بالأسفل.",
        type: "error",
      });
    } finally {
      setIsStarting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.cameraBox}>
      {/* ── Viewport Header Bar ── */}
      <div className={styles.topControlBar}>
        <div className={styles.statusPill}>
          <span
            className={`${styles.statusDot} ${
              cameraError
                ? styles.dotError
                : isPaused
                ? styles.dotPaused
                : isStarting || isSwitching
                ? styles.dotStarting
                : styles.dotActive
            }`}
          />
          <span className={styles.statusText}>
            {isSwitching
              ? "جاري تبديل الكاميرا..."
              : isStarting
              ? "جاري تشغيل الكاميرا..."
              : cameraError
              ? "الكاميرا غير متاحة"
              : isPaused
              ? "المسح متوقف مؤقتاً"
              : facingMode === "environment"
              ? "الكاميرا الخلفية نشطة"
              : "الكاميرا الأمامية نشطة"}
          </span>
        </div>

        {/* Action Controls */}
        <div className={styles.actionGroup}>
          {hasTorch && (
            <button
              type="button"
              onClick={handleToggleTorch}
              className={`${styles.ctrlBtn} ${isTorchOn ? styles.torchActive : ""}`}
              title={isTorchOn ? "إطفاء الكشاف" : "تشغيل الكشاف"}
            >
              {isTorchOn ? <FlashlightOff size={18} /> : <Flashlight size={18} />}
            </button>
          )}

          {/* Switch Camera Button */}
          {(isMobile || cameras.length > 1) && (
            <button
              type="button"
              onClick={handleFlipCamera}
              disabled={isSwitching}
              className={`${styles.ctrlBtn} ${isSwitching ? styles.btnSwitching : ""}`}
              title={`تبديل الكاميرا إلى (${
                facingMode === "environment" ? "الأمامية" : "الخلفية"
              })`}
            >
              <SwitchCamera
                size={18}
                className={isSwitching ? styles.spinIcon : ""}
              />
            </button>
          )}

          <button
            type="button"
            onClick={onTogglePause}
            disabled={!isCameraActive || isSwitching}
            className={`${styles.ctrlBtn} ${isPaused ? styles.btnResume : ""}`}
            title={isPaused ? "استئناف المسح" : "إيقاف مؤقت"}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>

          {/* Upload QR image file */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={styles.ctrlBtn}
            title="رفع صورة QR من الجهاز لفحصها"
          >
            <Upload size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileScan}
          />
        </div>
      </div>

      {/* ── Camera Viewfinder Container ── */}
      <div className={styles.viewportWrapper}>
        <div id={READER_ID} className={styles.readerElement} />

        {/* Laser Scanning Line Animation */}
        {isCameraActive && !isPaused && !cameraError && !isStarting && !isSwitching && (
          <div className={styles.scanLaserOverlay}>
            <div className={styles.laserBeam} />
            <div className={styles.cornerTopLeft} />
            <div className={styles.cornerTopRight} />
            <div className={styles.cornerBottomLeft} />
            <div className={styles.cornerBottomRight} />
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && !cameraError && (
          <div className={styles.pausedOverlay}>
            <div className={styles.pausedNotice}>
              <Pause size={28} className={styles.pausedIcon} />
              <p>المسح متوقف مؤقتاً لمراجعة الطالب</p>
              <button
                type="button"
                onClick={onTogglePause}
                className={styles.resumeScanBtn}
              >
                <Play size={16} />
                <span>استئناف الكاميرا الآن</span>
              </button>
            </div>
          </div>
        )}

        {/* Desktop Helper or Error Overlay */}
        {cameraError && (
          <div className={styles.errorOverlay}>
            <div className={styles.desktopNoticeBox}>
              {!isMobile ? (
                <Monitor size={36} className={styles.desktopIcon} />
              ) : (
                <Smartphone size={36} className={styles.desktopIcon} />
              )}
              <h4 className={styles.desktopNoticeTitle}>
                {!isMobile ? "شاشة الكاميرا على الديسكتوب" : "تنبيه الكاميرا"}
              </h4>
              <p className={styles.desktopNoticeText}>
                {!isMobile
                  ? "ظهور شاشة داكنة على الديسكتوب طبيعي إذا لم تكن كاميرا الويب متصلة أو مغطاة. الهاتف المحمول هو الجهاز الموصى به للمسح عند بوابات الدخول."
                  : cameraError}
              </p>

              <div className={styles.desktopHelperActions}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.uploadImageBtn}
                >
                  <Upload size={16} />
                  <span>رفع صورة تذكرة QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCameraError(null);
                    startScannerWith(
                      isMobile ? { facingMode: "environment" } : { facingMode: "user" }
                    );
                  }}
                  className={styles.retryBtn}
                >
                  <RefreshCw size={15} />
                  <span>إعادة المحاولة</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Intelligent Search Bar ── */}
      <ScannerSearch onSelect={onManualSearch} isSearching={isSearching} />

      {/* ── Upload / Scan Modal ── */}
      <AdminModal
        isOpen={fileModal.isOpen}
        onClose={() => setFileModal((prev) => ({ ...prev, isOpen: false }))}
        title={fileModal.title}
        message={fileModal.message}
        type={fileModal.type}
      />
    </div>
  );
};

export default ScannerCamera;
