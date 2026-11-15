import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'

const CAMPUS_CENTER = [47.6553, -122.3080]
const UW_PURPLE = '#4b2e83'

// Zoom in on the opened spot, otherwise fit the map to every pin in the list
function FitView({ spots, focused }) {
  const map = useMap()
  const idsKey = spots.map((s) => s.id).join(',')

  useEffect(() => {
    if (focused) {
      map.flyTo([focused.lat, focused.lng], Math.max(map.getZoom(), 17), { duration: 0.6 })
      return
    }
    if (spots.length === 0) return
    if (spots.length === 1) {
      map.flyTo([spots[0].lat, spots[0].lng], 17, { duration: 0.6 })
      return
    }
    const bounds = spots.map((s) => [s.lat, s.lng])
    map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 17, duration: 0.6 })
    // idsKey covers changes to which spots are shown
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, focused?.id, map])

  return null
}

export default function MapView({ spots, selectedId, focusId, onSelect, onOpen, origin }) {
  const focused = spots.find((s) => s.id === focusId)

  return (
    <MapContainer center={CAMPUS_CENTER} zoom={16} className="h-full w-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {origin && (
        <CircleMarker
          center={[origin.lat, origin.lng]}
          radius={7}
          pathOptions={{ color: '#fff', weight: 2, fillColor: '#2563eb', fillOpacity: 1 }}
        >
          <Tooltip direction="top">{origin.label}</Tooltip>
        </CircleMarker>
      )}

      {spots.map((spot) => {
        const isSel = spot.id === selectedId
        return (
          <CircleMarker
            key={spot.id}
            center={[spot.lat, spot.lng]}
            radius={isSel ? 11 : 8}
            pathOptions={{
              color: '#fff',
              weight: 2,
              fillColor: isSel ? UW_PURPLE : '#111',
              fillOpacity: 1,
            }}
            eventHandlers={{
              click: () => onOpen(spot.id),
              mouseover: () => onSelect(spot.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              {spot.name}
            </Tooltip>
          </CircleMarker>
        )
      })}

      <FitView spots={spots} focused={focused} />
    </MapContainer>
  )
}
