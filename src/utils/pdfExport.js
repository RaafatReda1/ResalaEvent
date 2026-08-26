/**
 * Export filtered student rows to a beautifully styled, print-ready PDF document
 */
export const exportStudentsToPDF = (students = [], filterTitle = "كشف تسجيل الطلاب") => {
  if (!students || students.length === 0) return;

  const now = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalCount = students.length;
  const approvedCount = students.filter((s) => s.isApproved === true).length;
  const pendingCount = students.filter((s) => s.isApproved === null).length;
  const rejectedCount = students.filter((s) => s.isApproved === false).length;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("يرجى السماح بالنوافذ المنبثقة لتوليد ملف الـ PDF");
    return;
  }

  const rowsHtml = students
    .map(
      (s, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td>
          <div style="font-weight: bold; color: #0f172a;">${s.name || "بدون اسم"}</div>
          <div style="font-size: 11px; color: #64748b; direction: ltr; text-align: right;">${s.email || "—"}</div>
        </td>
        <td style="direction: ltr; text-align: right; font-weight: 600;">${s.phone || "—"}</td>
        <td>${s.university || "—"}</td>
        <td>${s.academicYear || "—"}</td>
        <td>${s.place || "—"}</td>
        <td style="text-align: center;">
          <span style="
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            background: ${s.isApproved === true ? "#dcfce7" : s.isApproved === false ? "#fee2e2" : "#fef3c7"};
            color: ${s.isApproved === true ? "#15803d" : s.isApproved === false ? "#b91c1c" : "#b45309"};
          ">
            ${s.isApproved === true ? "مقبول" : s.isApproved === false ? "مرفوض" : "في الانتظار"}
          </span>
        </td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8" />
      <title>${filterTitle} - أطباء الخير رسالة</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Cairo', sans-serif; }
        body {
          margin: 0;
          padding: 24px;
          color: #1e293b;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #3ab9ac;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
        .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
        .stats-bar {
          display: flex;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 13px;
          font-weight: bold;
        }
        .stat-item { display: flex; align-items: center; gap: 6px; }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th {
          background: #0f172a;
          color: #ffffff;
          padding: 10px 12px;
          text-align: right;
          font-weight: 700;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }
        tr:nth-child(even) td { background: #f8fafc; }
        .footer {
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }
        @media print {
          body { padding: 10px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">جمعية رسالة - إيفنت أطباء الخير</h1>
          <div class="subtitle">${filterTitle} | تاريخ الاستخراج: ${now}</div>
        </div>
        <div style="text-align: left;">
          <button class="no-print" onclick="window.print()" style="
            background: #3ab9ac;
            color: #ffffff;
            border: none;
            padding: 8px 18px;
            font-size: 13px;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
          ">
            طباعة / حفظ كـ PDF 🖨️
          </button>
        </div>
      </div>

      <div class="stats-bar">
        <div class="stat-item">إجمالي الطلاب: <span>${totalCount}</span></div>
        <div class="stat-item" style="color: #16a34a;">المقبولين: <span>${approvedCount}</span></div>
        <div class="stat-item" style="color: #d97706;">في الانتظار: <span>${pendingCount}</span></div>
        <div class="stat-item" style="color: #dc2626;">المرفوضين: <span>${rejectedCount}</span></div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th>اسم الطالب / البريد</th>
            <th>الهاتف</th>
            <th>الجامعة</th>
            <th>الفرقة</th>
            <th>نقطة التجمع</th>
            <th style="text-align: center;">الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="footer">
        <span>تم إنشاء هذا التقرير آلياً عبر لوحة تحكم المشرف</span>
        <span>صفحة 1 من 1</span>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
