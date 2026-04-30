import DOMPurify from 'dompurify';

/**
 * Sanitise a raw HTML string using DOMPurify.
 * Always use this before rendering any HTML via dangerouslySetInnerHTML.
 * @param {string} dirty - Untrusted HTML string.
 * @returns {string} Safe HTML string.
 */
export function sanitizeHtml(dirty) {
  if (typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'li', 'ol'] });
}

/**
 * Strip ALL HTML tags from a string, returning plain text.
 * @param {string} dirty - Untrusted string.
 * @returns {string} Safe plain text.
 */
export function sanitizeText(dirty) {
  if (typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}

/**
 * Validate and sanitise a URL, ensuring it uses HTTPS.
 * @param {string} url - URL to validate.
 * @returns {string|null} Safe URL or null if invalid.
 */
export function sanitizeUrl(url) {
  if (typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return null;
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Sanitise a name string used in form inputs.
 * Allows letters, spaces, hyphens and apostrophes only.
 * @param {string} name - User-supplied name.
 * @returns {string} Sanitised name.
 */
export function sanitizeName(name) {
  if (typeof name !== 'string') return '';
  return name.replace(/[^a-zA-Z\u00C0-\u024F\s'\-]/g, '').trim().slice(0, 64);
}
