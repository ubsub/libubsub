const _ = require('lodash');
const crypto = require('crypto');
const RouterSignature = require('./signature');
const config = require('./config');

module.exports = {

  /**
   * Create middleware that validates `X-Router-Signature`
   *
   * @param  {string} appDomain - Expected app domain of the JWT to pass validation (usually the domain the request is sent o)
   * @param  {object} additionalVerifyOpts - additional options to pass verifier
   * @param  {string} [routerUrl=config.ROUTER_URL] Optional override for router url
   * @return {expressMiddleware} Returns a new middleware to be used in express
   */
  validateSignature(appDomain, additionalVerifyOpts = {}, routerUrl = config.ROUTER_URL) {
    if (!appDomain) throw new Error('appDomain arg is required for safe signature validation');

    const signatureValidator = new RouterSignature(Object.assign({ audience: appDomain }, additionalVerifyOpts), routerUrl);

    return (req, res, next) => {
      signatureValidator.assertValidJwt(req.get('X-Router-Signature'))
        .then((token) => {
          req.routerSignature = token;
          next();
        }).catch(() => {
          res.status(401).send({ message: 'JWT failed validation' });
        });
    };
  },

  /**
   * Middleware that will validate signature hash against the `req.body`
   * This will make sure that nothing has changed since the router has sent the payload
   * MUST be run after the `validateSignature` middleware
   * @return {expressMiddleware} Returns a middleware that validates `req.routerSignaure.hash` against the body
   */
  validateBodyHash() {
    return (req, res, next) => {
      if (!req.routerSignature || !req.routerSignature.hash) {
        return res.status(401).send({ message: 'Unable to validate body against missing signature' });
      }

      let payload = req.body || '';
      if (_.isObjectLike(payload)) {
        payload = JSON.stringify(payload);
      }

      const sha256 = crypto.createHash('sha256');
      sha256.update(payload);
      const hash = sha256.digest('base64');

      if (hash === req.routerSignature.hash) {
        return next();
      }

      return res.status(401).send({ message: 'Failed to validate signature hash' });
    };
  },
};
