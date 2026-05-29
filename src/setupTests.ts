import '@testing-library/jest-dom'
// Normalizes styled-components class names in snapshots (sc-xxx -> c0/c1) so
// they're stable across environments; runtime-counter IDs otherwise differ
// between local and CI and break DOM snapshots.
import 'jest-styled-components'
