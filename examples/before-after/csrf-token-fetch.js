// Before / After — CSRF token on mutating fetch (security)

export async function transferBefore(accountId, amount) {
  await fetch('/api/transfer', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId, amount }),
  });
}

export async function transferAfter(accountId, amount, { csrfToken } = {}) {
  await fetch('/api/transfer', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ accountId, amount }),
  });
}

export function readCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.content;
}
