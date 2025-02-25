import PlayerCachingLocalStorage from '@/player/localStorage'
import type { PlayerCaching } from '@/player/types'
import { Player } from '@/player/types'
import socket from '@/websocket'
import { defineStore } from 'pinia'
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'

const useLandingEvents = () => {
  const registerServerEvent = (ws: WebSocket, name: String): void => {
    ws.send(JSON.stringify({ name: 'auth', action: 'register_client', payload: { name } }))
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

  const createPlayerClientEvent = (e: MessageEvent, caching: PlayerCaching): Player => {
    const payload = JSON.parse(e.data)?.payload
    caching.setPlayer(payload)
    return payload
  }

  return {
    registerServerEvent,
    reconnectServerEvent,
    createPlayerClientEvent,
  }
}

const useLandingEventHandlers = defineStore('client', () => {
  const { registerServerEvent, reconnectServerEvent, createPlayerClientEvent } = useLandingEvents()
  const router = useRouter()

  const caching = new PlayerCachingLocalStorage()
  const player: Ref<Player> = ref({ name: '', id: '' })
  const shouldReconnect: Ref<boolean> = ref(false)

  const setPlayer = (value: Player) => {
    player.value = value
  }

  const clientEventHandler = (e: MessageEvent, params): void => {
    const data = JSON.parse(e.data)
    switch (data.action) {
      case 'create_client_event': {
        player.value = createPlayerClientEvent(e, caching)
        break
      }
    }
  }

  const serverEventHandler = (action: String, params: any): void => {
    switch (action) {
      case 'register': {
        registerServerEvent(socket, params.name)
        router.push('/rooms')
        break
      }

      case 'reconnect': {
        reconnectServerEvent(socket, new PlayerCachingLocalStorage())
        break
      }
    }
  }

  onMounted(() => {
    const playerStorage: Player | null = caching.getPlayer()

    if (playerStorage && playerStorage?.id) {
      shouldReconnect.value = true
      player.value = playerStorage
      router.push('/rooms')
      return
    }

    shouldReconnect.value = false
  })

  return {
    serverEventHandler,
    clientEventHandler,
    setPlayer,
    player,
    shouldReconnect,
  }
})

export default useLandingEventHandlers
