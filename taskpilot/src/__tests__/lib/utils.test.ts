/**
 * Utils Tests - Utility Functions
 */
import { describe, it, expect, vi } from 'vitest'
import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn (classnames merge)', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base', isActive && 'active')
      expect(result).toBe('base active')
    })

    it('should handle false conditions', () => {
      const isActive = false
      const result = cn('base', isActive && 'active')
      expect(result).toBe('base')
    })

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2'])
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('should handle object notation', () => {
      const result = cn({ active: true, disabled: false })
      expect(result).toBe('active')
    })

    it('should merge Tailwind classes correctly', () => {
      // clsx + tailwind-merge should resolve conflicts
      const result = cn('px-4 py-2', 'px-8')
      expect(result).toBe('py-2 px-8')
    })

    it('should handle undefined and null', () => {
      const result = cn('base', undefined, null, 'end')
      expect(result).toBe('base end')
    })

    it('should handle empty strings', () => {
      const result = cn('base', '', 'end')
      expect(result).toBe('base end')
    })
  })
})

describe('Date Formatting', () => {
  // Import if your utils have date formatting
  it('should format dates correctly', () => {
    const date = new Date('2025-01-15T12:00:00Z')
    const formatted = date.toLocaleDateString('en-US')
    expect(formatted).toContain('2025')
  })

  it('should handle relative time', () => {
    const now = Date.now()
    const fiveMinutesAgo = now - 5 * 60 * 1000
    const diff = now - fiveMinutesAgo
    expect(diff).toBe(5 * 60 * 1000)
  })
})

describe('String Utilities', () => {
  it('should truncate long strings', () => {
    const long = 'This is a very long string that needs truncation'
    const truncated = long.length > 20 ? long.slice(0, 20) + '...' : long
    expect(truncated).toBe('This is a very long ...')
  })

  it('should slugify strings', () => {
    const title = 'Hello World Example'
    const slug = title.toLowerCase().replace(/\s+/g, '-')
    expect(slug).toBe('hello-world-example')
  })

  it('should sanitize HTML', () => {
    const dirty = '<script>alert("xss")</script>Hello'
    const clean = dirty.replace(/<[^>]*>/g, '')
    expect(clean).toBe('alert("xss")Hello')
  })
})

describe('Number Utilities', () => {
  it('should format currency', () => {
    const amount = 2900
    const formatted = (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    expect(formatted).toBe('$29.00')
  })

  it('should format percentages', () => {
    const progress = 0.75
    const formatted = `${Math.round(progress * 100)}%`
    expect(formatted).toBe('75%')
  })

  it('should clamp values', () => {
    const clamp = (val: number, min: number, max: number) =>
      Math.min(Math.max(val, min), max)

    expect(clamp(150, 0, 100)).toBe(100)
    expect(clamp(-10, 0, 100)).toBe(0)
    expect(clamp(50, 0, 100)).toBe(50)
  })
})

describe('Validation Utilities', () => {
  it('should validate email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    expect(emailRegex.test('test@example.com')).toBe(true)
    expect(emailRegex.test('invalid')).toBe(false)
    expect(emailRegex.test('no@domain')).toBe(false)
  })

  it('should validate password strength', () => {
    const hasMinLength = (pwd: string) => pwd.length >= 8
    const hasNumber = (pwd: string) => /\d/.test(pwd)
    const hasUppercase = (pwd: string) => /[A-Z]/.test(pwd)

    const password = 'MyPassword123'
    expect(hasMinLength(password)).toBe(true)
    expect(hasNumber(password)).toBe(true)
    expect(hasUppercase(password)).toBe(true)
  })

  it('should validate URL format', () => {
    const isValidUrl = (str: string) => {
      try {
        new URL(str)
        return true
      } catch {
        return false
      }
    }

    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('not-a-url')).toBe(false)
  })
})

describe('Array Utilities', () => {
  it('should chunk arrays', () => {
    const chunk = <T,>(arr: T[], size: number): T[][] => {
      const chunks: T[][] = []
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
      }
      return chunks
    }

    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('should unique arrays', () => {
    const unique = <T,>(arr: T[]): T[] => [...new Set(arr)]

    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })

  it('should group by key', () => {
    const groupBy = <T,>(arr: T[], key: keyof T): Record<string, T[]> => {
      return arr.reduce((groups, item) => {
        const val = String(item[key])
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
      }, {} as Record<string, T[]>)
    }

    const items = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
    ]

    const grouped = groupBy(items, 'type')
    expect(grouped['a']).toHaveLength(2)
    expect(grouped['b']).toHaveLength(1)
  })
})

describe('Object Utilities', () => {
  it('should deep clone objects', () => {
    const obj = { a: 1, b: { c: 2 } }
    const clone = JSON.parse(JSON.stringify(obj))

    clone.b.c = 3
    expect(obj.b.c).toBe(2)
  })

  it('should pick properties', () => {
    const pick = <T extends object, K extends keyof T>(
      obj: T,
      keys: K[]
    ): Pick<T, K> => {
      const result = {} as Pick<T, K>
      keys.forEach((key) => {
        if (key in obj) result[key] = obj[key]
      })
      return result
    }

    const user = { id: 1, name: 'John', password: 'secret' }
    const safe = pick(user, ['id', 'name'])

    expect(safe).toEqual({ id: 1, name: 'John' })
    expect('password' in safe).toBe(false)
  })

  it('should omit properties', () => {
    const omit = <T extends object, K extends keyof T>(
      obj: T,
      keys: K[]
    ): Omit<T, K> => {
      const result = { ...obj }
      keys.forEach((key) => {
        delete result[key]
      })
      return result
    }

    const user = { id: 1, name: 'John', password: 'secret' } as const
    type UserKeys = keyof typeof user
    const safe = omit(user, ['password'] as unknown as UserKeys[])

    expect('password' in safe).toBe(false)
  })
})
