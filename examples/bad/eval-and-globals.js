/**
 * INTENTIONALLY BAD — global pollution and eval pattern.
 * See docs/security.md and docs/antipatterns.md
 */

globalAppState = { users: [] };

function runUserScriptBad(input) {
  const fn = eval('(' + input + ')');
  return fn(globalAppState);
}

export { runUserScriptBad };
