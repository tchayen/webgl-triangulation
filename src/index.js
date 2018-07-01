import { setUpCanvas, createShader, createProgram } from './webgl'
import * as geo from './geo'
import '../public/style.scss'

debugger
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

const primitiveType = gl.TRIANGLES
const arrayOffset   = 0
const count         = 3            // Execute vertex shader 3 times
gl.drawArrays(primitiveType, arrayOffset, count)
