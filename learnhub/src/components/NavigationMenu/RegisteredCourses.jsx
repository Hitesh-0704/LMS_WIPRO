import { useNavigate } from 'react-router-dom'
import { useCourses } from '../../context/CourseContext'
import { toast } from '../ui/Toast'

function RegisteredCourses() {
  const navigate = useNavigate()
  const { enrolledCourses, unenroll, markComplete } = useCourses()

  const handleUnenroll = async (enrollmentId, title) => {
    await unenroll(enrollmentId)
    toast(`Unenrolled from ${title}`, 'info')
  }

  const handleMarkComplete = async (enrollmentId, title) => {
    await markComplete(enrollmentId)
    toast(`🎉 ${title} marked complete!`, 'success')
  }

  return (
    <div className='min-h-[80vh] bg-gray-100 dark:bg-gray-900 px-10 py-16 transition-colors duration-300'>
      <h1 className='text-4xl font-bold text-center mb-10 dark:text-white'>My Registered Courses</h1>

      {enrolledCourses.length === 0 ? (
        <div className='text-center'>
          <div className='text-6xl mb-4'>📚</div>
          <p className='text-xl text-gray-500 dark:text-gray-400'>No courses enrolled yet.</p>
          <button onClick={() => navigate('/courses')}
            className='mt-6 bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition'>
            Browse Courses
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {enrolledCourses.map((course, index) => (
            <div key={index} className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col'>
              {course.completed && (
                <div className='mb-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full w-fit'>
                  ✅ Completed · {course.completedDate}
                </div>
              )}
              <h2 className='text-2xl font-bold dark:text-white'>{course.title}</h2>
              <p className='mt-2 text-blue-600 font-semibold'>Duration: {course.duration}</p>
              <hr className='my-4 dark:border-gray-700' />
              <p className='text-gray-700 dark:text-gray-300'><span className='font-medium'>Student:</span> {course.studentName}</p>
              <p className='text-gray-700 dark:text-gray-300'><span className='font-medium'>Email:</span> {course.email}</p>
              <p className='text-gray-700 dark:text-gray-300'><span className='font-medium'>Phone:</span> {course.phone}</p>

              <div className='mt-auto pt-5 space-y-2'>
                <button onClick={() => navigate(`/learn/${course.courseId}`)}
                  className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition'>
                  ▶ Start Course
                </button>
                {course.completed ? (
                  <button onClick={() => navigate(`/certificates/${course.courseId}`)}
                    className='w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition'>
                    🏆 View Certificate
                  </button>
                ) : (
                  <button onClick={() => handleMarkComplete(course.enrollmentId, course.title)}
                    className='w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition'>
                    ✓ Mark as Complete
                  </button>
                )}
                <button onClick={() => handleUnenroll(course.enrollmentId, course.title)}
                  className='w-full border border-red-400 text-red-500 py-2 rounded-lg font-medium hover:bg-red-500 hover:text-white transition'>
                  Unenroll
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RegisteredCourses