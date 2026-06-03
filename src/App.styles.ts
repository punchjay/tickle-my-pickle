import styled from 'styled-components'

export const AppWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
`

export const MapDiv = styled.div`
  position: absolute;
  inset: 0;
`

export const OverlayTop = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: min(400px, calc(100vw - 32px));
`

export const ErrorBanner = styled.p`
  margin: 0;
  background: var(--pf-card);
  border-left: 4px solid var(--pf-tomato);
  border-radius: var(--pf-radius-sm);
  padding: 10px 14px;
  font-size: 13px;
  color: var(--pf-text);
  box-shadow: 0 2px 8px rgba(30, 45, 73, 0.18);
`
