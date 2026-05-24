import api from './axios'

export const createOrderApi  = (payload) => api.post('/api/payment/create-order', payload)
export const verifyPaymentApi = (payload) => api.post('/api/payment/verify', payload)