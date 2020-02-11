const Express = require('express')
const compression = require('compression')
const BodyParser = require('body-parser')
const Cors = require("./lib/cors")
const Log = require('./lib/log')
const Session = require('./lib/session')
const Email = require('./service/email')
const routes = require('./apiRoutes')
const errorHandler = require('./errorHandler')

const urlencoded = BodyParser.urlencoded({
  extended: false
})
const json = BodyParser.json()

const cors = Cors()

// init application
const app = Express()
app.use(compression())
app.use(Session)
app.use(cors)
app.options('*', cors)
app.use('/', json, urlencoded, routes)
app.use(errorHandler)

Email.init().then(() => {
  Log.info('API application loaded')
})

module.exports = app
