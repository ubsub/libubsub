const { assert } = require('chai');
const Signature = require('../signature');
const config = require('../config');

const VALID_CERT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiUkJOdm8xV3paNG9SUnEwVzkraGtucFQ3VDhJZjUzNkRFTUJnOWh5cS80bz0iLCJpYXQiOjE1NTg4MjQ5NTQsImV4cCI6MTU1ODgyNDk4NCwiYXVkIjoid2ViaG9vay5zaXRlIiwiaXNzIjoicm91dGVyLnVic3ViLmlvIiwic3ViIjoiU0pfTXpCX0lYIn0.IKP_4LLE3uvUJ8GjX4THjzVRnUGucHEa_5wUXX2dg0ls8wtvrPIxZojrfp6a38OP6CH2nwwAgXDtlzj3NYUdpDfiG-Wlvan4mUQIVB4sMSvg_VKr3_fKJ_idO_8BHMXuW9oELttH5dXbyiAKAdJ3fVhRN2p0icoI6IIEpXrszk9ZxPFG4eTdv8ODCOXBemZS3MxcHZyuFtP0Ms94GQYEk0aIn-x3xyA4Ry4XJUwb-dpl1zPW-aS2phJkTtnHFD8JjBmS-mol6x7VIzsOgxjD5IW3Rn0TK1iGydV1jULrEUmKYRwedsenWTOj9myMydjFbAMN2xLZwC-Lyr0xW432lQ';

const TYPO_INVALID_CERT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIUnEwVzkraGtucFQ3VDhJZjUzNkRFTUJnOWh5cS80bz0iLCJpYXQiOjE1NTg4MjQ5NTQsImV4cCI6MTU1ODgyNDk4NCwiYXVkIjoid2ViaG9vay5zaXRlIiwiaXNzIjoicm91dGVyLnVic3ViLmlvIiwic3ViIjoiU0pfTXpCX0lYIn0.IKP_4LLE3uvUJ8GjX4THjzVRnUGucHEa_5wUXX2dg0ls8wtvrPIxZojrfp6a38OP6CH2nwwAgXDtlzj3NYUdpDfiG-Wlvan4mUQIVB4sMSvg_VKr3_fKJ_idO_8BHMXuW9oELttH5dXbyiAKAdJ3fVhRN2p0icoI6IIEpXrszk9ZxPFG4eTdv8ODCOXBemZS3MxcHZyuFtP0Ms94GQYEk0aIn-x3xyA4Ry4XJUwb-dpl1zPW-aS2phJkTtnHFD8JjBmS-mol6x7VIzsOgxjD5IW3Rn0TK1iGydV1jULrEUmKYRwedsenWTOj9myMydjFbAMN2xLZwC-Lyr0xW432lQ';

describe('#signature', () => {
  const sig = new Signature({ ignoreExpiration: true }); // Ignore for sake of test

  it('Can retrieve public key', () => sig.getCachedPublicKey());

  it('Should accept a valid JWT token', () => sig.assertValidJwt(VALID_CERT));

  it('Should reject an invalid token', () => {
    return assert.isRejected(sig.assertValidJwt(TYPO_INVALID_CERT));
  });

  it('Should reject a token with a bad issuer', () => {
    const sigIssuer = new Signature({ ignoreExpiration: true }, config.ROUTER_URL, 'bad-issuer');
    return assert.isRejected(sigIssuer.assertValidJwt(VALID_CERT));
  });
});
