// Distance + hours helpers

export const RED_SQUARE = { lat: 47.65605, lng: -122.30945 }

export function distanceMiles(a, b) {
  const R = 3958.8 // earth radius in miles
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function formatMiles(miles) {
  return miles < 0.1 ? '< 0.1 mi' : `${miles.toFixed(1)} mi`
}

// About 20 minutes per mile walking
export function walkMinutes(miles) {
  return Math.max(1, Math.round(miles * 20))
}

const DAY_KEYS = ['sun', 'weekday', 'weekday', 'weekday', 'weekday', 'weekday', 'sat']

export function todaysHours(hours, date = new Date()) {
  return hours[DAY_KEYS[date.getDay()]] ?? null
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function formatTime(hhmm) {
  let [h, m] = hhmm.split(':').map(Number)
  if (h === 24) h = 0
  const suffix = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m ? `${h12}:${String(m).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`
}

export function isOpenNow(hours, date = new Date()) {
  const today = todaysHours(hours, date)
  if (!today) return false
  const now = date.getHours() * 60 + date.getMinutes()
  return now >= toMinutes(today[0]) && now < toMinutes(today[1])
}

export function hoursLabel(hours, date = new Date()) {
  const today = todaysHours(hours, date)
  if (!today) return 'Closed today'
  if (today[0] === '00:00' && today[1] === '24:00') return 'Open 24 hours'
  const now = date.getHours() * 60 + date.getMinutes()
  if (now < toMinutes(today[0])) return `Closed, opens ${formatTime(today[0])}`
  if (now >= toMinutes(today[1])) return 'Closed for today'
  return `Open until ${formatTime(today[1])}`
}

export function rangeLabel(range) {
  if (!range) return 'Closed'
  if (range[0] === '00:00' && range[1] === '24:00') return 'Open 24 hours'
  return `${formatTime(range[0])} to ${formatTime(range[1])}`
}
