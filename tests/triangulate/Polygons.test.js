import {
  joinWithVectors,
  cyclic,
  sameSide,
  isInsideTriangle,
  splitConvexAndReflex,
  detectEars,
  isReflex,
  earCut,
} from '../../src/triangulate/Polygons'

const v = [[50, 110], [150, 30], [240, 115], [320, 65], [395, 170], [305, 160], [265, 240], [190, 100], [95, 125], [100, 215]]
const c = [0, 1, 3, 4, 6, 9]
const r = [2, 5, 7, 8]
const e = [3, 4, 6, 9]
const t = [[2, 3, 4], [2, 4, 5], [2, 5, 6], [2, 6, 7], [1, 2, 7], [0, 1, 7], [0, 7, 8], [0, 8, 9]]

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
  expect(isReflex([0, 0], [1, 1], [2, 0])).toBe(true)
  expect(isReflex([0, 0], [1, 0], [1, 1])).toBe(false)
})

test('sameSide() works as intended', () => {
  expect(sameSide([3, 1], [4, 2], [0, 0], [5, 3])).toBe(true)
})

test('isInsideTriangle() works as intended', () => {
  expect(isInsideTriangle([v[0], v[1], v[2]], v[7])).toBe(true)
  expect(isInsideTriangle([v[0], v[1], v[2]], v[5])).toBe(false)
  expect(isInsideTriangle([v[0], v[1], v[2]], v[5])).toBe(false)
})

test('splitConvexAndReflex() works as intended', () => {
  expect(splitConvexAndReflex([[0, 0], [2, 3], [4, 2], [0, 7]])).toEqual([[0, 2, 3], [1]])
  expect(splitConvexAndReflex(v)).toEqual([c, r])
})

test('detectEars() works as intended', () => {
  expect(detectEars(v, r)).toEqual(e)
})

test('earCut() works as intended', () => {
  expect(earCut(v)).toEqual(t)
})
