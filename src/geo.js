/**
 * For more information, visit:
 * https://epsg.io/3857
 * http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection/
 */

/**
 * Origin shift, which equals to 20037508.342789244, comes from the
 * circumference of the Earth in meters
 */
const originShift = 2 * Math.PI * 6378137 / 2.0

/**
 * Converts longitude and latitude using WGS84 Geodetic Datum to meters using
 * Spherical Mercator projection, known oficially under EPSG:3857 codename.
 * Domain is 85.06°S and 85.06°N.
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

export {
  degreesToMeters,
  metersToDegress,
}
