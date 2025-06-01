import { describe, it, expect } from 'vitest'
import { highlightSearchTerm, validateTitle } from '../columnUtils'

describe('columnUtils', () => {
  describe('highlightSearchTerm', () => {
    it('should return true when search term is found in text', () => {
      expect(highlightSearchTerm('Hello World', 'world')).toBe(true)
      expect(highlightSearchTerm('Task 123', 'task')).toBe(true)
    })

    it('should return false when search term is not found in text', () => {
      expect(highlightSearchTerm('Hello World', 'xyz')).toBe(false)
      expect(highlightSearchTerm('Task 123', 'test')).toBe(false)
    })

    it('should handle empty search term', () => {
      expect(highlightSearchTerm('Hello World', '')).toBe(false)
    })

    it('should be case insensitive', () => {
      expect(highlightSearchTerm('Hello World', 'HELLO')).toBe(true)
      expect(highlightSearchTerm('TASK 123', 'task')).toBe(true)
    })
  })

  describe('validateTitle', () => {
    it('should return true for valid titles', () => {
      expect(validateTitle('New Task')).toBe(true)
      expect(validateTitle('Column 1')).toBe(true)
    })

    it('should return false for empty titles', () => {
      expect(validateTitle('')).toBe(false)
    })

    it('should return false for whitespace-only titles', () => {
      expect(validateTitle('   ')).toBe(false)
      expect(validateTitle('\n\t')).toBe(false)
    })
  })
})