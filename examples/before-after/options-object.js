// Before / After #73 — many positional params vs options object

function createUserBefore(name, email, role, sendEmail, locale, timezone) {
  return { name, email, role, sendEmail, locale, timezone };
}

function createUserAfter({
  name,
  email,
  role,
  sendEmail = true,
  locale = 'en-US',
  timezone = 'UTC',
}) {
  return { name, email, role, sendEmail, locale, timezone };
}

export { createUserBefore, createUserAfter };
