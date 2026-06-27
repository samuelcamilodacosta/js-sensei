/**
 * INTENTIONALLY BAD — Do not use in production.
 * Demonstrates var hoisting, global leak, and callback hell.
 * See docs/antipatterns.md and docs/variables.md
 */

var cache = {};

function getUserBad(id, callback) {
  if (cache[id]) {
    callback(null, cache[id]);
    return;
  }
  fetch('/api/users/' + id)
    .then(function (res) {
      return res.json();
    })
    .then(function (user) {
      cache[id] = user;
      callback(null, user);
    })
    .catch(function (err) {
      callback(err);
    });
}

function loadDashboardBad(userId, cb) {
  getUserBad(userId, function (err, user) {
    if (err) return cb(err);
    fetch('/api/orders?user=' + user.id)
      .then(function (r) {
        return r.json();
      })
      .then(function (orders) {
        cb(null, { user: user, orders: orders });
      })
      .catch(function (e) {
        cb(e);
      });
  });
}

export { getUserBad, loadDashboardBad };
