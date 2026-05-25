// src/features/react-demos/components/Accordion.tsx
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AccordionCtx {
  openId: string | null
  toggle: (id: string) => void
}

interface ItemCtx {
  id: string
}

const AccordionContext = createContext<AccordionCtx | null>(null)
const AccordionItemContext = createContext<ItemCtx | null>(null)

function useAccordionContext() {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('Must be used inside <Accordion>')
  return ctx
}

function useItemContext() {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) throw new Error('Must be used inside <Accordion.Item>')
  return ctx
}

function AccordionRoot({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))
  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function Item({ id, children }: { id: string; children: ReactNode }) {
  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div className="px-4">{children}</div>
    </AccordionItemContext.Provider>
  )
}

function Trigger({ children }: { children: ReactNode }) {
  const { openId, toggle } = useAccordionContext()
  const { id } = useItemContext()
  return (
    <button
      className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-gray-900 dark:text-white"
      onClick={() => toggle(id)}
      aria-expanded={openId === id}
    >
      {children}
      <span className="ml-2 text-xs text-gray-400">{openId === id ? '▲' : '▼'}</span>
    </button>
  )
}

function Content({ children }: { children: ReactNode }) {
  const { openId } = useAccordionContext()
  const { id } = useItemContext()
  if (openId !== id) return null
  return (
    <div className="pb-3 text-sm text-gray-600 dark:text-gray-400">
      {children}
    </div>
  )
}

export const Accordion = Object.assign(AccordionRoot, { Item, Trigger, Content })
