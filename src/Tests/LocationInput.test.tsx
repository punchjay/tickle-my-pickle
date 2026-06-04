import { render, screen, fireEvent } from '@testing-library/react'
import LocationInput from '@/components/LocationInput'

const PLACEHOLDER = 'Search city, ZIP, or neighborhood'

describe('LocationInput', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <LocationInput
        onSearch={() => {}}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('calls onSearch with the entered query on submit', () => {
    const onSearch = vi.fn()
    render(
      <LocationInput
        onSearch={onSearch}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
      target: { value: 'Seattle' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(onSearch).toHaveBeenCalledWith('Seattle')
  })

  it('calls onGeolocate when the "Near me" button is clicked', () => {
    const onGeolocate = vi.fn()
    render(
      <LocationInput
        onSearch={() => {}}
        onGeolocate={onGeolocate}
        loading={false}
        disabled={false}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /near me/i }))
    expect(onGeolocate).toHaveBeenCalled()
  })

  it('disables the input and actions when disabled prop is true', () => {
    render(
      <LocationInput
        onSearch={() => {}}
        onGeolocate={() => {}}
        loading={false}
        disabled={true}
      />,
    )
    expect(screen.getByPlaceholderText(PLACEHOLDER)).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /near me/i })).toBeDisabled()
  })

  it('shows a loading state and disables actions while loading', () => {
    render(
      <LocationInput
        onSearch={() => {}}
        onGeolocate={() => {}}
        loading={true}
        disabled={false}
      />,
    )
    expect(screen.getByPlaceholderText(PLACEHOLDER)).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /near me/i })).toBeDisabled()
  })

  it('shows a spinner while the map is initializing', () => {
    render(
      <LocationInput
        onSearch={() => {}}
        onGeolocate={() => {}}
        loading={false}
        disabled={true}
        initializing={true}
      />,
    )
    const button = screen.getByRole('button', { name: 'Search' })
    // Spinner is a <span>; the static SearchIcon is an <svg>.
    expect(button.querySelector('svg')).toBeNull()
    expect(button.querySelector('span')).toBeInTheDocument()
  })

  it('shows the static search icon when ready and idle', () => {
    render(
      <LocationInput
        onSearch={() => {}}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
        initializing={false}
      />,
    )
    expect(
      screen.getByRole('button', { name: 'Search' }).querySelector('svg'),
    ).toBeInTheDocument()
  })

  it('trims surrounding whitespace before submitting', () => {
    const onSearch = vi.fn()
    render(
      <LocationInput
        onSearch={onSearch}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    const input = screen.getByPlaceholderText(PLACEHOLDER)
    fireEvent.change(input, { target: { value: '  Green Lake  ' } })
    fireEvent.submit(input.closest('form')!)
    expect(onSearch).toHaveBeenCalledWith('Green Lake')
  })

  it('does not submit when the input is only whitespace', () => {
    const onSearch = vi.fn()
    render(
      <LocationInput
        onSearch={onSearch}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    const input = screen.getByPlaceholderText(PLACEHOLDER)
    fireEvent.change(input, { target: { value: '     ' } })
    fireEvent.submit(input.closest('form')!)
    expect(onSearch).not.toHaveBeenCalled()
  })
})
