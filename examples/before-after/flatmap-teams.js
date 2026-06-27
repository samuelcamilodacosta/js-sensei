// Before / After #21 — flatMap vs map().flat()

const teams = [
  { name: 'A', members: ['u1', 'u2'] },
  { name: 'B', members: ['u3'] },
];

const membersBefore = teams.map((t) => t.members).flat();
const membersAfter = teams.flatMap((t) => t.members);

export { membersBefore, membersAfter };
