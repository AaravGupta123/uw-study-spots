import { formatMiles, hoursLabel, isOpenNow } from '../lib/geo'

const NOISE = { quiet: 'Quiet', moderate: 'Moderate', loud: 'Loud' }

export function spotTags(spot) {
  const tags = [NOISE[spot.noise]]
  if (spot.outlets) tags.push('Outlets')
  if (spot.groupSeating) tags.push('Group seating')
  else tags.push('Solo seating')
  if (spot.setting === 'outdoor') tags.push('Outdoor')
  return tags
}

export function PhotoPlaceholder({ className = '' }) {
  return (
    <div className={'flex items-center justify-center rounded bg-gray-200 text-xs text-gray-500 ' + className}>
      Photo
    </div>
  )
}

export default function SpotCard({ spot, selected, onSelect, onOpen }) {
  const open = isOpenNow(spot.hours)
  return (
    <button
      type="button"
      onClick={() => onOpen(spot.id)}
      onMouseEnter={() => onSelect(spot.id)}
      className={
        'flex w-full gap-3 rounded-lg border p-3 text-left transition-colors ' +
        (selected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400')
      }
    >
      <PhotoPlaceholder className="h-20 w-20 shrink-0" />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{spot.name}</div>
        <div className="text-xs text-gray-500">
          {spot.building} · {formatMiles(spot.distance)}
        </div>
        <div className="mt-0.5 text-xs text-gray-700">{spotTags(spot).join(' · ')}</div>
        <div className={'mt-0.5 text-xs font-semibold ' + (open ? 'text-black' : 'text-gray-400')}>
          {hoursLabel(spot.hours)}
        </div>
      </div>
    </button>
  )
}
