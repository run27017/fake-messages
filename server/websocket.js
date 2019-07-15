const _ = require('lodash')
const WebSocketServer = require('websocket').server

const connections = []

function createServer (httpServer) {
  const wsServer = new WebSocketServer({
    httpServer,
    autoAcceptConnections: false
  })

  wsServer.on('request', function(request) {
    const connection = request.accept('echo-protocol', request.origin);
    connections.push(connection)
    console.log((new Date()) + ' Connection accepted.');

    connection.on('close', function(reasonCode, description) {
      connections.splice(connections.indexOf(connection), 1)
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
    })
  })

  console.log('WebSocket server injected.')
}

function broadcast (message) {
  if (_.isObject(message)) {
    // Array is also object.
    message = JSON.stringify(message)
  }
  connections.forEach(connection => {
    connection.sendUTF(message)
  })
}

module.exports = {
  createServer,
  broadcast
}

