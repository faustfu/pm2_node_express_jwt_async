var _ = require('lodash'),
  debug = global.debug

module.exports = cors

function cors(env) {
  var corsURLs = env[process.env.NODE_ENV].corsURLs

  return function(req, res, next) {
    var origin = req.headers.origin || req.ip

    if (
      _.findIndex(
        corsURLs,
        row => {
          debug(`cors list=${row} check result=${_.startsWith(origin, row)}`)
          return _.startsWith(origin, row)
        },
        corsURLs
      ) > -1
    ) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Auth, accept, access-control-allow-origin, X-Referer'
    )

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.sendStatus(200)
    } else {
      next()
    }
  }
}
