// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { toast } from '../ui/Toast'
// import axios from 'axios'
//
// function ContactUs() {
//   const navigate = useNavigate()
//
//   const [formData, setFormData] = useState({
//     name: '', email: '', phone: '', message: ''
//   })
//   const [loading, setLoading] = useState(false)
//
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }
//
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       await axios.post('http://localhost:9797/api/contact', formData, {
//         headers: { 'Content-Type': 'application/json' }
//       })
//       toast(`Message sent! We'll get back to you soon, ${formData.name} 📩`, 'success')
//       setFormData({ name: '', email: '', phone: '', message: '' })
//       navigate('/')
//     } catch (err) {
//       toast('Failed to send message. Please try again.', 'error')
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   return (
//     <div className='min-h-[80vh] bg-gray-100 dark:bg-gray-800 px-10 py-16 flex justify-center items-center transition-colors duration-300'>
//
//       <div className='bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-10 w-full max-w-2xl'>
//
//         <h1 className='text-4xl font-bold text-center mb-8 dark:text-white'>Contact Us</h1>
//
//         <form onSubmit={handleSubmit} className='space-y-6'>
//
//           <div>
//             <label className='block text-lg font-medium mb-2 dark:text-gray-300'>Full Name</label>
//             <input
//               type='text' name='name' value={formData.name}
//               onChange={handleChange} placeholder='Enter your name' required
//               className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
//             />
//           </div>
//
//           <div>
//             <label className='block text-lg font-medium mb-2 dark:text-gray-300'>Email</label>
//             <input
//               type='email' name='email' value={formData.email}
//               onChange={handleChange} placeholder='Enter your email' required
//               className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
//             />
//           </div>
//
//           <div>
//             <label className='block text-lg font-medium mb-2 dark:text-gray-300'>Phone Number</label>
//             <input
//               type='tel' name='phone' value={formData.phone}
//               onChange={handleChange} placeholder='Enter phone number' required
//               className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
//             />
//           </div>
//
//           <div>
//             <label className='block text-lg font-medium mb-2 dark:text-gray-300'>Message</label>
//             <textarea
//               rows='5' name='message' value={formData.message}
//               onChange={handleChange} placeholder='Write your message here...' required
//               className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none'
//             />
//           </div>
//
//           <button
//             type='submit' disabled={loading}
//             className='w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-60'
//           >
//             {loading ? 'Sending...' : 'Send Message'}
//           </button>
//
//         </form>
//
//         <div className='mt-10 border-t dark:border-gray-700 pt-6 text-gray-700 dark:text-gray-400 space-y-2 text-center'>
//           <p>📧 support@learnhub.com</p>
//           <p>📞 +91 98765 43210</p>
//           <p>📍 Mumbai, Maharashtra</p>
//         </div>
//
//       </div>
//
//     </div>
//   )
// }
//
// export default ContactUs

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../ui/Toast'
import axios from 'axios'

function ContactUs() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[6-9]\d{9}$/
    const nameRegex  = /^[a-zA-Z\s]{2,}$/
    const cleanPhone = formData.phone.replace(/\s/g, '').replace(/^(\+91|0)/, '')

    if (!nameRegex.test(formData.name.trim())) {
      toast('Enter a valid full name (letters only, min 2 chars).', 'error')
      return
    }
    if (!emailRegex.test(formData.email)) {
      toast('Enter a valid email address.', 'error')
      return
    }
    if (!phoneRegex.test(cleanPhone)) {
      toast('Enter a valid 10-digit Indian phone number.', 'error')
      return
    }
    if (formData.message.trim().length < 10) {
      toast('Message must be at least 10 characters.', 'error')
      return
    }

    setLoading(true)
    try {
      await axios.post('http://localhost:9797/api/contact', formData, {
        headers: { 'Content-Type': 'application/json' }
      })
      toast(`Message sent! We'll get back to you soon, ${formData.name} 📩`, 'success')
      setFormData({ name: '', email: '', phone: '', message: '' })
      navigate('/')
    } catch (err) {
      toast('Failed to send message. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-[80vh] bg-gray-100 dark:bg-gray-800 px-10 py-16 flex justify-center items-center transition-colors duration-300'>

      <div className='bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-10 w-full max-w-2xl'>

        <h1 className='text-4xl font-bold text-center mb-8 dark:text-white'>Contact Us</h1>

        <form onSubmit={handleSubmit} className='space-y-6'>

          <div>
            <label className='block text-lg font-medium mb-2 dark:text-gray-300'>Full Name</label>
            <input
              type='text' name='name' value={formData.name}
              onChange={handleChange} placeholder='Enter your name' required
              className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
            />
          </div>

          <div>
            <label className='block text-lg font-medium mb-2 dark:text-gray-300'>Email</label>
            <input
              type='email' name='email' value={formData.email}
              onChange={handleChange} placeholder='Enter your email' required
              className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
            />
          </div>

          <div>
            <label className='block text-lg font-medium mb-2 dark:text-gray-300'>Phone Number</label>
            <input
              type='tel' name='phone' value={formData.phone}
              onChange={handleChange} placeholder='Enter 10-digit phone number' required
              className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
            />
          </div>

          <div>
            <label className='block text-lg font-medium mb-2 dark:text-gray-300'>Message</label>
            <textarea
              rows='5' name='message' value={formData.message}
              onChange={handleChange} placeholder='Write your message here...' required
              className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none'
            />
          </div>

          <button
            type='submit' disabled={loading}
            className='w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-60'
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>

        </form>

        <div className='mt-10 border-t dark:border-gray-700 pt-6 text-gray-700 dark:text-gray-400 space-y-2 text-center'>
          <p>📧 support@learnhub.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 Mumbai, Maharashtra</p>
        </div>

      </div>

    </div>
  )
}

export default ContactUs

