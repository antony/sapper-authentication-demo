import sirv from 'sirv'
import express from 'express';
import compression from 'compression'
import * as sapper from '@sapper/server'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import passport from 'passport';
import { Strategy as KeycloakStrategy } from 'passport-keycloak-oauth2-oidc';
import config from './config.js'

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
  .get('/auth/login', passport.authenticate('keycloak', { scope: ['openid', 'email', 'profile', 'roles'] }))
  .get('/auth/callback',
    passport.authenticate('keycloak', {failureRedirect: '/login'}),
    (req, res) => {
      res.cookie(authTokenCookieKey, req.user.accessToken)
      res.redirect('/');
    })
  .get('/auth/logout', function(req, res){
      req.logout();
      res.cookie(authTokenCookieKey, '', {
        domain: req.hostname,
        maxAge: 0,
        overwrite: true,
      });
      res.redirect('/');
    })
	.use(
		compression({ threshold: 0 }),
    sirv('static', { dev }),
    cookieParser(),
    (req, res, next) => {
      const token = req.cookies[authTokenCookieKey]
      const profile = token ? jwt.decode(token) : false

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
