<script setup lang="ts">
import useRoomsEventHandlers from '@/pages/rooms/Events'
import PlayerCachingLocalStorage from '@/player/localStorage'
import type { PlayerCaching } from '@/player/types'
import socket from '@/websocket'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

const ws: WebSocket = socket
const caching: PlayerCaching = new PlayerCachingLocalStorage()

const store = useRoomsEventHandlers()
const { rooms } = storeToRefs(store)
const { clientEventHandler } = store
ws.onopen = () => {}

ws.onmessage = (e) => {
  clientEventHandler(e, {})
}

const roomsNotFound = "Couldn't find any rooms"
</script>
<template>
  <div class="flex flex-col items-center h-screen justify-center">
    <h2 class="text-snake-white text-3xl text-center max-w-[400px]">
      Available <span class="text-snake-pink">Rooms</span>
    </h2>
    <div class="flex flex-col pt-10">
      <div class="bg-snake-white gap-10 py-5 px-12" v-if="rooms.length">
        <div v-for="(room, index) in rooms" :key="index" class="text-snake-purple text-sm py-2">
          <span>{{ room.name }}</span>
          <span>{{ room.max_players }}</span>
        </div>
      </div>
      <div class="bg-snake-white gap-10 py-5 px-12" v-else>
        <span class="text-snake-purple">Couldn't find any rooms</span>
      </div>
      <RouterLink
        to="/room-settings"
        class="bg-snake-pink text-snake-white text-sm p-3 mt-5 self-start"
      >
        Create room
      </RouterLink>
    </div>
  </div>
</template>
