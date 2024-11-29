<script setup lang="ts">
import PlayerCachingLocalStorage from '@/player/localStorage'
import { PlayerCaching } from '@/player/types'
import socket from '@/websocket'
import useLandingEventHandlers from '@/pages/landing-page/events'
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

const landingText = 'Hey! This is the multiplayer snake!'
</script>
<template>
  <div class="center">
    <h1 class="landing-title">{{ landingText }}</h1>
    {{ shouldReconnect }}
    <div v-if="!shouldReconnect">
      <span class="input-title">Tell me your name</span>
      <div class="input-area space-at-top">
        <input class="input" v-model="player.name" type="text" />
        <button
          @click="() => serverEventHandler('register', { name: player.name })"
          class="input-button"
        >
          OK!
        </button>
      </div>
      <button @click="caching.removePlayer" class="input-button">Quit!</button>
    </div>
    <div v-else>
      <h2>welcome back {{ store.player.name }}</h2>
      <span>user has already been registered, reconnecting . . .</span>
    </div>
  </div>
</template>
<style scoped>
.landing-title {
  max-width: 700px;
  text-align: center;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input {
  outline: none;
  color: var(--purple);
  font-family: inherit;
}

.input-area {
  display: flex;
  gap: 5px;
}

.input-button {
  background-color: var(--pink);
  color: var(--white);
  border: none;
  font-family: inherit;
  padding: 1em;
}

.input-title {
  color: var(--white);
}

.space-at-top {
  padding-top: 1em;
}
</style>
