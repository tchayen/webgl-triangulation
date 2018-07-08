import * as WebGLUtils from './WebGLUtils'
import * as Geography from './Geography'
import * as Triangulate from './triangulate/Triangulate'
import * as Matrix from './math/Matrix'
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

const linePoints = [[100, 300], [100, 250], [200, 320], [260, 350], [300, 310], [450, 300], [400, 100], [600, 120], [500, 160], [515, 175], [550, 200], [600, 300]]
const lineTriangles = Triangulate.Lines.miter(linePoints, 10.0)
const polygonPoints = [[50, 110], [150, 30], [240, 115], [320, 65], [395, 170], [305, 160], [265, 240], [190, 100], [95, 125], [100, 215]]
const triangulatedPolygon = Triangulate.Polygons.earCut(polygonPoints)
const polygonTriangles = new Float32Array(Triangulate.Polygons.resolveTriangleVertices(polygonPoints, triangulatedPolygon))

// ...

const fLetter = new Float32Array([
  0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,
  30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,
  30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
])

let positionLocation, resolutionLocation, colorLocation, matrixLocation

const translationVector = [0, 0]
const angleInRadians = 0
const scaleVector = [1, 1]
const color = [0, 0, 0, 1]

/**
 * A bunch of initialization commands. It's not a real setup, you know...
 * @param {Object} gl WebGL context
 * @param {Object} program linked shaders
 * @param {Object[]} objects objects (flat arrays of vertices) to draw
 * @returns {Object[]} objects containing WebGL buffers and matching vertex arrays
 */
const setupScene = (gl, program, objects) => {
  positionLocation = gl.getAttribLocation(program, 'a_position')

  // Set uniforms.
  resolutionLocation = gl.getUniformLocation(program, "u_resolution")
  colorLocation      = gl.getUniformLocation(program, "u_color")
  matrixLocation     = gl.getUniformLocation(program, "u_matrix")

  // Set up data in buffers.
  const resultObjects = []
  objects.forEach(object => {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, object, gl.STATIC_DRAW)
    resultObjects.push({
      buffer,
      triangles: object,
    })
  })
  gl.clearColor(0, 0, 0, 0)

  return resultObjects
}

/**
 * Draw scene – enable vertex attribute, calculate scale-rotate-translate-projection
 * matrix, call `gl.drawArrays`.
 * @param {Object} gl WebGL context
 * @param {Object} program linked shaders
 * @param {Object} objects objects containg triangle data and initialized buffers
 * @param {Object} constants set of configuration constants to use for rendering
 */
const drawScene = (gl, program, objects, constants) => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(program)

  objects.forEach(object => {
    const { buffer, triangles } = object

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
    gl.uniform4fv(colorLocation, color)

    const matrix = Matrix.calculateSRTP(
      [gl.canvas.clientWidth, gl.canvas.clientHeight],
      translationVector,
      scaleVector,
      angleInRadians,
    )

    gl.uniformMatrix3fv(matrixLocation, false, matrix)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(
      positionLocation,
      constants.size,
      constants.type,
      constants.normalize,
      constants.stride,
      constants.offset,
    )

    gl.drawArrays(
      constants.primitiveType,
      constants.arrayOffset,
      object.triangles.length / 2,
    )
  })
}

// Set ups
const canvas = WebGLUtils.setUpCanvas(width, height, scalingFactor)

const gl = canvas.getContext('webgl')
if (!gl) throw 'WebGL is not supported'

const constants = {
  type: gl.FLOAT,
  // Normalization means translating value in any type to [-1.0, 1.0] range
  // based on the range this given type has.
  normalize: false,
  // Start at the beginning of the buffer.
  offset: 0,
  // 2 components per iteration, i.e. for
  // a {x, y, z, w} vector we provide only {x, y}, z
  // and w will default to 0 and 1 respectively.
  size: 2,
  // 0 = move forward size * sizeof(type) each iteration to get the next position
  stride: 0,
  arrayOffset: 0,
  primitiveType: gl.TRIANGLES,
}

// Shaders
const vertexShader = WebGLUtils.createShader(gl, gl.VERTEX_SHADER, vertex)
const fragmentShader = WebGLUtils.createShader(gl, gl.FRAGMENT_SHADER, fragment)

const program = WebGLUtils.createProgram(gl, vertexShader, fragmentShader)

const objects = setupScene(gl, program, [lineTriangles, polygonTriangles])
drawScene(gl, program, objects, constants)
