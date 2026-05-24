import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const WORDS = ['LearnHub', 'Courses', 'Skills', 'Your Future', 'Knowledge', 'Success']

function Home() {
  const navigate = useNavigate()
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = WORDS[wordIndex % WORDS.length]

    let timeout

    if (!deleting && charIndex < word.length) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, 100)

    } else if (!deleting && charIndex === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1400)

    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, charIndex - 1))
        setCharIndex(c => c - 1)
      }, 55)

    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setWordIndex(i => i + 1)   // loops forever via % WORDS.length above
    }

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, wordIndex])

  return (
    <div className='h-[80vh] flex flex-col justify-center items-center text-center bg-gray-100 dark:bg-gray-900 px-6 transition-colors duration-300'>

      {/* Two-line layout so the red dot never floats away */}
      <div className='flex flex-col items-center'>

        <h1 className='text-6xl font-bold text-black dark:text-white'>
          Welcome to
        </h1>

        <h1 className='text-6xl font-bold text-black dark:text-white mt-2 flex items-center justify-center gap-1'>
          <span className='min-w-[1ch]'>{displayed}</span>
          <span className='animate-pulse'>|</span>
          <span className='text-red-500'>.</span>
        </h1>

      </div>

      <p className='mt-6 text-2xl text-gray-700 dark:text-gray-300'>
        Learn new skills from expert instructors
      </p>

      <div className='flex gap-4 mt-8'>
        <button
          onClick={() => navigate('/courses')}
          className='bg-black dark:bg-white dark:text-black text-white px-8 py-3 rounded-lg text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300 shadow-lg'
        >
          Explore Courses
        </button>

      </div>

    </div>
  )
}

export default Home