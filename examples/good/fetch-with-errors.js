/**
 * Recommended pattern — custom errors with cause.
 * See docs/errors.md
 */

export class HttpError extends Error {
  constructor(status, body, options) {
    super(`HTTP ${status}`, options);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

export async function fetchJson(url, { signal, headers = {} } = {}) {
  let response;
  try {
    response = await fetch(url, {
      signal,
      headers: { Accept: 'application/json', ...headers },
    });
  } catch (error) {
    throw new HttpError(0, 'Network failure', { cause: error });
  }

  if (!response.ok) {
    const body = await response.text();
    throw new HttpError(response.status, body);
  }

  return response.json();
}
