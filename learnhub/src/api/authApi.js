import api from './axios'

export const loginApi    = (username, password) =>
  api.post('/api/auth/login', { username, password })

export const registerApi = (name, email, password) =>
  api.post('/api/auth/register', { name, email, password })

  export const forgotPasswordApi = (email) =>
    api.post('/api/auth/forgot-password', { email })

  export const resetPasswordApi = (email, otp, newPassword) =>
    api.post('/api/auth/reset-password', { email, otp, newPassword })