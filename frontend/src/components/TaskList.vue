<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useTasksStore } from '../store/useTasksStore'
import TaskForm from './TaskForm.vue'
import TaskItem from './TaskItem.vue'
import ProgressBar from './ProgressBar.vue'
import FilterDropdown from './FilterDropdown.vue'

const store = useTasksStore()
const showForm = ref(false)
const filterPriority = ref<'all'|'high'|'medium'|'low'>('all')
const sortDirection = ref<'none'|'asc'|'desc'>('none')

onMounted(() => {
  // ensure manualOrder is reset on initial load
  const doFetch = async () => {
    await store.fetchTasks()
    manualOrder.value = false
  }
  void doFetch()
})

// If the user switches to an explicit sort, discard manual order so the
// explicit sort takes precedence.
watch(sortDirection, (v) => {
  if (v !== 'none') manualOrder.value = false
})

// Drag state: store dragged task id (not filtered index) so we can map to the real array index
const dragId = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
// When the user manually reorders via DnD, set this flag so we don't re-sort
// the visible list by created_at and undo their changes.
const manualOrder = ref(false)
// Completed section visibility (collapsed by default)
const showCompleted = ref(false)

const onDragStart = (e: DragEvent, id: number) => {
  dragId.value = id
  // required by some browsers to allow a move operation
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(id))
  }
}

const onDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  dragOverIndex.value = index
}

const onDragEnd = () => {
  // clear ephemeral drag state
  dragId.value = null
  dragOverIndex.value = null
}

const onDrop = (e: DragEvent, targetId: number) => {
  e.preventDefault()
  // Determine dragged id (from ref or dataTransfer)
  const fromId = dragId.value ?? parseInt(e.dataTransfer?.getData('text/plain') || '0')

  // Map ids to indexes in the underlying store.tasks array
  let fromIndex = store.tasks.findIndex(t => t.id === fromId)
  let toIndex = store.tasks.findIndex(t => t.id === targetId)

  // If direct mapping fails (possible with filtered/sorted views or id type mismatches),
  // try a fallback: map positions in the currently rendered filtered list to the underlying store
  if (fromIndex === -1 || toIndex === -1) {
    // fallback to the currently rendered pending list (these are the draggable items)
    const renderedIds = pendingTasks.value.map(t => t.id)
    const renderedFrom = renderedIds.indexOf(fromId)
    const renderedTo = renderedIds.indexOf(targetId)
    if (renderedFrom === -1 || renderedTo === -1) {
      dragId.value = null
      dragOverIndex.value = null
      return
    }
    const idAtFrom = renderedIds[renderedFrom]
    const idAtTo = renderedIds[renderedTo]
    fromIndex = store.tasks.findIndex(t => t.id === idAtFrom)
    toIndex = store.tasks.findIndex(t => t.id === idAtTo)
    if (fromIndex === -1 || toIndex === -1) {
      dragId.value = null
      dragOverIndex.value = null
      return
    }
  }

  if (fromIndex !== toIndex) {
    store.reorderTasks(fromIndex, toIndex)
    manualOrder.value = true
  }

  dragId.value = null
  dragOverIndex.value = null
}
 
const completedCount = () => store.tasks.filter(t => t.completed).length
const totalCount = () => store.tasks.length

// Tasks that are pending (rendered in main list and draggable)
const pendingTasks = computed(() => {
  let list = store.tasks.slice().filter(t => !t.completed)
  if (filterPriority.value !== 'all') list = list.filter(t => t.priority === filterPriority.value)

  if (sortDirection.value === 'asc') {
    const order = { high: 0, medium: 1, low: 2 }
    list.sort((a,b) => order[a.priority] - order[b.priority])
  } else if (sortDirection.value === 'desc') {
    const order = { high: 0, medium: 1, low: 2 }
    list.sort((a,b) => order[b.priority] - order[a.priority])
  }

  // Default: if there's no explicit sort, show most recent first by created_at
  // unless the user has manually reordered the list via drag-and-drop.
  if (sortDirection.value === 'none' && !manualOrder.value) {
    list.sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0
      return tb - ta
    })
  }

  return list
})

// Completed tasks are grouped in a separate section at the bottom
const completedTasks = computed(() => {
  // If tasks have a completed_at timestamp, use it for ordering. Otherwise fall back to created_at.
  const list = store.tasks.slice().filter(t => t.completed)
  list.sort((a,b) => {
    const ta = (a as any).completed_at ? new Date((a as any).completed_at).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0)
    const tb = (b as any).completed_at ? new Date((b as any).completed_at).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0)
    return tb - ta
  })
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
    </div>

    <!-- Filters bar: horizontal, directly under header -->
    <div class="filters-bar" style="margin-bottom:18px">
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; width:100%">
        <div style="display:flex; gap:12px; align-items:center; flex:1; min-width:0">
          <FilterDropdown v-model="filterPriority" :options="[{ value: 'all', label: 'All' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]" label="Priority" />
          <!-- Status filter removed: completed tasks are shown in a grouped section below -->
          <FilterDropdown v-model="sortDirection" :options="[{ value: 'none', label: 'No sort' }, { value: 'asc', label: 'Priority ↑' }, { value: 'desc', label: 'Priority ↓' }]" label="Sort" />
        </div>
        <div style="display:flex; align-items:center; justify-content:flex-end; min-width:0">
          <button class="btn btn-primary" v-if="!showForm" @click="showForm = true" style="padding:10px 16px; font-size:15px; border-radius:8px;">Add task</button>
        </div>
      </div>
    </div>

    <TaskForm v-if="showForm" @close="showForm = false" />

  <ProgressBar :completed="completedCount()" :total="totalCount()" />

    <ul style="list-style:none; padding:0; margin:18px 0; display:flex; flex-direction:column; gap:12px">
      <div>
        <div v-for="(task, idx) in pendingTasks" :key="task.id" :class="{ 'drag-over': dragOverIndex === idx }" draggable="true"
          @dragstart="(e)=>onDragStart(e, task.id)" @dragover="(e)=>onDragOver(e, idx)" @drop="(e)=>onDrop(e, task.id)" @dragend="onDragEnd">
          <TaskItem :task="task" @toggle="store.toggleCompleted" @delete="store.removeTask" />
        </div>
      </div>
    </ul>

    <!-- Completed section grouped at the bottom -->
    <div v-if="completedTasks.length" style="margin-top:20px">
      <h3 @click="showCompleted = !showCompleted" style="margin:0 0 10px 0; color:var(--muted); cursor:pointer; display:flex; align-items:center; gap:8px">
        <span>Completed</span>
        <small style="color:var(--muted)">({{ completedTasks.length }})</small>
        <span style="margin-left:auto; color:var(--muted)">{{ showCompleted ? '▲' : '▼' }}</span>
      </h3>
      <ul v-if="showCompleted" style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px">
  <li v-for="task in completedTasks" :key="task.id">
          <!-- Use the same TaskItem so the checkbox and menu are available to restore/delete -->
          <div style="pointer-events:auto">
            <TaskItem :task="task" @toggle="store.toggleCompleted" @delete="store.removeTask" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>