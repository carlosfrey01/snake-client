<script setup lang="ts">
import useLandingEventHandlers from '@/pages/landing-page/events'
import PlayerCachingLocalStorage from '@/player/localStorage'
import { PlayerCaching } from '@/player/types'
import socket from '@/websocket'
import { storeToRefs } from 'pinia'

const ws: WebSocket = socket
const caching: PlayerCaching = new PlayerCachingLocalStorage()

const store = useLandingEventHandlers()
const { serverEventHandler, clientEventHandler } = store
const { player, shouldReconnect } = storeToRefs(store)

ws.onopen = () => {
  serverEventHandler('reconnect', {})
}

ws.onmessage = (e) => {
  clientEventHandler(e, { player: player, caching })
}
</script>
<template>
  <div class="h-screen flex gap-6 flex-col items-center justify-center">
    <h2 class="text-snake-white text-3xl text-center max-w-[800px]">
      Hey! This is the <span class="text-snake-pink">multiplayer snake!</span>
    </h2>
    <div class="flex flex-col gap-4">
      <span class="text-snake-white">Tell me your name</span>
      <div class="flex gap-2">
        <input class="text-snake-purple pl-2" v-model="player.name" type="text" />
        <button
          @click="() => serverEventHandler('register', { name: player.name })"
          class="bg-snake-pink text-snake-white p-3"
        >
          OK!
        </button>
      </div>
    </div>
  </div>
</template>
