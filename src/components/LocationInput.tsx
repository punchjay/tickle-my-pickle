import { useEffect, useRef, useState, type FormEvent } from 'react'
import { search } from '../appData'
import { Spinner } from './Spinner.styles'
import {
  Wrapper,
  SearchForm,
  IconButton,
  SearchInput,
  Divider,
  NearMeButton,
} from './LocationInput.styles'

const SearchIcon = () => {
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

const NearMeIcon = () => {
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
      <line
        x1="8"
        y1="0"
        x2="8"
        y2="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <line
        x1="8"
        y1="13.5"
        x2="8"
        y2="16"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <line
        x1="0"
        y1="8"
        x2="2.5"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <line
        x1="13.5"
        y1="8"
        x2="16"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  )
}

interface Props {
  onSearch: (query: string) => void
  onGeolocate: () => void
  // Fired the first time the user engages the pill (focus or click), so the
  // page can lazily start loading the Maps SDK only on intent.
  onActivate?: () => void
  // Put the cursor in the field on mount, on devices with a fine pointer
  // (mouse/trackpad) only: mobile browsers won't raise the keyboard for a
  // focus the user didn't trigger, so there it would just be a stray caret.
  autoFocus?: boolean
  loading: boolean
  disabled: boolean
  // Maps SDK still loading — spin the icon to signal "not yet".
  initializing?: boolean
}

const LocationInput = ({
  onSearch,
  onGeolocate,
  onActivate,
  autoFocus = false,
  loading,
  disabled,
  initializing = false,
}: Props) => {
  const [query, setQuery] = useState('')
  const busy = loading || initializing
  const inputRef = useRef<HTMLInputElement>(null)
  // Set around the autofocus so its focus event doesn't count as engagement:
  // the Maps SDK should still wait for a real click, tap, or keystroke.
  const autoFocusing = useRef(false)

  useEffect(() => {
    if (!autoFocus || !window.matchMedia?.('(pointer: fine)').matches) return
    autoFocusing.current = true
    inputRef.current?.focus()
    autoFocusing.current = false
  }, [autoFocus])

  const handleFocusCapture = () => {
    if (!autoFocusing.current) onActivate?.()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  // Clear the typed location when searching by current position, so the input
  // doesn't keep showing a stale query that no longer matches the results.
  const handleGeolocate = () => {
    setQuery('')
    onGeolocate()
  }

  return (
    // Pointer-down + focus (capture) cover both a click and a keyboard tab into
    // any control in the pill; key-down covers typing into the autofocused
    // field. onActivate is idempotent, so firing more than one is fine.
    <Wrapper
      onPointerDownCapture={onActivate}
      onFocusCapture={handleFocusCapture}
      onKeyDownCapture={onActivate}
    >
      <SearchForm onSubmit={handleSubmit}>
        <IconButton
          type="submit"
          disabled={disabled || loading}
          aria-label={search.submitLabel}
        >
          {busy ? <Spinner /> : <SearchIcon />}
        </IconButton>
        <SearchInput
          ref={inputRef}
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
        onClick={handleGeolocate}
        disabled={disabled || loading}
      >
        <NearMeIcon />
        {search.nearMe}
      </NearMeButton>
    </Wrapper>
  )
}

export default LocationInput
