<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTasksStore } from '../store/useTasksStore'
import TaskForm from './TaskForm.vue'
import TaskItem from './TaskItem.vue'
import ProgressBar from './ProgressBar.vue'
import FilterDropdown from './FilterDropdown.vue'

const store = useTasksStore()
const showForm = ref(false)
const filterPriority = ref<'all'|'high'|'medium'|'low'>('all')
const filterStatus = ref<'all'|'completed'|'pending'>('all')
const sortDirection = ref<'none'|'asc'|'desc'>('none')

onMounted(() => {
  store.fetchTasks()
})

// Drag state: store dragged task id (not filtered index) so we can map to the real array index
const dragId = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const onDragStart = (e: DragEvent, id: number) => {
  dragId.value = id
  e.dataTransfer?.setData('text/plain', String(id))
}

const onDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  dragOverIndex.value = index
}

const onDrop = (e: DragEvent, targetId: number) => {
  e.preventDefault()
  // Determine dragged id (from ref or dataTransfer)
  const fromId = dragId.value ?? parseInt(e.dataTransfer?.getData('text/plain') || '0')
  // Map ids to indexes in the underlying store.tasks array
  const fromIndex = store.tasks.findIndex(t => t.id === fromId)
  const toIndex = store.tasks.findIndex(t => t.id === targetId)
  if (fromIndex === -1 || toIndex === -1) {
    // fallback: do nothing if mapping fails
    dragId.value = null
    dragOverIndex.value = null
    return
  }
  store.reorderTasks(fromIndex, toIndex)
  dragId.value = null
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

  // Default: if there's no explicit sort, show most recent first by created_at
  if (sortDirection.value === 'none') {
    list.sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0
      return tb - ta
    })
  }

  return list
})
</script>

<template>
  <div class="container">
    <div style="display:flex; align-items:center; gap:20px; margin-bottom:8px">
      <div>
        <h1>My Tasks</h1>
        <h2>Organize your day — add, edit and mark as completed</h2>
      </div>

      <div class="spacer"></div>

      <div style="display:flex; align-items:center">
  <button class="btn btn-primary" v-if="!showForm" @click="showForm = true">Add task</button>
      </div>
    </div>

    <!-- Filters bar: horizontal, directly under header -->
    <div class="filters-bar" style="margin-bottom:18px">
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap">
        <FilterDropdown v-model="filterPriority" :options="[{ value: 'all', label: 'All' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]" label="Priority" />

        <FilterDropdown v-model="filterStatus" :options="[{ value: 'all', label: 'All' }, { value: 'completed', label: 'Completed' }, { value: 'pending', label: 'Pending' }]" label="Status" />

        <FilterDropdown v-model="sortDirection" :options="[{ value: 'none', label: 'No sort' }, { value: 'asc', label: 'Priority ↑' }, { value: 'desc', label: 'Priority ↓' }]" label="Sort" />
      </div>
    </div>

    <TaskForm v-if="showForm" @close="showForm = false" />

  <ProgressBar :completed="completedCount()" :total="totalCount()" />

    <ul style="list-style:none; padding:0; margin:18px 0; display:flex; flex-direction:column; gap:12px">
      <div>
        <div v-for="(task, idx) in filteredTasks" :key="task.id" :class="{ 'drag-over': dragOverIndex === idx }" draggable="true"
          @dragstart="(e)=>onDragStart(e, task.id)" @dragover="(e)=>onDragOver(e, idx)" @drop="(e)=>onDrop(e, task.id)">
          <TaskItem :task="task" @toggle="store.toggleCompleted" @delete="store.removeTask" />
        </div>
      </div>
    </ul>
  </div>
</template>