const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy('/blog', {
            target: 'http://localhost:5000/',
            pathRewrite: { '^/blog': '/' },
        })
    );
};
