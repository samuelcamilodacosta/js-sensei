# Security: XSS, CSRF, CSP, Validation, and Prototype Pollution

JavaScript applications face browser and server-side threats. Defense in depth combines **validation**, **contextual encoding**, **Content Security Policy**, safe DOM APIs, and hardening against **prototype pollution**.

---

## Introduction

**Cross-Site Scripting (XSS)** injects executable scripts through untrusted input rendered in the browser. **Cross-Site Request Forgery (CSRF)** tricks authenticated browsers into performing unwanted state-changing requests. **Content Security Policy (CSP)** restricts which scripts and resources may execute. **Prototype pollution** alters `Object.prototype` via unsafe merge/parse patterns, affecting application logic and sometimes leading to RCE in Node services.

Security is a system property — client-side checks alone are insufficient. Validate at boundaries; encode on output; enforce policy on server and via headers.

---

## When to Use

- **Input validation** at API and form boundaries (schema, allowlists)
- **Output encoding** matched to context (HTML, URL, JS, CSS)
- **CSP** with nonces or hashes in production deployments
- **SameSite cookies** + CSRF tokens for cookie-based sessions
- **Object.hasOwn** and safe merge utilities for untrusted objects
- **HttpOnly, Secure** flags on session cookies

---

## When to Avoid

- `eval`, `new Function`, `innerHTML` with user-controlled strings
- Deep merging untrusted JSON into plain objects
- Storing bearer tokens in localStorage when XSS surface exists
- Rolling custom crypto or sanitizers without maintenance commitment
- Disabling CSP entirely for convenience in production

---

## Best Practices

1. Treat all external input as hostile until validated
2. Use framework escaping defaults; audit bypass points (`dangerouslySetInnerHTML`)
3. Implement CSP in report-only mode first, then enforce
4. Rotate CSRF tokens per session; validate on mutating verbs
5. Keep dependencies patched; supply chain attacks are common
6. Log security events without leaking secrets to clients

---

## Bad Practices

- Client-only validation (bypass trivial via DevTools)
- Reflecting raw error stacks to end users
- Allowing `javascript:` URLs in user-provided links
- Parsing query strings into objects via recursive merge without key blocklists
- CORS `Access-Control-Allow-Origin: *` with credentials

---

## XSS (Cross-Site Scripting)

### ❌ Bad

```javascript
document.getElementById('bio').innerHTML = user.bio;
searchResults.innerHTML = items.map((i) => `<li>${i.name}</li>`).join('');
```

Any HTML/script in `user.bio` or `i.name` executes in your origin.

---

### ✅ Better

```javascript
document.getElementById('bio').textContent = user.bio;
const li = document.createElement('li');
li.textContent = item.name;
list.appendChild(li);
```

Text nodes do not parse HTML.

---

### ✅ Best

```javascript
import DOMPurify from 'dompurify'; // maintained sanitizer if HTML required

function renderBio(element, bio, { allowHtml = false } = {}) {
  if (allowHtml) {
    element.innerHTML = DOMPurify.sanitize(bio, { USE_PROFILES: { html: true } });
  } else {
    element.textContent = bio;
  }
}
```

Sanitize only when rich text is a product requirement. **When NOT to use sanitizer:** plain text fields — use `textContent` only.

---

## CSRF (Cross-Site Request Forgery)

### ❌ Bad

```javascript
// Cookie session; state-changing POST with no CSRF token
await fetch('/api/transfer', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ to: accountId, amount }),
});
```

Malicious site can trigger this from victim's browser while logged in.

---

### ✅ Better

```javascript
await fetch('/api/transfer', {
  method: 'POST',
  credentials: 'include',
  headers: { 'X-CSRF-Token': getCsrfTokenFromMeta() },
  body: JSON.stringify({ to: accountId, amount }),
});
```

---

### ✅ Best

Server enforces:

- `SameSite=Lax` or `Strict` on session cookies
- CSRF token bound to session, validated on POST/PUT/PATCH/DELETE
- `Origin` / `Referer` verification for sensitive operations

Client reads token from meta tag or cookie double-submit pattern. **Trade-off:** token plumbing adds complexity — mandatory for cookie auth.

---

## Content Security Policy (CSP)

### ❌ Bad

No CSP; inline scripts and any CDN allowed.

---

### ✅ Better

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
```

Blocks inline script — may break apps relying on inline handlers.

---

### ✅ Best

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}';
  style-src 'self' 'nonce-{RANDOM}';
  object-src 'none';
  base-uri 'self';
  report-uri /csp-report
```

Generate per-request nonce server-side; attach to script tags. Start with `Content-Security-Policy-Report-Only` ([web.dev CSP guide](https://web.dev/articles/csp)).

---

## Prototype Pollution

### ❌ Bad

```javascript
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key]) {
      target[key] = target[key] || {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
merge({}, JSON.parse(userInput));
```

Keys like `__proto__` or `constructor.prototype` can pollute all objects.

---

### ✅ Better

```javascript
function safeAssign(target, source) {
  for (const key of Object.keys(source)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    target[key] = source[key];
  }
  return target;
}
```

Shallow only; blocks obvious keys.

---

### ✅ Best

Validate with a schema (allowlisted keys), use `Map` for dynamic key bags, or a maintained library with pollution tests. Never merge untrusted objects recursively into `{}`.

---

## Validation at Boundaries

### ❌ Bad

```javascript
const payload = JSON.parse(req.body);
await createUser(payload); // trusts shape
```

---

### ✅ Best

```javascript
const result = UserCreateSchema.safeParse(JSON.parse(req.body));
if (!result.success) {
  throw new ValidationError('Invalid input', { cause: result.error });
}
await createUser(result.data);
```

Schema validates types, bounds, and forbidden fields before domain logic.

---

## Before / After

### 110. URL injection

**Before:** `` `<a href="${userUrl}">link</a>` ``  
**After:** allowlist protocols (`https:`, `mailto:`) before rendering

### 111. JSON.parse trust

**Before:** `JSON.parse(input)` then use directly  
**After:** parse → schema validate → domain

---

## Common Pitfalls

- **DOMPurify bypasses** — keep updated; avoid `ALLOW_UNKNOWN_PROTOCOLS`
- **JWT in localStorage** — any XSS exfiltrates token
- **JSONP** — avoid; use CORS fetch
- **postMessage** without origin check — cross-frame attacks
- **Regex validation** for HTML — use proper encoding/sanitization

---

## Performance

Security checks add latency at boundaries — negligible vs network. CSP parsing is browser-native. Heavy sanitization on every keystroke — debounce or sanitize on submit.

---

## References

- [MDN — Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [web.dev — CSP](https://web.dev/articles/csp)
- [web.dev — XSS](https://web.dev/articles/cross-site-scripting)
- [TC39 — Object integrity notes](https://tc39.es/ecma262/)
