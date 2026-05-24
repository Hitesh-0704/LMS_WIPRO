// import { useAuth } from '../../context/AuthContext'
// import { useCourses } from '../../context/CourseContext'
// import { useNavigate } from 'react-router-dom'
// import { useState } from 'react'
// import { toast } from '../ui/Toast'
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
//
// function Profile() {
//   const { user, logout } = useAuth()
//   const { enrolledCourses, completedCourses } = useCourses()
//   const navigate = useNavigate()
//
//   const username = user?.name || user?.email?.split('@')[0] || 'Student'
//   const [editing, setEditing] = useState(false)
//   const [name, setName] = useState(username)
//   const [tempName, setTempName] = useState(name)
//
//   const handleSave = () => {
//     setName(tempName)
//     setEditing(false)
//     toast('Profile updated!', 'success')
//   }
//
//   const notesCount = (() => {
//     try { return JSON.parse(localStorage.getItem('learnhub-notes') || '[]').length }
//     catch { return 0 }
//   })()
//
//   const totalHours = enrolledCourses.length * 12
//   const completionRate = enrolledCourses.length > 0
//     ? Math.round((completedCourses.length / enrolledCourses.length) * 100)
//     : 0
//
//   const inProgress = enrolledCourses.length - completedCourses.length
//   const donutData = [
//     { name: 'Completed', value: completedCourses.length || 0 },
//     { name: 'In Progress', value: inProgress > 0 ? inProgress : 0 },
//     { name: 'Not Started', value: enrolledCourses.length === 0 ? 1 : 0 },
//   ].filter(d => d.value > 0)
//   const DONUT_COLORS = ['#10b981', '#3b82f6', '#e2e8f0']
//
//   const achievements = [
//     { icon: '🥇', label: 'Learning Master', current: completedCourses.length, total: 5, color: '#f59e0b' },
//     { icon: '🥈', label: 'Skill Builder', current: Math.min(enrolledCourses.length, 3), total: 5, color: '#94a3b8' },
//     { icon: '🥉', label: 'Course Explorer', current: Math.min(enrolledCourses.length, 2), total: 2, color: '#10b981' },
//     { icon: '🏅', label: 'Note Taker', current: Math.min(notesCount, 10), total: 10, color: '#8b5cf6' },
//   ]
//
//   const learningStats = [
//     { icon: '⏱', label: 'Total learning hours', value: totalHours },
//     { icon: '🏆', label: 'Certificates completed', value: completedCourses.length },
//     { icon: '💻', label: 'Hands-on practice hours', value: enrolledCourses.length * 4 },
//     { icon: '📚', label: 'Courses completed', value: completedCourses.length },
//   ]
//
//   return (
//     <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '32px', fontFamily: 'Segoe UI, sans-serif' }}>
//
//       <div style={{ maxWidth: 1200, margin: '0 auto' }}>
//
//         {/* Top row */}
//         <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, marginBottom: 24 }}>
//
//           {/* Profile Card */}
//           <div style={{
//             background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
//             borderRadius: 20, padding: 32, color: '#fff', position: 'relative', overflow: 'hidden'
//           }}>
//             <div style={{
//               position: 'absolute', top: -40, right: -40,
//               width: 150, height: 150, borderRadius: '50%',
//               background: 'rgba(255,255,255,0.08)'
//             }} />
//             <div style={{
//               position: 'absolute', bottom: -20, left: -20,
//               width: 100, height: 100, borderRadius: '50%',
//               background: 'rgba(255,255,255,0.05)'
//             }} />
//
//             {/* Avatar */}
//             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
//               <div style={{
//                 width: 90, height: 90, borderRadius: '50%',
//                 background: '#fff', display: 'flex', alignItems: 'center',
//                 justifyContent: 'center', fontSize: 36, fontWeight: 800,
//                 color: '#1e40af', border: '4px solid rgba(255,255,255,0.4)',
//                 boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
//               }}>
//                 {name.charAt(0).toUpperCase()}
//               </div>
//             </div>
//
//             {/* Name */}
//             <div style={{ textAlign: 'center', marginBottom: 8 }}>
//               {editing ? (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
//                   <input
//                     value={tempName}
//                     onChange={e => setTempName(e.target.value)}
//                     style={{
//                       background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
//                       borderRadius: 8, padding: '6px 12px', color: '#fff',
//                       fontSize: 16, fontWeight: 700, textAlign: 'center', outline: 'none', width: '100%'
//                     }}
//                   />
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     <button onClick={handleSave} style={{
//                       background: '#fff', color: '#1e40af', border: 'none',
//                       borderRadius: 8, padding: '4px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 12
//                     }}>Save</button>
//                     <button onClick={() => setEditing(false)} style={{
//                       background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none',
//                       borderRadius: 8, padding: '4px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 12
//                     }}>Cancel</button>
//                   </div>
//                 </div>
//               ) : (
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
//                   <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, textTransform: 'capitalize' }}>{name}</h2>
//                   <button onClick={() => { setTempName(name); setEditing(true) }} style={{
//                     background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6,
//                     color: '#fff', cursor: 'pointer', fontSize: 12, padding: '2px 8px'
//                   }}>✏️</button>
//                 </div>
//               )}
//               <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: 13 }}>Student</p>
//               <p style={{ margin: '2px 0 0', opacity: 0.7, fontSize: 12 }}>{user?.email}</p>
//             </div>
//
//             {/* Stats row */}
//             <div style={{
//               display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
//               gap: 12, marginTop: 24, paddingTop: 20,
//               borderTop: '1px solid rgba(255,255,255,0.2)'
//             }}>
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: 18, fontWeight: 800 }}>{completionRate}%</div>
//                 <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>Technical Skills</div>
//               </div>
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: 18, fontWeight: 800 }}>{Math.min(completionRate + 10, 100)}%</div>
//                 <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>Soft Skills</div>
//               </div>
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: 18, fontWeight: 800 }}>{enrolledCourses.length} yrs</div>
//                 <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>Experience</div>
//               </div>
//             </div>
//
//             {/* Logout */}
//             <button onClick={() => { logout(); toast('Logged out!', 'info'); navigate('/') }}
//               style={{
//                 marginTop: 20, width: '100%', background: 'rgba(255,255,255,0.15)',
//                 border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10,
//                 color: '#fff', padding: '10px', cursor: 'pointer',
//                 fontWeight: 600, fontSize: 13, transition: 'background 0.2s'
//               }}>
//               🚪 Logout
//             </button>
//           </div>
//
//           {/* Radar Chart */}
//           <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
//             <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Course Progress</h3>
//             <p style={{ margin: '0 0 16px', fontSize: 13, color: '#94a3b8' }}>Overview of your learning journey</p>
//
//             <ResponsiveContainer width="100%" height={220}>
//               <PieChart>
//                 <Pie
//                   data={donutData.length > 0 ? donutData : [{ name: 'No courses', value: 1 }]}
//                   cx="50%" cy="50%"
//                   innerRadius={65} outerRadius={95}
//                   paddingAngle={4} dataKey="value"
//                 >
//                   {(donutData.length > 0 ? donutData : [{ name: 'No courses', value: 1 }]).map((entry, index) => (
//                     <Cell key={index} fill={donutData.length > 0 ? DONUT_COLORS[index % DONUT_COLORS.length] : '#e2e8f0'} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value, name) => [value + ' courses', name]} />
//                 <Legend iconType="circle" iconSize={10} />
//               </PieChart>
//             </ResponsiveContainer>
//
//             {/* Center stats */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 8 }}>
//               <div style={{ textAlign: 'center', padding: '12px', background: '#f0fdf4', borderRadius: 12 }}>
//                 <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>{completedCourses.length}</div>
//                 <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Completed</div>
//               </div>
//               <div style={{ textAlign: 'center', padding: '12px', background: '#eff6ff', borderRadius: 12 }}>
//                 <div style={{ fontSize: 22, fontWeight: 800, color: '#3b82f6' }}>{inProgress > 0 ? inProgress : 0}</div>
//                 <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>In Progress</div>
//               </div>
//               <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: 12 }}>
//                 <div style={{ fontSize: 22, fontWeight: 800, color: '#1e293b' }}>{enrolledCourses.length}</div>
//                 <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Enrolled</div>
//               </div>
//             </div>
//           </div>
//         </div>
//
//         {/* Bottom row */}
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
//
//           {/* Learning History */}
//           <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
//             <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Learning History</h3>
//             {enrolledCourses.length === 0 ? (
//               <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: 14 }}>
//                 <p>No courses enrolled yet.</p>
//                 <button onClick={() => navigate('/courses')} style={{
//                   marginTop: 12, background: '#1e40af', color: '#fff', border: 'none',
//                   borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 13
//                 }}>Browse Courses</button>
//               </div>
//             ) : (
//               <div>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, marginBottom: 8 }}>
//                   <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Course</span>
//                   <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Cert</span>
//                   <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Duration</span>
//                 </div>
//                 {enrolledCourses.map((course, i) => (
//                   <div key={i} style={{
//                     display: 'grid', gridTemplateColumns: '1fr auto auto',
//                     gap: 8, padding: '10px 0', borderBottom: '1px solid #f1f5f9',
//                     alignItems: 'center'
//                   }}>
//                     <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{course.title}</span>
//                     <span style={{ fontSize: 12, color: course.completed ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
//                       {course.completed ? 'Yes' : '—'}
//                     </span>
//                     <span style={{ fontSize: 12, color: '#64748b' }}>{course.duration || '12h'}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//
//           {/* Achievements */}
//           <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
//             <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Achievements</h3>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               {achievements.map((a, i) => (
//                 <div key={i}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
//                     <span style={{ fontSize: 24 }}>{a.icon}</span>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
//                         <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{a.label}</span>
//                         <span style={{ fontSize: 12, color: '#94a3b8' }}>{a.current}/{a.total}</span>
//                       </div>
//                       <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
//                         <div style={{
//                           height: '100%', borderRadius: 999,
//                           background: a.color,
//                           width: `${(a.current / a.total) * 100}%`,
//                           transition: 'width 0.6s ease'
//                         }} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//
//           {/* Learning Statistics */}
//           <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
//             <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Learning Statistic</h3>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '4px 0', marginBottom: 4 }}>
//                 <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Name</span>
//                 <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Value</span>
//               </div>
//               {learningStats.map((s, i) => (
//                 <div key={i} style={{
//                   display: 'grid', gridTemplateColumns: '1fr auto',
//                   padding: '12px 0', borderBottom: '1px solid #f1f5f9',
//                   alignItems: 'center'
//                 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                     <span style={{ fontSize: 16 }}>{s.icon}</span>
//                     <span style={{ fontSize: 13, color: '#334155' }}>{s.label}</span>
//                   </div>
//                   <span style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{s.value}</span>
//                 </div>
//               ))}
//             </div>
//
//             {/* Quick navigate */}
//             <button onClick={() => navigate('/courses')} style={{
//               marginTop: 16, width: '100%', background: '#1e40af',
//               color: '#fff', border: 'none', borderRadius: 10,
//               padding: '10px', cursor: 'pointer', fontWeight: 600, fontSize: 13
//             }}>
//               ▶ Continue Learning
//             </button>
//           </div>
//
//         </div>
//       </div>
//     </div>
//   )
// }
//
// export default Profile


import { useAuth } from '../../context/AuthContext'
import { useCourses } from '../../context/CourseContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from '../ui/Toast'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

function Profile() {
  const { user, logout } = useAuth()
  const { enrolledCourses, completedCourses } = useCourses()
  const navigate = useNavigate()

  const username = user?.name || user?.email?.split('@')[0] || 'Student'
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(username)
  const [tempName, setTempName] = useState(name)

  const handleSave = () => {
    setName(tempName)
    setEditing(false)
    toast('Profile updated!', 'success')
  }

  const notesCount = (() => {
    try { return JSON.parse(localStorage.getItem('learnhub-notes') || '[]').length }
    catch { return 0 }
  })()

  const totalHours = enrolledCourses.length * 12
  const completionRate = enrolledCourses.length > 0
    ? Math.round((completedCourses.length / enrolledCourses.length) * 100)
    : 0

  const inProgress = enrolledCourses.length - completedCourses.length
  const donutData = [
    { name: 'Completed', value: completedCourses.length || 0 },
    { name: 'In Progress', value: inProgress > 0 ? inProgress : 0 },
    { name: 'Not Started', value: enrolledCourses.length === 0 ? 1 : 0 },
  ].filter(d => d.value > 0)
  const DONUT_COLORS = ['#10b981', '#3b82f6', '#e2e8f0']

  const achievements = [
    { icon: '🥇', label: 'Learning Master', current: completedCourses.length, total: 5, color: '#f59e0b' },
    { icon: '🥈', label: 'Skill Builder', current: Math.min(enrolledCourses.length, 3), total: 5, color: '#94a3b8' },
    { icon: '🥉', label: 'Course Explorer', current: Math.min(enrolledCourses.length, 2), total: 2, color: '#10b981' },
    { icon: '🏅', label: 'Note Taker', current: Math.min(notesCount, 10), total: 10, color: '#8b5cf6' },
  ]

  const learningStats = [
    { icon: '⏱', label: 'Total learning hours', value: totalHours },
    { icon: '🏆', label: 'Certificates completed', value: completedCourses.length },
    { icon: '💻', label: 'Hands-on practice hours', value: enrolledCourses.length * 4 },
    { icon: '📚', label: 'Courses completed', value: completedCourses.length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '32px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, marginBottom: 24 }}>

          {/* Profile Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            borderRadius: 20, padding: 32, color: '#fff', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 150, height: 150, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)'
            }} />
            <div style={{
              position: 'absolute', bottom: -20, left: -20,
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)'
            }} />

            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                background: '#fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 36, fontWeight: 800,
                color: '#1e40af', border: '4px solid rgba(255,255,255,0.4)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}>
                {name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Name */}
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                  <input
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
                      borderRadius: 8, padding: '6px 12px', color: '#fff',
                      fontSize: 16, fontWeight: 700, textAlign: 'center', outline: 'none', width: '100%'
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSave} style={{
                      background: '#fff', color: '#1e40af', border: 'none',
                      borderRadius: 8, padding: '4px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 12
                    }}>Save</button>
                    <button onClick={() => setEditing(false)} style={{
                      background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '4px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 12
                    }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, textTransform: 'capitalize' }}>{name}</h2>
                  <button onClick={() => { setTempName(name); setEditing(true) }} style={{
                    background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6,
                    color: '#fff', cursor: 'pointer', fontSize: 12, padding: '2px 8px'
                  }}>✏️</button>
                </div>
              )}
              <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: 13 }}>Student</p>
              <p style={{ margin: '2px 0 0', opacity: 0.7, fontSize: 12 }}>{user?.email}</p>
            </div>

            {/* Stats row - meaningful student data */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12, marginTop: 24, paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{enrolledCourses.length}</div>
                <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>📚 Enrolled</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{completedCourses.length}</div>
                <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>✅ Completed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{notesCount}</div>
                <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>📝 Notes</div>
              </div>
            </div>

            {/* Logout */}
            <button onClick={() => { logout(); toast('Logged out!', 'info'); navigate('/') }}
              style={{
                marginTop: 20, width: '100%', background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10,
                color: '#fff', padding: '10px', cursor: 'pointer',
                fontWeight: 600, fontSize: 13, transition: 'background 0.2s'
              }}>
              🚪 Logout
            </button>
          </div>

          {/* Course Progress - Donut Chart */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Course Progress</h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#94a3b8' }}>Overview of your learning journey</p>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={donutData.length > 0 ? donutData : [{ name: 'No courses', value: 1 }]}
                  cx="50%" cy="50%"
                  innerRadius={65} outerRadius={95}
                  paddingAngle={4} dataKey="value"
                >
                  {(donutData.length > 0 ? donutData : [{ name: 'No courses', value: 1 }]).map((entry, index) => (
                    <Cell key={index} fill={donutData.length > 0 ? DONUT_COLORS[index % DONUT_COLORS.length] : '#e2e8f0'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value + ' courses', name]} />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
              {(donutData.length > 0 ? donutData : [{ name: 'No courses' }]).map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: DONUT_COLORS[index % DONUT_COLORS.length]
                  }} />
                  <span style={{ fontSize: 12, color: '#64748b' }}>{entry.name}</span>
                </div>
              ))}
            </div>

            {/* Different stats from profile card */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 8 }}>
              <div style={{ textAlign: 'center', padding: '12px', background: '#fefce8', borderRadius: 12 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b' }}>{completionRate}%</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>🎯 Completion Rate</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: '#fdf4ff', borderRadius: 12 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#a855f7' }}>{totalHours}h</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>⏱ Total Hours</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: '#fff7ed', borderRadius: 12 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f97316' }}>{completedCourses.length}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>🏆 Certificates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>

          {/* Learning History */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Learning History</h3>
            {enrolledCourses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: 14 }}>
                <p>No courses enrolled yet.</p>
                <button onClick={() => navigate('/courses')} style={{
                  marginTop: 12, background: '#1e40af', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 13
                }}>Browse Courses</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Course</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Cert</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Duration</span>
                </div>
                {enrolledCourses.map((course, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto',
                    gap: 8, padding: '10px 0', borderBottom: '1px solid #f1f5f9',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{course.title}</span>
                    <span style={{ fontSize: 12, color: course.completed ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
                      {course.completed ? 'Yes' : '—'}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{course.duration || '12h'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Achievements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {achievements.map((a, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 24 }}>{a.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{a.label}</span>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{a.current}/{a.total}</span>
                      </div>
                      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 999,
                          background: a.color,
                          width: `${(a.current / a.total) * 100}%`,
                          transition: 'width 0.6s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Statistics */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Learning Statistic</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '4px 0', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Name</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Value</span>
              </div>
              {learningStats.map((s, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto',
                  padding: '12px 0', borderBottom: '1px solid #f1f5f9',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{s.icon}</span>
                    <span style={{ fontSize: 13, color: '#334155' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{s.value}</span>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/courses')} style={{
              marginTop: 16, width: '100%', background: '#1e40af',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '10px', cursor: 'pointer', fontWeight: 600, fontSize: 13
            }}>
              ▶ Continue Learning
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile
