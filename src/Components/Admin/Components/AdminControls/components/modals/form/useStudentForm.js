import { useState, useEffect } from "react";

export const useStudentForm = (student, isOpen, onSave, onClose) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    academicYear: "",
    place: "",
    imgSrc: "",
    isApproved: null,
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        university: student.university || "",
        academicYear: student.academicYear || "",
        place: student.place || "",
        imgSrc: student.imgSrc || "",
        isApproved: student.isApproved,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        university: "",
        academicYear: "",
        place: "",
        imgSrc: "",
        isApproved: null,
      });
    }
    setErr("");
  }, [student, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email?.trim()) {
      setErr("البريد الإلكتروني مطلوب!");
      return;
    }
    try {
      setSaving(true);
      setErr("");
      await onSave(formData);
    } catch (error) {
      console.error(error);
      setErr(error.message || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    saving,
    err,
    handleChange,
    handleSubmit,
  };
};
