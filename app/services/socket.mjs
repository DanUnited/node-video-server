import WebSocket from 'ws'
let _instance = null

class Socket {
  constructor() {
    if (_instance) {
      return _instance
    }
    _instance = this

    this.wss = null
    this.clients = []
  }

  init(params) {
    this.wss = new WebSocket.Server({
      ...params
    })

    this.wss.broadcast = (data, url) => {
      this.clients.filter(client => client.url === url)
        .forEach(client => {
          const {socket} = client;
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(data)
          }
        });
    }

    this.wss.on('connection', (socket, req) => {
      this.clients.push({
        socket,
        url: req.url
      })
    })

    this.wss.on('close', () => console.log(`WEBSOCKET SERVER CONNECTION WAS CLOSED`))
  }

  get() {
    return this.wss
  }


}

export const socket = new Socket()
