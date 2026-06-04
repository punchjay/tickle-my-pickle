import { courtList } from '@/appData'

describe('appData', () => {
  describe('courtList.heading', () => {
    it('uses the singular noun for exactly one court', () => {
      expect(courtList.heading(1)).toBe('1 pickleball court nearby')
    })

    it('uses the plural noun for more than one court', () => {
      expect(courtList.heading(3)).toBe('3 pickleball courts nearby')
    })

    it('uses the plural noun for zero courts', () => {
      expect(courtList.heading(0)).toBe('0 pickleball courts nearby')
    })
  })
})
