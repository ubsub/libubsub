const RouterSignature = require('./signature');
const config = require('./config');

module.exports = {

  /**
   * @param  {string} appDomain - Expected app domain of the JWT to pass validation (usually the domain the request is sent o)
   * @param  {string} routerUrl - Defaults to router.ubsub.io. Override URL to router
   * @return {express middleware} Returns a new middleware to be used in express
   */
  validateSignature(appDomain, routerUrl = config.ROUTER_URL) {
    if (!appDomain) throw new Error('appDomain arg is required for safe signature validation');

    const signatureValidator = new RouterSignature(routerUrl, { audience: appDomain });

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
