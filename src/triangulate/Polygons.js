import * as Vector from '../math/Vector'
import { PreviousMap } from '../../node_modules/postcss';

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
 * Checks if vertex `b` laying between `a` and `c` is reflex.
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
const sameSide = (p1, p2, a, b) =>
  Vector.cross(Vector.sub2(b, a), Vector.sub2(p1, a)) *
  Vector.cross(Vector.sub2(b, a), Vector.sub2(p2, a)) >= 0

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
 * @param {Number[][]} v source array of 2D vertices, is not used directly
 * @param {Number[]} vMap continuos array of vertices mapping to the real ones
 * @returns {Number[][]} array consisting of two arrays filled with **indices**
 */
const splitConvexAndReflex = (v, vMap) => {
  if (!vMap) vMap = v.map((_, i) => i)
  const reflex = []
  const convex = []
  const n = vMap.length

  for (let i = 0; i < vMap.length; i++) {
    if (isReflex(v[vMap[cyclic(i - 1, n)]], v[vMap[i]], v[vMap[cyclic(i + 1, n)]])) {
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
 * @param {Number[][]} v source array of 2D vertices, is not used directly
 * @param {Number[]} vMap continuos array of vertices mapping to the real ones
 * @returns {Number[]} array of **indices** from v
 */
const detectEars = (v, r, vMap) => {
  if (!vMap) vMap = v.map((_, i) => i)
  const ears = []
  const n = vMap.length

  for (let i = 0; i < n; i++) {
    if (r.indexOf(i) >= 0) continue

    let isEar = true
    for (let j = 0; j < n; j++) {
      // It is ok to skip reflex vertices and the ones that actually belong to
      // the triangle.
      if (
        r.indexOf(j) < 0 ||
        j === cyclic(i - 1, n) ||
        j === i ||
        j === cyclic(i + 1, n)
      ) continue

      // If triangle contains v[j], v[i] cannot be an ear tip.
      if (isInsideTriangle([v[vMap[cyclic(i - 1, n)]], v[vMap[i]], v[vMap[cyclic(i + 1, n)]]], v[vMap[j]])) {
        isEar = false
      }
    }
    if (isEar) ears.push(i)
  }
  return ears
}

// const combinePolygons = (outer, inners) => {
//   const inner = inners.shift()

//   // Find vertex `M` of maximum x-value.
//   let xMax = 0
//   let index
//   inner.forEach((v, i) => {
//     if (v[0] > xMax) {
//       xMax = v[0]
//       index = i
//     }
//   })
//   const m = outer[index]

//   // Find edge whose intersection with ray `M + t * (1, 0)` minimizes the ray
//   // parameter t >= 0.
//   let i = outer.length - 1, j = 0
//   while (j < outer.length) {
//     // Consider only edges which have its first vertex below and second above `M`.
//     const iDiff = [outer[i][0] - m[0], outer[i][1] - m[1]]
//     const jDiff = [outer[j][0] - m[0], outer[j][1] - m[1]]
//     if (iDiff[1] > 0 || jDiff[1] < 0) continue

//     let s, t
//     let v0Min, v1Min
//     let endMin
//     let currentEndMin = -1
//     if (iDiff[1] < 0) {
//       if (jDiff[1] > 0) {
//         s = iDiff[1] / (iDiff[1] - jDiff[1])
//         t = iDiff[0] + s * (jDiff[0] - iDiff[0])
//       } else { // jDiff[1] === 0
//         t = jDiff[0]
//         currentEndMin = j
//       }
//     } else { // iDiff[1] === 0
//       if (jDiff[1] > 0) {
//         t = iDiff[0]
//         currentEndMin = i
//       } else { // jDiff[1] === 0
//         if (iDiff[0] < jDiff[0]) {
//           t = iDiff[0]
//           currentEndMin = i
//         } else {
//           t = jDiff[0]
//           currentEndMin = j
//         }
//       }
//     }

//     if (0 <= t && t < intr[0]) {
//       intr[0] = t
//       v0Min = i
//       v1Min = j
//       // If `currentEndMin` === -1 then the current closest point is an
//       // edge-interior point. Otherwise it's a vertex.
//       endMin = currentEndMin
//     } else if (t === intr[0]) {
//       // Current closest point is a vertex shared by multiple edges. It means
//       // the endMin and currentMin refer to the same point.
//       if (endMin === -1 || currentEndMin === -1) throw 'Ooops'

//       const dotPerP = DotPerP()
//       if (dotPerP > 0) {
//         v0Min = i
//         v1Min = j
//         endMin = currentEndMin
//       }
//     }

//     i = j
//     i++
//   }
// }

/**
 *
 * @param {Number[][]} outer
 * @param {Number[][]} inner
 */
const combinePolygons = (outer, inners) => {
  debugger

  const inner = inners.shift()

  // 1. Find vertex `M` of maximum x-value.
  let xMax = 0
  let index
  inner.forEach((v, i) => {
    if (v[0] > xMax) {
      xMax = v[0]
      index = i
    }
  })

  const m = inner[index]
  let visible

  // 2. Find the edges that intersect with ray `M + t * (1, 0)`. Let `K` be the
  // closest visible point to `M` on this ray.
  let i = outer.length - 1, j = 0
  let k = []
  while (j < outer.length) {
    // Skip edges that does not have their first point below `M` and the second
    // one above.
    if (outer[i][1] > m[1] || outer[j][1] < m[1]) continue

    // Calculate simplified intersection of ray (1, 0) and [V_i, V_j] segment.
    const v1 = [m[0] - a[0], m[1] - a[1]]
    const v2 = [b[0] - a[0], b[1] - a[1]]
    const d = v2[1]
    const t1 = cross(v2, v1) / v2[1]
    const t2 = v1[1] / v2[1]

    if (t1 >= 0.0 && t2 >= 0.0 && t2 <= 1.0) {
      if (k === [] || t1 - m[0] < k[0]) k = [t1 + m[0], m[1]]
    } else {
      throw 'Cannot calculate intersection, problematic data'
    }

    i = j
    j += 1
  }

  // 3. If `K` is vertex of the outer polygon, `M` and `K` are mutually visible.
  outer.forEach(v => { if (v[0] === k[0] && v[1] === k[1]) visible = k })

  // 4. Otherwise, `K` is an interior point of the edge `[V_i, V_j]`. Find `P`
  // which is endpoint with greater x-value.
  let p = outer[i][0] > outer[j][0] ? outer[i] : outer[j]

  // 5. Check with all vertices of the outer polygon to be outside of the
  // triangle `[M, K, P]`. If it is true, `M` and `P` are mutually visible.
  if (outer.map(v => isInsideTriangle(m, k, p)).every()) visible = p

  // 6. Otherwise at least one reflex vertex lies in `[M, K, P]`. Search for the
  // array of reflex vertices `R` that minimizes the angle between `(1, 0)` and
  // line segment `[M, R]`. If there is exactly one vertex in `R` then they are
  // mutually visible. If there are multiple such vertices, pick the one closest
  // to `M`.
  visible = outer
    .filter(v => isInsideTriangle(m, k, p))
    .filter((v, i) => isReflex(v[cyclic[i - 1]], v[i], v[cyclic[i + 1]]))
    .sort((v, w) => Vector.squaredDistance(v, m) - Vector.squaredDistance(w, m))
    .shift()

  if (!visible) throw 'Could not find visible vertex'

}

/**
 * Adds vertices to make triangulation possible using regular ear cut.
 * @param {Number[][]} outer vertices of the outer polygon
 * @param {Number[][][]} inners array of arrays of vertices forming inner
 * polygons (holes)
 * @returns {Number[][]} `vertices` array with new vertices added to fix holes
 *
 * **Note:** _Holes should be clock-wise (opposed to CCW polygon) and not nested_
 */
const eliminateHoles = (outer, inners) => {
  let holes = inners.slice()

  // Sort holes by max x-value.
  holes = inners.sort((i, j) =>
    j.map(v => v[0]).reduce((a, b) => Math.max(a, b)) -
    i.map(v => v[0]).reduce((a, b) => Math.max(a, b)))

  combinePolygons(outer, holes)

  // Merge holes with outer polygon.
  // while (holes.length > 0) {
  // }

  return outer
}

/**
 * Polygon triangulation using ear cut approach based on the following paper:
 * https://www.geometrictools.com/Documentation/TriangulationByEarClipping.pdf
 * @param {Number[][]} vertices vertex array
 * @returns {Number[][]} array of threes (triangles) pointing to indices in the
 * `vertices` array
 */
const earCut = vertices => {
  const v = vertices
  let n = v.length
  if (n < 3) throw 'Cannot triangulate less than 3 vertices'
  const vMap = v.map((_, i) => i)

  let [c, r] = splitConvexAndReflex(v, vMap)
  let e = detectEars(v, r, vMap)

  const triangles = []

  //let i = 0
  while (vMap.length > 3) {
    //if (i >= e.length) i = 0

    const removed = e.shift()//splice(i, 1)
    triangles.push([
      vMap[cyclic(removed - 1, n)],
      vMap[removed],
      vMap[cyclic(removed + 1, n)],
    ])

    vMap.splice(removed, 1)
    n = n - 1

    let [_c, _r] = splitConvexAndReflex(v, vMap)
    c = _c
    r = _r

    e = detectEars(v, r, vMap)

    //i += 2
  }
  triangles.push([vMap[0], vMap[1], vMap[2]])
  return triangles
}

/**
 * Takes array of points and 'instruction' for constructing array of triangles.
 * Returns resolved, flat array of vertex coordinates.
 *
 * **Given:**
 *
 * `points = [[110, 54], [82, 243], [156, 120]]`
 *
 * `triangles = [[0, 1, 2]]`
 *
 * results in:
 *
 * `[110, 54, 82, 243, 156, 120]`
 *
 * @param {Number[]} points
 * @param {Number[][]} triangles array of threes (triangles) pointing to indices
 * in the `vertices` array
 * @returns {Number[]} array of vertex coordinates
 */
const resolveTriangleVertices = (points, triangles) => {
  const result = []
  triangles.forEach(t => {
    const color = Math.random() * 0.5
    t.forEach(i => result.push(...points[i], color))
  })
  return result
}

export {
  joinWithVectors,
  cyclic,
  sameSide,
  isInsideTriangle,
  splitConvexAndReflex,
  detectEars,
  isReflex,
  eliminateHoles,
  earCut,
  resolveTriangleVertices,
}
