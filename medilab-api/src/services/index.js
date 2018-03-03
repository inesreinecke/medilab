const graphql = require('./graphql/graphql.service.js');

module.exports = function (app) {
  app.configure(graphql);
};
