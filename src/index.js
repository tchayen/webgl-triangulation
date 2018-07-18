import * as WebGLUtils from './WebGLUtils'
import * as Geography from './Geography'
import * as Triangulate from './triangulate/Triangulate'
import * as Matrix from './math/Matrix'
import * as Vector from './math/Vector'
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

const a = [[[19.9230995, 50.0649971], [19.9230956, 50.0649849], [19.9231036, 50.0649835], [19.9230915, 50.0649505], [19.9230633, 50.0648647], [19.923055, 50.0648429], [19.9229992, 50.0646931], [19.9229579, 50.0646999], [19.922887, 50.0645009], [19.9229266, 50.064494], [19.9228184, 50.0642041], [19.9228041, 50.064206], [19.9227781, 50.06413], [19.9227722, 50.0641127], [19.9229126, 50.0640914], [19.9232824, 50.0640338], [19.9234229, 50.0640114], [19.9234578, 50.0641053], [19.9234468, 50.064107], [19.923553, 50.0643987], [19.9236302, 50.0643872], [19.9236463, 50.0644333], [19.9236193, 50.0644377], [19.9236271, 50.0644587], [19.9236556, 50.0644546], [19.9236625, 50.0644734], [19.9236347, 50.0644776], [19.9236426, 50.0644983], [19.9236706, 50.0644939], [19.9236776, 50.0645132], [19.9236499, 50.0645174], [19.9236571, 50.0645358], [19.9236847, 50.0645315], [19.9236906, 50.0645476], [19.9236875, 50.0645482], [19.9237001, 50.0645839], [19.9236262, 50.0645944], [19.9237332, 50.0648875], [19.9237443, 50.0648859], [19.9237807, 50.0649799], [19.9236384, 50.0650025], [19.9236374, 50.0649999], [19.9232656, 50.0650574], [19.9232665, 50.0650596], [19.9231281, 50.0650803], [19.9230995, 50.0649971]], [[19.9231874, 50.0646963], [19.9232541, 50.0648807], [19.9233601, 50.064864], [19.9233575, 50.0648568], [19.9233695, 50.0648418], [19.9234026, 50.0648362], [19.9234218, 50.0648465], [19.9234249, 50.0648545], [19.9235317, 50.0648381], [19.9234636, 50.0646537], [19.9234047, 50.0646624], [19.9233994, 50.0646689], [19.9233928, 50.0646747], [19.9233888, 50.0646781], [19.9233815, 50.0646829], [19.9233738, 50.0646869], [19.9233654, 50.0646903], [19.9233566, 50.0646934], [19.9233484, 50.0646955], [19.9233393, 50.0646973], [19.9233269, 50.0646987], [19.9233156, 50.0646992], [19.9233051, 50.0646988], [19.9232925, 50.0646973], [19.9232783, 50.0646944], [19.9232686, 50.0646913], [19.9232552, 50.0646857], [19.9231874, 50.0646963]], [[19.9230187, 50.0642415], [19.9230927, 50.0644247], [19.9231604, 50.0644139], [19.9231682, 50.0644049], [19.9231745, 50.0643992], [19.923185, 50.0643925], [19.9231951, 50.0643874], [19.9232041, 50.0643839], [19.9232144, 50.0643809], [19.9232265, 50.0643785], [19.9232359, 50.0643774], [19.9232445, 50.0643767], [19.9232547, 50.0643768], [19.9232645, 50.0643774], [19.9232742, 50.0643787], [19.9232842, 50.0643807], [19.9232902, 50.0643825], [19.9233002, 50.0643856], [19.9233096, 50.0643899], [19.923368, 50.06438], [19.9232953, 50.0641963], [19.923189, 50.0642137], [19.9231919, 50.0642217], [19.9231824, 50.0642365], [19.923149, 50.0642415], [19.9231276, 50.0642317], [19.9231248, 50.0642247], [19.9230187, 50.0642415]]]
const b = a[0]
  .map(e => Geography.degreesToMeters(e[0], e[1]))
  .map(e => [3 * (e[0] - 2217750), 3 * (e[1] - 6457350)])

// console.log(b)

Triangulate.Polygons.eliminateHoles(
  [[0, 30], [20, 0], [80, 0], [90, 40], [30, 70]],
  [
    [[20, 10], [20, 40], [50, 40]],
    [[60, 30], [70, 20], [50, 10]],
  ],
)

// ...

const linePoints = [[100, 300], [100, 250], [200, 320], [260, 350]]

console.log(Triangulate.Lines.normal(linePoints, 3.0))

const lineTriangles = Triangulate.Lines.miter(linePoints, 10.0)
const polygonPoints = b//[[50, 110], [150, 30], [240, 115], [320, 65], [395, 170], [305, 160], [265, 240], [190, 100], [95, 125], [100, 215]]
const triangulatedPolygon = Triangulate.Polygons.earCut(polygonPoints)
const polygonTriangles = new Float32Array(Triangulate.Polygons.resolveTriangleVertices(polygonPoints, triangulatedPolygon))

// console.log(polygonPoints.length, polygonTriangles.length / 6.0)

// ...

const fLetter = new Float32Array([
  0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,
  30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,
  30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
])

let positionLocation, resolutionLocation, matrixLocation

const translationVector = [0, 0]
const angleInRadians = 0
const scaleVector = [1, 1]

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
const drawScene = (gl, program, objects, constants, wireframe) => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  // gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(program)

  objects.forEach(object => {
    const { buffer, triangles } = object

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)

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

    console.log(object)
    gl.drawArrays(
      wireframe ? gl.LINE_STRIP : gl.TRIANGLES,// constants.primitiveType,
      constants.arrayOffset,
      object.triangles.length / 3,
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
  // WIP: changed to 3 to store color
  size: 3,
  // 0 = move forward size * sizeof(type) each iteration to get the next position
  stride: 0,
  arrayOffset: 0,
  primitiveType: gl.LINE_STRIP,
}

// Shaders
const vertexShader = WebGLUtils.createShader(gl, gl.VERTEX_SHADER, vertex)
const fragmentShader = WebGLUtils.createShader(gl, gl.FRAGMENT_SHADER, fragment)

const program = WebGLUtils.createProgram(gl, vertexShader, fragmentShader)

const objects = setupScene(gl, program, [/*lineTriangles*/, polygonTriangles])
drawScene(gl, program, objects, constants)
// drawScene(gl, program, objects, constants, true)
