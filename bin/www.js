#!/usr/bin/env node

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

var loggers = require('debug'),
  debug = loggers('debug'),
  logger = loggers('logger'),
  async = require('async'),
  d = require('domain').create()

global.debug = debug
global.logger = logger

d.on('error', function(err) {
  logger(`Domain master error=${err}`)
  process.exit(0)
})

d.run(() => {
  global.fn = require('../utils/fn')

  async.auto(
    {
      env: cb => {
        var envPromise = null

        try {
          envPromise = require('../config/env')()

          envPromise
            .then(env => {
              cb(null, env)
            })
            .catch(err => {
              cb(err)
            })
        } catch (err) {
          return cb(err)
        }
      },
      db: [
        'env',
        (scope, cb) => {
          var dbPromise = null

          try {
            dbPromise = require('../utils/db')(scope.env)

            dbPromise
              .then(db => {
                cb(null, db)
              })
              .catch(err => {
                cb(err)
              })
          } catch (err) {
            return cb(err)
          }
        },
      ],
      server: [
        'env',
        'db',
        (scope, cb) => {
          try {
            global.env = scope.env
            global.db = scope.db

            var app = require('../app')(scope.env),
              port = normalizePort(scope.env[process.env.NODE_ENV].port)

            app.set('port', port)

            var server = require('http').createServer(app)

            server.listen(port)

            server.on('error', onError)
            server.on('listening', onListening)

            function onListening() {
              var addr = server.address()
              var bind =
                typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
              debug('Listening on ' + bind)

              cb(null, server)
            }
          } catch (err) {
            return cb(err)
          }
        },
      ],
      ready: [
        'server',
        (scope, cb) => {
          cb()
        },
      ],
    },
    function(err, scope) {
      if (err) {
        logger(`fatal error=${err}`)
      } else {
        debug('Server ready and launched')
      }
    }
  )
})

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}
