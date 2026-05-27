const BOT_REPLIES = ['Got it!', 'Interesting...', 'Tell me more.', 'Noted.', '👍']

export class FakeWebSocket {
  readonly url: string
  readyState: number = 0 // CONNECTING

  onopen: (() => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onclose: (() => void) | null = null

  private replyIndex = 0

  constructor(url: string) {
    this.url = url
    setTimeout(() => {
      this.readyState = 1 // OPEN
      this.onopen?.()
    }, 300)
  }

  send(data: string): void {
    if (this.readyState !== 1) return
    const reply = BOT_REPLIES[this.replyIndex % BOT_REPLIES.length]
    this.replyIndex++
    setTimeout(() => {
      this.onmessage?.(new MessageEvent('message', { data: reply }))
    }, 800)
  }

  close(): void {
    this.readyState = 3 // CLOSED
    this.onclose?.()
  }
}
