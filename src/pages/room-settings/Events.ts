import socket from '@/websocket'
import { defineStore } from 'pinia'
import { Reactive, reactive, Ref, ref } from 'vue'

export type Room = {
  name: String
  max_players: Number
  min_players: Number
  starting_size: Number
  speed: Number
}

export type RoomSettings = {
  room_created: Boolean
  room: Room
}

export type ServerMessage<T> = {
  event_type: String
  action: String
  payload: T
}

const ws: WebSocket = socket

const useRoomSettingsEvents = () => {
  const quitRoomEvent = (ws: WebSocket, room_id: String, client_id: String) => {
    ws.send(
      JSON.stringify({
        name: 'rooms',
        action: 'quit_room',
        payload: { room_id, client_id },
      }),
    )
  }

  const kickHostEvent = (ws: WebSocket, room_id: String, actor_id: String, victim_id: String) => {
    ws.send(
      JSON.stringify({
        name: 'rooms',
        action: 'kick_host',
        payload: { actor_id, victim_id, room_id },
      }),
    )
  }

  const inviteHostEvent = (ws: WebSocket, room_id: String, actor_id: String, victim_id: String) => {
    ws.send(
      JSON.stringify({
        name: 'rooms',
        action: 'invite_host',
        payload: { actor_id, victim_id, room_id },
      }),
    )
  }

  const createRoomEvent = (room): void => {
    ws.send(
      JSON.stringify({
        name: 'rooms',
        action: 'create_room',
        payload: room,
      }),
    )
  }

  const roomPageTransitionEvent = (message: MessageEvent) => {
    const data = JSON.parse(message.data)
    const { payload, transition } = data
  }

  return {
    createRoomEvent,
    roomPageTransitionEvent,
    quitRoomEvent,
    kickHostEvent,
    inviteHostEvent,
  }
}

const useRoomSettingsEventHandler = defineStore('roomSettings', () => {
  const {
    createRoomEvent,
    roomPageTransitionEvent,
    quitRoomEvent,
    kickHostEvent,
    inviteHostEvent,
  } = useRoomSettingsEvents()

  const roomSettings: Reactive<RoomSettings> = reactive({
    room_created: false,
    room: {
      name: 'entra aí, noob',
      maxPlayers: 4,
      minPlayers: 1,
      startingSize: 10,
      speed: 5,
    },
  })

  const existingRoomMode: Ref<Boolean> = ref(false)

  const serverEventsHandler = (message: MessageEvent) => {
    const data: ServerMessage<Room> = JSON.parse(message.data)
    switch (data.action) {
      case 'room_created':
        roomPageTransitionEvent(message)
        break
      case 'quit_room':
        break
      case 'kicked_host':
        break
      case 'invited_host':
        break
    }
  }

  const clientEventsHandler = (action: String, params: any = {}) => {
    switch (action) {
      case 'create_room':
        createRoomEvent(roomSettings)
        break

      case 'quit_room':
        quitRoomEvent(ws, params.room_id, params.client_id)
        break
      case 'kick_host':
        kickHostEvent(ws, params.room_id, params.action_id, params.victim_id)
        break
      case 'invite_host':
        inviteHostEvent(ws, params.room_id, params.actor_id, params.victim_id)
        break
    }
  }

  return { roomSettings, existingRoomMode, serverEventsHandler, clientEventsHandler }
})

export default useRoomSettingsEventHandler
