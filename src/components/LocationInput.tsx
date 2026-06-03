import { useState, type FormEvent } from 'react'
import styled from 'styled-components'

// Single pill: terracotta search icon (submit) + free-text input + an inline
// court-blue "Near me" action. Matches the mood board's "ui kit in context".
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-pill);
  padding: 4px 10px 4px 12px;
  box-shadow: 0 2px 12px rgba(30, 45, 73, 0.18);
`

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`

const IconButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--pf-primary);
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid var(--pf-border);
  border-top-color: var(--pf-primary);
  border-radius: 50%;
  animation: pf-spin 0.7s linear infinite;

  @keyframes pf-spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-size: 15px;
  font-family: var(--pf-font-body);
  color: var(--pf-text);
  outline: none;

  &::placeholder {
    color: #9c8a6e;
  }

  &:disabled {
    color: var(--pf-text-muted);
  }
`

const Divider = styled.span`
  flex-shrink: 0;
  width: 1px;
  height: 22px;
  background: var(--pf-border);
`

const NearMeButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  border-radius: var(--pf-radius-pill);
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--pf-font-body);
  color: var(--pf-link);
  white-space: nowrap;
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
        <IconButton type="submit" disabled={disabled || loading} aria-label="Search">
          {loading ? <Spinner /> : <SearchIcon />}
        </IconButton>
        <SearchInput
          type="text"
          placeholder="Search city, ZIP, or neighborhood"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled || loading}
          aria-label="Search location"
        />
      </SearchForm>
      <Divider aria-hidden="true" />
      <NearMeButton
        type="button"
        onClick={onGeolocate}
        disabled={disabled || loading}
      >
        <NearMeIcon />
        Near me
      </NearMeButton>
    </Wrapper>
  )
}
