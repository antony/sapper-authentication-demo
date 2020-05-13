import sirv from 'sirv'
import express from 'express';
import compression from 'compression'
import * as sapper from '@sapper/server'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import passport from 'passport';
import { Strategy as KeycloakStrategy } from 'passport-keycloak-oauth2-oidc';
import config from './config.js'
// import { protectRoute } from './lib/protectRoute'
import { guard } from '@beyonk/sapper-rbac'
import routes from './routes.js'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const authTokenCookieKey = 'keycloak-access-token'

passport.use(
  new KeycloakStrategy(config.keycloak,
    (accessToken, refreshToken, profile, done) => {
      // This is called after a successful authentication
      done(null, { accessToken, refreshToken, profile });
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

express()
  .use(passport.initialize())
  .get('/auth/login', passport.authenticate('keycloak', { scope: ['openid'] }))
  .get('/auth/callback',
    passport.authenticate('keycloak', {failureRedirect: '/login'}),
    (req, res) => {
      res.cookie(authTokenCookieKey, req.user.accessToken)
      res.redirect('/');
    })
  .get('/auth/logout', function(req, res) {
      res.cookie(authTokenCookieKey, '', {
        domain: req.hostname,
        maxAge: 0,
        overwrite: true,
      });
      req.logout();
      res.redirect('/');
    })
	.use(
		compression({ threshold: 0 }),
    sirv('static', { dev }),
    cookieParser(),
    (req, res, next) => {
      const token = req.cookies[authTokenCookieKey]
      const user = token ? jwt.decode(token) : false

      // sapper-rbac expects res.user.scope to exist and contain user's roles
      // but that's a reserved field in Keycloak.
      //
      // Instead move `scope` to `requestedScope`, and map
      // any roles (realm or client) to `scope`.
      //
      // Roles are only available when the client has
      // a mapper
      //
      // Ex.
      // - name: clientRoles
      //   protocolMapper: oidc-usermodel-client-role-mapper
      //   config:
      //     access.token.claim: "true"
      //     claim.name: clientRoles
      //     jsonType.label: String
      //     multivalued: "true"
      // - name: roles
      //   protocolMapper: oidc-usermodel-realm-role-mapper
      //   config:
      //     access.token.claim: "true"
      //     claim.name: roles
      //     jsonType.label: String
      //     multivalued: "true"

      let clientRoles = user.clientRoles || []
      let roles = user.roles || []

      res.user = {
        ...user,
        requestedScope: user.scope,
        scope: [...new Set([...clientRoles, ...roles])]
      }

      next()
    },
    (req, res, next) => {
      const token = req.cookies[authTokenCookieKey]
      const user = token ? jwt.decode(token) : false

      const options = {
        routes,
        deny: () => {
          res.redirect('/')
          return res.end()
        },
        grant: () => {
          return sapper.middleware({
            session: () => {
              return {
                authenticated: !!user,
                user: res.user
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
