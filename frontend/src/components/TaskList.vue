<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTasksStore } from '../store/useTasksStore'
import TaskForm from './TaskForm.vue'
import TaskItem from './TaskItem.vue'
import ProgressBar from './ProgressBar.vue'

const store = useTasksStore()
const showForm = ref(false)
const filterPriority = ref<'all'|'high'|'medium'|'low'>('all')
const filterStatus = ref<'all'|'completed'|'pending'>('all')
const sortDirection = ref<'none'|'asc'|'desc'>('none')

onMounted(() => {
  store.fetchTasks()
})

// Drag state
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const onDragStart = (e: DragEvent, index: number) => {
  dragIndex.value = index
  e.dataTransfer?.setData('text/plain', String(index))
  e.dataTransfer?.setData('application/x-index', String(index))
}

const onDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  dragOverIndex.value = index
}

const onDrop = (e: DragEvent, index: number) => {
  e.preventDefault()
  const from = dragIndex.value ?? parseInt(e.dataTransfer?.getData('text/plain') || '0')
  store.reorderTasks(from, index)
  dragIndex.value = null
  dragOverIndex.value = null
}

const completedCount = () => store.tasks.filter(t => t.completed).length
const totalCount = () => store.tasks.length

const filteredTasks = computed(() => {
  let list = store.tasks.slice()
  if (filterPriority.value !== 'all') list = list.filter(t => t.priority === filterPriority.value)
  if (filterStatus.value === 'completed') list = list.filter(t => t.completed)
  if (filterStatus.value === 'pending') list = list.filter(t => !t.completed)

  if (sortDirection.value === 'asc') {
    const order = { high: 0, medium: 1, low: 2 }
    list.sort((a,b) => order[a.priority] - order[b.priority])
  } else if (sortDirection.value === 'desc') {
    const order = { high: 0, medium: 1, low: 2 }
    list.sort((a,b) => order[b.priority] - order[a.priority])
  }

  return list
})
</script>

<template>
  <div class="container">
    <div style="display:flex; align-items:center; gap:20px; margin-bottom:8px">
      <div>
        <h1>Mis tareas</h1>
        <h2>Organiza tu día — agrega, edita y marca como completadas</h2>
      </div>

      <div class="spacer"></div>

      <div style="display:flex; align-items:center">
        <button class="btn btn-primary" v-if="!showForm" @click="showForm = true">Agregar tarea</button>
      </div>
    </div>

    <!-- Filters bar: horizontal, directly under header -->
    <div class="filters-bar" style="margin-bottom:18px">
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap">
        <label class="form-label" style="margin:0">
          Priority
          <select class="input-field" v-model="filterPriority">
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label class="form-label" style="margin:0">
          Status
          <select class="input-field" v-model="filterStatus">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </label>

        <label class="form-label" style="margin:0">
          Sort
          <select class="input-field" v-model="sortDirection">
            <option value="none">No sort</option>
            <option value="asc">Priority ↑</option>
            <option value="desc">Priority ↓</option>
          </select>
        </label>
      </div>
    </div>

    <TaskForm v-if="showForm" @close="showForm = false" />

  <ProgressBar :completed="completedCount()" :total="totalCount()" />

    <ul style="list-style:none; padding:0; margin:18px 0; display:flex; flex-direction:column; gap:12px">
      <div>
        <div v-for="(task, idx) in filteredTasks" :key="task.id" :class="{ 'drag-over': dragOverIndex === idx }" draggable="true"
          @dragstart="(e)=>onDragStart(e, idx)" @dragover="(e)=>onDragOver(e, idx)" @drop="(e)=>onDrop(e, idx)">
          <TaskItem :task="task" @toggle="store.toggleCompleted" @delete="store.removeTask" />
        </div>
      </div>
    </ul>
  </div>
</template>