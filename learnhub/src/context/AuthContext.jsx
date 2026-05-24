// import { createContext, useContext, useState, useEffect } from 'react'
// import { loginApi } from '../api/authApi'
//
// const AuthContext = createContext(null)
//
// export function AuthProvider({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [user, setUser]             = useState(null)
//   const [role, setRole]             = useState(null)
//   const [loading, setLoading]       = useState(true)
//
//   useEffect(() => {
//     const token    = localStorage.getItem('token')
//     const userData = localStorage.getItem('user')
//     const userRole = localStorage.getItem('role')
//     if (token && userData) {
//       setIsLoggedIn(true)
//       setUser(JSON.parse(userData))
//       setRole(userRole)
//     }
//     setLoading(false)
//   }, [])
//
//   const login = async (username, password) => {
//     const res = await loginApi(username, password)
//     const { token, role: r, username: uname } = res.data
//     localStorage.setItem('token', token)
//     localStorage.setItem('user', JSON.stringify({ email: uname }))
//     localStorage.setItem('role', r)
//     setIsLoggedIn(true)
//     setUser({ email: uname })
//     setRole(r)
//     return r
//   }
//
//   const logout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     localStorage.removeItem('role')
//     setIsLoggedIn(false)
//     setUser(null)
//     setRole(null)
//   }
//
//   const isAdmin = () => role === 'ADMIN'
//
//   return (
//     <AuthContext.Provider value={{ isLoggedIn, user, role, login, logout, isAdmin, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   )
// }
//
// export function useAuth() {
//   return useContext(AuthContext)
// }


import { createContext, useContext, useState, useEffect } from 'react'
import { loginApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser]             = useState(null)
  const [role, setRole]             = useState(null)
  const [loading, setLoading]       = useState(true)

  // Restore from sessionStorage on page load
  useEffect(() => {
    const token    = sessionStorage.getItem('token')    // ← sessionStorage
    const userData = sessionStorage.getItem('user')     // ← sessionStorage
    const userRole = sessionStorage.getItem('role')     // ← sessionStorage

    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
      setRole(userRole)
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const res = await loginApi(username, password)
    const { token, role: r, username: uname } = res.data

    sessionStorage.setItem('token', token)                        // ← sessionStorage
    sessionStorage.setItem('user', JSON.stringify({ email: uname })) // ← sessionStorage
    sessionStorage.setItem('role', r)                             // ← sessionStorage

    setIsLoggedIn(true)
    setUser({ email: uname })
    setRole(r)
    return r
  }

  const logout = () => {
    sessionStorage.clear()    // ← sessionStorage
    setIsLoggedIn(false)
    setUser(null)
    setRole(null)
  }

  const isAdmin = () => role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, role, login, logout, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}