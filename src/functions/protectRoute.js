const PROTECTED_ROUTES = {
  '/admin': {
    scope: 'admin',
    redirectTo: '/'
  },
  '/organisation': {
    scope: 'owner',
    redirectTo: '/'
  }
}

export function protectRoute (url, profile) {
  const options = PROTECTED_ROUTES[url]
  if (!options) {
    return false
  }

  if (!profile) {
    return options.redirectTo
  }

  if (!profile.scope.includes(options.scope)) {
    return options.redirectTo
  }
}
