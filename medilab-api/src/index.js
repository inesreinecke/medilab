/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const port = app.get('port');

const createSubscriptionServer = app.get('createSubscriptionServer');
const server = app.listen(port, () => createSubscriptionServer(server));

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('MediLab started on http://%s:%d', app.get('host'), port)
);
