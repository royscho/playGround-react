import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRef } from 'react'
import { useFocusTrap } from '../useFocusTrap'

function TestTrap({ isOpen }: { isOpen: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, isOpen)
  return (
    <div ref={ref}>
      <button data-testid="btn-1">First</button>
      <button data-testid="btn-2">Second</button>
      <button data-testid="btn-3">Last</button>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('focuses first element when isOpen becomes true', () => {
    render(<TestTrap isOpen={true} />)
    expect(screen.getByTestId('btn-1')).toHaveFocus()
  })

  it('does not steal focus when isOpen is false', () => {
    render(<TestTrap isOpen={false} />)
    expect(screen.getByTestId('btn-1')).not.toHaveFocus()
  })

  it('Tab from last element wraps to first', () => {
    render(<TestTrap isOpen={true} />)
    screen.getByTestId('btn-3').focus()
    fireEvent.keyDown(screen.getByTestId('btn-3').parentElement!, { key: 'Tab', shiftKey: false })
    expect(screen.getByTestId('btn-1')).toHaveFocus()
  })

  it('Shift+Tab from first element wraps to last', () => {
    render(<TestTrap isOpen={true} />)
    screen.getByTestId('btn-1').focus()
    fireEvent.keyDown(screen.getByTestId('btn-1').parentElement!, { key: 'Tab', shiftKey: true })
    expect(screen.getByTestId('btn-3')).toHaveFocus()
  })

  it('non-Tab keys are ignored', () => {
    render(<TestTrap isOpen={true} />)
    screen.getByTestId('btn-1').focus()
    fireEvent.keyDown(screen.getByTestId('btn-1').parentElement!, { key: 'Escape' })
    expect(screen.getByTestId('btn-1')).toHaveFocus()
  })

  it('stops trapping focus when isOpen becomes false', () => {
    const { rerender } = render(<TestTrap isOpen={true} />)
    rerender(<TestTrap isOpen={false} />)
    // After closing, Tab on the container should not wrap focus
    screen.getByTestId('btn-3').focus()
    fireEvent.keyDown(screen.getByTestId('btn-3').parentElement!, { key: 'Tab', shiftKey: false })
    // Focus should NOT have wrapped to btn-1 (listener removed)
    expect(screen.getByTestId('btn-1')).not.toHaveFocus()
  })
})
