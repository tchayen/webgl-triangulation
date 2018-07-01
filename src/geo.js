/**
 * For more information, visit:
 * https://epsg.io/3857
 * http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection/
 */

/**
 * Origin shift, which equals to 20037508.342789244, comes from the
 * circumference of the Earth in meters
 */
const originShift = 2.0 * Math.PI * 6378137 / 2.0

const initialResolution = originShift * 2.0 / 256.0
/**
 * Converts longitude and latitude using WGS84 Geodetic Datum to meters using
 * Spherical Mercator projection, known oficially under EPSG:3857 codename.
 * Bounds: [-180.0, -85.06, 180.0, 85.06]
 * @param {Number} lon longitude
 * @param {Number} lat latitude
 */
const degreesToMeters = (lon, lat) => {
  const x = lon * originShift / 180
  const y = Math.log(Math.tan((90.0 + lat) * Math.PI / 360.0))
    / (Math.PI / 180.0) * originShift / 180.0

  return [x, y]
}

/**
 * Converts meters from EPSG:3857 projection to WGS84 Geodetic Datum.
 * @param {Number} x meters on the X axis
 * @param {Number} y meters on the Y axis
 */
const metersToDegress = (x, y) => {
  const lon = x *  180.0 / originShift
  const lat = Math.atan(Math.exp(y * Math.PI / originShift))
    * 360.0 / Math.PI - 90.0

  return [lon, lat]
}

/**
 * Converts EPSG:3857 to pixel coordinates based on provided zoom level
 * @param {Number} x meters in EPSG:3857
 * @param {Number} y meters in EPSG:3857
 * @param {Number} zoom non-negative integer, level of zoom
 */
const metersToPixels = (x, y, zoom) => {
  const resolution = initialResolution / Math.pow(2, zoom)
  const pixelX = (x + originShift) / resolution
  const pixelY = (y + originShift) / resolution

  return [pixelX, pixelY]
}

/**
 * Converts pixel coordinates to EPSG:3857 based on provided zoom level
 * @param {Number} x pixel coordinate
 * @param {Number} y pixel coordinate
 * @param {Number} zoom non-negative integer, level of zoom
 */
const pixelsToMeters = (x, y, zoom) => {
  const resolution = initialResolution / Math.pow(2, zoom)
  const meterX = x * resolution - originShift
  const meterY = y * resolution - originShift

  return [meterX, meterY]
}

export {
  degreesToMeters,
  metersToDegress,
  pixelsToMeters,
  metersToPixels,
}
