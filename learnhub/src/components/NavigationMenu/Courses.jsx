import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCoursesApi } from '../../api/courseApi'

function Courses() {
  const navigate  = useNavigate()
  const [courses,  setCourses]  = useState([])
  const [filtered, setFiltered] = useState([])
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [loading,  setLoading]  = useState(true)

  const categories = ['All', 'Tech', 'Design', 'Marketing']

  useEffect(() => {
    fetchCoursesApi()
      .then(res => { setCourses(res.data); setFiltered(res.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let list = courses
    if (category !== 'All') list = list.filter(c => c.category === category)
    if (search) list = list.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(list)
  }, [search, category, courses])

  if (loading) return (
    <div className='h-[80vh] flex items-center justify-center dark:bg-gray-900'>
      <div className='text-gray-500 dark:text-gray-400 text-lg'>Loading courses...</div>
    </div>
  )

  return (
    <div className='min-h-[80vh] bg-gray-100 dark:bg-gray-900 px-10 py-14 transition-colors duration-300'>
      <h1 className='text-4xl font-bold text-center dark:text-white'>Our Courses</h1>
      <p className='text-center text-gray-600 dark:text-gray-400 mt-3 text-lg mb-8'>
        Browse our available courses below
      </p>

      <div className='flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-10'>
        <input
          type='text' placeholder='Search courses...' value={search}
          onChange={e => setSearch(e.target.value)}
          className='flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
        />
        <div className='flex gap-2'>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                category === cat
                  ? 'bg-black dark:bg-white dark:text-black text-white'
                  : 'bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className='text-center text-gray-500 dark:text-gray-400 text-lg'>No courses found.</p>
      ) : (
        <div className='grid grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {filtered.map(course => (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300 cursor-pointer'
            >
              <span className='text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full font-medium text-gray-500'>
                {course.category}
              </span>
              <h2 className='text-2xl font-bold mt-3 dark:text-white'>{course.title}</h2>
              <p className='mt-3 text-gray-600 dark:text-gray-400'>{course.description}</p>
              <p className='mt-5 font-semibold text-blue-600'>Duration: {course.duration}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Courses