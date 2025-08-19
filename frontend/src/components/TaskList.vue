<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTasksStore } from '../store/useTasksStore'
import TaskForm from './TaskForm.vue'
import TaskItem from './TaskItem.vue'

const store = useTasksStore()
const showForm = ref(false)

onMounted(() => {
  store.fetchTasks()
})
</script>

<template>
  <div class="container">
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px">
      <div>
        <h1>Mis tareas</h1>
        <h2>Organiza tu día — agrega, edita y marca como completadas</h2>
      </div>
      <div class="spacer"></div>
      <div>
        <button class="btn btn-primary" v-if="!showForm" @click="showForm = true">Agregar tarea</button>
      </div>
    </div>

    <TaskForm v-if="showForm" @close="showForm = false" />

    <ul style="list-style:none; padding:0; margin:18px 0; display:flex; flex-direction:column; gap:12px">
      <transition-group name="fade" tag="div">
  <TaskItem v-for="task in store.tasks" :key="task.id" :task="task" @toggle="store.toggleCompleted" @delete="store.removeTask" />
      </transition-group>
    </ul>
  </div>
</template>