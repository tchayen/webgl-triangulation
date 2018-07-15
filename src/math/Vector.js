/**
 * Adds two 2D vectors element-wise.
 * @param {Number[]} a 2D vector
 * @param {Number[]} b 2D vector
 */
const add2 = (a, b) => [a[0] + b[0], a[1] + b[1]]

/**
 * Subtracts two 2D vectors element-wise.
 * @param {Number[]} a 2D vector
 * @param {Number[]} b 2D vector
 */
const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]]

/**
 * Returns normalized (length == 1) 2D vector.
 * @param {Number[]} v 2D vector
 */
const normalize = v => {
  let w
  const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1])
  if (norm != 0) {
    w = [v[0] / norm, v[1] / norm]
    return w
  }
}

/**
 * Scales vector by given factor.
 * @param {Number[]} v 2D vector
 * @param {Number} s scale factor
 */
const scale = (v, s) => {
  let w
  const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1])
  if (norm != 0) {
    w = [v[0] / norm * s, v[1] / norm * s]
    return w
  }
}

/**
 * Calculates dot product of two 2D vectors.
 * @param {Number[]} a 2D vector
 * @param {Number[]} b 2D vector
 */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]

/**
 * Calculates conventional cross product of two 2D vectors defined as
 * determinant of matrix formed by storing those vectors column-wise to express
 * cross product.
 * @param {Number} a 2D vector
 * @param {Number} b 2D vector
 */
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]

const squaredDistance = (a, b) =>
  (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])

export {
  add2,
  sub2,
  normalize,
  scale,
  dot,
  cross,
  squaredDistance,
}
