const assert = require('assert');
const app = require('../../src/app');

describe('\'w3id\' service', () => {
  it('registered the service', () => {
    const service = app.service('w3id');

    assert.ok(service, 'Registered the service');
  });
});
