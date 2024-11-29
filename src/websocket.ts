class Socket {
  public connection: WebSocket | null
  private host: String
  private port: Number

  constructor(host: String, port: Number) {
    this.connection = null
    this.port = port
    this.host = host
  }

  createSocket = (): WebSocket => {
    if (!this.connection) {
      this.connection = new WebSocket(`ws://localhost:6789`)
    }
    return this.connection
  }
}

export default new Socket('locahost', 6789).createSocket()
