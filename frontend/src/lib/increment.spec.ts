import { expect, test } from 'vitest'
import { increment } from './increment'

test('increment by 1', () => {
    const a = 10;
    expect(increment(a)).toBe(a + 1)
})

test('increment by 23', () => {
    const a = 10;
    const i = 23;
    expect(increment(a, i)).toBe(a + i)
})