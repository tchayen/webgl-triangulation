import {
  joinWithVectors,
  cyclic,
  sameSide,
  isInsideTriangle,
  splitConvexAndReflex,
  detectEars,
  isReflex,
  earCut,
  eliminateHoles,
} from '../../src/triangulate/Polygons'

const vertices = [[50, 110], [150, 30], [240, 115], [320, 65], [395, 170], [305, 160], [265, 240], [190, 100], [95, 125], [100, 215]]
const convex = [0, 1, 3, 4, 6, 9]
const reflex = [2, 5, 7, 8]
const ears = [3, 4, 6, 9]
const triangles = [[2, 3, 4], [4, 5, 6], [2, 4, 6], [2, 6, 7], [1, 2, 7], [0, 1, 7], [0, 7, 8], [0, 8, 9]]
const polygonWithHoles = [
  [[0, 30], [20, 0], [80, 0], [90, 40], [30, 70]],
  [
    [[20, 10], [20, 40], [50, 40]],
    [[60, 30], [70, 20], [50, 10]],
  ]]
const polygonWithEliminatedHoles = [
  [ 0, 30], [20,  0], [80,  0], [90, 40],
  [70, 20], [50, 10], [60, 30], [70, 20],
  [90, 40], [50, 40], [20, 10], [20, 40],
  [50, 40], [90, 40], [30, 70],
]

describe('cyclic() works as intended', () => {
  test('Regular index works as identity', () => {
    expect(cyclic(1, 5)).toBe(1)
  })

  test('Value from upper edge of range is not changed', () => {
    expect(cyclic(4, 5)).toBe(4)
  })

  test('Value above the range is reduced correctly', () => {
    expect(cyclic(6, 5)).toBe(1)
  })

  test('Negative value preserves cyclic behavior', () => {
    expect(cyclic(-1, 5)).toBe(4)
  })

  test('Negative edge values are correct', () => {
    expect(cyclic(-5, 5)).toBe(0)
  })

  test('Shift after crossing edge on the negative range is correct', () => {
    expect(cyclic(-6, 5)).toBe(4)
  })
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
  const v = vertices
  expect(isInsideTriangle([v[0], v[1], v[2]], v[7])).toBe(true)
  expect(isInsideTriangle([v[0], v[1], v[2]], v[5])).toBe(false)
})

test('splitConvexAndReflex() works as intended', () => {
  expect(splitConvexAndReflex([[0, 0], [2, 3], [4, 2], [0, 7]])).toEqual([[0, 2, 3], [1]])
  expect(splitConvexAndReflex(vertices)).toEqual([convex, reflex])
})

test('detectEars() works as intended', () => {
  expect(detectEars(vertices, reflex)).toEqual(ears)
})

test('earCut() works as intended', () => {
  expect(earCut(vertices)).toEqual(triangles)
})

test('eliminateHoles() works as intended', () => {
  expect(
    eliminateHoles(polygonWithHoles[0], polygonWithHoles[1]))
      .toEqual(polygonWithEliminatedHoles)
})
