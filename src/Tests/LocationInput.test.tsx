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

  it('trims surrounding whitespace before submitting', () => {
    const onZipSubmit = vi.fn()
    render(
      <LocationInput
        onZipSubmit={onZipSubmit}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    const input = screen.getByPlaceholderText('Enter zip code')
    fireEvent.change(input, { target: { value: ' 902 ' } })
    // Submit the form directly so the trim logic is tested independently of
    // the Search button's length-based disabled gate.
    fireEvent.submit(input.closest('form')!)
    expect(onZipSubmit).toHaveBeenCalledWith('902')
  })

  it('does not submit when the input is only whitespace', () => {
    const onZipSubmit = vi.fn()
    render(
      <LocationInput
        onZipSubmit={onZipSubmit}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    const input = screen.getByPlaceholderText('Enter zip code')
    fireEvent.change(input, { target: { value: '     ' } })
    fireEvent.submit(input.closest('form')!)
    expect(onZipSubmit).not.toHaveBeenCalled()
  })

  it('caps the zip input length at 5 characters', () => {
    render(
      <LocationInput
        onZipSubmit={() => {}}
        onGeolocate={() => {}}
        loading={false}
        disabled={false}
      />,
    )
    expect(screen.getByPlaceholderText('Enter zip code')).toHaveAttribute(
      'maxLength',
      '5',
    )
  })
})
