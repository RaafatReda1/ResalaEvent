import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  Camera,
  Flashlight,
  FlashlightOff,
  SwitchCamera,
  Pause,
  Play,
  Search,
  AlertTriangle,
  RefreshCw,
  Upload,
  Monitor,
  Smartphone,
} from "lucide-react";
import styles from "./ScannerCamera.module.css";

const READER_ID = "admin-qr-reader-viewport";

const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || ""
  );
};

const ScannerCamera = ({
  onScanSuccess,
  isPaused,
  onTogglePause,
  onManualSearch,
  isSearching,
  soundEnabled,
}) => {
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMobile = isMobileDevice();

  const [cameras, setCameras] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);
  const [facingMode, setFacingMode] = useState(isMobile ? "environment" : "user");
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isStarting, setIsStarting] = useState(true);
  const [manualInput, setManualInput] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Keep track of active scan lock to avoid duplicate triggering within 1 second
  const lastScanTimeRef = useRef(0);

  // 1. Initialize camera list
  useEffect(() => {
    let isMounted = true;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!isMounted) return;
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back camera if mobile, or first camera
          const backCam = isMobile
            ? devices.find((d) =>
                d.label?.toLowerCase().includes("back") ||
                d.label?.toLowerCase().includes("rear") ||
                d.label?.toLowerCase().includes("environment")
              )
            : null;

          const chosen = backCam ? backCam.id : devices[0].id;
          setCurrentCameraId(chosen);
        } else {
          setCameraError(
            isMobile
              ? "لم يتم العثور على كاميرا نشطة بالهاتف."
              : "لا توجد كاميرا ويب متصلة بجهاز الكمبيوتر المكتبي. يمكنك استخدام البحث اليدوي أو رفع صورة QR."
          );
          setIsStarting(false);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Camera enumeration error:", err);
        setCameraError(
          isMobile
            ? "يرجى منح إذن استخدام الكاميرا من إعدادات المتصفح."
            : "تعذر تشغيل كاميرا الكمبيوتر (تأكد من توصيلها ومنح الإذن، أو استخدم البحث اليدوي أدناه)."
        );
        setIsStarting(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isMobile]);

  // 2. Start or switch scanner stream
  useEffect(() => {
    let html5QrCode = null;
    let isMounted = true;

    const startCamera = async () => {
      setIsStarting(true);
      setCameraError(null);
      setIsCameraActive(false);

      try {
        // Clean up previous instance if running
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
          } catch {
            // ignore
          }
        }

        html5QrCode = new Html5Qrcode(READER_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
        scannerRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrEdge = Math.floor(minEdge * 0.72);
            return { width: Math.max(180, qrEdge), height: Math.max(180, qrEdge) };
          },
          aspectRatio: 1.0,
        };

        const handleDecoded = (decodedText, decodedResult) => {
          const now = Date.now();
          if (now - lastScanTimeRef.current < 1200) {
            return;
          }
          lastScanTimeRef.current = now;
          if (onScanSuccess) {
            onScanSuccess(decodedText, decodedResult);
          }
        };

        // Determine camera target
        let cameraIdOrConfig;
        if (currentCameraId) {
          cameraIdOrConfig = currentCameraId;
        } else if (isMobile) {
          cameraIdOrConfig = { facingMode: "environment" };
        } else {
          cameraIdOrConfig = { facingMode: "user" };
        }

        try {
          await html5QrCode.start(
            cameraIdOrConfig,
            config,
            handleDecoded,
            () => {}
          );
        } catch (firstErr) {
          // Fallback: if environment failed (common on desktop/laptops), try user camera or first device
          console.warn("Primary camera start failed, trying fallback:", firstErr);
          await html5QrCode.start(
            { facingMode: "user" },
            config,
            handleDecoded,
            () => {}
          );
        }

        if (!isMounted) return;
        setIsStarting(false);
        setIsCameraActive(true);

        // Check if torch capability exists
        try {
          const capabilities = html5QrCode.getRunningTrackCapabilities();
          if (capabilities && capabilities.torch) {
            setHasTorch(true);
          } else {
            setHasTorch(false);
          }
        } catch {
          setHasTorch(false);
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn("Scanner start failed:", err);
        setCameraError(
          isMobile
            ? "تعذر تشغيل كاميرا الهاتف. تأكد من منح الإذن للمتصفح."
            : "شاشة الكاميرا معطلة أو غير متصلة بالكمبيوتر (يمكنك استخدام البحث اليدوي أو رفع صورة QR أو فتح الصفحة من الهاتف)."
        );
        setIsStarting(false);
        setIsCameraActive(false);
      }
    };

    if (currentCameraId || cameras.length > 0) {
      startCamera();
    } else {
      // If after 2.5 seconds getCameras hasn't returned, try with default facing mode
      const timer = setTimeout(() => {
        if (!currentCameraId) {
          startCamera();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
          })
          .catch(() => {});
      }
    };
  }, [currentCameraId, facingMode, isMobile, cameras.length]);

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
    if (!scannerRef.current) return;
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

  // Flip Front / Back Camera
  const handleFlipCamera = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex((c) => c.id === currentCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setCurrentCameraId(cameras[nextIndex].id);
    } else {
      setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    }
  };

  // Scan from uploaded file / image (great on desktop!)
  const handleFileScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsStarting(true);
      let tempScanner = scannerRef.current;
      if (!tempScanner) {
        tempScanner = new Html5Qrcode(READER_ID, { verbose: false });
      }

      const decodedText = await tempScanner.scanFile(file, true);
      if (decodedText && onScanSuccess) {
        onScanSuccess(decodedText);
      }
    } catch (err) {
      console.warn("File QR scan error:", err);
      alert("لم يتم العثور على رمز QR واضح في الصورة المختارة. يرجى تجربة صورة أوضح.");
    } finally {
      setIsStarting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    onManualSearch(manualInput.trim());
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
                : isStarting
                ? styles.dotStarting
                : styles.dotActive
            }`}
          />
          <span className={styles.statusText}>
            {isStarting
              ? "جاري تشغيل الكاميرا..."
              : cameraError
              ? "الكاميرا غير متاحة"
              : isPaused
              ? "المسح متوقف مؤقتاً"
              : "الكاميرا نشطة وجاهزة"}
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

          {cameras.length > 1 && (
            <button
              type="button"
              onClick={handleFlipCamera}
              className={styles.ctrlBtn}
              title="تبديل الكاميرا"
            >
              <SwitchCamera size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={onTogglePause}
            disabled={!isCameraActive}
            className={`${styles.ctrlBtn} ${isPaused ? styles.btnResume : ""}`}
            title={isPaused ? "استئناف المسح" : "إيقاف مؤقت"}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>

          {/* Upload QR image file (convenient for desktop) */}
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

        {/* Laser Scanning Line Animation (active when camera stream is live) */}
        {isCameraActive && !isPaused && !cameraError && !isStarting && (
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
                    setCurrentCameraId(null);
                    setFacingMode("user");
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

      {/* ── Manual ID / Phone / Email Search ── */}
      <div className={styles.manualInputCard}>
        <form onSubmit={handleManualSubmit} className={styles.searchForm}>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="أو اكتب كود الطالب (UUID)، رقم الهاتف، أو الإيميل..."
            className={styles.searchInput}
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !manualInput.trim()}
            className={styles.searchBtn}
            title="بحث يدوي في قاعدة البيانات"
          >
            <Search size={16} />
            <span>{isSearching ? "جاري البحث..." : "بحث يدوي"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScannerCamera;
