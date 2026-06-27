// Before / After #101 — classList vs className string concat

export function activateTabBefore(el) {
  el.className += ' active';
}

export function activateTabAfter(el) {
  el.classList.add('active');
}

export function deactivateTabAfter(el) {
  el.classList.remove('active');
}
