// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { toast } from '../ui/Toast'
//
// function Login() {
//   const { login } = useAuth()
//   const navigate  = useNavigate()
//   const [formData, setFormData] = useState({ email: '', password: '' })
//   const [error, setError]       = useState('')
//   const [loading, setLoading]   = useState(false)
//
//   const handleChange = e =>
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//
//   const handleSubmit = async e => {
//     e.preventDefault()
//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields.')
//       return
//     }
//     setLoading(true)
//     setError('')
//     try {
//       const role = await login(formData.email, formData.password)
//       toast('Login successful!', 'success')
//       navigate('/courses')
//     } catch {
//       setError('Invalid email or password.')
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   return (
//     <div className='h-[80vh] bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-6 transition-colors duration-300'>
//       <div className='bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md'>
//
//         <h1 className='text-3xl font-bold text-center mb-6 dark:text-white'>Login</h1>
//
//         {error && <p className='text-red-500 text-sm text-center mb-4'>{error}</p>}
//
//         <form onSubmit={handleSubmit} className='space-y-5'>
//           <div>
//             <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
//             <input
//               type='email' name='email' value={formData.email}
//               onChange={handleChange} placeholder='you@example.com'
//               className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
//             />
//           </div>
//           <div>
//             <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Password</label>
//             <input
//               type='password' name='password' value={formData.password}
//               onChange={handleChange} placeholder='••••••••'
//               className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
//             />
//           </div>
//
//           <div className='text-right'>
//             <Link to='/forgot-password'
//               className='text-xs text-blue-600 hover:underline'>
//               Forgot password?
//             </Link>
//           </div>
//
//           <button
//             type='submit' disabled={loading}
//             className='w-full bg-black dark:bg-white dark:text-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300 disabled:opacity-60'
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//
//         <div className='mt-6 text-center text-xs text-gray-400 space-y-1'>
//           <p>Student: user@learnhub.com / user123</p>
//         </div>
//
//         <p className='text-sm text-center text-gray-500 dark:text-gray-400 mt-5'>
//           New here?{' '}
//           <Link to='/register' className='text-blue-600 hover:underline font-medium'>
//             Create account
//           </Link>
//         </p>
//
//       </div>
//     </div>
//   )
// }
//
// export default Login


import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../ui/Toast'

function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      return
    }
    if (!emailRegex.test(formData.email)) {
      setError('Enter a valid email address.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await login(formData.email, formData.password)
      toast('Login successful!', 'success')
      navigate('/courses')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-[80vh] bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-6 transition-colors duration-300'>
      <div className='bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md'>

        <h1 className='text-3xl font-bold text-center mb-6 dark:text-white'>Login</h1>

        {error && <p className='text-red-500 text-sm text-center mb-4'>{error}</p>}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
            <input
              type='email' name='email' value={formData.email}
              onChange={handleChange} placeholder='you@example.com'
              className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Password</label>
            <input
              type='password' name='password' value={formData.password}
              onChange={handleChange} placeholder='••••••••'
              className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
            />
          </div>

          <div className='text-right'>
            <Link to='/forgot-password' className='text-xs text-blue-600 hover:underline'>
              Forgot password?
            </Link>
          </div>

          <button
            type='submit' disabled={loading}
            className='w-full bg-black dark:bg-white dark:text-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300 disabled:opacity-60'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='mt-6 text-center text-xs text-gray-400 space-y-1'>
          <p>Student: user@learnhub.com / user123</p>
        </div>

        <p className='text-sm text-center text-gray-500 dark:text-gray-400 mt-5'>
          New here?{' '}
          <Link to='/register' className='text-blue-600 hover:underline font-medium'>
            Create account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login