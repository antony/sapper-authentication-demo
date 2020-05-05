import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { protectRoute } from './functions/protectRoute'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

polka()
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    cookieParser(),

    (req, res, next) => {
      res.redirect = location => {
        let str = `Redirecting to ${location}`
        res.writeHead(302, {
          Location: location,
          'Content-Type': 'text/plain',
          'Content-Length': str.length
        })
        res.end(str)
      }
      next()
    },

    (req, res, next) => {
      const token = req.cookies['my-jwt']
      const profile = token ? jwt.decode(token) : false

      const redirectTo = protectRoute(req.url, profile)
      if (redirectTo) {
        return res.redirect(redirectTo)
      }

      return sapper.middleware({
        session: () => {
          return {
            authenticated: !!profile,
            profile
          }
        }
      })(req, res, next)
    }
  )
  .listen(PORT, err => {
    if (err) console.log('error', err)
  })
