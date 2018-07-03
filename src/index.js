import * as Utils from './webgl'
import * as Geography from './geography'
import * as Geometry from './geometry'
import * as Matrix from './matrix'
import '../public/style.scss'

// console.log(Geography.metersToPixels(...Geography.degreesToMeters(19.9484548, 50.0488673), 12))
// console.log(Geography.metersToPixels(...Geography.degreesToMeters(19.9954434, 50.0641602), 12))

// ...

// Consts
const width = window.innerWidth
const height = window.innerHeight
const scalingFactor = window.devicePixelRatio || 1

// Assets
const vertex = require('./shaders/vertex.glsl')
const fragment = require('./shaders/fragment.glsl')

// ...

const points = [[100, 100], [100, 200],
                [200, 300], [260, 350],
                [300, 310], [400, 300],
                [400, 100], [460, 120],
                [500, 200], [600, 300]]

const triangles = Geometry.triangularizeLineMiter(points, 12.0)

// ...

const fLetter = new Float32Array([
  0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,
  30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,
  30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
])

let positionLocation, positionBuffer, resolutionLocation, colorLocation, matrixLocation

const translationVector = [0, 0]
const angleInRadians = 0
const scaleVector = [1, 1]
const color = [Math.random(), Math.random(), Math.random(), 1]

/**
 *
 * @param {Object} gl WebGL context
 * @param {Object} program linked shaders
 */
const setupScene = (gl, program) => {
  positionLocation = gl.getAttribLocation(program, 'a_position')

  resolutionLocation = gl.getUniformLocation(program, "u_resolution")
  colorLocation      = gl.getUniformLocation(program, "u_color")
  matrixLocation     = gl.getUniformLocation(program, "u_matrix")

  positionBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, triangles, gl.STATIC_DRAW)
  gl.clearColor(0, 0, 0, 0)
}

/**
 *
 * @param {Object} gl WebGL context
 * @param {Object} program linked shaders
 */
const drawScene = (gl, program) => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(program)

  gl.enableVertexAttribArray(positionLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const size      = 2        // 2 components per iteration, i.e. for
                             // a {x, y, z, w} vector we provide only {x, y}, z
                             // and w will default to 0 and 1 respectively
  const type      = gl.FLOAT // the data is 32 bit floats
  const normalize = false    // don't normalize the data
  const stride    = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset    = 0        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)

  gl.uniform4fv(colorLocation, color)

  const matrix = Matrix.calculateSRTP(
    [gl.canvas.clientWidth, gl.canvas.clientHeight],
    translationVector,
    scaleVector,
    angleInRadians,
  )

  gl.uniformMatrix3fv(matrixLocation, false, matrix)

  const count         = 6 * (points.length - 1) // Execute vertex shader n times
  const arrayOffset   = 0
  const primitiveType = gl.TRIANGLES
  gl.drawArrays(primitiveType, arrayOffset, count)
}

// Set ups
const canvas = Utils.setUpCanvas(width, height, scalingFactor)

const gl = canvas.getContext('webgl')
if (!gl) throw 'WebGL is not supported'

// Shaders
const vertexShader = Utils.createShader(gl, gl.VERTEX_SHADER, vertex)
const fragmentShader = Utils.createShader(gl, gl.FRAGMENT_SHADER, fragment)

const program = Utils.createProgram(gl, vertexShader, fragmentShader)

setupScene(gl, program)
drawScene(gl, program)
