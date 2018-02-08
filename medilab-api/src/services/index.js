const graphql = require('./graphql/graphql.service.js');

const w3id = require('./w3id/w3id.service.js');

module.exports = function (app) {
  app.configure(w3id);
  app.configure(graphql);
};
