import axios from 'axios'

const API_URL = 'http://localhost:3000/tasks'

export const getTasks = async () => {
  const res = await axios.get(API_URL)
  return res.data
}

export const addTask = async (task: { title: string; description: string }) => {
  const res = await axios.post(API_URL, task)
  return res.data
}

export const updateTask = async (id: number, task: { title: string; description: string }) => {
  const res = await axios.put(`${API_URL}/${id}`, task)
  return res.data
}

export const deleteTask = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`)
}

export const toggleTask = async (id: number) => {
  const res = await axios.patch(`${API_URL}/${id}`)
  return res.data
}
