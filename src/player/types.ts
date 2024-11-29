export type ServerEvent<T> = {
  type: string
  action: string
  payload?: T
}

export type Player = {
  name: string
  id: string
}

export interface PlayerCaching {
  setPlayer(player: Player)
  getPlayer(): Player | null
  removePlayer()
}
