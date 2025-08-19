export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  priority: Priority
  created_at: string
}