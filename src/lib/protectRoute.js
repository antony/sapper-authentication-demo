const PROTECTED_ROUTES = {
  '/admin': {
    role: 'admin',
    loginUrl: '/auth/login'
  },
  '/organisation': {
    role: 'owner',
    loginUrl: '/auth/login'
  }
}

export function protectRoute (url, profile) {
  const options = PROTECTED_ROUTES[url]
  if (!options) {
    return false
  }

  if (!profile) {
    return options.loginUrl
  }

  if (!profile.roles.includes(options.role)) {
    return false
  }
}
