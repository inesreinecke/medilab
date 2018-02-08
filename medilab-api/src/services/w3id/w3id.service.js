// Initializes the `w3id` service on path `/w3id`
const createService = require('./w3id.class.js');
const hooks = require('./w3id.hooks');

module.exports = function (app) {

  const options = {
    name: 'w3id',
  };

  // Initialize our service with any options it requires
  app.use('/w3id', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('w3id');

  service.hooks(hooks);
};
