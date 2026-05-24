function AboutUs() {
  return (
    <div className='min-h-[80vh] bg-gray-100 dark:bg-gray-800 px-10 py-16 transition-colors duration-300'>

      <div className='max-w-4xl mx-auto'>

        <h1 className='text-4xl font-bold dark:text-white'>About Us</h1>

        <p className='mt-5 text-lg text-gray-700 dark:text-gray-300 leading-8'>
          LearnHub is an online learning platform designed to help students and professionals improve their skills.
        </p>

        <p className='mt-4 text-lg text-gray-700 dark:text-gray-300 leading-8'>
          We provide high quality courses in Web Development, Data Science, UI/UX Design and many more technologies.
        </p>

        <div className='mt-12 grid grid-cols-3 gap-8'>
          {[
            { icon: '🎓', title: '6+ Courses', desc: 'Curated courses from industry experts' },
            { icon: '👨‍💻', title: 'Expert Instructors', desc: 'Learn from professionals in the field' },
            { icon: '📜', title: 'Certificates', desc: 'Earn certificates on completion' },
          ].map((item, i) => (
            <div key={i} className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md text-center'>
              <div className='text-4xl mb-3'>{item.icon}</div>
              <h3 className='font-bold text-xl dark:text-white'>{item.title}</h3>
              <p className='text-gray-500 dark:text-gray-400 mt-2 text-sm'>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}

export default AboutUs
