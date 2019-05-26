const memoize = require('memoizee');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('./config');

// Class to validate a token in Ubsub's header against
// the router's public certificate
// Public cert is automatically retrieved, and cached for {config.CACHE_MILLIS}

/**
 * Class to vlidate a token in UbSub's header `X-Router-Signature`
 * against the router's public certificate
 *
 * Public certificate is automatically retrieved and cached
 * Future retrievals will be pre-fetched to minimize any interruptions
 */
class Signature {
  /**
   * @param  {object} verifyOpts - Arguments passed to the JWT verifier
   * @param  {string} routerUrl - Override the default router_url
   * @param  {string} routerIssuer - The expected issuer of the JWT
   * @return {Signature} - A new instance of this class
   */
  constructor(verifyOpts = undefined, routerUrl = config.ROUTER_URL, routerIssuer = config.ROUTER_ISSUER) {
    this._routerUrl = routerUrl;
    this._verifyOpts = Object.assign({
      issuer: routerIssuer,
    }, verifyOpts);

    this.getCachedPublicKey = memoize(this.getPublicKey, {
      maxAge: config.CACHE_MILLIS,
      preFetch: 0.66,
      promise: true,
    });
  }

  /**
   * @return {string} The router's public key
   */
  getPublicKey() {
    return axios.get(`${this._routerUrl}/docs/cert`)
      .then(resp => resp.data);
  }

  /**
   * @param  {string} token - The JWT to validate
   * @return {promise} Either the parsed body of the JWT payload, or a rejection on failure
   */
  assertValidJwt(token) {
    if (!token) return Promise.reject(new Error('No token present'));

    return this.getCachedPublicKey()
      .then(publicKey => new Promise((resolve, reject) => {
        jwt.verify(token, publicKey, this._verifyOpts, (err, decoded) => {
          if (err) return reject(err);
          return resolve(decoded);
        });
      }));
  }
}

module.exports = Signature;
