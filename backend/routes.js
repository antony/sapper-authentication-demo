'use strict'

const Joi = require('@hapi/joi')
const { createJsonWebToken, cookieConfig } = require('./auth')
const bcrypt = require('bcryptjs')

const usersDatabase = [
  {
    name: 'A User',
    email: 'user@example.com',
    hashed_password: '',
    scope: [ 'user' ]
  },
  {
    name: 'An Owner',
    email: 'owner@example.org',
    hashed_password: '',
    scope: [ 'owner', 'moderator' ]
  },
  {
    name: 'An Admin',
    email: 'admin@example.net',
    hashed_password: '',
    scope: [ 'admin', 'secret' ]
  }
]

function storeHashedPassword(user, password) {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(`Error hashing password for ${username}`)
    } else {
      if (!user) {
        console.error(`User ${username} not found`)
      } else {
        user.hashed_password = hash
      }
    }
  })
}

function checkPassword (user, password) {
  if (!user) {
    console.error(`User ${username} not found`)
    return false
  } else {
    return bcrypt.compare(password, user.hashed_password)
  }
}

usersDatabase.forEach((user) => {
  storeHashedPassword(user, 'user123')
})

module.exports = [
  {
    method: 'POST',
    path: '/session',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      }
    },
    handler: async (request, h) => {
      const { email, password } = request.payload
      const user = usersDatabase.find(u => u.email === email)

      const match = await checkPassword(user, password)
      if (match) {
        const jwt = await createJsonWebToken(user)
        return h
          .response()
          .state('my-jwt', jwt, cookieConfig)
          .code(201)
      } else {
        console.error('Bad username or password')
        return h.response().code(401)
      }
    }
  },
  {
    method: 'DELETE',
    path: '/session',
    handler: (request, h) => {
      return h
        .response()
        .unstate('my-jwt', cookieConfig)
        .code(200)
    }
  },
  {
    method: 'GET',
    path: '/whoami',
    handler: (request, h) => {
      return request.auth.credentials
    }
  }
]