import sirv from 'sirv'
import express from 'express';
import compression from 'compression'
import * as sapper from '@sapper/server'
import jwt from 'jsonwebtoken'
import passport from 'passport';
import { Strategy as KeycloakStrategy } from 'passport-keycloak-oauth2-oidc';
import config from './config.js'
import { guard } from '@beyonk/sapper-rbac'
import routes from './routes.js'
import cookieSession from 'cookie-session'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

passport.use(
  new KeycloakStrategy(config.keycloak,
    (accessToken, refreshToken, profile, done) => {
      // This is called after a successful authentication
      done(null, { accessToken, refreshToken, profile });
    }
  )
);

passport.serializeUser(function(user, cb) {
  const profile = jwt.decode(user.accessToken)
  let clientRoles = profile.clientRoles || []
  let roles = profile.roles || []
  const serializedUser = {
    username: profile.username,
    scope: [...new Set([...clientRoles, ...roles])],
    accessToken: user.accessToken
  }
  cb(null, serializedUser);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

express()
  .use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: config.sessionKey
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .get(
    "/auth/login",
    passport.authenticate("keycloak", {
      scope: ["openid", "email", "profile", "roles"]
    })
  )
  .get(
    "/auth/callback",
    passport.authenticate("keycloak", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  )
  .get("/auth/logout", function(req, res) {
    req.logout();
    req.session = null
    res.redirect('/')
  })
	.use(
		compression({ threshold: 0 }),
    sirv('static', { dev }),
    (req, res, next) => {
      const user = req.user

      const options = {
        routes,
        deny: () => {
          const page = req.path
          console.log('Access to page denied', page)

          // if not authenticated, send to login
          if (! user) {
            console.log('user is not authenticated')
            res.redirect('/auth/login')
          } else {
            res.redirect('/')
          }

          // if page === '/special' do something else
          
          return res.end()
        },
        grant: () => {
          return sapper.middleware({
            session: () => {
              return {
                authenticated: !!user,
                user
              }
            }
          })(req, res, next)
        }
      }
      return guard(req.path, user, options)
    }
  )
  .listen(PORT, err => {
    if (err) console.log('error', err)
  })
