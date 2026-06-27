// Before / After #49 — Promise.all vs allSettled for batch operations

async function backupOne(db) {
  if (db === 'fail') throw new Error('backup failed');
  return { db, ok: true };
}

const databases = ['primary', 'fail', 'replica'];

async function backupAllFailFast() {
  return Promise.all(databases.map(backupOne));
}

async function backupAllReport() {
  return Promise.allSettled(databases.map(backupOne));
}

export { backupAllFailFast, backupAllReport };
