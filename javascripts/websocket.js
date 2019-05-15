import { w3cwebsocket as W3CWebSocket } from 'websocket'

const listenersMap = {}

function connect () {
  const client = new W3CWebSocket(url(), 'echo-protocol')

  client.onerror = function() {
    console.log('Connection Error')
  }

  client.onopen = function() {
    console.log('WebSocket Client Connected')
  }

  client.onclose = function() {
    console.log('WebSocket Client Closed')
  }

  client.onmessage = function(e) {
    console.log('Received:', e.data)

    let data = null
    try {
      data = JSON.parse(e.data)
    } catch (error) {
      console.error('JSON parsing error!')
      return
    }

    const listeners = listenersMap[data.event] || []
    listeners.forEach(listener => {
      try {
        listener(data)
      } catch (error) {
        console.error('Listener执行异常', listener, data, error)
      }
    })
  }
}

function addEventListener (event, listener) {
  let listeners = listenersMap[event]
  if (listeners === undefined) {
    listenersMap[event] = listeners = []
  }
  listeners.push(listener)
}

function url () {
  const location = window.location
  const protocol = location.protocol === 'https' ? 'wss' : 'ws'
  return `${protocol}://${location.host}`
}

export default {
  connect,
  addEventListener
}

