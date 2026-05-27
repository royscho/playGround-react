// src/features/chat/hooks/useChat.ts
import { useState, useEffect, useRef, useCallback } from 'react'
import { FakeWebSocket } from '../utils/FakeWebSocket'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface FrameLog {
  id: string
  direction: 'sent' | 'received'
  payload: string
  timestamp: Date
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

let msgCounter = 0
let frameCounter = 0

function makeId() { return String(++msgCounter) }
function makeFrameId() { return String(++frameCounter) }

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [frames, setFrames] = useState<FrameLog[]>([])
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [inputValue, setInputValue] = useState('')
  const wsRef = useRef<FakeWebSocket | null>(null)

  const connect = useCallback(() => {
    const ws = new FakeWebSocket('ws://localhost:8080/chat')
    wsRef.current = ws
    setStatus('connecting')

    ws.onopen = () => setStatus('connected')

    ws.onmessage = (e: MessageEvent) => {
      setMessages(prev => [...prev, {
        id: makeId(),
        text: e.data as string,
        sender: 'bot',
        timestamp: new Date(),
      }])
      setFrames(prev => [...prev, {
        id: makeFrameId(),
        direction: 'received',
        payload: e.data as string,
        timestamp: new Date(),
      }])
    }

    ws.onclose = () => setStatus('disconnected')
  }, [])

  useEffect(() => {
    connect()
    return () => { wsRef.current?.close() }
  }, [connect])

  const send = useCallback(() => {
    const text = inputValue.trim()
    if (!text || status !== 'connected') return
    setMessages(prev => [...prev, {
      id: makeId(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }])
    setFrames(prev => [...prev, {
      id: makeFrameId(),
      direction: 'sent',
      payload: text,
      timestamp: new Date(),
    }])
    wsRef.current?.send(text)
    setInputValue('')
  }, [inputValue, status])

  const reconnect = useCallback(() => {
    wsRef.current?.close()
    setMessages([])
    setFrames([])
    connect()
  }, [connect])

  return { messages, frames, status, inputValue, setInputValue, send, reconnect }
}
