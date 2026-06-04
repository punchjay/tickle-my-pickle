import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  it('renders the finder page at /', () => {
    renderAt('/')
    expect(
      screen.getByPlaceholderText('Search city, ZIP, or neighborhood'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Tickle My Pickle' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Find pickleball courts near you'),
    ).toBeInTheDocument()
  })

  it('renders the 404 page for an unknown route', () => {
    renderAt('/does-not-exist')
    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /back to the courts/i }),
    ).toBeInTheDocument()
  })
})
