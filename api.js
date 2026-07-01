import axios from 'axios'

const API = axios.create({
  baseURL: 'https://studymind-ai-backend-kc9l.onrender.com'
})

export const signup = (data) => API.post('/auth/signup', data)
export const login = (data) => API.post('/auth/login', data)
export const uploadPDF = (formData) => API.post('/pdf/upload', formData)
export const listPDFs = (userId) => API.get(`/pdf/list?user_id=${userId}`)
export const sendMessage = (data) => API.post('/chat/message', data)
export const deletePDF = (pdfId) => API.delete(`/pdf/delete/${pdfId}`)
export const getSummary = (pdfId) => API.post('/chat/summary', { pdf_id: pdfId })
