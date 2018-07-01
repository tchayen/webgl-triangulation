const setUpCanvas = (width, height, scalingFactor) => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', scalingFactor * width)
  canvas.setAttribute('height', scalingFactor * height)
  canvas.setAttribute('style', `width: ${width}px; height: ${height}px`)
  document.body.appendChild(canvas)

  return canvas
}

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) return shader

  console.error(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) return program

  console.error(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

export {
  setUpCanvas,
  createShader,
  createProgram,
}
