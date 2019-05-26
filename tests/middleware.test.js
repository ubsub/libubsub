const Middleware = require('../middleware');

const VALID_CERT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiUkJOdm8xV3paNG9SUnEwVzkraGtucFQ3VDhJZjUzNkRFTUJnOWh5cS80bz0iLCJpYXQiOjE1NTg4MjQ5NTQsImV4cCI6MTU1ODgyNDk4NCwiYXVkIjoid2ViaG9vay5zaXRlIiwiaXNzIjoicm91dGVyLnVic3ViLmlvIiwic3ViIjoiU0pfTXpCX0lYIn0.IKP_4LLE3uvUJ8GjX4THjzVRnUGucHEa_5wUXX2dg0ls8wtvrPIxZojrfp6a38OP6CH2nwwAgXDtlzj3NYUdpDfiG-Wlvan4mUQIVB4sMSvg_VKr3_fKJ_idO_8BHMXuW9oELttH5dXbyiAKAdJ3fVhRN2p0icoI6IIEpXrszk9ZxPFG4eTdv8ODCOXBemZS3MxcHZyuFtP0Ms94GQYEk0aIn-x3xyA4Ry4XJUwb-dpl1zPW-aS2phJkTtnHFD8JjBmS-mol6x7VIzsOgxjD5IW3Rn0TK1iGydV1jULrEUmKYRwedsenWTOj9myMydjFbAMN2xLZwC-Lyr0xW432lQ';

function mockRequest(token) {
  return {
    get(name) {
      if (name === 'X-Router-Signature') return token;
      return null;
    },
  };
}

function mockResponse(expectStatus, done) {
  return {
    status(status) {
      if (status !== expectStatus) {
        done(new Error(`Expected status ${expectStatus}, but got ${status}`));
      } else {
        done();
      }
      return this;
    },

    send() {
      return this;
    },
  };
}

describe('#middleware', () => {
  const mw = Middleware.validateSignature('webhook.site', { ignoreExpiration: true });

  it('Allows valid signature', (done) => {
    mw(mockRequest(VALID_CERT), mockResponse(null, done), done);
  });

  it('Fails on no signature', (done) => {
    mw(mockRequest(null), mockResponse(401, done), done);
  });
});
