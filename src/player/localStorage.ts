import type { Player, PlayerCaching } from './types'

class PlayerCachingLocalStorage implements PlayerCaching {
  getPlayer = (): Player | null => {
    const playerStorage = localStorage.getItem('snakePlayer')
    if (playerStorage) {
      return JSON.parse(playerStorage)
    }
    return null
  }

  setPlayer = (player: Player): void => {
    const parsedPlayer = JSON.stringify(player)
    localStorage.setItem('snakePlayer', parsedPlayer)
  }

  removePlayer = (): void => {
    localStorage.removeItem('snakePlayer')
  }
}

export default PlayerCachingLocalStorage
