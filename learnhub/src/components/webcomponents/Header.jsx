
import { Link, useNavigate } from 'react-router-dom'
import { FaBookOpen, FaMoon, FaSun, FaUserCircle, FaChevronDown } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../ui/Toast'
import { useState, useEffect, useRef } from 'react'

function Header() {
  const { isLoggedIn, logout, user } = useAuth()
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    toast('Logged out successfully!', 'info')
    navigate('/')
  }

  const navLinkClass = 'hover:text-blue-600 transition dark:text-gray-300 dark:hover:text-blue-400'

  return (
    <header className='flex justify-between items-center px-10 py-4 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300'>

      {/* Logo */}
      <div
        className='flex items-center gap-2 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <FaBookOpen className='text-2xl text-black dark:text-white' />
        <h1 className='text-2xl font-bold dark:text-white'>LearnHub</h1>
      </div>

      {/* Nav */}
      <nav className='flex gap-8 text-base font-medium items-center'>

        <Link to='/' className={navLinkClass}>Home</Link>
        <Link to='/about' className={navLinkClass}>About</Link>
        <Link to='/contact' className={navLinkClass}>Contact</Link>
        {isLoggedIn && (
          <Link to='/courses' className={navLinkClass}>Courses</Link>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDark(d => !d)}
          className='p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition'
          title='Toggle dark mode'
        >
          {dark
            ? <FaSun className='text-yellow-400' />
            : <FaMoon className='text-gray-600' />
          }
        </button>

        {/* Not logged in */}
        {!isLoggedIn && (
          <Link
            to='/login'
            className='bg-black dark:bg-white dark:text-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300'
          >
            Login
          </Link>
        )}

        {/* Logged in — Profile Dropdown */}
        {isLoggedIn && (
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className='flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-xl transition'
            >
              <FaUserCircle className='text-xl text-gray-600 dark:text-gray-300' />
              <span className='text-sm font-semibold dark:text-gray-200'>
                {user?.email?.split('@')[0] || 'Account'}
              </span>
              <FaChevronDown
                className={`text-xs text-gray-500 dark:text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className='absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden'>

                <div className='px-4 py-3 border-b border-gray-100 dark:border-gray-700'>
                  <p className='text-xs text-gray-400 dark:text-gray-500'>Signed in as</p>
                  <p className='text-sm font-semibold text-gray-700 dark:text-gray-200 truncate'>
                    {user?.email || 'admin@learnhub.com'}
                  </p>
                </div>

                {[
                  { to: '/profile',            label: '👤 Profile' },
                  { to: '/registered-courses', label: '📚 My Courses' },
                  { to: '/certificates',       label: '🏆 Certificates' },
                  { to: '/my-notes',           label: '📝 Notes' },
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDropdownOpen(false)}
                    className='block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition'
                  >
                    {item.label}
                  </Link>
                ))}

                <div className='border-t border-gray-100 dark:border-gray-700'>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition'
                  >
                    🚪 Logout
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

      </nav>

    </header>
  )
}

export default Header