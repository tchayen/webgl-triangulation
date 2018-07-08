import {
  cyclic,
  joinWithVectors,
  isReflex,
  sameSide,
  isInsideTriangle,
  splitConvexAndReflex,
  detectEars,
} from '../../src/triangulate/Polygons'

test('cyclic() works as intended', () => {
  expect(cyclic(1, 5)).toBe(1)
  expect(cyclic(4, 5)).toBe(4)
  expect(cyclic(6, 5)).toBe(1)
  expect(cyclic(-1, 5)).toBe(4)
  expect(cyclic(-5, 5)).toBe(0)
  expect(cyclic(-6, 5)).toBe(4)
})

test('joinWithVectors() works as intended', () => {
  expect(joinWithVectors([0, 0], [1, 1], [2, 0])).toEqual([[1, 1], [1, -1]])
})

test('isReflex() works as intended', () => {
  expect(isReflex([0, 0], [1, 1], [2, 0])).toBe(false)
  expect(isReflex([0, 0], [1, 0], [1, 1])).toBe(true)
})

test('sameSide() works as intended', () => {
  expect(sameSide([3, 1], [4, 2], [0, 0], [5, 3])).toBe(true)
})

test('isInsideTriangle() works as intended', () => {
  expect(isInsideTriangle([[2, 1], [5, 2], [5, 6]], [4, 3])).toBe(true)
})

test('splitConvexAndReflex() works as intended', () => {
  expect(false).toBe(true)
})

test('detectEars() works as intended', () => {
  expect(false).toBe(true)
})
