import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { forgotPasswordApi, resetPasswordApi } from '../../api/authApi'
import { toast } from '../ui/Toast'

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep]         = useState(1) // 1=email, 2=otp+newpw
  const [email, setEmail]       = useState('')
  const [otp, setOtp]           = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSendOtp = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await forgotPasswordApi(email)
      toast('OTP sent! Check your email (also check console if email fails)', 'success')
      setStep(2)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async e => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match'); return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters'); return
    }
    setLoading(true); setError('')
    try {
      await resetPasswordApi(email, otp, newPassword)
      toast('Password reset successful! Please login.', 'success')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-[80vh] bg-gray-100 dark:bg-gray-900 flex justify-center
                    items-center px-6 transition-colors duration-300'>
      <div className='bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg
                      w-full max-w-md'>

        {/* Step indicator */}
        <div className='flex items-center justify-center gap-3 mb-8'>
          {[1, 2].map(s => (
            <div key={s} className='flex items-center gap-2'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-bold transition ${
                step >= s
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 2 && <div className={`w-12 h-0.5 ${
                step > s ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'
              }`} />}
            </div>
          ))}
        </div>

        <h1 className='text-2xl font-bold text-center mb-2 dark:text-white'>
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </h1>
        <p className='text-center text-sm text-gray-500 dark:text-gray-400 mb-6'>
          {step === 1
            ? 'Enter your registered email to receive an OTP'
            : `Enter the OTP sent to ${email}`}
        </p>

        {error && (
          <p className='text-red-500 text-sm text-center mb-4'>{error}</p>
        )}

        {/* Step 1 — Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium
                                dark:text-gray-300 mb-1'>Email</label>
              <input
                type='email' value={email} required
                onChange={e => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='w-full border border-gray-300 dark:border-gray-600
                           dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3
                           outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
              />
            </div>
            <button
              type='submit' disabled={loading}
              className='w-full bg-black dark:bg-white dark:text-black text-white
                         py-3 rounded-xl font-semibold hover:bg-gray-800 transition
                         disabled:opacity-60'
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2 — OTP + New Password */}
        {step === 2 && (
          <form onSubmit={handleReset} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium
                                dark:text-gray-300 mb-1'>OTP Code</label>
              <input
                type='text' value={otp} required maxLength={6}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder='Enter 6-digit OTP'
                className='w-full border border-gray-300 dark:border-gray-600
                           dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3
                           outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
                           text-center text-xl tracking-widest font-mono'
              />
            </div>
            <div>
              <label className='block text-sm font-medium
                                dark:text-gray-300 mb-1'>New Password</label>
              <input
                type='password' value={newPassword} required
                onChange={e => setNewPassword(e.target.value)}
                placeholder='Minimum 6 characters'
                className='w-full border border-gray-300 dark:border-gray-600
                           dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3
                           outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium
                                dark:text-gray-300 mb-1'>Confirm Password</label>
              <input
                type='password' value={confirmPassword} required
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder='Repeat new password'
                className='w-full border border-gray-300 dark:border-gray-600
                           dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3
                           outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
              />
            </div>
            <button
              type='submit' disabled={loading}
              className='w-full bg-black dark:bg-white dark:text-black text-white
                         py-3 rounded-xl font-semibold hover:bg-gray-800 transition
                         disabled:opacity-60'
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button type='button' onClick={() => { setStep(1); setError('') }}
              className='w-full text-sm text-gray-500 hover:text-gray-800
                         dark:text-gray-400 dark:hover:text-gray-200 transition'>
              ← Back
            </button>
          </form>
        )}

        <p className='text-sm text-center text-gray-500 dark:text-gray-400 mt-6'>
          Remember it?{' '}
          <Link to='/login'
            className='text-blue-600 hover:underline font-medium'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword