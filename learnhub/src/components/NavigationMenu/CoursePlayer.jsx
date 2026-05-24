import { useParams, useNavigate } from 'react-router-dom'
import { useCourses } from '../../context/CourseContext'

const courseData = {
  'web-development':   { title: 'Web Development',   youtubeId: 'U9-GFVi4Uo4' },
  'data-science':      { title: 'Data Science',      youtubeId: 'mkv5mxYu0Wk' },
  'ui-ux-design':      { title: 'UI/UX Design',      youtubeId: 'c9Wg6Cb_YlU' },
  'digital-marketing': { title: 'Digital Marketing', youtubeId: 'D7SYlHVx1f8' },
  'cybersecurity':     { title: 'Cybersecurity',     youtubeId: 'nzZkKoREEGo' },
  'cloud-computing':   { title: 'Cloud Computing',   youtubeId: 'M988_fsOSWo' },
}

function CoursePlayer() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { enrolledCourses } = useCourses()

  // 🚀 Dynamically extract the course record directly out of your sync array!
  const course = enrolledCourses.find(c => String(c.courseId) === String(courseId))

  if (!course) {
    return (
      <div className='h-[80vh] flex flex-col justify-center items-center dark:bg-gray-800'>
        <h1 className='text-2xl font-bold text-red-500'>Course Not Found or Access Denied</h1>
        <p className='text-gray-400 text-sm mt-1'>Please confirm your active enrollment registration state.</p>
        <button onClick={() => navigate('/registered-courses')} className='mt-4 bg-black text-white px-6 py-2 rounded-lg'>
          My Courses
        </button>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white px-10 py-8'>
      {/* Top Bar */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <p className='text-gray-400 text-sm'>Now Learning</p>
          <h1 className='text-3xl font-bold'>{course.title}</h1>
        </div>
        <button
          onClick={() => navigate('/registered-courses')}
          className='bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition'
        >
          ← My Courses
        </button>
      </div>

      {/* YouTube Embed */}
      <div className='relative w-full rounded-2xl overflow-hidden shadow-2xl' style={{ paddingBottom: '56.25%' }}>
        <iframe
          className='absolute top-0 left-0 w-full h-full'
          src={`https://www.youtube.com/embed/${course.youtubeId}?autoplay=1&rel=0`}
          title={course.title}
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        />
      </div>

      {/* Info Below Video */}
      <div className='mt-6 bg-gray-800 rounded-xl p-6'>
        <h2 className='text-xl font-bold'>{course.title} — Full Course</h2>
        <p className='text-gray-400 mt-1 text-sm'>
          Powered by LearnHub Core Engine
        </p>
      </div>
    </div>
  )
}

export default CoursePlayer