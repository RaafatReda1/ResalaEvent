import supabase from "./supabaseClient";
import { BUCKET, extractStoragePath } from "@/Components/Form/Actions";
import { logActivity, ACTION_TYPES, ACTION_CATEGORIES } from "./activityLogger";

export const BUCKET_LIMIT_BYTES = 1024 * 1024 * 1024; // 1 GB (1,073,741,824 bytes)
export const BUCKET_LIMIT_MB = 1024;

/**
 * Format bytes into human-readable string (KB, MB, GB)
 */
export const formatBytes = (bytes = 0) => {
  if (bytes === 0) return "0 بايت";
  const k = 1024;
  const sizes = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${val} ${sizes[i]}`;
};

/**
 * Recursively list all files across all folders in Supabase storage bucket
 */
export const listAllBucketFiles = async (folder = "") => {
  let files = [];
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(folder, { limit: 1000, sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      console.warn("Bucket listing error in folder:", folder, error);
      return files;
    }

    if (!data) return files;

    for (const item of data) {
      if (!item.name || item.name === ".emptyFolderPlaceholder") continue;

      const itemPath = folder ? `${folder}/${item.name}` : item.name;

      // In Supabase storage, folders have item.id === null or no size in metadata
      if (!item.id && !item.metadata) {
        const subFiles = await listAllBucketFiles(itemPath);
        files = files.concat(subFiles);
      } else {
        const size = item.metadata?.size || item.size || 0;
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(itemPath);
        files.push({
          name: item.name,
          path: itemPath,
          size,
          formattedSize: formatBytes(size),
          created_at: item.created_at || item.updated_at || null,
          metadata: item.metadata || {},
          publicUrl: urlData?.publicUrl || "",
        });
      }
    }
  } catch (err) {
    console.error("Storage list exception:", err);
  }
  return files;
};

/**
 * Calculate bucket storage analytics & separate active vs orphaned files
 */
export const fetchBucketStorageStats = async () => {
  try {
    // 1. Fetch all bucket files recursively
    const bucketFiles = await listAllBucketFiles("");

    // 2. Fetch all student image paths from the database
    const { data: students, error: dbError } = await supabase
      .from("students")
      .select("id, name, phone, email, imgSrc");

    if (dbError) throw dbError;

    // 3. Build lookup maps/sets of active student images
    const activePathMap = new Map();
    const activeUrlSet = new Set();

    (students || []).forEach((s) => {
      if (s.imgSrc && typeof s.imgSrc === "string") {
        activeUrlSet.add(s.imgSrc.trim());
        const extracted = extractStoragePath(s.imgSrc);
        if (extracted) {
          activePathMap.set(extracted.toLowerCase(), s);
          // Also check unencoded or decoded versions
          try {
            activePathMap.set(decodeURIComponent(extracted).toLowerCase(), s);
          } catch (e) {
            // ignore
          }
        }
      }
    });

    // 4. Categorize files as Linked vs Orphaned
    const linkedFiles = [];
    const orphanedFiles = [];
    let totalBytes = 0;
    let linkedBytes = 0;
    let orphanedBytes = 0;

    bucketFiles.forEach((file) => {
      totalBytes += file.size;
      const normalizedPath = file.path.toLowerCase();
      const isLinkedByPath = activePathMap.has(normalizedPath);
      const isLinkedByUrl = activeUrlSet.has(file.publicUrl);

      if (isLinkedByPath || isLinkedByUrl) {
        const student = activePathMap.get(normalizedPath);
        linkedFiles.push({
          ...file,
          isOrphaned: false,
          student: student || null,
        });
        linkedBytes += file.size;
      } else {
        orphanedFiles.push({
          ...file,
          isOrphaned: true,
        });
        orphanedBytes += file.size;
      }
    });

    // 5. Compute usage & summary metrics
    const totalMB = parseFloat((totalBytes / (1024 * 1024)).toFixed(2));
    const linkedMB = parseFloat((linkedBytes / (1024 * 1024)).toFixed(2));
    const orphanedMB = parseFloat((orphanedBytes / (1024 * 1024)).toFixed(2));
    const usagePercent = Math.min(100, parseFloat(((totalBytes / BUCKET_LIMIT_BYTES) * 100).toFixed(2)));
    const remainingBytes = Math.max(0, BUCKET_LIMIT_BYTES - totalBytes);
    const remainingMB = parseFloat((remainingBytes / (1024 * 1024)).toFixed(2));

    return {
      success: true,
      totalBytes,
      totalMB,
      formattedTotal: formatBytes(totalBytes),
      limitBytes: BUCKET_LIMIT_BYTES,
      limitMB: BUCKET_LIMIT_MB,
      remainingBytes,
      remainingMB,
      formattedRemaining: formatBytes(remainingBytes),
      usagePercent,
      totalFiles: bucketFiles.length,
      linkedCount: linkedFiles.length,
      linkedBytes,
      linkedMB,
      orphanedCount: orphanedFiles.length,
      orphanedBytes,
      orphanedMB,
      formattedOrphaned: formatBytes(orphanedBytes),
      orphanedFiles,
      linkedFiles,
      allFiles: bucketFiles,
    };
  } catch (err) {
    console.error("fetchBucketStorageStats error:", err);
    throw err;
  }
};

/**
 * Delete a single orphaned image from the bucket
 */
export const deleteSingleOrphanedImage = async (filePath) => {
  if (!filePath) return false;
  try {
    const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
    if (error) throw error;

    logActivity({
      action_type: "DELETE_STORAGE_FILE",
      action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
      description: `قام بحذف صورة معلقة غير مرتبطة من مساحة التخزين: "${filePath}"`,
      metadata: { path: filePath },
    });

    return true;
  } catch (err) {
    console.error("deleteSingleOrphanedImage error:", err);
    throw err;
  }
};

/**
 * Bulk delete all or multiple orphaned images from the bucket
 */
export const purgeOrphanedImages = async (filePaths = []) => {
  if (!filePaths || filePaths.length === 0) return { deletedCount: 0 };

  try {
    // Process in batches of 50 to avoid request URL length limitations
    const batchSize = 50;
    let successCount = 0;

    for (let i = 0; i < filePaths.length; i += batchSize) {
      const batch = filePaths.slice(i, i + batchSize);
      const { data, error } = await supabase.storage.from(BUCKET).remove(batch);
      if (error) {
        console.warn("Batch storage deletion error:", error);
      } else {
        successCount += batch.length;
      }
    }

    logActivity({
      action_type: "PURGE_STORAGE",
      action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
      description: `قام بتنظيف (${successCount}) صورة معلقة غير مرتبطة من مساحة التخزين لتوفير المساحة`,
      metadata: { count: successCount, pathsSample: filePaths.slice(0, 10) },
    });

    return { deletedCount: successCount };
  } catch (err) {
    console.error("purgeOrphanedImages error:", err);
    throw err;
  }
};
