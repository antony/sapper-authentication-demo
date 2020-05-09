export default {
  keycloak: {
    authServerURL: process.env.SAPPER_KEYCLOAK_AUTHSERVER_URL,
    clientID: process.env.SAPPER_KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.SAPPER_KEYCLOAK_CLIENT_SECRET,
    realm: process.env.SAPPER_KEYCLOAK_REALM,
    sslRequired: 'external',
    publicClient: false,
    callbackURL: `/auth/callback`
  }
}