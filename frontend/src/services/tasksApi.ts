import axios from 'axios'
import type { Task } from '../types/task'

const API_URL = '/api/tasks' // usar proxy de vite

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
 * PATCH: si se pasa { completed } lo aplica; si no, backend hace toggle
 */
export const toggleTask = async (id: number, completed?: boolean): Promise<Task> => {
  const payload = typeof completed === 'boolean' ? { completed } : {}
  const res = await axios.patch<Task>(`${API_URL}/${id}`, payload)
  return res.data
}