<script setup lang="ts">
import useRoomSettingsEventHandler from '@/pages/room-settings/Events'
import socket from '@/websocket'
import { ref, Ref } from 'vue'

const ws: WebSocket = socket
const { roomSettings, existingRoomMode, serverEventsHandler, clientEventsHandler } =
  useRoomSettingsEventHandler()

const inRoom: Ref<Boolean> = ref(false)

ws.onmessage = (e) => {
  serverEventsHandler(e)
}
</script>
<template>
  <div class="h-screen flex flex-col items-center justify-center gap-12">
    <h2 class="text-snake-white text-3xl text-center max-w-[350px]">
      Room <span class="text-snake-pink">Settings</span>
    </h2>
    <div>
      <div class="flex flex-col md:flex-row">
        <div class="bg-snake-white px-6 py-6">
          <h3 class="text-center text-lg text-snake-pink">Players</h3>
          <div class="players-container">
            <div class="flex text-snake-purple gap-6 py-4 items-center">
              <span class="p-4">John doe</span>
              <span class="text-snake-pink">kick</span>
              <span class="text-snake-purple">Owner</span>
            </div>
            <div class="flex text-snake-purple gap-6 items-center">
              <span class="bg-snake-purple text-snake-white p-4">John doe</span>
              <span class="text-snake-pink">kick</span>
              <span class="text-snake-purple">Owner</span>
            </div>
          </div>
        </div>
        <div class="bg-snake-white px-6 py-6">
          <h3 class="text-center text-lg text-snake-pink">Match settings</h3>
          <div class="form-container pt-4 flex flex-col gap-4 text-xs">
            <div class="field flex gap-4">
              <label class="text-snake-purple" for="">Max players</label>
              <input
                v-model="roomSettings.room.maxPlayers"
                class="text-snake-pink w-[50px] ml-auto"
                type="text"
              />
            </div>
            <div class="field flex gap-4">
              <label class="text-snake-purple" for="">Min players</label>
              <input
                v-model="roomSettings.room.minPlayers"
                class="text-snake-pink w-[50px] ml-auto"
                type="text"
              />
            </div>
            <div class="field flex gap-4">
              <label class="text-snake-purple" for="">Starting size</label>
              <input
                v-model="roomSettings.room.startingSize"
                class="text-snake-pink w-[50px] ml-auto"
                type="text"
              />
            </div>
            <div class="field flex gap-4">
              <label class="text-snake-purple" for="">Speed</label>
              <input
                v-model="roomSettings.room.speed"
                class="text-snake-pink w-[50px] ml-auto"
                type="number"
              />
            </div>
          </div>
        </div>
      </div>
      <button
        @click="() => clientEventsHandler('create_room')"
        class="bg-snake-pink text-snake-white text-sm p-3 mt-5 self-start"
      >
        Create room
      </button>
    </div>
    <div></div>
  </div>
</template>
