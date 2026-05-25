import { useState, type FormEvent } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
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
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 9px 12px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #16a34a;
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
  }
`

const SearchButton = styled.button`
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #15803d;
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`

const GeoButton = styled.button`
  width: 100%;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 9px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #f9fafb;
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

export default function LocationInput({ onZipSubmit, onGeolocate, loading, disabled }: Props) {
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
        <SearchButton type="submit" disabled={disabled || loading || zip.length < 5}>
          {loading ? 'Searching…' : 'Search'}
        </SearchButton>
      </SearchForm>
      <GeoButton type="button" onClick={onGeolocate} disabled={disabled || loading}>
        Use my location
      </GeoButton>
    </Wrapper>
  )
}
