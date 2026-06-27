// Before / After #1 and #11 — Optional chaining modernization

// Before
function getCityBefore(user) {
  if (user && user.address && user.address.city) {
    return user.address.city;
  }
  return null;
}

// After
function getCityAfter(user) {
  return user?.address?.city ?? null;
}

export { getCityBefore, getCityAfter };
