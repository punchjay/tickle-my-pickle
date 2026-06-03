import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Enter zip code')).toBeInTheDocument()
  })

  it('renders the header card title and tagline', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Tickle My Pickle' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Find pickleball courts near you'),
    ).toBeInTheDocument()
  })
})
