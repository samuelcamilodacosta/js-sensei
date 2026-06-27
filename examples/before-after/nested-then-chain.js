// #46 — nested then vs flat async

const api = {
  getUser: (id) => Promise.resolve({ id, teamId: 't1' }),
  getTeam: (id) => Promise.resolve({ id, name: 'Eng' }),
};

function loadBefore(userId) {
  return api
    .getUser(userId)
    .then((user) => api.getTeam(user.teamId).then((team) => ({ user, team })));
}

async function loadAfter(userId) {
  const user = await api.getUser(userId);
  const team = await api.getTeam(user.teamId);
  return { user, team };
}

export { loadBefore, loadAfter };
