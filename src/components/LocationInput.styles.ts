import styled from 'styled-components'

// Single pill: terracotta search icon (submit) + free-text input + an inline
// court-blue "Near me" action. Matches the mood board's "ui kit in context".
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-pill);
  padding: 4px 10px 4px 12px;
  box-shadow: var(--pf-shadow-card);
`

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`

export const IconButton = styled.button`
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

export const Spinner = styled.span`
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

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-size: 0.9375rem;
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

export const Divider = styled.span`
  flex-shrink: 0;
  width: 1px;
  height: 22px;
  background: var(--pf-border);
`

export const NearMeButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  border-radius: var(--pf-radius-pill);
  padding: 8px 10px;
  font-size: 0.875rem;
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
