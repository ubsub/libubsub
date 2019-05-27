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
};
