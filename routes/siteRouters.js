const apiRoutes = require('./api')

function route(app) {
    app.use(apiRoutes);
}

module.exports = route;