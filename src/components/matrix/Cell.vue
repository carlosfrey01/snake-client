<script setup>
const props = defineProps(['cell'])
const cell = props.cell
</script>

<template>
  <div v-if="cell == 0" class="cell"></div>
  <div v-else class="cell red-cell"></div>
</template>

<style scoped>
.cell {
  display: block;
  height: 10px;
  width: 10px;
  background-color: royalblue;
}

.red-cell {
  background-color: red;
}
</style>
