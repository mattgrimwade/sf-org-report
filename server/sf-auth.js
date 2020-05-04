const jsforce = require('jsforce');

//
// OAuth2 client information can be shared with multiple connections.
//
const oauth2 = new jsforce.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    // loginUrl : 'https://test.salesforce.com',
    clientId : '3MVG9A2kN3Bn17hs_V2R7BXiPbjo_5IJ1d_CFX0iV8xrjYxd50dz_wx61GrSIxbVa5LcKiEPTvdGwc3Wn.zpI',
    clientSecret : 'EA37ABC05458B08B95B2C81196EF525BB842B1AF55F2234EA7BBDD3F59507C50',
    redirectUri : process.env.NODE_ENV == 'production' ? 'https://serene-mesa-23595.herokuapp.com/org-report/oauth2/callback' : 'https://localhost:3006/org-report/oauth2/callback'
});

exports.oauth2 = oauth2;
exports.jsforce = jsforce;