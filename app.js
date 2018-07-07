var createError = require('http-errors')
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var jwt = require('./utils/auth')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

module.exports = initial

function initial(env) {
  var app = express()

  app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')

  app.use(
    logger(
      '[:date[iso]] :method :url :status :response-time ms - :res[content-length]'
    )
  )
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, 'public')))

  app.use(require('./config/cors')(env))
  
  app.use(
    jwt({
      secret: env[process.env.NODE_ENV].secret,
    }).unless({
      path: ['/', '/users'],
    })
  )

  app.use('/', indexRouter)
  app.use('/users', usersRouter)

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })

  return app
}
