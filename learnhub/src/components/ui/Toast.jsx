import { useState, useEffect } from 'react'

let toastFn = null

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastFn = (message, type = 'success') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 3000)
    }
    return () => { toastFn = null }
  }, [])

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }

  return (
    <div className='fixed top-5 right-5 z-50 flex flex-col gap-3'>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${colors[toast.type]} text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 min-w-[260px] animate-slide-in`}
          style={{ animation: 'slideIn 0.3s ease' }}
        >
          <span>{icons[toast.type]}</span>
          <span className='font-medium text-sm'>{toast.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export function toast(message, type = 'success') {
  if (toastFn) toastFn(message, type)
}
