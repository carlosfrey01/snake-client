<script setup>
import { ref, onMounted } from 'vue'
const matrix = ref([])
const baseAxis = 500
const serverAxis = ref(null)
const ws = new WebSocket('ws://localhost:6789')

ws.onopen = () => {
  ws.send('Hello, server! This is the initial message.')
}

onMounted(() => {
  document.addEventListener('keyup', (e) => {
    console.log(e.key)
    sendEvent({ name: 'key_read', key: e.key })
  })
})

const colors = {
  food: 'red',
  body: 'black',
}

const render = () => {
  const distance = baseAxis / serverAxis.value
  const ctx = canvasRef.value.getContext('2d')
  ctx.clearRect(0, 0, baseAxis, baseAxis)
  for (let y = 0; y < serverAxis.value; y++) {
    for (let x = 0; x < serverAxis.value; x++) {
      const currentCell = matrix.value[y][x]
      if (currentCell !== 0) {
        const type = currentCell.type
        ctx.fillStyle = colors[type]
        ctx.fillRect(x * distance, y * distance, distance, distance)
      }
    }
  }
}
const clientEvents = {
  start_game: () => {
    isPaused.value = false
    started.value = true
  },
  pause_game: () => {
    isPaused.value = true
  },
  resume_game: () => {
    isPaused.value = false
  },
  game_setup: (responseValue) => {
    const { payload } = responseValue
    serverAxis.value = payload.x
    showCanvas.value = true
  },
  update_matrix: (responseValue) => {
    matrix.value = responseValue.payload
    render()
  },
}
ws.onmessage = (e) => {
  const res = e.data
  const responseValue = JSON.parse(res)
  const { name } = responseValue
  clientEvents[name](responseValue)
}

const isPaused = ref(true)
const started = ref(false)
const showCanvas = ref(false)

const sendEvent = (event) => {
  ws.send(JSON.stringify(event))
}

const start = () => {
  sendEvent({ name: 'start_game' })
}

const pause = () => {
  sendEvent({ name: 'pause_game' })
}

const resume = () => {
  sendEvent({ name: 'resume_game' })
}

const canvasRef = ref(null)
</script>

<template>
  <div v-if="showCanvas">
    <canvas ref="canvasRef" :width="baseAxis" :height="baseAxis" class="canva"></canvas>
    <button v-if="!started" @click="start">start</button>
    <button v-if="!isPaused && started" @click="pause">Pause</button>
    <button v-if="isPaused && started" @click="resume">Resume</button>
  </div>
</template>

<style scoped>
.canva {
  border: 3px solid black;
  background-color: blueviolet;
}
.row {
  display: flex;
  gap: 2px;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
