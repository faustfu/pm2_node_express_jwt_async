var env = {
  development: {
    corsURLs: ['http://localhost', '::ffff:127.0.0.1'],
    dbAPIURL: 'http://localhost:4000',
    port: '21301',
    secret: 'how',
  },
  sit: {
    corsURLs: ['http://localhost', '::ffff:127.0.0.1'],
    dbAPIURL: 'http://localhost:4000',
    port: '21301',
    secret: 'are',
  },
  production: {
    corsURLs: ['http://localhost', '::ffff:127.0.0.1'],
    dbAPIURL: 'http://localhost:4000',
    port: '21301',
    secret: 'you',
  },
}

module.exports = initial

function initial() {
  return new Promise((resolve, reject) => {
    resolve(env)
  })
}
