var util = require('util'), output = {
  catchError,
  getSuccessResponse,
}, logger = global.logger

module.exports = output

function catchError(req, res) {
  return function(error) {
    logger(`error=${util.inspect(error)}`)
    res.status(450).send(error.response && error.response.data || util.inspect(error))

    // res.render('error', {
    //   message: req.url,
    //   error: error,
    // })
  }
}

function getSuccessResponse(data) {
  return {
    status: 0,
    data: data,
    message: "OK"
  }
}