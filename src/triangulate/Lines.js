import * as Vector from 'math/Vector'

/**
 * Pushes coordinates of two triangles (line segment) to given `triangles` array.
 * @param {Number[]} triangles flat array of triangle coordinates
 * @param {Number[]} p1 point (2D vector)
 * @param {Number[]} p2 point (2D vector)
 * @param {Number[][]} normals two normals of the line constructed from the points
 * @param {Number} width width of the line
 */
const addTriangles = (triangles, p1, p2, normals, width) => {
  triangles.push(
    ...Vector.add2(p2, Vector.scale(normals[1], width)),
    ...Vector.add2(p1, Vector.scale(normals[1], width)),
    ...Vector.add2(p1, Vector.scale(normals[0], width)),

    ...Vector.add2(p1, Vector.scale(normals[0], width)),
    ...Vector.add2(p2, Vector.scale(normals[0], width)),
    ...Vector.add2(p2, Vector.scale(normals[1], width)),
  )
}

/**
 * Triangulates line with no joins (using only normals).
 * @param {Number[][]} points array of 2D points
 * @param {Number} width width of the line
 * @returns {Number[]} array of triangle coordinates
 */
const normal = (points, width) => {
  // Make width equal to half of itself since it will used as distance from
  // middle of the line
  width /= 2.0

  const triangles = []
  let i = 0
  while (i <= points.length - 2) {
    const dx = points[i + 1][0] - points[i][0]
    const dy = points[i + 1][1] - points[i][1]

    const normals = [
      Vector.normalize([dy, -dx]),
      Vector.normalize([-dy, dx]),
    ]

    addTriangles(triangles, points[i], points[i + 1], normals, width)
    i += 1
  }
  return new Float32Array(triangles)
}

/**
 * Triangulates line using miter joins. Has no vertex overhead.
 * @param {Number[][]} points array of 2D points
 * @param {Number[]} width width of the line
 * @returns {Number[]} array of triangle coordinates
 */
const miter = (points, width) => {
  // Make width equal to half of itself since it will used as distance from
  // middle of the line
  width /= 2.0

  const triangles = []
  let dx = [], dy = [], normals = [], miter = []

  // Uses simple calculation of 90° rotation.
  const calculateNormals = (x, y) => [
    Vector.normalize([y, -x]),
    Vector.normalize([-y, x]),
  ]

  const lineDistance = (p0, p1) => [p1[0] - p0[0], p1[1] - p0[1]]

  // Calculate first point (being an edge case).
  dx[1] = points[1][0] - points[0][0]
  dy[1] = points[1][1] - points[0][1]

  normals[1] = calculateNormals(dx[1], dy[1])

  // Use first normal as a 'neutral element' for miter join.
  miter[1] = Vector.scale(normals[1][0], width)

  let i = 1
  while (i < points.length - 1) {
    // Shift calculated values.
    dx[0] = dx[1]; dy[0] = dy[1]; normals[0] = normals[1]; miter[0] = miter[1]

    dx[1] = points[i + 1][0] - points[i][0]
    dy[1] = points[i + 1][1] - points[i][1]

    normals[1] = calculateNormals(dx[1], dy[1])

    // Find tangent vector to both lines in the middle point.
    const tangent = Vector.normalize(
      Vector.add2(
        Vector.normalize(Vector.sub2(points[i + 1], points[i])),
        Vector.normalize(Vector.sub2(points[i], points[i - 1])),
      )
    )

    // Miter vector is perpendicular to the tangent and crosses extensions of
    // normal-translated lines in miter join points.
    const unitMiter = [-tangent[1], tangent[0]]

    // Length of the miter vector projected onto one of the normals.
    // Choice of normal is arbitrary, each of them would work.
    const miterLength = width / Vector.dot(unitMiter, normals[0][0])
    miter[1] = Vector.scale(unitMiter, miterLength)

    triangles.push(
      ...Vector.sub2(points[i], miter[1]),
      ...Vector.sub2(points[i - 1], miter[0]),
      ...Vector.add2(points[i - 1], miter[0]),

      ...Vector.add2(points[i - 1], miter[0]),
      ...Vector.add2(points[i], miter[1]),
      ...Vector.sub2(points[i], miter[1]),
    )
    i += 1
  }

  // Use last normal as another 'neutral element' for miter join.
  const size = points.length
  triangles.push(
    ...Vector.sub2(points[size - 1], Vector.scale(normals[1][0], width)),
    ...Vector.sub2(points[size - 2], miter[1]),
    ...Vector.add2(points[size - 2], miter[1]),

    ...Vector.add2(points[size - 2], miter[1]),
    ...Vector.add2(points[size - 1], Vector.scale(normals[1][0], width)),
    ...Vector.sub2(points[size - 1], Vector.scale(normals[1][0], width)),
  )

  return new Float32Array(triangles)
}

/**
 * Triangulates line using bevel joins. Adds one triangle per join.
 * @param {Number[][]} points array of 2D points
 * @param {Number[]} width width of the line
 * @returns {Number[]} array of triangle coordinates
 */
const bevel = (points, width) => {
  throw 'Not implemented'
}

/**
 * Triangulates line using rounded joins. Has biggest vertex overhead, adds
 * `n + 1` triangles where `n` is number of triangle fan divisions.
 * @param {Number[][]} points array of 2D points
 * @param {Number[]} width width of the line
 * @param {Number} divisions specifies number of divisions for creating triangle
 * fan. Has minimum of `1` and no maximum. Increase carefully.
 * @returns {Number[]} array of triangle coordinates
 */
const round = (points, divisions, width) => {
  throw 'Not implemented'
}

export { normal, miter, bevel, round }
