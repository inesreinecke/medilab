const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('graphql-tools');

const TypeDefinitions = require('./graphql.typeDefs');
const Resolvers = require('./graphql.resolvers');
const Modok = require('modokdb');
const db = new Modok('medilab');

module.exports = function () {
  const app = this;
  const port = app.get('port');

  const schema = makeExecutableSchema({
    typeDefs: TypeDefinitions,
    resolvers: Resolvers.call(app)
  });

  app.use('/graphql', graphqlExpress((req) => {
    const { provider } = req.feathers;
    const { accessToken } = req.body;
    const headers = req.headers;
    if(!headers.authorization && accessToken) {
      headers.authorization = `Bearer ${accessToken}`;
    }

    return {
      schema,
      context: {
        provider,
        headers,
        db
      }
    };
  }));
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
  }));

  app.set('createSubscriptionServer', function createSubscriptionServer(server) {
    return new SubscriptionServer({
      execute, subscribe, schema,
      onConnect: () => { console.log('Client Connected'); },
      onDisconnect: () => { console.log('Client Disconnected'); }
    },
    {
      server, path: '/subscriptions',
    });
  });
};
