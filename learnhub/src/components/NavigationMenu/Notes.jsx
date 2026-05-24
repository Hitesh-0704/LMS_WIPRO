import { useState, useEffect } from 'react'
import { toast } from '../ui/Toast'

function Notes() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('learnhub-notes')) || []
    } catch { return [] }
  })
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    localStorage.setItem('learnhub-notes', JSON.stringify(notes))
  }, [notes])

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast('Please fill in both title and content.', 'warning')
      return
    }

    if (editId !== null) {
      setNotes(prev => prev.map(n => n.id === editId ? { ...n, title, content } : n))
      toast('Note updated! ✏️', 'success')
      setEditId(null)
    } else {
      const newNote = { id: Date.now(), title, content, date: new Date().toLocaleDateString('en-IN') }
      setNotes(prev => [newNote, ...prev])
      toast('Note saved! 📝', 'success')
    }

    setTitle('')
    setContent('')
  }

  const handleEdit = (note) => {
    setTitle(note.title)
    setContent(note.content)
    setEditId(note.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    toast('Note deleted.', 'info')
  }

  const handleCancel = () => {
    setTitle('')
    setContent('')
    setEditId(null)
  }

  return (
    <div className='min-h-[80vh] bg-gray-100 dark:bg-gray-800 px-10 py-16 transition-colors duration-300'>

      <h1 className='text-4xl font-bold text-center mb-10 dark:text-white'>📝 My Notes</h1>

      {/* Add / Edit Note */}
      <div className='max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg mb-12'>

        <h2 className='text-2xl font-bold mb-6 dark:text-white'>
          {editId !== null ? 'Edit Note' : 'Add New Note'}
        </h2>

        <div className='space-y-4'>
          <input
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='Note title...'
            className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
          />

          <textarea
            rows='5'
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder='Write your note here...'
            className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none'
          />

          <div className='flex gap-3'>
            <button
              onClick={handleSave}
              className='flex-1 bg-black dark:bg-white dark:text-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition'
            >
              {editId !== null ? 'Update Note' : 'Save Note'}
            </button>

            {editId !== null && (
              <button
                onClick={handleCancel}
                className='px-6 border border-gray-400 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition'
              >
                Cancel
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className='text-center text-gray-400 dark:text-gray-500 text-xl'>
          No notes yet. Start writing! ✏️
        </div>
      ) : (
        <div className='grid grid-cols-3 gap-6 max-w-6xl mx-auto'>
          {notes.map(note => (
            <div key={note.id} className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md flex flex-col'>

              <div className='flex items-start justify-between'>
                <h3 className='text-xl font-bold dark:text-white flex-1 pr-2'>{note.title}</h3>
                <span className='text-yellow-500 text-xl'>📌</span>
              </div>

              <p className='mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1 line-clamp-4'>
                {note.content}
              </p>

              <p className='text-xs text-gray-400 dark:text-gray-500 mt-4'>{note.date}</p>

              <div className='flex gap-2 mt-4'>
                <button
                  onClick={() => handleEdit(note)}
                  className='flex-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition'
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className='flex-1 bg-red-50 dark:bg-red-900/20 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition'
                >
                  🗑 Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Notes
