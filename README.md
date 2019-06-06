# libubsub

[![Build Status](https://travis-ci.org/ubsub/libubsub.svg?branch=master)](https://travis-ci.org/ubsub/libubsub)
[![npm](https://img.shields.io/npm/v/libubsub.svg)](https://www.npmjs.com/package/libubsub)
[![npm](https://img.shields.io/npm/l/libubsub.svg)](https://www.npmjs.com/package/libubsub)
[![Latest Documentation](https://doxdox.org/images/badge-flat.svg)](https://doxdox.org/)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/libubsub.svg)

libubsub provides a common set of functionality to connect and consume ubsub's API and pub/sub events.

Its primary goals are to simplify:

 - Making API calls to ubsub
 - Consuming events and validating events
 - Validating signatures
 - Simplifying complex systems (SocketIO) and wrapping in ubsub terminology

# Installing

```bash
npm install --save libubsub
```

# Functions

To see a complete list of functions, please see [DOCUMENTATION.md](DOCUMENTATION.md)

## Express Middleware

The express middleware inspects the signature that comes in on the router via `X-Router-Signature`, and denies
the request if it's not a wholly valid signature (Expiration, app domain, source, etc..)

```js
const { middleware } = require('libubsub');

// express stuff..

app.use(middleware.validateSignature('my.domain'));

```

### Signature Validator

If you wish to use the signature validation directly, you can use the `signature` class.

The signature class should do a good job retrieving and pre-fetching the public key from the router. By default,
this happens every 15 minutes (see: `config.js`).

You can also read more about the JWT signature in the [ubsub docs](https://app.ubsub.io/docs/advanced/router/).

```js
const { Signature } = require('libubsub');

const signatureValidator = new Signature();

// Returns promise that was either rejected or resolved depending on validity
// If resolved, contains the JWT object
signatureValidator.assertValidJwt(tokenString);
```

### Client API

We also bundle a client API wrapper for the router built on top of [axios](https://www.npmjs.com/package/axios).

```js
const { api } = require('libubsub');

const userId = '...';
const userKey = '...';
const client = api(userId, userKey);

client.getUser();
```

You can see the full list of functions in [api.js](api.js)

# License

Copyright (c) 2019 Christopher LaPointe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.