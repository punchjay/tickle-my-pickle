import { useState, type FormEvent } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  background: var(--pf-card);
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-md);
  padding: 12px;
  box-shadow: 0 2px 12px rgba(30, 45, 73, 0.18);
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SearchForm = styled.form`
  display: flex;
  gap: 8px;
`

const ZipInput = styled.input`
  flex: 1;
  border: 1px solid var(--pf-border);
  border-radius: var(--pf-radius-sm);
  padding: 9px 12px;
  font-size: 15px;
  font-family: var(--pf-font-body);
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--pf-primary);
  }

  &:disabled {
    background: var(--pf-ivory);
    color: var(--pf-text-muted);
  }
`

const SearchButton = styled.button`
  background: var(--pf-primary);
  color: var(--pf-card);
  border: none;
  border-radius: var(--pf-radius-sm);
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--pf-font-body);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: var(--pf-primary-hover);
  }

  &:disabled {
    background: var(--pf-border);
    cursor: not-allowed;
  }
`

const GeoButton = styled.button`
  width: 100%;
  background: var(--pf-ivory);
  color: var(--pf-link);
  border: 1.5px solid var(--pf-link);
  border-radius: var(--pf-radius-sm);
  padding: 9px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--pf-font-body);
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: var(--pf-surface);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

interface Props {
  onZipSubmit: (zip: string) => void
  onGeolocate: () => void
  loading: boolean
  disabled: boolean
}

export default function LocationInput({
  onZipSubmit,
  onGeolocate,
  loading,
  disabled,
}: Props) {
  const [zip, setZip] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (zip.trim()) onZipSubmit(zip.trim())
  }

  return (
    <Wrapper>
      <SearchForm onSubmit={handleSubmit}>
        <ZipInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]{5}"
          maxLength={5}
          placeholder="Enter zip code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          disabled={disabled || loading}
          aria-label="Zip code"
        />
        <SearchButton
          type="submit"
          disabled={disabled || loading || zip.length < 5}
        >
          {loading ? 'Searching…' : 'Search'}
        </SearchButton>
      </SearchForm>
      <GeoButton
        type="button"
        onClick={onGeolocate}
        disabled={disabled || loading}
      >
        Use my location
      </GeoButton>
    </Wrapper>
  )
}
