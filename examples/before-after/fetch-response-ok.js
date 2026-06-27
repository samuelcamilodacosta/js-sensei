// fetch — check response.ok

export async function getJsonBefore(url) {
  const res = await fetch(url);
  return res.json();
}

export async function getJsonAfter(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}
