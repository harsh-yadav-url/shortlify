const { getUser } = require("../service/auth");

function checkAuthentication(req, res, next) {
  const TokenCookie = req.cookies.token;
  req.user = null;
  if (!TokenCookie) return next();
  const token = TokenCookie;
  const user = getUser(token);

  req.user = user;
  return next();
}
// admin // normal
function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");

    if (!roles.includes(req.user.role)) return res.end("UnAuthorized");

    return next();
  };
}

module.exports = { checkAuthentication, restrictTo };
