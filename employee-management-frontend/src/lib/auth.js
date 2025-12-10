import Cookies from 'js-cookie'

export const setAuthToken = (token) => {
  Cookies.set('token', token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })
}

export const setUser = (user) => {
  Cookies.set('user', JSON.stringify(user), {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })
}

export const getUser = () => {
  const userStr = Cookies.get('user')
  return userStr ? JSON.parse(userStr) : null
}

export const getToken = () => {
  return Cookies.get('token')
}

export const removeAuth = () => {
  Cookies.remove('token', { path: '/' })
  Cookies.remove('user', { path: '/' })
}

export const isAuthenticated = () => {
  return !!Cookies.get('token')
}

export const isAdmin = () => {
  const user = getUser()
  return user?.role === 'admin' || user?.role === 'super_admin'
}

export const isSuperAdmin = () => {
  const user = getUser()
  return user?.role === 'super_admin'
}

export const isManager = () => {
  const user = getUser()
  return user?.role === 'manager'
}

export const hasRole = (roles) => {
  const user = getUser()
  return roles.includes(user?.role)
}
