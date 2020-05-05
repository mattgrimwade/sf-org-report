// require('dotenv').config()
const next = require('next')
const express = require('express')
const path =  require('path');
const fs =  require('fs');
const http =  require('http');
const https =  require('https');
// const jsforceAjaxProxy = require('jsforce-ajax-proxy');

//session management
const session = require('express-session');
const RedisStore = require('connect-redis')(session)
const Redis = require('redis');
const uuid = require('uuid/v4');

const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.PORT || 3006;
const privateKey = fs.readFileSync(path.resolve('./sslcert/server.key'));
const certificate = fs.readFileSync(path.resolve('./sslcert/server.cert'));
const credentials = {key: privateKey, cert: certificate};

//routers
const orgReportRouter = require('./server/routers/org-report-router');

const redisClient = Redis.createClient(process.env.REDIS_URL);
redisClient.on("error", function(error) {
    console.error(error);
});

//clear the redis DB on server start (runs as independent process even though its an in memory store)
redisClient.flushall( function (err, succeeded) {
    console.log('flushed redis ' + succeeded); 
});

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
    const server = express()

    server.use(session({
        genid: (req) => {
        const sessionId = uuid();
          console.log('Creating new session ID ' + sessionId);
          return sessionId
        },
        cookie: {maxAge : 1000000},
        store: new RedisStore({ client: redisClient }),
        secret: '343ji43j4n3jn4jk3n'
    }));

    server.use('/projects/org-report/*', orgReportRouter(app));
    
    server.all('*', (req, res) => {
        return handle(req, res)
    })

    const httpServer = http.createServer(server);
    const httpsServer = https.createServer(credentials, server);

    //SF oauth requires https. However if we're on heroku then they provide that for us.
    if (dev) {
        httpsServer.listen(HTTPS_PORT, () => {
            console.log(`😎 Server is listening on port ${HTTPS_PORT}`);
        }); 
    } else {
        httpServer.listen(HTTP_PORT, () => {
            console.log(`😎 Server is listening on port ${HTTP_PORT}`);
        });
    }
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})