import { createContext, useContext, useState, useEffect } from 'react'
import {
  fetchMyEnrollmentsApi,
  enrollApi,
  unenrollApi,
  markCompleteApi
} from '../api/enrollmentApi'
import { useAuth } from './AuthContext'

const CourseContext = createContext(null)

export function CourseProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])

  useEffect(() => {
    if (isLoggedIn) refreshEnrollments()
    else setEnrolledCourses([])
  }, [isLoggedIn])

  // File: CourseContext.jsx

  const refreshEnrollments = async () => {
    try {
      const res = await fetchMyEnrollmentsApi()

      // 🚀 ADD THIS SAFETY CHECK RIGHT HERE
      if (res.data && Array.isArray(res.data)) {
        setEnrolledCourses(res.data.map(e => ({
          enrollmentId:  e.id,
          courseId:      String(e.courseId),
          title:         e.title,
          duration:      e.duration,
          youtubeId:     e.youtubeId,
          studentName:   e.studentName,
          phone:         e.phone,
          email:         e.email,
          completed:     e.completed,
          completedDate: e.completedDate,
        })))
      } else {
        // If backend returns an error object instead of an array, handle it gracefully
        console.warn("Expected an array from enrollments API, but received:", res.data)
        setEnrolledCourses([])
      }

    } catch (err) {
      console.error('Failed to load enrollments', err)
      setEnrolledCourses([])
    }
  }

  // Inside src/context/CourseContext.jsx

  const enroll = async ({ courseId, title, duration, youtubeId, studentName, phone, email }) => {
    // 🚀 Force conversion to an absolute Number so Jackson maps it to Long smoothly
    await enrollApi({ courseId: Number(courseId), studentName, phone })
    await refreshEnrollments()
  }

  const unenroll = async (enrollmentId) => {
    await unenrollApi(enrollmentId)
    setEnrolledCourses(prev => prev.filter(c => c.enrollmentId !== enrollmentId))
  }

  const markComplete = async (enrollmentId) => {
    await markCompleteApi(enrollmentId)
    await refreshEnrollments()
  }

  const isEnrolled  = (courseId) =>
    enrolledCourses.some(c => String(c.courseId) === String(courseId))

  const isCompleted = (courseId) =>
    enrolledCourses.some(c => String(c.courseId) === String(courseId) && c.completed)

  const completedCourses = enrolledCourses.filter(c => c.completed)

  return (
    <CourseContext.Provider value={{
      enrolledCourses, enroll, unenroll, isEnrolled,
      markComplete, isCompleted, completedCourses, refreshEnrollments
    }}>
      {children}
    </CourseContext.Provider>
  )
}

export function useCourses() {
  return useContext(CourseContext)
}