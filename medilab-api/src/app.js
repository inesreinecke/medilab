const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('winston');
const session = require('express-session');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const passport = require('passport');
const OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;

//app.disable('x-powered-by');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const appHandler = require('./app.handler');
const channels = require('./channels');

const app = express(feathers());

// Load app configuration
app.configure(configuration());

if(process.env.NODE_ENV !== 'development') {
  app.enable('trust proxy');
  
  app.use (function (req, res, next) {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(session({
  name: 'medilab',
  resave: 'true',
  saveUninitialized: 'true',
  secret: 'ae01cf85-3c4f-4fed-af0e-b2413cfbfbed',
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

app.use(passport.initialize());
app.use(passport.session());

const OpenIdStrategy = new OpenIDConnectStrategy(app.get('w3id'),
  (iss, sub, profile, accessToken, refreshToken, params, done) => {
    process.nextTick(() => {
      const PROFILE = profile;
      PROFILE.accessToken = accessToken;
      PROFILE.refreshToken = refreshToken;
      PROFILE.bluegroups = PROFILE._json.bluegroups;
      done(null, PROFILE);
    });
  });

passport.use(OpenIdStrategy);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ 
  logger,
  html: function(error, req, res) {
    res.sendFile(appHandler(error.code));
  }
}));

app.hooks(appHooks);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = app;
