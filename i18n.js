// i18n.js
// موتور مدیریت بین‌المللی‌سازی (Internationalization) بازی
// این فایل مسئول بارگذاری، مدیریت و ارائه ترجمه‌ها در سراسر بازی است.

/**
 * لیستی از زبان‌های پشتیبانی‌شده.
 * کلید: کد زبان (ISO 639-1)
 * مقدار: نام بومی زبان برای نمایش در منوی انتخاب زبان.
 */
const supportedLanguages = {
  en: "English",
  fa: "فارسی (Persian)",
  fr: "Français (French)",
  de: "Deutsch (German)",
  es: "Español (Spanish)",
  tr: "Türkçe (Turkish)",
};

// متغیری برای نگهداری ترجمه‌های زبان فعلی که بارگذاری شده است.
let currentTranslations = {};
// متغیری برای نگهداری کد زبان فعلی.
let currentLang = "en"; // زبان پیش‌فرض انگلیسی است.

/**
 * تابع اصلی برای دریافت یک رشته ترجمه‌شده.
 * @param {string} key - کلید رشته مورد نظر (مثلاً 'CREATE_YOUR_CHARACTER').
 * @param {object} [params={}] - یک آبجکت شامل متغیرهایی که باید در رشته جایگزین شوند (مثلاً {name: "John"}).
 * @returns {string} رشته ترجمه‌شده یا خود کلید در صورت یافت نشدن.
 */
export function t(key, params = {}) {
  // ابتدا سعی می‌کند ترجمه را در زبان فعلی پیدا کند.
  let translation = currentTranslations[key];

  // اگر ترجمه یافت نشد، یک هشدار در کنسول نمایش داده شده و خود کلید به عنوان بازگشت داده می‌شود.
  // این به ما در پیدا کردن ترجمه‌های گمشده کمک می‌کند.
  if (translation === undefined) {
    console.warn(
      `[i18n] Translation key not found for language '${currentLang}': ${key}`
    );
    return `[${key}]`; // بازگرداندن کلید برای اینکه مشخص شود ترجمه نشده
  }

  // جایگزینی پارامترها در رشته ترجمه (مثلا جایگزینی {name} با مقدار واقعی)
  for (const paramKey in params) {
    const regex = new RegExp(`{${paramKey}}`, "g");
    translation = translation.replace(regex, params[paramKey]);
  }

  return translation;
}

/**
 * زبان بازی را تغییر می‌دهد.
 * این تابع به صورت async تعریف شده زیرا فایل‌های زبان را به صورت پویا بارگذاری می‌کند.
 * @param {string} lang - کد زبان جدید (مثلاً 'fa').
 * @returns {Promise<boolean>} - یک Promise که در صورت موفقیت true و در غیر این صورت false برمی‌گرداند.
 */
export async function setLanguage(lang) {
  // بررسی می‌کند که آیا زبان درخواستی پشتیبانی می‌شود یا نه.
  if (!supportedLanguages[lang]) {
    console.error(`[i18n] Attempted to set unsupported language: ${lang}`);
    return false;
  }

  try {
    // بارگذاری پویای فایل زبان مربوطه با استفاده از dynamic import.
    // این کار باعث می‌شود فقط فایل زبان مورد نیاز کاربر دانلود شود.
    const module = await import(`./locales/${lang}.js`);
    currentTranslations = module.translations;
    currentLang = lang;
    console.log(`[i18n] Language changed to: ${lang}`);

    // تغییر جهت سند بر اساس زبان
    if (lang === "fa") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }

    return true;
  } catch (error) {
    console.error(`[i18n] Failed to load language file for: ${lang}`, error);
    return false;
  }
}

/**
 * کد زبان فعلی را برمی‌گرداند.
 * @returns {string} کد زبان فعلی (e.g., 'en').
 */
export function getLang() {
  return currentLang;
}

/**
 * لیست تمام زبان‌های پشتیبانی‌شده را برمی‌گرداند.
 * @returns {object} آبجکتی از زبان‌های پشتیبانی‌شده.
 */
export function getAvailableLanguages() {
  return supportedLanguages;
}

/**
 * تابع اولیه برای راه‌اندازی سیستم زبان هنگام شروع بازی.
 * زبان ذخیره‌شده کاربر را بارگذاری می‌کند یا به زبان پیش‌فرض (انگلیسی) برمی‌گردد.
 * @returns {Promise<void>}
 */
export async function initI18n() {
  // سعی می‌کند زبان ذخیره شده کاربر از حافظه مرورگر (localStorage) را بخواند.
  const savedLang = localStorage.getItem("game_language") || "en";
  await setLanguage(savedLang);
}
