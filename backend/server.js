'use strict'

const Hapi = require('@hapi/hapi')
const { strategy, plugin } = require('./auth')
const routes = require('./routes')

const init = async () => {
  const server = Hapi.server({
    routes: {
      cors: {
        credentials: true
      }
    },
    port: 2000,
    host: 'localhost'
  })

  await server.register(plugin)
  const { type, name, config } = strategy
  server.auth.strategy(type, name, config)

  await server.route(routes)

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

init()
