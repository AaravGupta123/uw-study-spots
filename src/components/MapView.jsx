import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'

const CAMPUS_CENTER = [47.6553, -122.3080]
const UW_PURPLE = '#4b2e83'

function FlyToSelected({ spot }) {
  const map = useMap()
  useEffect(() => {
    if (spot) map.flyTo([spot.lat, spot.lng], Math.max(map.getZoom(), 17), { duration: 0.6 })
  }, [spot, map])
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

      <FlyToSelected spot={focused} />
    </MapContainer>
  )
}
