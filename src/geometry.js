import * as Vector from './vector'

/**
 *
 * @param {Number[][]} points array of 2D points
 * @param {Number} width width of the line
 * @returns {Number[]} array of triangle coordinates
 */
const triangularizeLine = (points, width) => {
  const triangles = []
  let i = 0
  while (i <= points.length - 2) {
    const dx = points[i + 1][0] - points[i][0]
    const dy = points[i + 1][1] - points[i][1]

    const length = Math.sqrt(dx * dx + dy * dy) / width * 2.0

    const n1 = [dy / length, -dx / length]
    const n2 = [-dy / length, dx / length]

    triangles.push(
      ...Vector.add2(points[i + 1], n2),
      ...Vector.add2(points[i], n2),
      ...Vector.add2(points[i], n1),

      ...Vector.add2(points[i], n1),
      ...Vector.add2(points[i + 1], n1),
      ...Vector.add2(points[i + 1], n2),
    )
    i += 1
  }
  return new Float32Array(triangles)
}

/**
 * Triangularizes line
 * @param {Number[][]} points array of 2D points
 * @param {Number[]} width width of the line
 * @returns {Number[]} array of triangle coordinates
 */
const triangularizeLineMiter = (points, width) => {
  const triangles = []
  let dx = [], dy = [], n = []

  const addTriangles = (p1, p2, n) => {
    triangles.push(
      ...Vector.add2(p2, Vector.setLength(n[1], width)),
      ...Vector.add2(p1, Vector.setLength(n[1], width)),
      ...Vector.add2(p1, Vector.setLength(n[0], width)),

      ...Vector.add2(p1, Vector.setLength(n[0], width)),
      ...Vector.add2(p2, Vector.setLength(n[0], width)),
      ...Vector.add2(p2, Vector.setLength(n[1], width)),
    )
  }

  // uses simple calculation of 90° rotation
  const calculateNormals = () => [
    Vector.normalize([dy[1], -dx[1]]),
    Vector.normalize([-dy[1], dx[1]]),
  ]

  // Calculate first point (being an edge case)
  dx[1] = points[1][0] - points[0][0]
  dy[1] = points[1][1] - points[0][1]
  n[1] = calculateNormals()

  let i = 1
  while (i < points.length - 2) {
    dx[0] = dx[1]; dy[0] = dy[1]; n[0] = n[1]

    dx[1] = points[i + 1][0] - points[i][0]
    dy[1] = points[i + 1][1] - points[i][1]

    n[1] = calculateNormals()

    const tangent = Vector.normalize(
      Vector.add2(
        Vector.normalize(Vector.sub2(points[i + 1], points[i])),
        Vector.normalize(Vector.sub2(points[i], points[i - 1])),
      )
    )

    const miter = [-tangent[1], tangent[0]]

    // Choice of normal is arbitrary, each of them would work
    const miterLength = width / Vector.dot(miter, n[0][0])

    console.log(points[i - 1], points[i], points[i + 1], tangent, miter, miterLength)

    triangles.push(
      ...Vector.add2(points[i], Vector.setLength(n[0][1], width)),
      ...Vector.add2(points[i - 1], Vector.setLength(n[0][1], width)),
      ...Vector.add2(points[i - 1], Vector.setLength(n[0][0], width)),

      ...Vector.add2(points[i - 1], Vector.setLength(n[0][0], width)),
      ...Vector.add2(points[i], Vector.setLength(n[0][0], width)),
      ...Vector.add2(points[i], Vector.setLength(n[0][1], width)),
    )
    i += 1
  }

  // Process the last two points
  const size = points.length
  addTriangles(points[size - 3], points[size - 2], n[1])

  dx[1] = points[size - 1][0] - points[size - 2][0]
  dy[1] = points[size - 1][1] - points[size - 2][1]
  n[1] = calculateNormals()

  addTriangles(points[size - 2], points[size - 1], n[1])

  return new Float32Array(triangles)
}

export {
  triangularizeLine,
  triangularizeLineMiter,
}
