import api from './axios'

export const fetchCoursesApi = ()    => api.get('/api/courses')
export const fetchCourseApi  = (id)  => api.get(`/api/courses/${id}`)