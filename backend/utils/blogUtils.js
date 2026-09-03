const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'img',
  'code',
  'pre',
  'div',
  'span',
]);

const ALLOWED_ATTRS = {
  a: ['href', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
  p: ['style'],
  div: ['style'],
  span: ['style'],
  blockquote: ['style'],
  h2: ['style'],
  h3: ['style'],
  li: ['style'],
  pre: ['style'],
  code: ['style'],
};

export const sanitizeSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

export const sanitizeCategory = (value = '') => value.trim();

export const sanitizeText = (value = '') =>
  String(value || '').replace(/\s+/g, ' ').trim();

export const stripHtml = (value = '') =>
  String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeHtmlAttribute = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const sanitizeUrl = (value = '') => {
  const trimmed = String(value || '').trim();

  if (/^(https?:|\/|#|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return '';
};

const sanitizeStyle = (value = '') => {
  const match = String(value || '').match(/text-align\s*:\s*(left|right|center|justify)/i);
  return match ? `text-align: ${match[1].toLowerCase()}` : '';
};

const parseAttributes = (attributeString = '') => {
  const attributes = {};
  const matcher = /([a-z0-9:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/gi;
  let match = matcher.exec(attributeString);

  while (match) {
    const key = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    attributes[key] = value;
    match = matcher.exec(attributeString);
  }

  return attributes;
};

export const sanitizeRichTextHtml = (value = '') => {
  const input = String(value || '');

  const withoutBlockedTags = input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|link|meta)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed|link|meta)[^>]*\/?>(?![^<]*<\/\1>)/gi, '');

  return withoutBlockedTags.replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (match, tagName, rawAttrs = '') => {
    const tag = String(tagName).toLowerCase();

    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }

    if (match.startsWith('</')) {
      return `</${tag}>`;
    }

    const attrs = parseAttributes(rawAttrs);
    const allowedAttrs = ALLOWED_ATTRS[tag] || [];
    const sanitizedAttrs = [];

    for (const attrName of allowedAttrs) {
      if (!(attrName in attrs)) continue;

      const rawValue = attrs[attrName];
      let safeValue = rawValue;

      if (attrName === 'href' || attrName === 'src') {
        safeValue = sanitizeUrl(rawValue);
        if (!safeValue) continue;
      }

      if (attrName === 'style') {
        safeValue = sanitizeStyle(rawValue);
        if (!safeValue) continue;
      }

      if (attrName === 'target') {
        safeValue = String(rawValue).trim().toLowerCase();
        if (!['_blank', '_self', '_parent', '_top'].includes(safeValue)) {
          continue;
        }
      }

      if (attrName === 'loading') {
        safeValue = String(rawValue).trim().toLowerCase();
        if (!['lazy', 'eager'].includes(safeValue)) {
          continue;
        }
      }

      if (attrName === 'decoding') {
        safeValue = String(rawValue).trim().toLowerCase();
        if (!['async', 'sync', 'auto'].includes(safeValue)) {
          continue;
        }
      }

      sanitizedAttrs.push(`${attrName}="${escapeHtmlAttribute(safeValue)}"`);
    }

    if (tag === 'a') {
      const href = sanitizeUrl(attrs.href || '');
      if (href && !attrs.target) {
        sanitizedAttrs.push('target="_blank"');
        sanitizedAttrs.push('rel="noopener noreferrer"');
      }
    }

    if (tag === 'img' && !attrs.alt) {
      sanitizedAttrs.push('alt=""');
    }

    const attrString = sanitizedAttrs.length ? ` ${sanitizedAttrs.join(' ')}` : '';
    return `<${tag}${attrString}>`;
  });
};

export const extractPlainText = (value = '') => stripHtml(sanitizeRichTextHtml(value));

export const generateExcerpt = (value = '', maxLength = 180) => {
  const text = extractPlainText(value);

  if (!text) return '';
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}...`;
};

export const calculateReadingTime = (value = '') => {
  const words = extractPlainText(value)
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
};

export const normalizeBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return String(value).toLowerCase() === 'true';
};

export const parseOptionalDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
