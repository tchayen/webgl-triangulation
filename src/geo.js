/**
 * For more information, visit:
 * https://epsg.io/3857
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
 * http://oms.wff.ch/calc.php?baseurl=Standard&lat=50.01000&long=19.870000&longto=7.906000&latto=19.870000
 * http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection/
 * http://oms.wff.ch/calc.htm
 */

/**
 * Origin shift comes from the circumference of the Earth in meters (6378137)
 */
const originShift = 2.0 * Math.PI * 6378137 / 2.0

/**
 * Initial resolution is basis for pixel calculations
 */
const initialResolution = originShift * 2.0 / 256.0

/**
 * Converts longitude and latitude using **WGS84 Geodetic Datum** to meters using
 * Spherical Mercator projection, known oficially under **EPSG:3857** codename.
 * Bounds: `[-180.0, -85.06, 180.0, 85.06]`.
 * @param {Number} long longitude
 * @param {Number} lat latitude
 * @returns {Number[]} pair of meter coordinates
 */
const degreesToMeters = (long, lat) => {
  const x = long * originShift / 180
  const y = Math.log(Math.tan((90.0 + lat) * Math.PI / 360.0))
    / (Math.PI / 180.0) * originShift / 180.0

  return [x, y]
}

/**
 * Converts meters from **EPSG:3857** projection to **WGS84 Geodetic Datum**.
 * @param {Number} x meters on the X axis
 * @param {Number} y meters on the Y axis
 * @returns {Number[]} pair of degrees
 */
const metersToDegress = (x, y) => {
  const long = x *  180.0 / originShift
  const lat = Math.atan(Math.exp(y * Math.PI / originShift))
    * 360.0 / Math.PI - 90.0

  return [long, lat]
}

/**
 * Converts **EPSG:3857** to pixel coordinates based on provided zoom level.
 * @param {Number} x meters in **EPSG:3857**
 * @param {Number} y meters in **EPSG:3857**
 * @param {Number} zoom non-negative integer `[0-18]`, level of zoom
 * @returns {Number[]} pair of pixel coordinates
 */
const metersToPixels = (x, y, zoom) => {
  const resolution = initialResolution / Math.pow(2, zoom)
  const pixelX = (x + originShift) / resolution
  const pixelY = (y + originShift) / resolution

  return [pixelX, pixelY]
}

/**
 * Converts pixel coordinates to **EPSG:3857** based on provided zoom level.
 * @param {Number} x pixel coordinate
 * @param {Number} y pixel coordinate
 * @param {Number} zoom non-negative integer `[0-18]`, level of zoom
 * @returns {Number[]} pair of meter coordinates
 */
const pixelsToMeters = (x, y, zoom) => {
  const resolution = initialResolution / Math.pow(2, zoom)
  const meterX = x * resolution - originShift
  const meterY = y * resolution - originShift

  return [meterX, meterY]
}

/**
 * Convert Open Street Map tile coordinates on a given zoom level to **WGS84**
 * compliant degrees. Both x and y have range `[0, 2^zoom - 1]`. Using the
 * following bounds the whole map becomes one giant square.
 * @param {Number} x coordinate. Left edge is 180°W, right is 180°E.
 * @param {Number} y coordinate. Top edge is `85.0511°N`, bottom one is 85.0511°S.
 * @param {Number} zoom non-negative integer `[0-18]`, level of zoom
 * @returns {Number[]} pair of degrees
 */
const tileToDegrees = (x, y, zoom) => {
  const long = x / Math.pow(2, zoom) * 360.0 - 180.0
  const n = Math.PI - 2.0 * Math.PI * y / Math.pow(2, zoom)
  const lat = 180.0 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))

  return [long, lat]
}

/**
 * Convert **WGS84 Geodetic Datum** degrees to Open Street Map tile coordinates
 * with given zoom level. Both result coordinates come in range `[0, 2^zoom - 1]`.
 * @param {Number} lat latitude
 * @param {Number} long longitude
 * @param {Number} zoom non-negative integer `[0-18]`, level of zoom
 * @returns {Number[]} pair of integer coordinates
 */
const degreesToTile = (lat, long, zoom) => {
  tileX = Math.floor((long + 180.0) / 360.0 * Math.pow(2, zoom))
  tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180.0) + 1.0
    / Math.cos(lat * Math.PI / 180.0)) / Math.PI) / 2.0 * Math.pow(2, zoom))

  return [tileX, tileY]
}

export {
  degreesToMeters,
  metersToDegress,

  pixelsToMeters,
  metersToPixels,

  tileToDegrees,
  degreesToTile,
}
