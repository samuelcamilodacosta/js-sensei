// Before / After #5 — var loop closure vs let / for..of

const tasks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

// Before — var captures single binding
function scheduleWithVar() {
  // eslint-disable-next-line no-var
  for (var i = 0; i < tasks.length; i++) {
    setTimeout(() => console.log(i), 10); // prints 3, 3, 3
  }
}

// After — block-scoped binding per iteration
function scheduleWithLet() {
  for (let i = 0; i < tasks.length; i++) {
    setTimeout(() => console.log(i), 10); // 0, 1, 2
  }
}

export { scheduleWithVar, scheduleWithLet };
