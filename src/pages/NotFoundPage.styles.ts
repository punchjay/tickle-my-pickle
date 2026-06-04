import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100svh;
  padding: 24px;
  text-align: center;
  background: var(--pf-bg);
  color: var(--pf-text);
  font-family: var(--pf-font-body);
`

export const Code = styled.p`
  margin: 0;
  font-family: var(--pf-font-display);
  font-size: 6rem;
  line-height: 1;
  color: var(--pf-primary);
`

export const Message = styled.p`
  margin: 0 0 16px;
  font-size: 1rem;
  color: var(--pf-text-muted);
`

export const HomeLink = styled(Link)`
  background: var(--pf-primary);
  color: var(--pf-card);
  border-radius: var(--pf-radius-sm);
  padding: 10px 18px;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s;

  &:hover {
    background: var(--pf-primary-hover);
    text-decoration: none;
  }
`
