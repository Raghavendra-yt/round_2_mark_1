import { sanitizeHtml, sanitizeText, sanitizeUrl, sanitizeName } from './sanitize';

describe('sanitizeHtml', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitizeHtml(null)).toBe('');
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml(42)).toBe('');
  });

  it('strips disallowed tags like <script>', () => {
    const result = sanitizeHtml('<script>alert("xss")</script><b>safe</b>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('<b>safe</b>');
  });

  it('preserves allowed tags', () => {
    const result = sanitizeHtml('<strong>hello</strong> <em>world</em>');
    expect(result).toContain('<strong>hello</strong>');
    expect(result).toContain('<em>world</em>');
  });

  it('strips onclick and event handlers', () => {
    const result = sanitizeHtml('<b onclick="evil()">text</b>');
    expect(result).not.toContain('onclick');
  });
});

describe('sanitizeText', () => {
  it('strips all HTML tags', () => {
    const result = sanitizeText('<b>hello</b> <script>evil()</script>');
    expect(result).toBe('hello ');
  });

  it('returns empty string for non-strings', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
  });

  it('preserves plain text content', () => {
    expect(sanitizeText('hello world')).toBe('hello world');
  });
});

describe('sanitizeUrl', () => {
  it('returns null for non-HTTPS URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBeNull();
    expect(sanitizeUrl('ftp://files.example.com')).toBeNull();
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
  });

  it('accepts valid HTTPS URLs', () => {
    expect(sanitizeUrl('https://example.com/path?q=1')).toBe('https://example.com/path?q=1');
  });

  it('returns null for invalid URLs', () => {
    expect(sanitizeUrl('not-a-url')).toBeNull();
    expect(sanitizeUrl('')).toBeNull();
    expect(sanitizeUrl(null)).toBeNull();
  });
});

describe('sanitizeName', () => {
  it('allows letters, spaces, hyphens, apostrophes', () => {
    expect(sanitizeName("John O'Brien")).toBe("John O'Brien");
    expect(sanitizeName('Mary-Jane')).toBe('Mary-Jane');
  });

  it('strips special characters', () => {
    expect(sanitizeName('<script>evil</script>')).toBe('scriptevilscript');
  });

  it('truncates at 64 characters', () => {
    const long = 'a'.repeat(100);
    expect(sanitizeName(long).length).toBe(64);
  });

  it('returns empty string for non-strings', () => {
    expect(sanitizeName(null)).toBe('');
    expect(sanitizeName(undefined)).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeName('  Alice  ')).toBe('Alice');
  });
});
