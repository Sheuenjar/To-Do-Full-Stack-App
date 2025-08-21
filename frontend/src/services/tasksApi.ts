import axios from 'axios'
import type { Task } from '../types/task'

const API_URL = '/api/tasks' // Use Vite proxy

export const getTasks = async (): Promise<Task[]> => {
  const res = await axios.get<Task[]>(API_URL)
  return res.data
}

export const addTask = async (task: { title: string; description?: string | null; priority?: 'low'|'medium'|'high' }): Promise<Task> => {
  const res = await axios.post<Task>(API_URL, task)
  return res.data
}

export const updateTask = async (id: number, task: { title: string; description?: string | null; priority?: 'low'|'medium'|'high' }): Promise<Task> => {
  const res = await axios.put<Task>(`${API_URL}/${id}`, task)
  return res.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`)
}

/**
 * PATCH: if { completed } is passed, it is applied; otherwise, the backend toggles it
 */
export const toggleTask = async (id: number, completed?: boolean): Promise<Task> => {
  const payload = typeof completed === 'boolean' ? { completed } : {}
  const res = await axios.patch<Task>(`${API_URL}/${id}`, payload)
  return res.data
}
