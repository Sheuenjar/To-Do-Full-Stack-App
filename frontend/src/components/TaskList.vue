<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTasksStore } from '../store/useTasksStore'
import TaskForm from './TaskForm.vue'

const store = useTasksStore()
const showForm = ref(false)
const editingTask = ref<any | null>(null)

const editTask = (task: any) => {
  editingTask.value = task
}

onMounted(() => {
  store.fetchTasks()
})
</script>

<template>
  <div>
    <h2>Lista de tareas</h2>

    <!-- Form para agregar nueva tarea -->
    <TaskForm v-if="showForm" @onClose="showForm = false" />
    <button v-else @click="showForm = true">Agregar tarea</button>

    <ul>
      <li v-for="task in store.tasks" :key="task.id">
        <input type="checkbox" :checked="task.completed" @change="store.toggleCompleted(task.id)" />
        <span :style="{ textDecoration: task.completed ? 'line-through' : 'none' }">
          {{ task.title }} - {{ task.description }}
        </span>
        <button @click="editTask(task)">Editar</button>
        <button @click="store.removeTask(task.id)">Eliminar</button>
      </li>
    </ul>

    <!-- Form para editar -->
    <TaskForm v-if="editingTask" :taskToEdit="editingTask" @onClose="editingTask = null" />
  </div>
</template>
