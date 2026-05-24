import { useParams, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useCourses } from '../../context/CourseContext'
import { useAuth } from '../../context/AuthContext'

function Certificate() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { enrolledCourses } = useCourses()
  const { user } = useAuth()
  const printRef = useRef()

  const course = enrolledCourses.find(
    c => String(c.courseId) === String(courseId) && c.completed
  )

  if (!course) {
    return (
      <div className='h-[80vh] flex flex-col justify-center items-center dark:bg-gray-800'>
        <div className='text-5xl mb-4'>🔒</div>
        <h1 className='text-2xl font-bold text-gray-700 dark:text-white'>
          Certificate Not Available
        </h1>
        <p className='text-gray-500 dark:text-gray-400 mt-2'>
          Complete the course first to unlock your certificate.
        </p>
        <button
          onClick={() => navigate('/registered-courses')}
          className='mt-6 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition'
        >
          My Courses
        </button>
      </div>
    )
  }

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <html>
        <head>
          <title>Certificate - ${course.title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }

            @page {
              size: A4 landscape;
              margin: 0;
            }

            html, body {
              width: 297mm;
              height: 210mm;
              overflow: hidden;
              font-family: Georgia, serif;
              background: white;
            }

            .cert-outer {
              width: 297mm;
              height: 210mm;
              padding: 10mm;
              border: 10px solid #1a1a1a;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .cert-inner {
              border: 3px solid #b8860b;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              gap: 8px;
              padding: 16px;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  const certId = `LH-${String(course.courseId)}-${Date.now().toString().slice(-6)}`

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-800 px-10 py-12 transition-colors duration-300'>

      {/* Action Buttons */}
      <div className='flex justify-center gap-4 mb-8'>
        <button
          onClick={() => navigate('/registered-courses')}
          className='border border-gray-400 dark:border-gray-600 dark:text-gray-300 px-5 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm'
        >
          ← My Courses
        </button>
        <button
          onClick={handlePrint}
          className='bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition font-semibold text-sm'
        >
          🖨 Download / Print Certificate
        </button>
        <button
          onClick={() => navigate('/certificates')}
          className='border border-yellow-500 text-yellow-600 px-5 py-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition text-sm'
        >
          All Certificates
        </button>
      </div>

      {/* Certificate — screen preview */}
      <div ref={printRef}>
        <div className='cert-outer' style={{
          border: '10px solid #1a1a1a',
          padding: '32px',
          background: 'white',
          maxWidth: '860px',
          margin: '0 auto',
        }}>
          <div className='cert-inner' style={{
            border: '3px solid #b8860b',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'center',
          }}>

            {/* Logo */}
            <div style={{
              fontSize: '24px',
              fontWeight: '900',
              letterSpacing: '3px',
              fontFamily: 'Georgia, serif',
            }}>
              LEARN<span style={{ color: '#b8860b' }}>HUB</span>
            </div>

            <div style={{ width: '100px', height: '2px', background: '#b8860b' }} />

            {/* Subtitle */}
            <div style={{
              fontSize: '11px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#888',
            }}>
              Certificate of Completion
            </div>

            {/* Certify text */}
            <div style={{
              fontSize: '30px',
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
              color: '#1a1a1a',
            }}>
              This is to certify that
            </div>

            {/* Student Name */}
            <div style={{
              fontSize: '44px',
              fontStyle: 'italic',
              color: '#b8860b',
              fontWeight: 'bold',
              borderBottom: '2px solid #b8860b',
              paddingBottom: '8px',
              fontFamily: 'Georgia, serif',
            }}>
              {course.studentName}
            </div>

            <div style={{
              fontSize: '14px',
              color: '#555',
              maxWidth: '460px',
              lineHeight: '1.8',
              fontFamily: 'Georgia, serif',
            }}>
              has successfully completed the course
            </div>

            {/* Course Name */}
            <div style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              letterSpacing: '1px',
            }}>
              {course.title}
            </div>

            <div style={{ fontSize: '12px', color: '#888' }}>
              Duration: {course.duration} · Platform: LearnHub
            </div>

            {/* Seal + Meta */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '50px',
              marginTop: '14px',
            }}>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
                  {course.completedDate}
                </div>
                <div style={{
                  borderTop: '1px solid #ccc',
                  paddingTop: '5px',
                  marginTop: '5px',
                }}>
                  Date of Completion
                </div>
              </div>

              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                border: '4px solid #b8860b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                background: '#fff9e6',
              }}>
                🏆
              </div>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
                  LearnHub Team
                </div>
                <div style={{
                  borderTop: '1px solid #ccc',
                  paddingTop: '5px',
                  marginTop: '5px',
                }}>
                  Authorized Signature
                </div>
              </div>

            </div>

            {/* Certificate ID */}
            <div style={{
              fontSize: '10px',
              color: '#bbb',
              marginTop: '10px',
              letterSpacing: '1px',
            }}>
              Certificate ID: {certId}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default Certificate