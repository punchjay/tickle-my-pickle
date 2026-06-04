import { useState, type FormEvent } from 'react'
import { search } from '../appData'
import {
  Wrapper,
  SearchForm,
  IconButton,
  Spinner,
  SearchInput,
  Divider,
  NearMeButton,
} from './LocationInput.styles'

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="2.2" />
      <line
        x1="12.6"
        y1="12.6"
        x2="16.5"
        y2="16.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function NearMeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="0" x2="8" y2="2.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="13.5" x2="8" y2="16" stroke="currentColor" strokeWidth="1.4" />
      <line x1="0" y1="8" x2="2.5" y2="8" stroke="currentColor" strokeWidth="1.4" />
      <line x1="13.5" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

interface Props {
  onSearch: (query: string) => void
  onGeolocate: () => void
  loading: boolean
  disabled: boolean
}

export default function LocationInput({
  onSearch,
  onGeolocate,
  loading,
  disabled,
}: Props) {
  const [query, setQuery] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <Wrapper>
      <SearchForm onSubmit={handleSubmit}>
        <IconButton
          type="submit"
          disabled={disabled || loading}
          aria-label={search.submitLabel}
        >
          {loading ? <Spinner /> : <SearchIcon />}
        </IconButton>
        <SearchInput
          type="text"
          placeholder={search.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled || loading}
          aria-label={search.inputLabel}
        />
      </SearchForm>
      <Divider aria-hidden="true" />
      <NearMeButton
        type="button"
        onClick={onGeolocate}
        disabled={disabled || loading}
      >
        <NearMeIcon />
        {search.nearMe}
      </NearMeButton>
    </Wrapper>
  )
}
