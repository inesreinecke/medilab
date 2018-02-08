const passport = require('passport');

module.exports = function (app) { // eslint-disable-line no-unused-vars
  // Add your custom middleware here. Remember, that
  // in Express the order matters
  app.get('/w3id/login', passport.authenticate('openidconnect', {}));

  app.get('/w3id/failure', (req, res) => {
    res.json({
      message: 'w3id login failed',
    });
  });

  app.get('/w3id/logout', (req, res) => {
    //req.session.destroy();
    req.logout();
    return res.json({
      message: 'Logout successful',
    });
  });

  app.get('/w3id/callback', passport.authenticate('openidconnect', {
    successRedirect: 'https://medilab.mybluemix.net/',
    failureRedirect: '/w3id/failure'
  }));

  app.get('/w3id/userinfo', (req, res) => {
    if (!req.user) {
      return res.status(401).send('Not authenticated');
    }
  
    return res.json({
      accessToken: req.user.accessToken,
      refreshToken: req.user.refreshToken,
      firstName: (req.user._json) ? req.user._json.firstName : '',
      lastName: (req.user._json) ? req.user._json.lastName : '',
      uid: (req.user._json) ? req.user._json.uid : '',
      emailAddress: (req.user._json) ? req.user._json.emailAddress : '',
    });
  });
};
