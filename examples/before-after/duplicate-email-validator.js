// #75 — deduplicate email validation

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistrationBefore(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('invalid');
}

function validateLoginBefore(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('invalid');
}

function validateEmailAfter(email) {
  if (!EMAIL_RE.test(email)) throw new Error('invalid');
}

export { validateRegistrationBefore, validateLoginBefore, validateEmailAfter, EMAIL_RE };
