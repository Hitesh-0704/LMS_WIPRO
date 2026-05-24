import api from './axios'

export const fetchMyEnrollmentsApi = ()             => api.get('/api/enrollments/my')
export const enrollApi             = (payload)      => api.post('/api/enrollments', payload)
export const markCompleteApi       = (enrollmentId) => api.put(`/api/enrollments/${enrollmentId}/complete`)
export const unenrollApi           = (enrollmentId) => api.delete(`/api/enrollments/${enrollmentId}`)