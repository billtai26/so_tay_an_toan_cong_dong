import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124/api'
const API_URL = `${BASE_URL}/admin`

export const getAllUsers = async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const updateUserRole = async (id, role) => {
  const token = localStorage.getItem('token')
  const response = await axios.put(`${API_URL}/users/${id}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const deleteUser = async (id) => {
  const token = localStorage.getItem('token')
  const response = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}