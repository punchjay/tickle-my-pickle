import styled from 'styled-components'

export const Fallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100svh;
  padding: 24px;
  text-align: center;
  background: var(--pf-bg);
  color: var(--pf-text);
  font-family: var(--pf-font-body);
`

export const RetryButton = styled.button`
  background: var(--pf-primary);
  color: var(--pf-card);
  border: none;
  border-radius: var(--pf-radius-sm);
  padding: 9px 18px;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: var(--pf-font-body);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: var(--pf-primary-hover);
  }
`
