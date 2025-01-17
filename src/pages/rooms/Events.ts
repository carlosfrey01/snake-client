import type { Room } from '@/pages/room-settings/Events'
import type { PlayerCaching } from '@/player/types'
import { Player } from '@/player/types'
import socket from '@/websocket'
import { defineStore } from 'pinia'
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
// 1 - TODO client entra na página de rooms
// 2 - TODO client envia evento de inscrição para o tópico de rooms
// 3 - TODO server recebe mensagem e em seguida adiciona o client no dicionario de clients inscritos em rooms
// 4 - TODO server envia lista de rooms toda vez que rooms for modificada
// 5 - client recebe lista atual de rooms enviada do server
const ws = socket
const useLandingEvents = () => {
  const router = useRouter()
  // SENDING EVENTS FROM CLIENT
  const joinRoomEvent = (ws: WebSocket, room_id: String, client_id: String) => {
    ws.send(
      JSON.stringify({
        name: 'rooms',
        action: 'join_room',
        payload: { room_id },
      }),
    )
  }
  const reconnectServerEvent = (ws: WebSocket, caching: PlayerCaching): void => {
    const localPlayer: Player | null = caching.getPlayer()
    ws.send(
      JSON.stringify({
        name: 'auth',
        action: 'reconnect_client',
        payload: localPlayer,
      }),
    )
  }

  const subscribeToRoomsServerEvent = (ws: WebSocket): void => {
    ws.send(
      JSON.stringify({
        name: 'rooms',
        action: 'subscribe_to_rooms',
        payload: {},
      }),
    )
  }

  // RECEIVING AND DISPATCHING EVENTS FROM SERVER
  const joinedRoomClientEvent = () => {
    router.push('/room-settings')
  }

  return {
    reconnectServerEvent,
    subscribeToRoomsServerEvent,
    joinRoomEvent,
    joinedRoomClientEvent,
  }
}

const useRoomsEventHandlers = defineStore('rooms', () => {
  const {
    subscribeToRoomsServerEvent,
    reconnectServerEvent,
    joinRoomEvent,
    joinedRoomClientEvent,
  } = useLandingEvents()
  const player: Ref<Player> = ref({ name: '', id: '' })
  const shouldReconnect: Ref<boolean> = ref(false)
  const rooms: Ref<Array<Room>> = ref([])

  const setPlayer = (value: Player) => {
    player.value = value
  }

  const clientEventHandler = (e: MessageEvent, params): void => {
    const data = JSON.parse(e.data)
    console.log('received event')
    switch (data.action) {
      case 'room_list': {
        console.log('received room list')
        rooms.value = data.payload
      }
      case 'joined_room': {
        console.log('received room list')
        joinedRoomClientEvent()
      }
    }
  }

  const serverEventHandler = (action: String, params: any): void => {
    switch (action) {
      case 'subscribe_to_rooms': {
        subscribeToRoomsServerEvent(socket)
        break
      }
      case 'join_room':
        joinRoomEvent(ws, params.room_id, params.client_id)
        break
    }
  }

  onMounted(() => {
    serverEventHandler('subscribe_to_rooms', {})
  })

  return {
    serverEventHandler,
    clientEventHandler,
    rooms,
  }
})

export default useRoomsEventHandlers
