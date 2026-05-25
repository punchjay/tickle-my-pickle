import { render, screen, fireEvent } from '@testing-library/react'
import LocationInput from '@/components/LocationInput'

describe('LocationInput', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <LocationInput
        onZipSubmit={() => {}}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('calls onZipSubmit with the entered zip on submit', () => {
    const onZipSubmit = vi.fn()
    render(
      <LocationInput
        onZipSubmit={onZipSubmit}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    fireEvent.change(screen.getByPlaceholderText('Enter zip code'), {
      target: { value: '90210' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(onZipSubmit).toHaveBeenCalledWith('90210')
  })

  it('calls onGeolocate when the location button is clicked', () => {
    const onGeolocate = vi.fn()
    render(
      <LocationInput
        onZipSubmit={() => {}}
        onGeolocate={onGeolocate}
        loading={false}
        disabled={false}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Use my location' }))
    expect(onGeolocate).toHaveBeenCalled()
  })

  it('keeps Search disabled until 5 digits are entered', () => {
    render(
      <LocationInput
        onZipSubmit={() => {}}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    const input = screen.getByPlaceholderText('Enter zip code')
    const searchBtn = screen.getByRole('button', { name: 'Search' })

    expect(searchBtn).toBeDisabled()
    fireEvent.change(input, { target: { value: '9021' } })
    expect(searchBtn).toBeDisabled()
    fireEvent.change(input, { target: { value: '90210' } })
    expect(searchBtn).not.toBeDisabled()
  })

  it('disables all inputs when disabled prop is true', () => {
    render(
      <LocationInput
        onZipSubmit={() => {}}
        onGeolocate={() => {}}
        loading={false}
        disabled={true}
      />,
    )
    expect(screen.getByPlaceholderText('Enter zip code')).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Use my location' }),
    ).toBeDisabled()
  })
})
