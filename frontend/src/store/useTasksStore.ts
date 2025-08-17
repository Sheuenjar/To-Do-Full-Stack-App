import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTasks, addTask, updateTask, deleteTask, toggleTask } from '../services/tasksApi'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<any[]>([])

  const fetchTasks = async () => {
    tasks.value = await getTasks()
  }

  const createTask = async (title: string, description: string) => {
    const newTask = await addTask({ title, description })
    tasks.value.push(newTask)
  }

  const editTask = async (id: number, title: string, description: string) => {
    const updated = await updateTask(id, { title, description })
    tasks.value = tasks.value.map(t => t.id === id ? updated : t)
  }

  const removeTask = async (id: number) => {
    await deleteTask(id)
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  const toggleCompleted = async (id: number) => {
    const updated = await toggleTask(id)
    tasks.value = tasks.value.map(t => t.id === id ? updated : t)
  }

  return { tasks, fetchTasks, createTask, editTask, removeTask, toggleCompleted }
})
