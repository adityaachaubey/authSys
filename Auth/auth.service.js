const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const validateJwt = expressJwt({ secret: "secret" });
const compose = require("composable-middleware");

let User = require("../AuthSys/Models/user.models");

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */

function isAuthenticated() {
  return (
    compose()
      // Validate jwt
      .use(function(req, res, next) {
        // allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty("access_token")) {
          req.headers.authorization = "Bearer " + req.query.access_token;
        }

        validateJwt(req, res, next);
      })
      // Attaching user to request
      .use(function(req, res, next) {
        User.findById(req.user._id, function(err, user) {
          if (err) return next(err);
          if (!user) return res.status(401).send({ message: "user not found" });
          req.user = user;
          delete req.headers["authorization"];
          next();
        });
      })
  );
}

/**
 * If there is a user, appends it to the req
 * else req.user would be undefined
 */
function appendUser() {
  return (
    compose()
      // Attach user to request
      .use(function(req, res, next) {
        validateJwt(req, res, function(val) {
          if (_.isUndefined(val)) {
            User.findById(req.user._id, function(err, user) {
              if (err) {
                return next(err);
              } else if (!user) {
                req.user = undefined;
                return next();
              } else {
                req.user = user;
                next();
              }
            });
          } else {
            req.user = undefined;
            next();
          }
        });
      })
  );
}

exports.isAuthenticated = isAuthenticated;
exports.appendUser = appendUser;
