// #13 — destructure rename

const user = { userId: 'u1', fullName: 'Ada Lovelace' };

const idBefore = user.userId;
const nameBefore = user.fullName;

const { userId: idAfter, fullName: nameAfter } = user;

export { idBefore, nameBefore, idAfter, nameAfter };
