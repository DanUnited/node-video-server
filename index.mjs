import fs from 'fs'
import http from 'http'
import WebSocket from 'ws'

if (process.argv.length < 3) {
  console.log(
    'Usage: \n' +
    'node websocket-relay.js <secret> [<stream-port> <websocket-port>]'
  )
  process.exit()
}

const STREAM_SECRET = process.argv[2],
  STREAM_PORT = process.argv[3] || 8081,
  WEBSOCKET_PORT = process.argv[4] || 8082,
  RECORD_STREAM = false

// Websocket Server
const socketServer = new WebSocket.Server({port: WEBSOCKET_PORT, perMessageDeflate: false})

socketServer.connectionCount = 0
socketServer.on('connection', function (socket, upgradeReq) {
  socketServer.connectionCount++
  console.log(
    'New WebSocket Connection: ',
    (upgradeReq || socket.upgradeReq).socket.remoteAddress,
    (upgradeReq || socket.upgradeReq).headers['user-agent'],
    '(' + socketServer.connectionCount + ' total)'
  )
  socket.on('close', function (code, message) {
    socketServer.connectionCount--
    console.log(
      'Disconnected WebSocket (' + socketServer.connectionCount + ' total)'
    )
  })
})

socketServer.broadcast = function (data) {
  socketServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

// HTTP Server to accept incomming MPEG-TS Stream from ffmpeg
http.createServer(function (request, response) {
  const params = request.url.substr(1).split('/')

  if (params[0] !== STREAM_SECRET) {
    console.log(
      'Failed Stream Connection: ' + request.socket.remoteAddress + ':' +
      request.socket.remotePort + ' - wrong secret.'
    )
    response.end()
  }

  response.connection.setTimeout(0)
  console.log(
    'Stream Connected: ' +
    request.socket.remoteAddress + ':' +
    request.socket.remotePort
  )
  request.on('data', function (data) {
    socketServer.broadcast(data)
    if (request.socket.recording) {
      request.socket.recording.write(data)
    }
  })
  request.on('end', function () {
    console.log('close')
    if (request.socket.recording) {
      request.socket.recording.close()
    }
  })

  // Record the stream to a local file?
  if (RECORD_STREAM) {
    const path = 'recordings/' + Date.now() + '.ts'
    request.socket.recording = fs.createWriteStream(path)
  }
}).listen(STREAM_PORT)

console.log('Listening for incomming MPEG-TS Stream on http://127.0.0.1:' + STREAM_PORT + '/<secret>')
console.log('Awaiting WebSocket connections on ws://127.0.0.1:' + WEBSOCKET_PORT + '/')
