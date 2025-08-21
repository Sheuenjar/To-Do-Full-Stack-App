import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTasks, addTask, updateTask, deleteTask, toggleTask } from '../services/tasksApi'
import type { Task } from '../types/task'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])

  const fetchTasks = async () => {
  tasks.value = await getTasks()
  console.debug('[store] fetchTasks -> order ids:', tasks.value.map(t => t.id))
  }

  const createTask = async (title: string, description?: string | null, priority: 'low'|'medium'|'high' = 'medium') => {
    const newTask = await addTask({ title, description, priority })
    // Ensure created_at exists so sorting by created_at works immediately
    if (!newTask.created_at) {
      (newTask as any).created_at = new Date().toISOString()
    }
    // Add new tasks to the top so the most recent appear first
    tasks.value = [newTask, ...tasks.value]
  console.debug('[store] createTask -> added id', newTask.id, 'resulting order ids:', tasks.value.map(t => t.id))
  }

  const editTask = async (id: number, title: string, description?: string | null, priority: 'low'|'medium'|'high' = 'medium') => {
    const updated = await updateTask(id, { title, description, priority })
    tasks.value = tasks.value.map(t => t.id === id ? updated : t)
  }

  const removeTask = async (id: number) => {
    await deleteTask(id)
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  const toggleCompleted = async (id: number, completed?: boolean) => {
    const updated = await toggleTask(id, completed)
    tasks.value = tasks.value.map(t => t.id === id ? updated : t)
  }

  const reorderTasks = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    const list = tasks.value.slice()
    const [moved] = list.splice(fromIndex, 1)
    list.splice(toIndex, 0, moved)
    tasks.value = list
    // NOTE: persistence not implemented. If backend supports order, call an API here.
  }

  return { tasks, fetchTasks, createTask, editTask, removeTask, toggleCompleted, reorderTasks }
})