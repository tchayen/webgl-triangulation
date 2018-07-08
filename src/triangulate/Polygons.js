import * as Vector from '../math/Vector'

/**
 * Return new index based on `i` from `n`-element array as if it was cyclic.
 * @param {Number} i index
 * @param {Number} n size of array
 * @returns {Number} new index
 */
const cyclic = (i, n) => (i % n + n) % n

/**
 * Takes array of vertices and returns array of vectors joining them in order.
 * @param {Number[]} vertices accepts variable number of vertices
 * @returns {Number[][]} array of vectors
 */
const joinWithVectors = (...vertices) => {
  if (vertices.length < 2) throw 'Not enough vertices'

  const vectors = []
  for (let i = 1; i < vertices.length; i++) {
    vectors.push([
      vertices[i][0] - vertices[i - 1][0],
      vertices[i][1] - vertices[i - 1][1],
    ])
  }
  return vectors
}

/**
 * Checks if vertex between two others is reflex.
 *
 * ### Explanation
 * Given three consecutive vertices in counter clockwise order, the inside of
 * the polygon lies to the left.
 * For given `[a, b, c]` points we can calculate vectors `[s, t]` joining them.
 * If we calculate cross product it will be positive if vertices form a left
 * turn and negative otherwise.
 *
 * Refer to: https://stackoverflow.com/a/40411577
 *
 * @param {Number[]} a 2D point
 * @param {Number[]} b 2D point
 * @param {Number[]} c 2D point
 * @returns {Boolean} true or false
 */
const isReflex = (a, b, c) => Vector.cross(Vector.sub2(b, a), Vector.sub2(c, b)) < 0

/**
 * Checks whether given point `p1` lies on the same side of **AB** as `p2`.
 *
 * ### Explanation
 * The solution in 3D uses real 3D cross product and then takes dot product of
 * the vectors.
 *
 * In 2D, taking 3D cross product with 0-filled z-axis (like: `[a, b, 0]`)
 * results in two first coordinates zeroed no matter their value: `[0, 0, c]`.
 * Therefore, the dot product of those two cross products in no more, no less,
 * simple 1D multiplication.
 *
 * @param {Number[]} p1 tested point
 * @param {Number[]} p2 point on the _correct_ side of **AB**
 * @param {Number[]} a start of the segment
 * @param {Number[]} b end of the segment
 */
const sameSide = (p1, p2, a, b) => {
  const cp1 = Vector.cross(Vector.sub2(b, a), Vector.sub2(p1, a))
  const cp2 = Vector.cross(Vector.sub2(b, a), Vector.sub2(p2, a))

  return cp1 * cp2 >= 0
}

/**
 * Checks if given point `p` lies inside triangle `t`.
 *
 * ### Explanation
 * Any point `p` where `cross(b-a, p-a)` does not point in the same
 * direction as `cross(b-a, c-a)` isn't inside the triangle. If the cross
 * products do point in the same direction, then we need to test `p` with the
 * other lines as well. If the point was on the same side of **AB** as **C** and
 * is also on the same side of **BC** as **A** and on the same side of **CA** as
 * **B**, then it is in the triangle.
 *
 * Refer to: http://blackpawn.com/texts/pointinpoly/default.html
 *
 * @param {Number[][]} t triangle of 2D vertices
 * @param {Number[]} p point
 * @returns {Boolean} true or false
 */
const isInsideTriangle = (t, p) =>
  sameSide(p, t[0], t[1], t[2]) &&
  sameSide(p, t[1], t[0], t[2]) &&
  sameSide(p, t[2], t[0], t[1])

/**
 * Split array of vertices into two: one containing reflex and the other convex
 * vertices.
 *
 * **reflex vertex** – one for which the interior angle formed by the two edges
 * sharing it is larger than 180 degrees.
 *
 * **convex vertex** – one failing to be reflex one.
 *
 * @param {Number[][]} v array of 2D vertices
 * @returns {Number[][]} array consisting of two arrays filled with **indices**
 */
const splitConvexAndReflex = v => {
  const reflex = []
  const convex = []
  const n = v.length

  for (let i = 0; i < v.length; i++) {
    if (isReflex(v[cyclic(i - 1, n)], v[i], v[cyclic(i + 1, n)])) {
      reflex.push(i)
    } else {
      convex.push(i)
    }
  }
  return [convex, reflex]
}

/**
 * Returns array of vertices filtered to contain only ear tips.
 *
 * **ear of a polygon** – a triangle formed by three consecutive vertices
 * `v[i-1]`, `v[i]`, `v[i+1]`, for which `v[i]` is a convex vertex, the line
 * segment from `v[i-1]` to `v[i+1]` lies completely inside the polygon and
 * no vertices of the polygon are contained in the triangle other than the three
 * vertcies of the triangle.
 *
 * @param {Number[][]} v array of 2D vertices
 * @returns {Number[]} array of **indices** from v
 */
const detectEars = (v, r) => {
  const ears = []
  const n = v.length

  for (let i = 0; i < n; i++) {
    let isEar = true
    for (let j = 0; j < n; j++) {
      if (r.indexOf(j) < 0) continue
      if (j === cyclic(i - 1, n) || j === i || j === cyclic(i + 1, n)) continue
      if (isInsideTriangle([v[cyclic(i - 1, n)], v[i], v[cyclic(i + 1, n)]], v[j])) {

        // console.log(`triangle [${cyclic(i - 1, n)}, ${i}, ${cyclic(i + 1, n)}] has ${j} inside, therefore ${i} is not ear tip`)

        isEar = false
      }
    }
    if (isEar) {
      ears.push(i)
    }
  }
  return ears
}

/**
 * Polygon triangulation using ear cut approach based on the following paper:
 * https://www.geometrictools.com/Documentation/TriangulationByEarClipping.pdf
 * @param {Number[]} vertices vertex array. **NOTE:** _must be flattened_
 * @returns {Number[][]} array of triangle indices arrays
 */
const earCut = vertices => {
  const v = vertices
  const n = v.length
  let [c, r] = splitConvexAndReflex(v)
  let e = detectEars(v, r)
  const triangles = []

  // console.log('v', v)
  // console.log('r', r)
  // console.log('c', c)
  // console.log('e', e)

  // while (e.length > 0) {
  //   const removed = e.shift()
  //   triangles.push(cyclic(removed - 1, n), removed, cyclic(removed + 1, n))
  //   v.splice(removed, 1)
  //   [c, r] = splitConvexAndReflex(v)
  //   e = detectEars(v)
  // }

  return triangles
}

export {
  joinWithVectors,
  cyclic,
  sameSide,
  isInsideTriangle,
  splitConvexAndReflex,
  detectEars,
  isReflex,
  earCut,
}