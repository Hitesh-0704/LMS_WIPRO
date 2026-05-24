// import { useParams, useNavigate } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { fetchCourseApi } from '../../api/courseApi'
// import { createOrderApi, verifyPaymentApi } from '../../api/paymentApi'
// import { useCourses } from '../../context/CourseContext'
// import { useAuth } from '../../context/AuthContext'
// import { toast } from '../ui/Toast'
//
// const courseExtras = {
//   'Web Development': {
//     icon: '🌐',
//     highlights: [
//       'Build real-world responsive websites from scratch',
//       'Master HTML5, CSS3 and JavaScript ES6+',
//       'Learn React and component-based development',
//       'Integrate REST APIs into your projects',
//       'Deploy live projects on the web',
//       'Version control with Git and GitHub',
//     ],
//     requirements: [
//       'No prior experience needed — complete beginner friendly',
//       'A computer with internet access',
//       'Willingness to practice daily for best results',
//     ],
//     level: 'Beginner to Intermediate',
//     students: '2,400+',
//     rating: '4.8',
//   },
//   'Data Science': {
//     icon: '📊',
//     highlights: [
//       'Learn Python programming from absolute scratch',
//       'Work with Pandas, NumPy and Matplotlib',
//       'Build and evaluate machine learning models',
//       'Analyse and visualise real-world datasets',
//       'Complete hands-on projects for your portfolio',
//       'Understand statistics for data analysis',
//     ],
//     requirements: [
//       'Basic computer knowledge required',
//       'No prior programming experience needed',
//       'Interest in data and problem solving',
//     ],
//     level: 'Beginner to Advanced',
//     students: '1,800+',
//     rating: '4.9',
//   },
//   'UI/UX Design': {
//     icon: '🎨',
//     highlights: [
//       'Master Figma from zero to professional level',
//       'Learn user research and wireframing techniques',
//       'Create complete design systems and style guides',
//       'Understand accessibility and usability principles',
//       'Build a professional design portfolio',
//       'Learn prototyping and user testing',
//     ],
//     requirements: [
//       'No design experience required',
//       'A computer with Figma installed (free)',
//       'Creative mindset and attention to detail',
//     ],
//     level: 'Beginner',
//     students: '1,200+',
//     rating: '4.7',
//   },
//   'Digital Marketing': {
//     icon: '📈',
//     highlights: [
//       'Learn SEO and rank on Google organically',
//       'Run Google Ads and Facebook ad campaigns',
//       'Build and grow social media presence',
//       'Create high-converting email marketing funnels',
//       'Track and analyse campaign performance with data',
//       'Build a complete digital marketing strategy',
//     ],
//     requirements: [
//       'No prior marketing knowledge needed',
//       'Basic understanding of social media platforms',
//       'A computer with internet access',
//     ],
//     level: 'Beginner to Intermediate',
//     students: '980+',
//     rating: '4.6',
//   },
//   'Cybersecurity': {
//     icon: '🔒',
//     highlights: [
//       'Learn ethical hacking and penetration testing',
//       'Understand network and web application security',
//       'Use industry tools like Kali Linux and Metasploit',
//       'Study cryptography and vulnerability assessment',
//       'Prepare for CEH and CompTIA Security+ exams',
//       'Perform real-world CTF (Capture the Flag) challenges',
//     ],
//     requirements: [
//       'Basic computer and networking knowledge',
//       'Curiosity about how systems and networks work',
//       'Linux basics are a plus but not required',
//     ],
//     level: 'Intermediate',
//     students: '760+',
//     rating: '4.8',
//   },
//   'Cloud Computing': {
//     icon: '☁️',
//     highlights: [
//       'Master AWS core services — EC2, S3, Lambda, RDS',
//       'Learn Docker and Kubernetes for containerisation',
//       'Build CI/CD pipelines for automated deployment',
//       'Write Infrastructure as Code with Terraform',
//       'Deploy scalable production-ready applications',
//       'Understand cloud security best practices',
//     ],
//     requirements: [
//       'Basic programming knowledge in any language',
//       'Familiarity with Linux command line',
//       'Understanding of basic web development concepts',
//     ],
//     level: 'Intermediate to Advanced',
//     students: '640+',
//     rating: '4.9',
//   },
// }
//
// function loadRazorpayScript() {
//   return new Promise(resolve => {
//     if (document.getElementById('razorpay-script')) { resolve(true); return }
//     const script = document.createElement('script')
//     script.id  = 'razorpay-script'
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js'
//     script.onload  = () => resolve(true)
//     script.onerror = () => resolve(false)
//     document.body.appendChild(script)
//   })
// }
//
// function CourseDetail() {
//   const { courseId } = useParams()
//   const navigate     = useNavigate()
//   const { user }     = useAuth()
//   const { isEnrolled, refreshEnrollments } = useCourses()
//
//   const [course, setCourse]         = useState(null)
//   const [loading, setLoading]       = useState(true)
//   const [payLoading, setPayLoading] = useState(false)
//   const [showForm, setShowForm]     = useState(false)
//   const [form, setForm]             = useState({ studentName: '', phone: '' })
//
//   const alreadyEnrolled = isEnrolled(courseId)
//
//   useEffect(() => {
//     fetchCourseApi(courseId)
//       .then(res => setCourse(res.data))
//       .catch(() => navigate('/courses'))
//       .finally(() => setLoading(false))
//   }, [courseId])
//
//   const handlePayment = async e => {
//     e.preventDefault()
//     setPayLoading(true)
//     try {
//       const loaded = await loadRazorpayScript()
//       if (!loaded) { toast('Failed to load payment gateway.', 'error'); setPayLoading(false); return }
//
//       const { data } = await createOrderApi({
//         courseId:    Number(courseId),
//         studentName: form.studentName,
//         phone:       form.phone,
//       })
//
//       const options = {
//         key:         data.keyId,
//         amount:      data.amount,
//         currency:    data.currency,
//         name:        'LearnHub',
//         description: `Enrollment: ${data.courseName}`,
//         order_id:    data.orderId,
//         prefill:     { name: form.studentName, email: user?.email || '', contact: form.phone },
//         theme:       { color: '#000000' },
//         handler: async (response) => {
//           try {
//             await verifyPaymentApi({
//               razorpayOrderId:   response.razorpay_order_id,
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpaySignature: response.razorpay_signature,
//               courseId:    Number(courseId),
//               studentName: form.studentName,
//               phone:       form.phone,
//             })
//             await refreshEnrollments()
//             toast(`🎉 Enrolled in ${course.title}! Check your email.`, 'success')
//             navigate('/registered-courses')
//           } catch (err) {
//             toast(err.response?.data?.error || 'Verification failed.', 'error')
//           }
//         },
//         modal: { ondismiss: () => { toast('Payment cancelled.', 'info'); setPayLoading(false) } }
//       }
//
//       const rzp = new window.Razorpay(options)
//       rzp.on('payment.failed', () => { toast('Payment failed. Try again.', 'error'); setPayLoading(false) })
//       rzp.open()
//
//     } catch (err) {
//       toast(err.response?.data?.error || 'Could not initiate payment.', 'error')
//       setPayLoading(false)
//     }
//   }
//
//   if (loading) return (
//     <div className='h-[80vh] flex items-center justify-center dark:bg-gray-900'>
//       <div className='text-center'>
//         <div className='w-10 h-10 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4' />
//         <p className='text-gray-500 dark:text-gray-400'>Loading course...</p>
//       </div>
//     </div>
//   )
//
//   const extras = courseExtras[course.title] || null
//
//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
//
//       {/* ── Hero Banner ────────────────────────────────────────────────────── */}
//       <div className='bg-gray-900 dark:bg-gray-950 text-white'>
//         <div className='max-w-6xl mx-auto px-8 py-12'>
//
//           <button
//             onClick={() => navigate('/courses')}
//             className='text-gray-400 hover:text-white transition text-sm mb-6 inline-flex items-center gap-1'
//           >
//             ← Back to Courses
//           </button>
//
//           <div className='flex items-start gap-6'>
//
//             {/* Icon */}
//             <div className='text-6xl flex-shrink-0 hidden sm:block'>{extras?.icon || '📚'}</div>
//
//             <div className='flex-1'>
//
//               {/* Badges */}
//               <div className='flex flex-wrap items-center gap-2 mb-3'>
//                 <span className='text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full font-medium'>
//                   {course.category}
//                 </span>
//                 {extras?.level && (
//                   <span className='text-xs bg-blue-900/60 text-blue-300 px-3 py-1 rounded-full font-medium'>
//                     {extras.level}
//                   </span>
//                 )}
//                 <span className='text-xs bg-yellow-900/60 text-yellow-300 px-3 py-1 rounded-full font-medium'>
//                   ⭐ {extras?.rating || '4.8'} rating
//                 </span>
//                 <span className='text-xs bg-green-900/60 text-green-300 px-3 py-1 rounded-full font-medium'>
//                   👥 {extras?.students || '500+'} students
//                 </span>
//               </div>
//
//               <h1 className='text-4xl font-bold mb-3 leading-tight'>{course.title}</h1>
//               <p className='text-gray-300 text-lg leading-relaxed max-w-3xl mb-5'>
//                 {course.description}
//               </p>
//
//               {/* Quick stats */}
//               <div className='flex flex-wrap items-center gap-6 text-sm text-gray-400'>
//                 <span className='flex items-center gap-1'>
//                   <span>⏱</span>
//                   <span>Duration: <strong className='text-white'>{course.duration}</strong></span>
//                 </span>
//                 <span className='flex items-center gap-1'>
//                   <span>🎓</span>
//                   <span>Certificate included</span>
//                 </span>
//                 <span className='flex items-center gap-1'>
//                   <span>▶</span>
//                   <span>Full video course</span>
//                 </span>
//                 <span className='flex items-center gap-1'>
//                   <span>♾</span>
//                   <span>Lifetime access</span>
//                 </span>
//               </div>
//
//             </div>
//           </div>
//         </div>
//       </div>
//
//       {/* ── Main Two-Column Layout ─────────────────────────────────────────── */}
//       <div className='max-w-6xl mx-auto px-8 py-10'>
//         <div className='flex gap-8 items-start flex-col lg:flex-row'>
//
//           {/* ── LEFT — Course Details ──────────────────────────────────────── */}
//           <div className='flex-1 space-y-6 min-w-0'>
//
//             {/* What you will learn */}
//             {extras?.highlights && (
//               <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8'>
//                 <h2 className='text-xl font-bold mb-6 dark:text-white flex items-center gap-2'>
//                   <span>✅</span> What you will learn
//                 </h2>
//                 <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
//                   {extras.highlights.map((item, i) => (
//                     <div key={i} className='flex items-start gap-3'>
//                       <div className='w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 mt-0.5'>
//                         <span className='text-green-600 dark:text-green-400 text-xs font-bold'>✓</span>
//                       </div>
//                       <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>{item}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//
//             {/* Course Overview */}
//             <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8'>
//               <h2 className='text-xl font-bold mb-4 dark:text-white flex items-center gap-2'>
//                 <span>📋</span> Course Overview
//               </h2>
//               <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-sm'>
//                 {course.description}
//               </p>
//
//               {/* Stats row */}
//               <div className='grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700'>
//                 {[
//                   { icon: '⏱', label: 'Duration', value: course.duration },
//                   { icon: '📊', label: 'Level', value: extras?.level || 'All levels' },
//                   { icon: '🏆', label: 'Certificate', value: 'Included' },
//                 ].map((s, i) => (
//                   <div key={i} className='text-center'>
//                     <div className='text-2xl mb-1'>{s.icon}</div>
//                     <div className='text-xs text-gray-400 dark:text-gray-500 mb-1'>{s.label}</div>
//                     <div className='text-sm font-semibold dark:text-white'>{s.value}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//
//             {/* Requirements */}
//             {extras?.requirements && (
//               <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8'>
//                 <h2 className='text-xl font-bold mb-5 dark:text-white flex items-center gap-2'>
//                   <span>📌</span> Requirements
//                 </h2>
//                 <ul className='space-y-3'>
//                   {extras.requirements.map((req, i) => (
//                     <li key={i} className='flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm'>
//                       <div className='w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2' />
//                       {req}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//
//             {/* This course includes */}
//             <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8'>
//               <h2 className='text-xl font-bold mb-5 dark:text-white flex items-center gap-2'>
//                 <span>🎁</span> This course includes
//               </h2>
//               <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//                 {[
//                   { icon: '▶', text: 'Full on-demand video lectures' },
//                   { icon: '📱', text: 'Access on mobile and desktop' },
//                   { icon: '📝', text: 'Personal notes feature built-in' },
//                   { icon: '🏆', text: 'Certificate of completion' },
//                   { icon: '♾', text: 'Lifetime access to all content' },
//                   { icon: '🔄', text: 'Regular content updates' },
//                 ].map((item, i) => (
//                   <div key={i} className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
//                     <span className='text-blue-500'>{item.icon}</span>
//                     {item.text}
//                   </div>
//                 ))}
//               </div>
//             </div>
//
//           </div>
//
//           {/* ── RIGHT — Sticky Enroll Card ─────────────────────────────────── */}
//           <div className='w-full lg:w-80 flex-shrink-0'>
//             <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden sticky top-6'>
//
//               {/* Price header */}
//               <div className='bg-gray-900 dark:bg-gray-950 p-6 text-center'>
//                 <div className='text-5xl mb-2'>{extras?.icon || '📚'}</div>
//                 <div className='text-3xl font-bold text-white mb-1'>₹999</div>
//                 <div className='text-gray-400 text-sm line-through mb-2'>₹4,999</div>
//                 <div className='inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full'>
//                   80% OFF — Limited time
//                 </div>
//               </div>
//
//               <div className='p-6'>
//
//                 {/* Course mini info */}
//                 <div className='space-y-2 mb-5'>
//                   {[
//                     { icon: '⏱', text: `Duration: ${course.duration}` },
//                     { icon: '📊', text: extras?.level || 'All levels' },
//                     { icon: '🎓', text: 'Certificate of completion' },
//                     { icon: '▶', text: 'Full video course' },
//                     { icon: '📝', text: 'Built-in notes feature' },
//                     { icon: '♾', text: 'Lifetime access' },
//                   ].map((item, i) => (
//                     <div key={i} className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400'>
//                       <span>{item.icon}</span>
//                       <span>{item.text}</span>
//                     </div>
//                   ))}
//                 </div>
//
//                 <hr className='dark:border-gray-700 mb-5' />
//
//                 {/* Enroll area */}
//                 {alreadyEnrolled ? (
//                   <div className='space-y-3'>
//                     <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center'>
//                       <p className='text-green-700 dark:text-green-400 font-semibold text-sm'>
//                         ✅ Already enrolled
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => navigate(`/learn/${courseId}`)}
//                       className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm'
//                     >
//                       ▶ Start Course
//                     </button>
//                     <button
//                       onClick={() => navigate('/registered-courses')}
//                       className='w-full border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition'
//                     >
//                       My Courses
//                     </button>
//                   </div>
//
//                 ) : showForm ? (
//                   <form onSubmit={handlePayment} className='space-y-4'>
//                     <h3 className='font-bold dark:text-white text-sm'>Complete your details</h3>
//
//                     <div>
//                       <label className='block text-xs font-medium dark:text-gray-300 mb-1'>Full Name</label>
//                       <input
//                         type='text' required
//                         value={form.studentName}
//                         onChange={e => setForm({ ...form, studentName: e.target.value })}
//                         placeholder='Your full name'
//                         className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
//                       />
//                     </div>
//
//                     <div>
//                       <label className='block text-xs font-medium dark:text-gray-300 mb-1'>Phone Number</label>
//                       <input
//                         type='tel' required
//                         value={form.phone}
//                         onChange={e => setForm({ ...form, phone: e.target.value })}
//                         placeholder='+91 98765 43210'
//                         className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
//                       />
//                     </div>
//
//                     {/* Price summary */}
//                     <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm'>
//                       <div className='flex justify-between text-gray-600 dark:text-gray-300 mb-2'>
//                         <span>{course.title}</span>
//                         <span className='line-through text-gray-400'>₹4,999</span>
//                       </div>
//                       <div className='flex justify-between text-gray-600 dark:text-gray-300 mb-2'>
//                         <span>Discount (80%)</span>
//                         <span className='text-green-600'>- ₹4,000</span>
//                       </div>
//                       <div className='flex justify-between font-bold dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600'>
//                         <span>Total</span>
//                         <span className='text-green-600 text-base'>₹999</span>
//                       </div>
//                     </div>
//
//                     <button
//                       type='submit' disabled={payLoading}
//                       className='w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm'
//                     >
//                       {payLoading ? (
//                         <>
//                           <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24' fill='none'>
//                             <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
//                             <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'/>
//                           </svg>
//                           Processing...
//                         </>
//                       ) : '🔒 Pay ₹999 & Enroll'}
//                     </button>
//
//                     <button type='button' onClick={() => setShowForm(false)}
//                       className='w-full text-gray-400 text-xs hover:text-gray-600 transition'>
//                       Cancel
//                     </button>
//
//                     <p className='text-center text-xs text-gray-400'>
//                       🔒 Secured by Razorpay · UPI, Cards, Net Banking
//                     </p>
//                   </form>
//
//                 ) : (
//                   <>
//                     <button
//                       onClick={() => setShowForm(true)}
//                       className='w-full bg-black dark:bg-white dark:text-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition text-base mb-3'
//                     >
//                       Enroll Now — ₹999
//                     </button>
//                     <p className='text-center text-xs text-gray-400 mb-4'>
//                       🔒 Secured checkout · 30-day money-back guarantee
//                     </p>
//                     <div className='flex justify-center gap-4 text-xs text-gray-400'>
//                       <span>💳 Cards</span>
//                       <span>📱 UPI</span>
//                       <span>🏦 Net Banking</span>
//                     </div>
//                   </>
//                 )}
//
//               </div>
//             </div>
//
//             {/* Trust badges below card */}
//             <div className='mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5'>
//               <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3'>
//                 Trusted by students
//               </p>
//               <div className='space-y-2'>
//                 {[
//                   '✅ Verified course content',
//                   '🏆 Industry-recognised certificate',
//                   '💬 Community support included',
//                   '🔄 Free content updates forever',
//                 ].map((item, i) => (
//                   <p key={i} className='text-xs text-gray-600 dark:text-gray-400'>{item}</p>
//                 ))}
//               </div>
//             </div>
//
//           </div>
//         </div>
//       </div>
//
//     </div>
//   )
// }
//
// export default CourseDetail


import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCourseApi } from '../../api/courseApi'
import { createOrderApi, verifyPaymentApi } from '../../api/paymentApi'
import { useCourses } from '../../context/CourseContext'
import { useAuth } from '../../context/AuthContext'
import { toast } from '../ui/Toast'

const courseExtras = {
  'Web Development': {
    icon: '🌐',
    highlights: [
      'Build real-world responsive websites from scratch',
      'Master HTML5, CSS3 and JavaScript ES6+',
      'Learn React and component-based development',
      'Integrate REST APIs into your projects',
      'Deploy live projects on the web',
      'Version control with Git and GitHub',
    ],
    requirements: [
      'No prior experience needed — complete beginner friendly',
      'A computer with internet access',
      'Willingness to practice daily for best results',
    ],
    level: 'Beginner to Intermediate',
    students: '2,400+',
    rating: '4.8',
  },
  'Data Science': {
    icon: '📊',
    highlights: [
      'Learn Python programming from absolute scratch',
      'Work with Pandas, NumPy and Matplotlib',
      'Build and evaluate machine learning models',
      'Analyse and visualise real-world datasets',
      'Complete hands-on projects for your portfolio',
      'Understand statistics for data analysis',
    ],
    requirements: [
      'Basic computer knowledge required',
      'No prior programming experience needed',
      'Interest in data and problem solving',
    ],
    level: 'Beginner to Advanced',
    students: '1,800+',
    rating: '4.9',
  },
  'UI/UX Design': {
    icon: '🎨',
    highlights: [
      'Master Figma from zero to professional level',
      'Learn user research and wireframing techniques',
      'Create complete design systems and style guides',
      'Understand accessibility and usability principles',
      'Build a professional design portfolio',
      'Learn prototyping and user testing',
    ],
    requirements: [
      'No design experience required',
      'A computer with Figma installed (free)',
      'Creative mindset and attention to detail',
    ],
    level: 'Beginner',
    students: '1,200+',
    rating: '4.7',
  },
  'Digital Marketing': {
    icon: '📈',
    highlights: [
      'Learn SEO and rank on Google organically',
      'Run Google Ads and Facebook ad campaigns',
      'Build and grow social media presence',
      'Create high-converting email marketing funnels',
      'Track and analyse campaign performance with data',
      'Build a complete digital marketing strategy',
    ],
    requirements: [
      'No prior marketing knowledge needed',
      'Basic understanding of social media platforms',
      'A computer with internet access',
    ],
    level: 'Beginner to Intermediate',
    students: '980+',
    rating: '4.6',
  },
  'Cybersecurity': {
    icon: '🔒',
    highlights: [
      'Learn ethical hacking and penetration testing',
      'Understand network and web application security',
      'Use industry tools like Kali Linux and Metasploit',
      'Study cryptography and vulnerability assessment',
      'Prepare for CEH and CompTIA Security+ exams',
      'Perform real-world CTF (Capture the Flag) challenges',
    ],
    requirements: [
      'Basic computer and networking knowledge',
      'Curiosity about how systems and networks work',
      'Linux basics are a plus but not required',
    ],
    level: 'Intermediate',
    students: '760+',
    rating: '4.8',
  },
  'Cloud Computing': {
    icon: '☁️',
    highlights: [
      'Master AWS core services — EC2, S3, Lambda, RDS',
      'Learn Docker and Kubernetes for containerisation',
      'Build CI/CD pipelines for automated deployment',
      'Write Infrastructure as Code with Terraform',
      'Deploy scalable production-ready applications',
      'Understand cloud security best practices',
    ],
    requirements: [
      'Basic programming knowledge in any language',
      'Familiarity with Linux command line',
      'Understanding of basic web development concepts',
    ],
    level: 'Intermediate to Advanced',
    students: '640+',
    rating: '4.9',
  },
}

function loadRazorpayScript() {
  return new Promise(resolve => {
    if (document.getElementById('razorpay-script')) { resolve(true); return }
    const script = document.createElement('script')
    script.id  = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function CourseDetail() {
  const { courseId } = useParams()
  const navigate     = useNavigate()
  const { user }     = useAuth()
  const { isEnrolled, refreshEnrollments } = useCourses()

  const [course, setCourse]         = useState(null)
  const [loading, setLoading]       = useState(true)
  const [payLoading, setPayLoading] = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState({ studentName: '', phone: '' })

  const alreadyEnrolled = isEnrolled(courseId)

  useEffect(() => {
    fetchCourseApi(courseId)
      .then(res => setCourse(res.data))
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false))
  }, [courseId])

  const handlePayment = async e => {
    e.preventDefault()
    setPayLoading(true)

    // Validation
    const nameRegex  = /^[a-zA-Z\s]{2,}$/
    const phoneRegex = /^[6-9]\d{9}$/
    const cleanPhone = form.phone.replace(/\D/g, '').replace(/^(\+91|0+)/, '')

    if (!nameRegex.test(form.studentName.trim())) {
      toast('Enter a valid full name (letters only, min 2 chars).', 'error')
      setPayLoading(false)
      return
    }
    if (!phoneRegex.test(cleanPhone)) {
      toast('Enter a valid 10-digit Indian phone number.', 'error')
      setPayLoading(false)
      return
    }

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { toast('Failed to load payment gateway.', 'error'); setPayLoading(false); return }

      const { data } = await createOrderApi({
        courseId:    Number(courseId),
        studentName: form.studentName,
        phone:       cleanPhone,
      })

      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        'LearnHub',
        description: `Enrollment: ${data.courseName}`,
        order_id:    data.orderId,
        prefill:     { name: form.studentName, email: user?.email || '', contact: cleanPhone },
        theme:       { color: '#000000' },
        handler: async (response) => {
          try {
            await verifyPaymentApi({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              courseId:    Number(courseId),
              studentName: form.studentName,
              phone:       cleanPhone,
            })
            await refreshEnrollments()
            toast(`🎉 Enrolled in ${course.title}! Check your email.`, 'success')
            navigate('/registered-courses')
          } catch (err) {
            toast(err.response?.data?.error || 'Verification failed.', 'error')
          }
        },
        modal: { ondismiss: () => { toast('Payment cancelled.', 'info'); setPayLoading(false) } }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => { toast('Payment failed. Try again.', 'error'); setPayLoading(false) })
      rzp.open()

    } catch (err) {
      toast(err.response?.data?.error || 'Could not initiate payment.', 'error')
      setPayLoading(false)
    }
  }

  if (loading) return (
    <div className='h-[80vh] flex items-center justify-center dark:bg-gray-900'>
      <div className='text-center'>
        <div className='w-10 h-10 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-gray-500 dark:text-gray-400'>Loading course...</p>
      </div>
    </div>
  )

  const extras = courseExtras[course.title] || null

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>

      {/* ── Hero Banner ────────────────────────────────────────────────────── */}
      <div className='bg-gray-900 dark:bg-gray-950 text-white'>
        <div className='max-w-6xl mx-auto px-8 py-12'>

          <button
            onClick={() => navigate('/courses')}
            className='text-gray-400 hover:text-white transition text-sm mb-6 inline-flex items-center gap-1'
          >
            ← Back to Courses
          </button>

          <div className='flex items-start gap-6'>
            <div className='text-6xl flex-shrink-0 hidden sm:block'>{extras?.icon || '📚'}</div>
            <div className='flex-1'>
              <div className='flex flex-wrap items-center gap-2 mb-3'>
                <span className='text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full font-medium'>{course.category}</span>
                {extras?.level && (
                  <span className='text-xs bg-blue-900/60 text-blue-300 px-3 py-1 rounded-full font-medium'>{extras.level}</span>
                )}
                <span className='text-xs bg-yellow-900/60 text-yellow-300 px-3 py-1 rounded-full font-medium'>⭐ {extras?.rating || '4.8'} rating</span>
                <span className='text-xs bg-green-900/60 text-green-300 px-3 py-1 rounded-full font-medium'>👥 {extras?.students || '500+'} students</span>
              </div>
              <h1 className='text-4xl font-bold mb-3 leading-tight'>{course.title}</h1>
              <p className='text-gray-300 text-lg leading-relaxed max-w-3xl mb-5'>{course.description}</p>
              <div className='flex flex-wrap items-center gap-6 text-sm text-gray-400'>
                <span className='flex items-center gap-1'><span>⏱</span><span>Duration: <strong className='text-white'>{course.duration}</strong></span></span>
                <span className='flex items-center gap-1'><span>🎓</span><span>Certificate included</span></span>
                <span className='flex items-center gap-1'><span>▶</span><span>Full video course</span></span>
                <span className='flex items-center gap-1'><span>♾</span><span>Lifetime access</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout ─────────────────────────────────────────── */}
      <div className='max-w-6xl mx-auto px-8 py-10'>
        <div className='flex gap-8 items-start flex-col lg:flex-row'>

          {/* LEFT */}
          <div className='flex-1 space-y-6 min-w-0'>

            {extras?.highlights && (
              <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8'>
                <h2 className='text-xl font-bold mb-6 dark:text-white flex items-center gap-2'><span>✅</span> What you will learn</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {extras.highlights.map((item, i) => (
                    <div key={i} className='flex items-start gap-3'>
                      <div className='w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <span className='text-green-600 dark:text-green-400 text-xs font-bold'>✓</span>
                      </div>
                      <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8'>
              <h2 className='text-xl font-bold mb-4 dark:text-white flex items-center gap-2'><span>📋</span> Course Overview</h2>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-sm'>{course.description}</p>
              <div className='grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700'>
                {[
                  { icon: '⏱', label: 'Duration', value: course.duration },
                  { icon: '📊', label: 'Level', value: extras?.level || 'All levels' },
                  { icon: '🏆', label: 'Certificate', value: 'Included' },
                ].map((s, i) => (
                  <div key={i} className='text-center'>
                    <div className='text-2xl mb-1'>{s.icon}</div>
                    <div className='text-xs text-gray-400 dark:text-gray-500 mb-1'>{s.label}</div>
                    <div className='text-sm font-semibold dark:text-white'>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {extras?.requirements && (
              <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8'>
                <h2 className='text-xl font-bold mb-5 dark:text-white flex items-center gap-2'><span>📌</span> Requirements</h2>
                <ul className='space-y-3'>
                  {extras.requirements.map((req, i) => (
                    <li key={i} className='flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm'>
                      <div className='w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2' />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8'>
              <h2 className='text-xl font-bold mb-5 dark:text-white flex items-center gap-2'><span>🎁</span> This course includes</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {[
                  { icon: '▶', text: 'Full on-demand video lectures' },
                  { icon: '📱', text: 'Access on mobile and desktop' },
                  { icon: '📝', text: 'Personal notes feature built-in' },
                  { icon: '🏆', text: 'Certificate of completion' },
                  { icon: '♾', text: 'Lifetime access to all content' },
                  { icon: '🔄', text: 'Regular content updates' },
                ].map((item, i) => (
                  <div key={i} className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
                    <span className='text-blue-500'>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className='w-full lg:w-80 flex-shrink-0'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden sticky top-6'>

              <div className='bg-gray-900 dark:bg-gray-950 p-6 text-center'>
                <div className='text-5xl mb-2'>{extras?.icon || '📚'}</div>
                <div className='text-3xl font-bold text-white mb-1'>₹999</div>
                <div className='text-gray-400 text-sm line-through mb-2'>₹4,999</div>
                <div className='inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full'>80% OFF — Limited time</div>
              </div>

              <div className='p-6'>
                <div className='space-y-2 mb-5'>
                  {[
                    { icon: '⏱', text: `Duration: ${course.duration}` },
                    { icon: '📊', text: extras?.level || 'All levels' },
                    { icon: '🎓', text: 'Certificate of completion' },
                    { icon: '▶', text: 'Full video course' },
                    { icon: '📝', text: 'Built-in notes feature' },
                    { icon: '♾', text: 'Lifetime access' },
                  ].map((item, i) => (
                    <div key={i} className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400'>
                      <span>{item.icon}</span><span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <hr className='dark:border-gray-700 mb-5' />

                {alreadyEnrolled ? (
                  <div className='space-y-3'>
                    <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center'>
                      <p className='text-green-700 dark:text-green-400 font-semibold text-sm'>✅ Already enrolled</p>
                    </div>
                    <button onClick={() => navigate(`/learn/${courseId}`)}
                      className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm'>
                      ▶ Start Course
                    </button>
                    <button onClick={() => navigate('/registered-courses')}
                      className='w-full border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition'>
                      My Courses
                    </button>
                  </div>

                ) : showForm ? (
                  <form onSubmit={handlePayment} className='space-y-4'>
                    <h3 className='font-bold dark:text-white text-sm'>Complete your details</h3>

                    <div>
                      <label className='block text-xs font-medium dark:text-gray-300 mb-1'>Full Name</label>
                      <input
                        type='text' required
                        value={form.studentName}
                        onChange={e => setForm({ ...form, studentName: e.target.value })}
                        placeholder='Your full name'
                        className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-medium dark:text-gray-300 mb-1'>Phone Number</label>
                      <input
                        type='tel' required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder='10-digit phone number'
                        className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
                      />
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm'>
                      <div className='flex justify-between text-gray-600 dark:text-gray-300 mb-2'>
                        <span>{course.title}</span>
                        <span className='line-through text-gray-400'>₹4,999</span>
                      </div>
                      <div className='flex justify-between text-gray-600 dark:text-gray-300 mb-2'>
                        <span>Discount (80%)</span>
                        <span className='text-green-600'>- ₹4,000</span>
                      </div>
                      <div className='flex justify-between font-bold dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600'>
                        <span>Total</span>
                        <span className='text-green-600 text-base'>₹999</span>
                      </div>
                    </div>

                    <button type='submit' disabled={payLoading}
                      className='w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm'>
                      {payLoading ? (
                        <>
                          <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24' fill='none'>
                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'/>
                          </svg>
                          Processing...
                        </>
                      ) : '🔒 Pay ₹999 & Enroll'}
                    </button>

                    <button type='button' onClick={() => setShowForm(false)}
                      className='w-full text-gray-400 text-xs hover:text-gray-600 transition'>
                      Cancel
                    </button>

                    <p className='text-center text-xs text-gray-400'>
                      🔒 Secured by Razorpay · UPI, Cards, Net Banking
                    </p>
                  </form>

                ) : (
                  <>
                    <button onClick={() => setShowForm(true)}
                      className='w-full bg-black dark:bg-white dark:text-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition text-base mb-3'>
                      Enroll Now — ₹999
                    </button>
                    <p className='text-center text-xs text-gray-400 mb-4'>
                      🔒 Secured checkout · 30-day money-back guarantee
                    </p>
                    <div className='flex justify-center gap-4 text-xs text-gray-400'>
                      <span>💳 Cards</span>
                      <span>📱 UPI</span>
                      <span>🏦 Net Banking</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className='mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5'>
              <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3'>Trusted by students</p>
              <div className='space-y-2'>
                {[
                  '✅ Verified course content',
                  '🏆 Industry-recognised certificate',
                  '💬 Community support included',
                  '🔄 Free content updates forever',
                ].map((item, i) => (
                  <p key={i} className='text-xs text-gray-600 dark:text-gray-400'>{item}</p>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default CourseDetail