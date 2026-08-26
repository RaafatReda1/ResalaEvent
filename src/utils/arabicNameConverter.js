/**
 * Smart Arabic Name Converter and Transliteration Utility
 * Handles English-to-Arabic conversions, extracting first names, and cleaning numbers/IDs.
 */

// Common English-to-Arabic name dictionary for Egyptian / Arab names
const COMMON_NAMES_MAP = {
  // Male Names
  ahmed: "أحمد",
  ahmad: "أحمد",
  mohamed: "محمد",
  mohammed: "محمد",
  muhammad: "محمد",
  mahmoud: "محمود",
  mahmud: "محمود",
  mostafa: "مصطفى",
  mustafa: "مصطفى",
  ali: "علي",
  omar: "عمر",
  amr: "عمرو",
  youssef: "يوسف",
  yousef: "يوسف",
  joseph: "يوسف",
  ibrahim: "إبراهيم",
  hassan: "حسن",
  hussein: "حسين",
  hossam: "حسام",
  tarek: "طارق",
  tariq: "طارق",
  khaled: "خالد",
  khalid: "خالد",
  karim: "كريم",
  kareem: "كريم",
  ziad: "زياد",
  zeyad: "زياد",
  seif: "سيف",
  sayed: "سيد",
  saeed: "سعيد",
  adel: "عادل",
  ayman: "أيمن",
  ashraf: "أشرف",
  alaa: "علاء",
  abdelrahman: "عبد الرحمن",
  abdulrahman: "عبد الرحمن",
  abdallah: "عبد الله",
  abdullah: "عبد الله",
  abdelaziz: "عبد العزيز",
  hazem: "حازم",
  hany: "هاني",
  hani: "هاني",
  gamal: "جمال",
  jamal: "جمال",
  ramy: "رامي",
  rami: "رامي",
  fady: "فادي",
  mina: "مينا",
  peter: "بيتر",
  george: "جورج",
  beshoy: "بيشوي",
  bishoy: "بيشوي",
  rafat: "رأفت",
  raafat: "رأفت",
  emad: "عماد",
  medhat: "مدحت",
  ehab: "إيهاب",
  ihab: "إيهاب",
  sameh: "سامح",
  samer: "سامر",
  sherif: "شريف",
  shereef: "شريف",
  wael: "وائل",
  walid: "وليد",
  waleed: "وليد",
  islam: "إسلام",
  eslam: "إسلام",
  osama: "أسامة",
  oussama: "أسامة",
  bassem: "باسم",
  basem: "باسم",
  marwan: "مروان",
  mazene: "مازن",
  mazen: "مازن",
  malek: "مالك",
  malik: "مالك",
  hamza: "حمزة",
  anas: "أنس",
  yahia: "يحيى",
  yahya: "يحيى",
  farahat: "فرحات",
  ismail: "إسماعيل",
  esmail: "إسماعيل",

  // Female Names
  lojain: "لوجين",
  lujain: "لوجين",
  logine: "لوجين",
  logen: "لوجين",
  nada: "ندى",
  mariam: "مريم",
  maryam: "مريم",
  meryam: "مريم",
  sarah: "سارة",
  sara: "سارة",
  nour: "نور",
  nouran: "نوران",
  nourhan: "نورهان",
  salma: "سلمى",
  fatma: "فاطمة",
  fatima: "فاطمة",
  aya: "آية",
  ayah: "آية",
  hagar: "هاجر",
  reem: "ريم",
  rana: "رنا",
  radwa: "رضوى",
  rawan: "روان",
  menna: "منة",
  mennatallah: "منة الله",
  habiba: "حبيبة",
  shahd: "شهد",
  yasmin: "ياسمين",
  yasmine: "ياسمين",
  dina: "دينا",
  donia: "دنيا",
  dalia: "داليا",
  mai: "مي",
  may: "مي",
  mayar: "ميار",
  mona: "منى",
  maha: "مها",
  manar: "منار",
  eman: "إيمان",
  iman: "إيمان",
  asmaa: "أسماء",
  asma: "أسماء",
  alaa_f: "آلاء",
  shaimaa: "شيماء",
  shimaa: "شيماء",
  doaa: "دعاء",
  omnia: "أمنية",
  omneya: "أمنية",
  arwa: "أروى",
  kenzy: "كنزي",
  kinzy: "كنزي",
  farida: "فريدة",
  farah: "فرح",
  gehad: "جهاد",
  jihad: "جهاد",
  roqaya: "رقية",
  amany: "أماني",
  amani: "أماني",
  asmaa_abd: "العصماء",
};

/**
 * Clean student name from trailing numbers, IDs, special characters
 * Example: "LOJAIN AHMED FARAHAT 949" -> "LOJAIN AHMED FARAHAT"
 */
export const cleanStudentName = (rawName) => {
  if (!rawName || typeof rawName !== "string") return "";
  return rawName
    .replace(/[0-9]+/g, "") // Remove numbers
    .replace(/[#@$%^&*()_+={}\[\]:;"'<>?,./\\|`~]/g, "") // Remove symbols
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Extract first name only from full name
 */
export const getFirstName = (fullName) => {
  const cleaned = cleanStudentName(fullName);
  if (!cleaned) return "";

  // Handle compound names like "عبد الرحمن", "عبد الله", "منة الله"
  const tokens = cleaned.split(" ").filter(Boolean);
  if (tokens.length === 0) return "";

  const firstToken = tokens[0].toLowerCase();
  if (
    (firstToken === "عبد" || firstToken === "abdel" || firstToken === "abdul") &&
    tokens.length > 1
  ) {
    return `${tokens[0]} ${tokens[1]}`;
  }

  return tokens[0];
};

/**
 * Transliterate single English word to Arabic
 */
export const transliterateWordToArabic = (word) => {
  if (!word) return "";
  const cleanWord = word.toLowerCase().trim();

  // Check dictionary
  if (COMMON_NAMES_MAP[cleanWord]) {
    return COMMON_NAMES_MAP[cleanWord];
  }

  // Phonetic rule-based approximation
  let result = cleanWord
    .replace(/kh/g, "خ")
    .replace(/sh/g, "ش")
    .replace(/th/g, "ث")
    .replace(/gh/g, "غ")
    .replace(/ph/g, "ف")
    .replace(/ch/g, "تش")
    .replace(/ee/g, "ي")
    .replace(/oo/g, "و")
    .replace(/ou/g, "و")
    .replace(/a/g, "ا")
    .replace(/b/g, "ب")
    .replace(/t/g, "ت")
    .replace(/g/g, "ج")
    .replace(/j/g, "ج")
    .replace(/h/g, "ه")
    .replace(/d/g, "د")
    .replace(/r/g, "ر")
    .replace(/z/g, "ز")
    .replace(/s/g, "س")
    .replace(/f/g, "ف")
    .replace(/q/g, "ق")
    .replace(/k/g, "ك")
    .replace(/l/g, "ل")
    .replace(/m/g, "م")
    .replace(/n/g, "ن")
    .replace(/w/g, "و")
    .replace(/y/g, "ي")
    .replace(/i/g, "ي")
    .replace(/e/g, "ي")
    .replace(/o/g, "و")
    .replace(/u/g, "و")
    .replace(/v/g, "ف");

  return result;
};

/**
 * Convert full name or first name to Arabic if it is written in English
 */
export const convertNameToSmartArabic = (name, firstNameOnly = false) => {
  const cleaned = cleanStudentName(name);
  if (!cleaned) return "";

  // Check if string contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(cleaned);
  if (hasArabic) {
    return firstNameOnly ? getFirstName(cleaned) : cleaned;
  }

  // If in English: convert tokens
  const target = firstNameOnly ? getFirstName(cleaned) : cleaned;
  const tokens = target.split(" ").filter(Boolean);

  const arabicTokens = tokens.map((token) => transliterateWordToArabic(token));
  return arabicTokens.join(" ");
};
