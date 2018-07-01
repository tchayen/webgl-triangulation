import { setUpCanvas, createShader, createProgram } from './webgl'
import * as geo from './geo'
import '../public/style.scss'

const krk = [[50.0, 19.85], [50.105, 20.13]]
krk.forEach(c => {
  const [c1, c2] = c
  c = [c2, c1]
  const m = geo.degreesToMeters(...c)
  const p = geo.metersToPixels(...m, 12)

  console.log(m, p)
})
console.log(geo.metersToPixels(...geo.degreesToMeters(19.9484548, 50.0488673), 12))
console.log(geo.metersToPixels(...geo.degreesToMeters(19.9954434, 50.0641602), 12))

// ...

// Consts
const width = window.innerWidth
const height = window.innerHeight
const scalingFactor = window.devicePixelRatio || 1

// Assets
const vertex = require('./shaders/vertex.glsl')
const fragment = require('./shaders/fragment.glsl')

const positions = [0, 0, 0, 1.0, 1.0, 0]

// Set ups
const canvas = setUpCanvas(width, height, scalingFactor)

const gl = canvas.getContext('webgl')
if (!gl) throw 'WebGL is not supported'

// Shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)

const program = createProgram(gl, vertexShader, fragmentShader)

// Atrributes buffer
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.useProgram(program)

gl.enableVertexAttribArray(positionAttributeLocation)

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
const size      = 2        // 2 components per iteration, i.e. for
                           // a {x, y, z, w} vector we provide only {x, y}, z
                           // and w will default to 0 and 1 respectively
const type      = gl.FLOAT // the data is 32 bit floats
const normalize = false    // don't normalize the data
const stride    = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset    = 0        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

const count         = 3 // Execute vertex shader 3 times
const arrayOffset   = 0
const primitiveType = gl.TRIANGLES
gl.drawArrays(primitiveType, arrayOffset, count)
