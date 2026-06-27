// Before / After #7 — default parameters vs ||

function fetchUsersBefore(limit) {
  limit = limit || 50; // 0 becomes 50
  return { limit };
}

function fetchUsersAfter(limit = 50) {
  return { limit };
}

export { fetchUsersBefore, fetchUsersAfter };
