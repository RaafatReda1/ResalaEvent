/**
 * chatPreviewActions.js
 * Pure action helpers for WhatsApp Chat Preview sub-components.
 */

export const renderWhatsAppHtml = (text) => {
  if (!text) return { __html: "" };
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  html = html.replace(/\*([^\*]+)\*/g, "<strong>$1</strong>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
  html = html.replace(/\n/g, "<br/>");
  return { __html: html };
};

export const pickRandomStudentId = (allStudents = []) => {
  if (!allStudents.length) return null;
  return allStudents[Math.floor(Math.random() * allStudents.length)].id;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
