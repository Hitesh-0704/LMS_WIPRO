//import axios from 'axios'
//
//const api = axios.create({
//  baseURL: 'http://localhost:9797',
//  headers: { 'Content-Type': 'application/json' }
//})
//
//// Attach JWT token to every request
//api.interceptors.request.use(config => {
//  const token = localStorage.getItem('token')
//  if (token) config.headers.Authorization = `Bearer ${token}`
//  return config
//})
//
//// Auto logout when server returns 401
//api.interceptors.response.use(
//  response => response,
//  error => {
//    if (error.response?.status === 401) {
//      localStorage.removeItem('token')
//      localStorage.removeItem('user')
//      localStorage.removeItem('role')
//      window.location.href = '/login'
//    }
//    return Promise.reject(error)
//  }
//)
//
//export default api


import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:9797',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')   // ← sessionStorage
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto logout on 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      sessionStorage.clear()                       // ← sessionStorage
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api