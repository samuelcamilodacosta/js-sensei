// #48 — finally for shared cleanup

let spinnerVisible = false;

function showSpinner() {
  spinnerVisible = true;
}
function hideSpinner() {
  spinnerVisible = false;
}

async function saveBefore(data) {
  showSpinner();
  try {
    return await persist(data);
  } catch (e) {
    hideSpinner();
    throw e;
  }
  // missing finally — hideSpinner not called on success path
}

async function saveAfter(data) {
  showSpinner();
  try {
    return await persist(data);
  } finally {
    hideSpinner();
  }
}

function persist(data) {
  return Promise.resolve({ saved: true, data });
}

export { saveBefore, saveAfter, spinnerVisible };
