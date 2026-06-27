// #62 — inject config instead of global import

const config = { apiUrl: 'https://api.example.com' };

function createClientBefore() {
  return { baseUrl: config.apiUrl };
}

function createClientAfter({ apiUrl }) {
  return { baseUrl: apiUrl };
}

export { createClientBefore, createClientAfter };
