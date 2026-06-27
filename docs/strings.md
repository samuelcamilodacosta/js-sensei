# Strings: Templates, Unicode, and Locale-Aware Operations

String handling in JavaScript affects UX (display, sorting), security (sanitization), and correctness (Unicode normalization). Production code must account for multibyte characters, locales, and modern APIs.

---

## Introduction

Strings are UTF-16 code unit sequences in JavaScript. Methods like **`replaceAll`**, **template literals**, **`localeCompare`**, and **`normalize`** address real production needs: interpolation, global replacement, culturally correct sorting, and consistent Unicode forms.

---

## When to Use

- **Template literals** — interpolation, multiline config, tagged templates for i18n DSLs
- **`replaceAll`** — global literal or regex replacement (ES2021)
- **`localeCompare`** — user-visible sorting
- **`normalize`** — compare/login/email canonical forms (NFC/NFD)
- **`Intl` APIs** — formatting numbers/dates relative to locale ([numbers.md](./numbers.md))

---

## When to Avoid

- `localeCompare` in hot server paths without caching locale collators
- Regex with unbounded backtracking on user input
- Concatenation in tight loops when array join is clearer (micro-optimization rarely needed)
- Assuming one character equals one `length` unit — use `[...str]` or `Intl.Segmenter` for graphemes

---

## Best Practices

1. Use template literals over `+` concatenation for readability
2. Normalize user identifiers (email) at validation boundary
3. Use `Intl.Segmenter` for user-perceived character boundaries in UI
4. Escape dynamic content in HTML contexts ([security.md](./security.md))
5. Prefer `String.prototype` methods over legacy patterns

---

## Bad Practices

- Building SQL/command strings via concatenation (injection risk)
- Sorting with `<` for display names internationally
- Using `split('')` for Unicode — breaks surrogate pairs
- `replace` with string pattern expecting global replace (only first match)

---

## Template Literals

### ❌ Bad

```javascript
const message = 'Hello ' + user.name + ', your order #' + order.id + ' shipped.';
```

Hard to read; error-prone with spacing.

---

### ✅ Better

```javascript
const message = `Hello ${user.name}, your order #${order.id} shipped.`;
```

---

### ✅ Best

```javascript
function formatShipmentNotice({ user, order }, { locale = 'en-US' } = {}) {
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  return `Hello ${user.name}, order #${order.id} shipped on ${formatter.format(order.shippedAt)}.`;
}
```

Separation of formatting concerns; testable with fixed locale.

---

## replaceAll and Unicode

### ❌ Bad

```javascript
const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/\s+/g, '-');
// duplicate replace; doesn't handle unicode accents
```

---

### ✅ Better

```javascript
function toSlug(title) {
  return title.trim().toLowerCase().replaceAll(/\s+/g, '-');
}
```

Global whitespace replace with `replaceAll`; ASCII-only slugs still break on accents.

---

### ✅ Best

```javascript
function toSlug(title) {
  return title
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '');
}
```

Unicode-aware slug generation with explicit normalization.

---

## Before / After

### 27. Global replace

**Before:** `text.replace(/foo/g, 'bar')` (fine) vs `text.replace('foo', 'bar')` (single)

**After:** `text.replaceAll('foo', 'bar')`

### 28. Multiline

**Before:** `'line1\n' + 'line2\n' + 'line3'`

**After:** `` `line1\nline2\nline3` ``

### 29. Padding

**Before:** manual loop adding zeros

**After:** `String(n).padStart(4, '0')`

### 30. Trim whitespace

**Before:** `str.replace(/^\s+|\s+$/g, '')`

**After:** `str.trim()`

### 31. Starts/ends

**Before:** `str.indexOf(prefix) === 0`

**After:** `str.startsWith(prefix)`

### 32. Locale sort

**Before:** `names.sort((a, b) => a.localeCompare(b))` without locale

**After:** `names.sort((a, b) => a.localeCompare(b, 'sv'))`

---

## Common Pitfalls

- **`length` vs grapheme count** — emoji and combined marks
- **Case mapping** — `toLowerCase()` locale quirks; use `toLocaleLowerCase` when needed
- **Template injection** — never embed unsanitized HTML in templates for DOM

---

## Performance

- Template literals comparable to concatenation in modern engines
- `normalize` on every keystroke — debounce in UI
- Cache `Intl` formatters — construction is expensive

---

## References

- [MDN — Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- [MDN — `replaceAll`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll)
- [MDN — `normalize`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
- [MDN — `localeCompare`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
- [Unicode Standard Annex #15](https://unicode.org/reports/tr15/)
