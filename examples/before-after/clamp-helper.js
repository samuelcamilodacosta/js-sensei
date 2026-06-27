// #38 — clamp helper

function clampBefore(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function clampAfter(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function clamp(value, min, max) {
  return clampAfter(value, min, max);
}

export { clampBefore, clampAfter };
