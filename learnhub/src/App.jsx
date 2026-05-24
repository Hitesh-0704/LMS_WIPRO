import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Header         from './components/webcomponents/Header'
import Footer         from './components/webcomponents/Footer'
import Home           from './components/webcomponents/Home'
import ProtectedRoute from './components/webcomponents/ProtectedRoute'
import { ToastContainer } from './components/ui/Toast'

import AboutUs           from './components/NavigationMenu/AboutUs'
import ContactUs         from './components/NavigationMenu/ContactUs'
import Courses           from './components/NavigationMenu/Courses'
import CourseDetail      from './components/NavigationMenu/CourseDetail'
import Login             from './components/NavigationMenu/Login'
import Register          from './components/NavigationMenu/Register'
import ForgotPassword    from './components/NavigationMenu/ForgotPassword'
import RegisteredCourses from './components/NavigationMenu/RegisteredCourses'
import CoursePlayer      from './components/NavigationMenu/CoursePlayer'
import Notes             from './components/NavigationMenu/Notes'
import Certificate       from './components/NavigationMenu/Certificate'
import AllCertificates   from './components/NavigationMenu/AllCertificates'
import Profile           from './components/NavigationMenu/Profile'

function App() {
  const { isLoggedIn } = useAuth()

  return (
    <div className='overflow-hidden'>
      <ToastContainer />
      <Header />

      <Routes>
        <Route path='/'        element={<Home />} />
        <Route path='/about'   element={<AboutUs />} />
        <Route path='/contact' element={<ContactUs />} />

        <Route path='/login'
          element={isLoggedIn ? <Navigate to='/courses' /> : <Login />} />
        <Route path='/register'
          element={isLoggedIn ? <Navigate to='/courses' /> : <Register />} />
        <Route path='/forgot-password'
          element={isLoggedIn ? <Navigate to='/courses' /> : <ForgotPassword />} />

        <Route path='/courses'
          element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path='/courses/:courseId'
          element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path='/registered-courses'
          element={<ProtectedRoute><RegisteredCourses /></ProtectedRoute>} />
        <Route path='/learn/:courseId'
          element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
        <Route path='/my-notes'
          element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path='/certificates'
          element={<ProtectedRoute><AllCertificates /></ProtectedRoute>} />
        <Route path='/certificates/:courseId'
          element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
        <Route path='/profile'
          element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App