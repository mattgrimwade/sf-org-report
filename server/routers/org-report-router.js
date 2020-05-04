const express = require('express');
const sfAuth = require ('../sf-auth');
const jsforce = sfAuth.jsforce;
const oauth2 = sfAuth.oauth2;

const orgReportRouter = function(app) {
    const router = express.Router();

    router.use((req, res, next) => authenticateUser(app, req, res, next));
    router.get('/oauth2/callback', (req, res, next) => {handleOAuthCallback(app, req, res, next)});
    return router;
} 

function authenticateUser(app, req, res, next) {
    console.log('validating user');
    console.log('path ' + req.path);

    if (req.param('code')) {
        handleOAuthCallback(app, req, res, next);
    }
    else if (validateUserAuthenticated(req)) {
        next();
    }
    else {
        return res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }))
    }   
}

function handleOAuthCallback(app, req, res, next) {
    var conn = new jsforce.Connection({ oauth2 : oauth2 });
    var code = req.param('code');
    conn.authorize(code, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.refreshToken);
    console.log(conn.instanceUrl);
    req.session.accessToken = conn.accessToken;
    req.session.refreshToken = conn.refreshToken;
    req.session.instanceUrl = conn.instanceUrl;
    return res.redirect('/projects/org-report/metadata-report-configurator');
  });
}

function validateUserAuthenticated(req) {
    const session = req.session;
    console.log('access token ', JSON.stringify(req.session.accessToken));
    return ((session && session.accessToken));
}

module.exports = orgReportRouter;