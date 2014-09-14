var fs = require('fs'),
    spdy = require('spdy'),
    express = require('express');

var latency = 100,
    app = express(),
    ip = '127.0.0.1',
    port = 8080,
    sslPort = 8443;

app.use(function(req, res, next) {
    setTimeout(next, latency);
});
app.use(express.static('.'));

spdy.createServer({
    key: fs.readFileSync(__dirname + '/keys/key.pem'),
    cert: fs.readFileSync(__dirname + '/keys/cert.pem'),

    version: 3
}, app).listen(sslPort, ip);

spdy.createServer({
    plain: true,
    ssl: false,
}, app).listen(port, ip);
