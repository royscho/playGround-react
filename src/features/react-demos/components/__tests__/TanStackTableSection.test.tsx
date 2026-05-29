import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TanStackTableSection } from '../TanStackTableSection'

describe('TanStackTableSection', () => {
  it('renders section heading', () => {
    render(<TanStackTableSection />)
    expect(screen.getByRole('heading', { name: /tanstack table/i })).toBeInTheDocument()
  })

  it('shows 5 rows on first page', () => {
    render(<TanStackTableSection />)
    // getAllByRole('row') returns header row + 5 data rows = 6
    expect(screen.getAllByRole('row').length - 1).toBe(5)
  })

  it('first row on page 1 is Mia Nelson by default', () => {
    render(<TanStackTableSection />)
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('Mia Nelson')).toBeInTheDocument()
  })

  it('clicking name header once sorts ascending — Alice Brown is first', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByTestId('col-header-name'))
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('Alice Brown')).toBeInTheDocument()
  })

  it('clicking name header twice sorts descending — Tina Underwood is first', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByTestId('col-header-name'))
    await userEvent.click(screen.getByTestId('col-header-name'))
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('Tina Underwood')).toBeInTheDocument()
  })

  it('global filter shows matching row and hides non-matching', async () => {
    render(<TanStackTableSection />)
    await userEvent.type(screen.getByTestId('global-filter'), 'Alice')
    expect(screen.getByText('Alice Brown')).toBeInTheDocument()
    expect(screen.queryByText('Bob Carter')).not.toBeInTheDocument()
  })

  it('global filter resets to page 1', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByTestId('next-page'))
    await userEvent.type(screen.getByTestId('global-filter'), 'Alice')
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1')
  })

  it('next page shows page 2 rows', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByTestId('next-page'))
    expect(screen.queryByText('Mia Nelson')).not.toBeInTheDocument()
    expect(screen.getByText('Frank Green')).toBeInTheDocument()
  })

  it('prev button is disabled on first page', () => {
    render(<TanStackTableSection />)
    expect(screen.getByTestId('prev-page')).toBeDisabled()
  })

  it('next button is disabled on last page', async () => {
    render(<TanStackTableSection />)
    // 20 rows / 5 per page = 4 pages; click next 3 times
    await userEvent.click(screen.getByTestId('next-page'))
    await userEvent.click(screen.getByTestId('next-page'))
    await userEvent.click(screen.getByTestId('next-page'))
    expect(screen.getByTestId('next-page')).toBeDisabled()
  })

  it('page info shows correct page and total', () => {
    render(<TanStackTableSection />)
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 4')
    expect(screen.getByTestId('page-info')).toHaveTextContent('20 employees')
  })

  it('unchecking name column removes name column header', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByRole('checkbox', { name: /toggle name column/i }))
    expect(screen.queryByTestId('col-header-name')).not.toBeInTheDocument()
  })

  it('selected count is empty when no rows selected', () => {
    render(<TanStackTableSection />)
    expect(screen.getByTestId('selected-count')).toHaveTextContent('')
  })

  it('selecting a row shows selected count', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByRole('checkbox', { name: /select mia nelson/i }))
    expect(screen.getByTestId('selected-count')).toHaveTextContent('1 selected')
  })

  it('select-all checkbox selects all 5 visible rows', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByRole('checkbox', { name: /select all/i }))
    expect(screen.getByTestId('selected-count')).toHaveTextContent('5 selected')
  })
})
