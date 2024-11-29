import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'

export const useClientStore = defineStore('client', {
  state: () => ({
    player: { name: '', id: '' },
    shouldReconnect: false,
  }),
})
