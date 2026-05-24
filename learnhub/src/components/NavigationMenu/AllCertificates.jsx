import { useNavigate } from 'react-router-dom'
import { useCourses } from '../../context/CourseContext'

function AllCertificates() {
  const navigate = useNavigate()
  const { completedCourses, enrolledCourses } = useCourses()

  return (
    <div className='min-h-[80vh] bg-gray-100 dark:bg-gray-800 px-10 py-16 transition-colors duration-300'>

      <h1 className='text-4xl font-bold text-center mb-3 dark:text-white'>🏆 My Certificates</h1>
      <p className='text-center text-gray-500 dark:text-gray-400 mb-10'>
        {completedCourses.length} certificate{completedCourses.length !== 1 ? 's' : ''} earned
      </p>

      {completedCourses.length === 0 ? (
        <div className='text-center'>
          <div className='text-7xl mb-4'>🎓</div>
          <p className='text-xl text-gray-500 dark:text-gray-400'>
            No certificates yet.
          </p>
          <p className='text-gray-400 dark:text-gray-500 mt-2 text-sm'>
            Complete a course to earn your first certificate!
          </p>
          <button
            onClick={() => navigate('/registered-courses')}
            className='mt-6 bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition'
          >
            Go to My Courses
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {completedCourses.map((course, index) => (
            <div
              key={index}
              className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border-t-4 border-yellow-500 flex flex-col items-center text-center'
            >
              <div className='text-5xl mb-4'>🏆</div>

              <h2 className='text-xl font-bold dark:text-white'>{course.title}</h2>
              <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>Duration: {course.duration}</p>

              <div className='mt-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full'>
                ✅ Completed · {course.completedDate}
              </div>

              <p className='text-gray-600 dark:text-gray-400 text-sm mt-3'>
                Awarded to <span className='font-semibold'>{course.studentName}</span>
              </p>

              <button
                onClick={() => navigate(`/certificates/${course.courseId}`)}
                className='mt-5 w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition'
              >
                View Certificate
              </button>
            </div>
          ))}
        </div>
      )}

      {/* In-progress courses reminder */}
      {enrolledCourses.filter(c => !c.completed).length > 0 && (
        <div className='mt-16 max-w-6xl mx-auto'>
          <h2 className='text-2xl font-bold mb-6 dark:text-white text-center'>
            In Progress — Complete to earn certificate
          </h2>
          <div className='grid grid-cols-3 gap-6'>
            {enrolledCourses.filter(c => !c.completed).map((course, i) => (
              <div key={i} className='bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm flex items-center gap-4 opacity-70'>
                <div className='text-3xl'>📘</div>
                <div>
                  <p className='font-bold dark:text-white'>{course.title}</p>
                  <p className='text-xs text-gray-400'>{course.duration}</p>
                </div>
                <button
                  onClick={() => navigate('/registered-courses')}
                  className='ml-auto text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-200 transition'
                >
                  Finish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default AllCertificates