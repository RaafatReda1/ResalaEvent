import React, { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "../../../../../utils/supabaseClient";
import {
  Search,
  User,
  Phone,
  Mail,
  Hash,
  X,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import styles from "./ScannerSearch.module.css";

/** Highlight matched part of text */
const Highlight = ({ text, query }) => {
  if (!query || !text) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = String(text).split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className={styles.highlight}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

/** Infer what type of field matched */
const getMatchType = (student, query) => {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  if (student.name?.toLowerCase().includes(q)) return { icon: <User size={11} />, label: "الاسم" };
  if (student.phone?.toLowerCase().includes(q)) return { icon: <Phone size={11} />, label: "الهاتف" };
  if (student.email?.toLowerCase().includes(q)) return { icon: <Mail size={11} />, label: "الإيميل" };
  if (student.id?.toLowerCase().startsWith(q.replace(/^#/, "")))
    return { icon: <Hash size={11} />, label: "الكود" };
  return null;
};

const ScannerSearch = ({ onSelect, isSearching }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const fetchSuggestions = useCallback(async (rawQuery) => {
    const q = rawQuery.trim();
    if (!q || q.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      const cleanQ = q.replace(/^#/, "").trim();
      const isShortId = /^[0-9a-fA-F]{6,8}$/.test(cleanQ);
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          cleanQ
        );

      let results = [];

      if (isUuid) {
        // Exact UUID match
        const { data } = await supabase
          .from("students")
          .select("id, name, phone, email, university, isApproved, hasScannedQr, academicYear")
          .eq("id", cleanQ)
          .limit(5);
        results = data || [];
      } else if (isShortId) {
        // Short ID range match
        const prefix = cleanQ.toLowerCase();
        const startUuid = `${prefix}${"0".repeat(8 - cleanQ.length)}-0000-0000-0000-000000000000`;
        const endUuid = `${prefix}${"f".repeat(8 - cleanQ.length)}-ffff-ffff-ffff-ffffffffffff`;
        const { data } = await supabase
          .from("students")
          .select("id, name, phone, email, university, isApproved, hasScannedQr, academicYear")
          .gte("id", startUuid)
          .lte("id", endUuid)
          .limit(5);
        results = data || [];
      } else {
        // Text search: name, phone, email in parallel
        const [nameRes, phoneRes, emailRes] = await Promise.all([
          supabase
            .from("students")
            .select("id, name, phone, email, university, isApproved, hasScannedQr, academicYear")
            .ilike("name", `%${q}%`)
            .limit(6),
          supabase
            .from("students")
            .select("id, name, phone, email, university, isApproved, hasScannedQr, academicYear")
            .ilike("phone", `%${q}%`)
            .limit(4),
          supabase
            .from("students")
            .select("id, name, phone, email, university, isApproved, hasScannedQr, academicYear")
            .ilike("email", `%${q}%`)
            .limit(4),
        ]);

        // Merge & deduplicate by id
        const seen = new Set();
        const merged = [
          ...(nameRes.data || []),
          ...(phoneRes.data || []),
          ...(emailRes.data || []),
        ].filter((s) => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        });

        // Sort: approved first, then name match
        merged.sort((a, b) => {
          const aNameMatch = a.name?.toLowerCase().includes(q.toLowerCase());
          const bNameMatch = b.name?.toLowerCase().includes(q.toLowerCase());
          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;
          return 0;
        });

        results = merged.slice(0, 8);
      }

      setSuggestions(results);
      setIsOpen(results.length > 0);
      setActiveIndex(-1);
    } catch (err) {
      console.warn("Suggestion fetch error:", err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);

    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 280);
  };

  const handleSelect = (student) => {
    setQuery(student.name || student.id);
    setIsOpen(false);
    setSuggestions([]);
    onSelect(student.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
    } else {
      setIsOpen(false);
      onSelect(q);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearQuery = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={styles.scannerSearch}>
      <form onSubmit={handleSubmit} className={styles.searchForm} autoComplete="off">
        {/* Search icon or loader */}
        <div className={styles.searchIconWrap}>
          {isLoading ? (
            <Loader2 size={16} className={styles.loaderIcon} />
          ) : (
            <Search size={16} className={styles.searchIcon} />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="ابحث بالاسم، كود الحضور، الهاتف، الإيميل..."
          className={styles.searchInput}
          disabled={isSearching}
          autoComplete="off"
          spellCheck={false}
          dir="auto"
        />

        {query && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={clearQuery}
            tabIndex={-1}
          >
            <X size={14} />
          </button>
        )}

        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className={styles.searchBtn}
        >
          {isSearching ? (
            <Loader2 size={15} className={styles.loaderIcon} />
          ) : (
            <Search size={15} />
          )}
          <span>{isSearching ? "بحث..." : "ابحث"}</span>
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <Search size={12} />
            <span>{suggestions.length} نتيجة مقترحة</span>
          </div>

          {suggestions.map((student, idx) => {
            const matchType = getMatchType(student, query);
            const shortId = student.id?.split("-")[0]?.toUpperCase();
            return (
              <button
                key={student.id}
                type="button"
                className={`${styles.suggestionItem} ${
                  idx === activeIndex ? styles.suggestionActive : ""
                }`}
                onClick={() => handleSelect(student)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {/* Avatar */}
                <div
                  className={`${styles.avatarCircle} ${
                    student.isApproved ? styles.avatarApproved : styles.avatarPending
                  }`}
                >
                  <User size={14} />
                </div>

                {/* Info */}
                <div className={styles.studentInfo}>
                  <div className={styles.studentName}>
                    <Highlight text={student.name} query={query} />
                    {student.hasScannedQr && (
                      <span className={styles.alreadyScanned}>
                        <CheckCircle2 size={11} />
                        حضر
                      </span>
                    )}
                  </div>

                  <div className={styles.studentMeta}>
                    <span className={styles.metaItem}>
                      <Hash size={10} />
                      <Highlight text={shortId} query={query.replace(/^#/, "").toUpperCase()} />
                    </span>
                    {student.phone && (
                      <span className={styles.metaItem}>
                        <Phone size={10} />
                        <Highlight text={student.phone} query={query} />
                      </span>
                    )}
                    {student.email && (
                      <span className={styles.metaItem}>
                        <Mail size={10} />
                        <Highlight text={student.email} query={query} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side: status + match type */}
                <div className={styles.suggestionRight}>
                  <span
                    className={`${styles.statusBadge} ${
                      student.isApproved ? styles.badgeApproved : styles.badgePending
                    }`}
                  >
                    {student.isApproved ? "مقبول" : "قيد المراجعة"}
                  </span>
                  {matchType && (
                    <span className={styles.matchBadge}>
                      {matchType.icon}
                      {matchType.label}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          <div className={styles.dropdownFooter}>
            <span>↑↓ للتنقل · Enter للاختيار · Esc للإغلاق</span>
          </div>
        </div>
      )}

      {/* No results hint */}
      {isOpen && !isLoading && query.length >= 2 && suggestions.length === 0 && (
        <div className={styles.noResults}>
          <Search size={14} />
          <span>لا توجد نتائج لـ "{query}"</span>
        </div>
      )}
    </div>
  );
};

export default ScannerSearch;
