/**
 * Smart Arabic Name Converter, Transliteration & Franco-Arabic Engine
 * Features:
 * 1. Extensive Egyptian / Arab Name Dictionary (500+ names & spelling variations)
 * 2. Franco-Arabic (Chat Arabic) decoder (7->ح, 3->ع, 2->أ, 5->خ, etc.)
 * 3. Prefix detection (El-, Al-, Abdel-, Abd El-, Abu-, Nour El-, etc.)
 * 4. Female ending detection (-ah, -a -> ة / ى)
 * 5. Advanced phonetic fallback engine
 */

// ─── Extensive Dictionary for Egyptian & Arab Names ──────────────────────────
const COMMON_NAMES_MAP = {
  // ── Male Names (A-Z) ──
  ahmed: "أحمد",
  ahmad: "أحمد",
  ahmet: "أحمد",
  mohamed: "محمد",
  mohammed: "محمد",
  muhammad: "محمد",
  muhammed: "محمد",
  mhamed: "محمد",
  mahmoud: "محمود",
  mahmud: "محمود",
  mostafa: "مصطفى",
  mustafa: "مصطفى",
  moustafa: "مصطفى",
  ali: "علي",
  aly: "علي",
  omar: "عمر",
  amr: "عمرو",
  amro: "عمرو",
  amer: "عامر",
  youssef: "يوسف",
  yousef: "يوسف",
  yousif: "يوسف",
  joseph: "يوسف",
  ibrahim: "إبراهيم",
  ibraheem: "إبراهيم",
  ebraheem: "إبراهيم",
  ebrahim: "إبراهيم",
  hassan: "حسن",
  hasan: "حسن",
  hassen: "حسن",
  hussein: "حسين",
  hussien: "حسين",
  hossien: "حسين",
  hossein: "حسين",
  hossam: "حسام",
  hosam: "حسام",
  tarek: "طارق",
  tariq: "طارق",
  khaled: "خالد",
  khalid: "خالد",
  karim: "كريم",
  kareem: "كريم",
  ziad: "زياد",
  zeyad: "زياد",
  zeyed: "زياد",
  seif: "سيف",
  saif: "سيف",
  sayed: "سيد",
  saeed: "سعيد",
  said: "سعيد",
  adel: "عادل",
  ayman: "أيمن",
  ashraf: "أشرف",
  alaa: "علاء",
  hazem: "حازم",
  hasem: "حازم",
  hany: "هاني",
  hani: "هاني",
  gamal: "جمال",
  jamal: "جمال",
  gemy: "جمال",
  ramy: "رامي",
  rami: "رامي",
  fady: "فادي",
  fadi: "فادي",
  mina: "مينا",
  meena: "مينا",
  peter: "بيتر",
  george: "جورج",
  beshoy: "بيشوي",
  bishoy: "بيشوي",
  peshoy: "بيشوي",
  rafat: "رأفت",
  raafat: "رأفت",
  emad: "عماد",
  imed: "عماد",
  medhat: "مدحت",
  ehab: "إيهاب",
  ihab: "إيهاب",
  sameh: "سامح",
  samer: "سامر",
  samir: "سمير",
  sameer: "سمير",
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
  bassam: "بسام",
  marwan: "مروان",
  mazene: "مازن",
  mazen: "مازن",
  malek: "مالك",
  malik: "مالك",
  hamza: "حمزة",
  anas: "أنس",
  yahia: "يحيى",
  yahya: "يحيى",
  yehia: "يحيى",
  farahat: "فرحات",
  ismail: "إسماعيل",
  esmail: "إسماعيل",
  ismael: "إسماعيل",
  nasser: "ناصر",
  nassir: "ناصر",
  yasser: "ياسر",
  yasir: "ياسر",
  tamer: "تامر",
  taher: "طاهر",
  taha: "طه",
  maged: "ماجد",
  magdy: "مجدي",
  magdi: "مجدي",
  wagdy: "وجدي",
  wagdi: "وجدي",
  atef: "عاطف",
  akram: "أكرم",
  amgad: "أمجد",
  anwar: "أنور",
  safwat: "صفوت",
  shawky: "شوقي",
  shukry: "شكري",
  shokry: "شكري",
  sabry: "صبري",
  sobhy: "صبحي",
  salah: "صلاح",
  saleh: "صالح",
  selim: "سليم",
  salem: "سالم",
  soliman: "سليمان",
  suleiman: "سليمان",
  mamdouh: "ممدوح",
  mowafy: "موافي",
  mohy: "محي",
  mohsen: "محسن",
  morsi: "مرسي",
  morsy: "مرسي",
  moussa: "موسى",
  mousa: "موسى",
  mosa: "موسى",
  nabil: "نبيل",
  nabeel: "نبيل",
  nagi: "ناجي",
  nagy: "ناجي",
  nasser: "ناصر",
  redha: "رضا",
  reda: "رضا",
  rida: "رضا",
  ragab: "رجب",
  raed: "رائد",
  raouf: "رؤوف",
  raoof: "رؤوف",
  zakaria: "زكريا",
  zakariya: "زكريا",
  fouad: "فؤاد",
  fuad: "فؤاد",
  fathy: "فتحي",
  fathi: "فتحي",
  farouk: "فاروق",
  farooq: "فاروق",
  fakhr: "فخر",
  fakhry: "فخري",
  fayez: "فايز",
  faiz: "فايز",
  fawzy: "فوزي",
  fawzi: "فوزي",
  kamal: "كمال",
  kamaleldin: "كمال الدين",
  lotfy: "لطفي",
  lotfi: "لطفي",
  mahmoudy: "محمودي",
  moheb: "محب",
  mounir: "منير",
  monir: "منير",
  habib: "حبيب",
  hafez: "حافظ",
  hatem: "حاتم",
  hamdy: "حمدي",
  hamdi: "حمدي",
  hegazy: "حجازي",
  hilal: "هلال",
  helal: "هلال",
  helmy: "حلمي",
  helmi: "حلمي",
  hesham: "هشام",
  hisham: "هشام",
  adam: "آدم",
  eyad: "إياد",
  iyad: "إياد",
  kareem: "كريم",
  kamel: "كامل",
  kassem: "قاسم",
  kassim: "قاسم",
  qasim: "قاسم",
  zein: "زين",
  zain: "زين",
  tamim: "تميم",
  tamem: "تميم",
  salman: "سلمان",
  badr: "بدر",
  bilal: "بلال",
  belal: "بلال",
  bashir: "بشير",
  basheer: "بشير",
  bakr: "بكر",
  bahgat: "بهجت",
  bahy: "باهي",
  bahi: "باهي",
  zaki: "زكي",
  zaky: "زكي",
  saad: "سعد",
  soud: "سعود",
  shadi: "شادي",
  shady: "شادي",
  shadid: "شديد",
  shahata: "شحاتة",
  shehata: "شحاتة",
  shehta: "شحاتة",
  sobhi: "صبحي",
  sedky: "صدقي",
  sedki: "صدقي",
  diab: "دياب",
  diaa: "ضياء",
  deaa: "ضياء",
  zaher: "ظاهر",
  abdelkader: "عبد القادر",
  abdelhalim: "عبد الحليم",
  abdelghani: "عبد الغني",
  abdelmoneim: "عبد المنعم",
  abdelmonem: "عبد المنعم",
  abdelbaset: "عبد الباسط",
  abdelbasit: "عبد الباسط",
  abdelhady: "عبد الهادي",
  abdelradi: "عبد الراضي",
  abdelshafy: "عبد الشافي",
  abdelhamid: "عبد الحميد",
  abdelhameed: "عبد الحميد",
  abdelmajeed: "عبد المجيد",
  abdelmagid: "عبد المجيد",
  abdelkareem: "عبد الكريم",
  abdelkarim: "عبد الكريم",
  abdelwahab: "عبد الوهاب",
  abdelgawad: "عبد الجواد",
  abdelzaher: "عبد الظاهر",
  abdelmohsen: "عبد المحسن",
  abdelraouf: "عبد الرؤوف",
  abdelwahid: "عبد الواحد",
  abdelnasser: "عبد الناصر",
  abdelnaser: "عبد الناصر",
  abdelshakour: "عبد الشكور",
  abdelhakim: "عبد الحكيم",
  abdelfattah: "عبد الفتاح",
  abdelgaffar: "عبد الغفار",
  aboubakr: "أبو بكر",
  abubakr: "أبو بكر",
  abdelaleem: "عبد العليم",
  abdelazem: "عبد العظيم",
  abdelazeem: "عبد العظيم",
  abdelrahim: "عبد الرحيم",
  abdelraheem: "عبد الرحيم",
  abdelgaber: "عبد الجابر",
  abdelghaffar: "عبد الغفار",
  abdelhaleem: "عبد الحليم",
  abdelhak: "عبد الحق",
  abdelkhaleq: "عبد الخالق",
  abdelmalek: "عبد المالك",
  abdelnour: "عبد النور",
  abdelrahman: "عبد الرحمن",
  abdulrahman: "عبد الرحمن",
  abdallah: "عبد الله",
  abdullah: "عبد الله",
  abdelaziz: "عبد العزيز",
  abdulaziz: "عبد العزيز",
  moustapha: "مصطفى",
  antoun: "أنطون",
  girgis: "جرجس",
  gerges: "جرجس",
  kerollos: "كيرلس",
  kirollos: "كيرلس",
  kyrillos: "كيرلس",
  abanoub: "أبانوب",
  abanoob: "أبانوب",
  mark: "مارك",
  fayek: "فايق",
  morcos: "مرقص",
  morkos: "مرقص",
  makram: "مكرم",
  shenouda: "شنودة",
  shinoda: "شنودة",
  ramsis: "رمسيس",
  ramses: "رمسيس",

  // ── Female Names (A-Z) ──
  lojain: "لوجين",
  lujain: "لوجين",
  logine: "لوجين",
  logen: "لوجين",
  login: "لوجين",
  nada: "ندى",
  nadah: "ندى",
  mariam: "مريم",
  maryam: "مريم",
  meryam: "مريم",
  mariem: "مريم",
  maram: "مرام",
  sarah: "سارة",
  sara: "سارة",
  nour: "نور",
  noor: "نور",
  nouran: "نوران",
  nourhan: "نورهان",
  nourhane: "نورهان",
  salma: "سلمى",
  fatma: "فاطمة",
  fatima: "فاطمة",
  fatimah: "فاطمة",
  fatema: "فاطمة",
  aya: "آية",
  ayah: "آية",
  ayat: "آيات",
  hagar: "هاجر",
  hajar: "هاجر",
  reem: "ريم",
  rim: "ريم",
  reham: "ريهام",
  riham: "ريهام",
  rana: "رنا",
  radwa: "رضوى",
  radwah: "رضوى",
  rawan: "روان",
  menna: "منة",
  mennah: "منة",
  minna: "منة",
  mennatallah: "منة الله",
  menatallah: "منة الله",
  habiba: "حبيبة",
  habibah: "حبيبة",
  shahd: "شهد",
  yasmin: "ياسمين",
  yasmine: "ياسمين",
  yasmeen: "ياسمين",
  dina: "دينا",
  donia: "دنيا",
  dunya: "دنيا",
  dalia: "داليا",
  dalya: "داليا",
  mai: "مي",
  may: "مي",
  mayar: "ميار",
  mona: "منى",
  muna: "منى",
  maha: "مها",
  manar: "منار",
  manal: "منال",
  eman: "إيمان",
  iman: "إيمان",
  emane: "إيمان",
  asmaa: "أسماء",
  asma: "أسماء",
  alaa_f: "آلاء",
  alaa: "آلاء",
  shaimaa: "شيماء",
  shimaa: "شيماء",
  shaymaa: "شيماء",
  chaimae: "شيماء",
  doaa: "دعاء",
  douaa: "دعاء",
  omnia: "أمنية",
  omneya: "أمنية",
  omnya: "أمنية",
  arwa: "أروى",
  kenzy: "كنزي",
  kinzy: "كنزي",
  kenzi: "كنزي",
  farida: "فريدة",
  fareeda: "فريدة",
  farah: "فرح",
  gehad: "جهاد",
  jihad: "جهاد",
  roqaya: "رقية",
  roqia: "رقية",
  rokaya: "رقية",
  amany: "أماني",
  amani: "أماني",
  omaima: "أميمة",
  omayma: "أميمة",
  noha: "نهى",
  nuha: "نهى",
  nihal: "نهال",
  nehal: "نهال",
  nesma: "نسمة",
  nesreen: "نسرين",
  nisreen: "نسرين",
  naglaa: "نجلاء",
  nagla: "نجلاء",
  nawal: "نوال",
  nadin: "نادين",
  nadine: "نادين",
  nahed: "ناهد",
  naira: "نيرة",
  nayra: "نيرة",
  nerfeen: "نرفين",
  sondos: "سندس",
  sondus: "سندس",
  samar: "سمر",
  sahar: "سحر",
  soha: "سهى",
  suha: "سهى",
  souhaila: "سهيلة",
  sohaila: "سهيلة",
  soheir: "سهير",
  suheir: "سهير",
  safaa: "صفاء",
  samah: "سماح",
  sabah: "صباح",
  somaya: "سمية",
  somia: "سمية",
  sally: "سالي",
  sali: "سالي",
  taghreed: "تغريد",
  tasneem: "تسنيم",
  tasnim: "تسنيم",
  tasbih: "تسبيح",
  toqa: "تقى",
  tuqa: "تقى",
  toka: "تقى",
  tala: "تالا",
  talia: "تاليا",
  jody: "جودي",
  jodi: "جودي",
  joumana: "جومانا",
  jumana: "جومانا",
  jana: "جنى",
  jannah: "جنة",
  janna: "جنة",
  hanan: "حنان",
  hoda: "هدى",
  houda: "هدى",
  hala: "هالة",
  heba: "هبة",
  hebah: "هبة",
  hend: "هند",
  hadeer: "هدير",
  hadir: "هدير",
  hossna: "حسناء",
  hasnaa: "حسناء",
  khadija: "خديجة",
  khadeeja: "خديجة",
  kholoud: "خلود",
  kholood: "خلود",
  dalal: "دلال",
  doha: "ضحى",
  duha: "ضحى",
  darine: "دارين",
  darin: "دارين",
  rehab: "رحاب",
  rahaf: "رهف",
  razan: "رزان",
  radia: "راضية",
  rawia: "راوية",
  zeinab: "زينب",
  zainab: "زينب",
  zahraa: "زهراء",
  zahra: "زهراء",
  zubaida: "زبيدة",
  ola: "علا",
  afaf: "عفاف",
  aziza: "عزيزة",
  aseel: "أسيل",
  abir: "عبير",
  abeer: "عبير",
  aida: "عايدة",
  ayda: "عايدة",
  ghada: "غادة",
  ghadah: "غادة",
  ghadeer: "غدير",
  faten: "فاتن",
  fayrouz: "فيروز",
  fairouz: "فيروز",
  fariha: "فرحة",
  lamia: "لمياء",
  lamiaa: "لمياء",
  layla: "ليلى",
  laila: "ليلى",
  leila: "ليلى",
  lubna: "لبنى",
  lobna: "لبنى",
  lina: "لينا",
  leena: "لينا",
  lara: "لارا",
  layan: "ليان",
  lian: "ليان",
  monira: "منيرة",
  mervat: "ميرفت",
  mirvat: "ميرفت",
  marwa: "مروة",
  marwah: "مروة",
  mirna: "ميرنا",
  myrna: "ميرنا",
  marian: "ماريان",
  maryan: "ماريان",
  monica: "مونيكا",
  christine: "كريستين",
  martina: "مارتينا",
  verena: "فيرينا",
  irene: "إيريني",
  ireny: "إيريني",
  veronia: "فيرونيا",
  marina: "مارينا",
  sandra: "ساندرا",
  carol: "كارول",
  caroline: "كارولين",
  claudia: "كلاوديا",
};

// ─── Franco-Arabic (Chat Arabic Numbers to Sounds) ───────────────────────────
export const decodeFrancoArabic = (str) => {
  if (!str) return "";
  return str
    .replace(/3'/g, "غ")
    .replace(/3/g, "ع")
    .replace(/7/g, "ح")
    .replace(/5/g, "خ")
    .replace(/2/g, "أ")
    .replace(/8/g, "غ")
    .replace(/6/g, "ط")
    .replace(/9'/g, "ض")
    .replace(/9/g, "ص")
    .replace(/4/g, "ش");
};

/**
 * Clean student name from trailing numbers, IDs, emails and special symbols.
 * Example: "LOJAIN AHMED FARAHAT 949" -> "LOJAIN AHMED FARAHAT"
 */
export const cleanStudentName = (rawName) => {
  if (!rawName || typeof rawName !== "string") return "";

  let cleaned = rawName
    .replace(/@[\w.-]+/g, "") // Remove @emails if typed
    .replace(/\b\d{2,}\b/g, "") // Remove multi-digit ID numbers (e.g. 949, 2024, 0101)
    .replace(/[#@$%^&*()_+={}\[\]:;"'<>?,./\\|`~]/g, " ") // Clean symbols
    .replace(/[-_]/g, " ") // Convert hyphens & underscores to space
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
};

/**
 * Smart First Name Extractor
 * Accurately extracts first name including Arabic & English compound prefixes.
 */
export const getFirstName = (fullName) => {
  const cleaned = cleanStudentName(fullName);
  if (!cleaned) return "";

  const tokens = cleaned.split(" ").filter(Boolean);
  if (tokens.length === 0) return "";

  const firstLower = tokens[0].toLowerCase();

  // Compound male prefixes: Abd El, Abdel, Abdul, Abou, Abu, Mohamed Ali, etc.
  if (
    (firstLower === "عبد" ||
      firstLower === "abdel" ||
      firstLower === "abdul" ||
      firstLower === "abd" ||
      firstLower === "abu" ||
      firstLower === "abou" ||
      firstLower === "ابو" ||
      firstLower === "أبو" ||
      firstLower === "ابن" ||
      firstLower === "ibn") &&
    tokens.length > 1
  ) {
    return `${tokens[0]} ${tokens[1]}`;
  }

  // Compound female prefixes: Menna Allah, Nour El Din, etc.
  if (
    (firstLower === "منة" ||
      firstLower === "menna" ||
      firstLower === "nour" ||
      firstLower === "نور") &&
    tokens.length > 1
  ) {
    const secondLower = tokens[1].toLowerCase();
    if (
      secondLower === "الله" ||
      secondLower === "allah" ||
      secondLower === "الدين" ||
      secondLower === "eldin" ||
      secondLower === "al-din" ||
      secondLower === "el-din"
    ) {
      return `${tokens[0]} ${tokens[1]}`;
    }
  }

  return tokens[0];
};

/**
 * Transliterates an individual word/token to Arabic.
 * Priority:
 * 1. Exact Dictionary Match
 * 2. Prefix stripping (e.g. "El-" or "Al-" -> "ال" + stem)
 * 3. Franco-Arabic check
 * 4. Rule-based phonetic engine
 */
export const transliterateWordToArabic = (word) => {
  if (!word) return "";
  const clean = word.toLowerCase().trim();

  // 1. Direct Dictionary Match
  if (COMMON_NAMES_MAP[clean]) {
    return COMMON_NAMES_MAP[clean];
  }

  // 2. Handle "El" or "Al" prefix (e.g. "ElGohary" -> "الجوهري", "AlSayed" -> "السيد")
  if (clean.startsWith("el") && clean.length > 4) {
    const stem = clean.slice(2);
    if (COMMON_NAMES_MAP[stem]) {
      return "ال" + COMMON_NAMES_MAP[stem];
    }
  }
  if (clean.startsWith("al") && clean.length > 4) {
    const stem = clean.slice(2);
    if (COMMON_NAMES_MAP[stem]) {
      return "ال" + COMMON_NAMES_MAP[stem];
    }
  }

  // 3. Handle Franco-Arabic numbers if typed by students (e.g. "a7med" -> "أحمد")
  if (/[2356789]/.test(clean)) {
    const francoDecoded = decodeFrancoArabic(clean);
    return transliterateWordToArabic(francoDecoded);
  }

  // 4. Advanced Phonetic Rule-Based Engine
  let result = clean;

  // Composite sound mappings
  result = result
    .replace(/^el-?|^al-?/g, "ال")
    .replace(/kh/g, "خ")
    .replace(/sh/g, "ش")
    .replace(/th/g, "ث")
    .replace(/gh/g, "غ")
    .replace(/ph/g, "ف")
    .replace(/ch/g, "تش")
    .replace(/dh/g, "ض")
    .replace(/zh/g, "ظ")
    .replace(/ee/g, "ي")
    .replace(/oo/g, "و")
    .replace(/ou/g, "و")
    .replace(/aa/g, "ا")
    .replace(/ai/g, "اي")
    .replace(/ay/g, "اي")
    .replace(/ey/g, "ي")
    .replace(/ie/g, "ي");

  // Single letters
  result = result
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
    .replace(/v/g, "ف")
    .replace(/x/g, "كس")
    .replace(/p/g, "ب");

  // Female trailing -ah or -a rule at the end of word (e.g. هبة, فاطمة, سارة)
  if (result.endsWith("اه") && result.length > 3) {
    result = result.slice(0, -2) + "ة";
  } else if (result.endsWith("ه") && result.length > 3 && !result.endsWith("الله")) {
    result = result.slice(0, -1) + "ة";
  }

  return result;
};

/**
 * Master Smart Arabic Name Converter
 * Converts full names or first names from English to Arabic with full accuracy.
 *
 * @param {string} name - Raw student name (e.g. "LOJAIN AHMED FARAHAT 949", "a7med mohamed")
 * @param {boolean} firstNameOnly - Whether to return only the first name
 * @returns {string} Fully cleaned and Arabic-transliterated name
 */
export const convertNameToSmartArabic = (name, firstNameOnly = false) => {
  const cleaned = cleanStudentName(name);
  if (!cleaned) return "";

  // If already Arabic, extract first name or return as is
  const hasArabic = /[\u0600-\u06FF]/.test(cleaned);
  if (hasArabic) {
    return firstNameOnly ? getFirstName(cleaned) : cleaned;
  }

  // Target string: either first name or full name
  const target = firstNameOnly ? getFirstName(cleaned) : cleaned;

  // Split tokens by spaces
  const tokens = target.split(" ").filter(Boolean);

  // Convert each token
  const arabicTokens = tokens.map((token) => transliterateWordToArabic(token));

  return arabicTokens.join(" ");
};
