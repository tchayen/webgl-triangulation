/**
 *
 * @param {[Number[]]} points array of 2D points
 * @returns {Number[]} array of triangle coordinates
 */
const triangularizeLine = points => {
  const triangles = []
  const addVec2 = (a, b) => [a[0] + b[0], a[1] + b[1]]
  let i = 0
  while (i <= points.length - 2) {
    const dx = points[i + 1][0] - points[i][0]
    const dy = points[i + 1][1] - points[i][1]

    const length = Math.sqrt(dx * dx + dy * dy) / 4.0

    const n1 = [dy / length, -dx / length]
    const n2 = [-dy / length, dx / length]

    triangles.push(
      ...addVec2(points[i + 1], n2),
      ...addVec2(points[i], n2),
      ...addVec2(points[i], n1),

      ...addVec2(points[i], n1),
      ...addVec2(points[i + 1], n1),
      ...addVec2(points[i + 1], n2),
    )
    i += 1
  }
  return new Float32Array(triangles)
}

export {
  triangularizeLine,
}
