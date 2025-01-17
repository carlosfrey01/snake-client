import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useClientStore = defineStore('client', () => {
  const clientState = reactive({
    page: '/rooms',
    current_status: 'Looking for a room...',
    room: {
      room_created: false,
      is_owner: false,
    },
    rooms: {},
    matches: {},
  })
})
