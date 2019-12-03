const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    // requests meant to the development api server
    // (which should be running on port 3001) are
    // proxied from "/api..." addresses
    app.use(
        '/api',
        proxy({
            target: 'http://localhost:3001',
            pathRewrite: { '^/api': '' }
        })
    );
};
