import { useMemo, useState } from 'react'
import spotsData from './data/spots.json'
import buildings from './data/buildings.json'
import Filters from './components/Filters'
import SpotCard from './components/SpotCard'
import SpotDetail from './components/SpotDetail'
import MapView from './components/MapView'
import { RED_SQUARE, distanceMiles, isOpenNow } from './lib/geo'

const DEFAULT_FILTERS = {
  noise: 'any', // any | quiet | moderate | loud
  outlets: false,
  group: false,
  openNow: false,
  setting: 'any', // any | indoor | outdoor
}

// Same filtered list feeds both the cards and the map pins
function filterSpots(spots, query, filters, origin) {
  const q = query.trim().toLowerCase()
  return spots
    .map((s) => ({ ...s, distance: distanceMiles(origin, s) }))
    .filter((s) => !q || s.name.toLowerCase().includes(q) || s.building.toLowerCase().includes(q))
    .filter((s) => filters.noise === 'any' || s.noise === filters.noise)
    .filter((s) => !filters.outlets || s.outlets)
    .filter((s) => !filters.group || s.groupSeating)
    .filter((s) => !filters.openNow || isOpenNow(s.hours))
    .filter((s) => filters.setting === 'any' || s.setting === filters.setting)
    .sort((a, b) => a.distance - b.distance)
}

function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  })
}

export default function App() {
  const [view, setView] = useState('browse') // browse | about
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [originId, setOriginId] = useState('red-square')
  const [userLoc, setUserLoc] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [notice, setNotice] = useState('')
  const [locating, setLocating] = useState(false)

  const origin = useMemo(() => {
    if (originId === 'me' && userLoc) return { ...userLoc, label: 'you' }
    const b = buildings.find((x) => x.id === originId) ?? buildings[0]
    return { lat: b.lat, lng: b.lng, label: b.name }
  }, [originId, userLoc])

  const results = useMemo(
    () => filterSpots(spotsData, query, filters, origin),
    [query, filters, origin],
  )

  const detailSpot = detailId
    ? filterSpots(spotsData, '', DEFAULT_FILTERS, origin).find((s) => s.id === detailId)
    : null

  // Ask the browser for location. If that fails, keep the building the user picked
  // (or Red Square if they hadn't picked one).
  async function locate() {
    setLocating(true)
    const loc = await getLocation()
    setLocating(false)
    const keepBuilding = originId !== 'me'
    const fallbackName = keepBuilding ? origin.label : 'Red Square'
    if (!keepBuilding) setOriginId('red-square')
    if (!loc) {
      setNotice(`Location unavailable, so distances are measured from ${fallbackName}. Pick a building below to change that.`)
      return null
    }
    if (distanceMiles(loc, RED_SQUARE) > 2) {
      setNotice(`You look like you're off campus, so distances are measured from ${fallbackName}.`)
      return null
    }
    setNotice('')
    setUserLoc(loc)
    setOriginId('me')
    return { ...loc, label: 'you' }
  }

  async function handleFindNow() {
    const fallback = originId === 'me' ? { ...RED_SQUARE, label: 'Red Square' } : origin
    const loc = (await locate()) ?? fallback
    const nextFilters = { ...filters, openNow: true }
    setFilters(nextFilters)
    setView('browse')
    const best = filterSpots(spotsData, query, nextFilters, loc)[0]
    if (best) {
      setDetailId(best.id)
      setSelectedId(best.id)
    } else {
      setNotice('Nothing open matches your filters right now. Try removing a filter.')
    }
  }

  function handleOriginChange(value) {
    if (value === 'me') locate()
    else {
      setNotice('')
      setOriginId(value)
    }
  }

  function openDetail(id) {
    setView('browse')
    setDetailId(id)
    setSelectedId(id)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-6">
        <button type="button" onClick={() => { setView('browse'); setDetailId(null) }} className="font-semibold">
          UW Study Spots
        </button>
        <nav className="flex gap-6 text-sm">
          <button type="button" onClick={() => setView('browse')} className={view === 'browse' ? 'font-semibold' : 'text-gray-500'}>
            Browse
          </button>
          <button type="button" onClick={() => setView('about')} className={view === 'about' ? 'font-semibold' : 'text-gray-500'}>
            About
          </button>
        </nav>
      </header>

      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="order-last min-h-0 flex-1 overflow-y-auto border-gray-200 p-5 md:order-first md:w-[420px] md:flex-none md:border-r">
          {view === 'about' ? (
            <About />
          ) : detailSpot ? (
            <SpotDetail spot={detailSpot} originLabel={origin.label} onBack={() => setDetailId(null)} />
          ) : (
            <div className="space-y-4">
              <Filters
                query={query}
                setQuery={setQuery}
                filters={filters}
                setFilters={setFilters}
                onFindNow={handleFindNow}
                locating={locating}
              />

              {notice && (
                <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">{notice}</p>
              )}

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-sm font-semibold">Nearby spots ({results.length})</span>
                <label className="flex items-center gap-1 text-gray-500">
                  Distance from
                  <select
                    value={originId}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    className="max-w-[150px] rounded border border-gray-300 bg-white px-1 py-0.5 text-gray-800"
                  >
                    <option value="me">My location</option>
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                {results.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    selected={spot.id === selectedId}
                    onSelect={setSelectedId}
                    onOpen={openDetail}
                  />
                ))}
                {results.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                    No spots match these filters.{' '}
                    <button type="button" className="underline" onClick={() => { setFilters(DEFAULT_FILTERS); setQuery('') }}>
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>

        <section className="h-[42vh] shrink-0 md:h-auto md:flex-1">
          <MapView
            spots={detailSpot ? [detailSpot] : results}
            selectedId={selectedId}
            focusId={detailId}
            onSelect={setSelectedId}
            onOpen={openDetail}
            origin={origin}
          />
        </section>
      </main>
    </div>
  )
}

function About() {
  return (
    <div className="space-y-3 text-sm text-gray-700">
      <h2 className="text-xl font-semibold text-black">About UW Study Spots</h2>
      <p>
        Finding a place to study on campus usually means walking to a library and hoping it isn't
        full. UW Study Spots puts libraries, academic buildings, the HUB and nearby cafes on one
        map so you can filter by noise, outlets, group seating, hours and indoor or outdoor.
      </p>
      <p>
        Hit <strong>Find me a spot now</strong> to jump straight to the closest spot that's open
        and matches your filters.
      </p>
      <p className="text-xs text-gray-400">
        Built for the KTP project sprint. Spot data is collected by hand and may change; check the
        "last verified" date on each spot.
      </p>
    </div>
  )
}
