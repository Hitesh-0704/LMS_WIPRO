// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { registerApi } from '../../api/authApi'
// import { toast } from '../ui/Toast'
//
// function Register() {
//   const navigate  = useNavigate()
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' })
//   const [error, setError]       = useState('')
//   const [loading, setLoading]   = useState(false)
//
//   const handleChange = e =>
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//
//   const handleSubmit = async e => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     try {
//       await registerApi(formData.name, formData.email, formData.password)
//       toast('Account created! Please log in.', 'success')
//       navigate('/login')
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed.')
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   return (
//     <div className='h-[80vh] bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-6 transition-colors duration-300'>
//       <div className='bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md'>
//         <h1 className='text-3xl font-bold text-center mb-6 dark:text-white'>Create Account</h1>
//         {error && <p className='text-red-500 text-sm text-center mb-4'>{error}</p>}
//         <form onSubmit={handleSubmit} className='space-y-5'>
//           {[
//             { label: 'Full Name', name: 'name',     type: 'text',     placeholder: 'Your name' },
//             { label: 'Email',     name: 'email',    type: 'email',    placeholder: 'you@example.com' },
//             { label: 'Password',  name: 'password', type: 'password', placeholder: '••••••••' },
//           ].map(f => (
//             <div key={f.name}>
//               <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{f.label}</label>
//               <input
//                 type={f.type} name={f.name} value={formData[f.name]}
//                 onChange={handleChange} placeholder={f.placeholder} required
//                 className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
//               />
//             </div>
//           ))}
//           <button
//             type='submit' disabled={loading}
//             className='w-full bg-black dark:bg-white dark:text-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-60'
//           >
//             {loading ? 'Creating account...' : 'Register'}
//           </button>
//         </form>
//         <p className='text-sm text-center text-gray-500 dark:text-gray-400 mt-5'>
//           Already have an account?{' '}
//           <Link to='/login' className='text-blue-600 hover:underline font-medium'>Login</Link>
//         </p>
//       </div>
//     </div>
//   )
// }
//
// export default Register


import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerApi } from '../../api/authApi'
import { toast } from '../ui/Toast'

function Register() {
  const navigate  = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const nameRegex  = /^[a-zA-Z\s]{2,}$/

    if (!nameRegex.test(formData.name.trim())) {
      setError('Name must be at least 2 letters and contain only alphabets.')
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
      await registerApi(formData.name, formData.email, formData.password)
      toast('Account created! Please log in.', 'success')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-[80vh] bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-6 transition-colors duration-300'>
      <div className='bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-6 dark:text-white'>Create Account</h1>

        {error && <p className='text-red-500 text-sm text-center mb-4'>{error}</p>}

        <form onSubmit={handleSubmit} className='space-y-5'>
          {[
            { label: 'Full Name', name: 'name',     type: 'text',     placeholder: 'Your name' },
            { label: 'Email',     name: 'email',    type: 'email',    placeholder: 'you@example.com' },
            { label: 'Password',  name: 'password', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.name}>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{f.label}</label>
              <input
                type={f.type} name={f.name} value={formData[f.name]}
                onChange={handleChange} placeholder={f.placeholder} required
                className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
              />
            </div>
          ))}
          <button
            type='submit' disabled={loading}
            className='w-full bg-black dark:bg-white dark:text-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-60'
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className='text-sm text-center text-gray-500 dark:text-gray-400 mt-5'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:underline font-medium'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register