import { formatMiles, hoursLabel, isOpenNow, rangeLabel, walkMinutes } from '../lib/geo'
import { PhotoPlaceholder, spotTags } from './SpotCard'

export default function SpotDetail({ spot, originLabel, onBack }) {
  const open = isOpenNow(spot.hours)
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}&travelmode=walking`

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="text-sm text-gray-600 hover:text-black">
        ← Back to results
      </button>

      <PhotoPlaceholder className="h-44 w-full" />

      <div>
        <h2 className="text-xl font-semibold">{spot.name}</h2>
        <p className="text-sm text-gray-500">
          {spot.building} · {formatMiles(spot.distance)} ({walkMinutes(spot.distance)} min walk from {originLabel})
        </p>
        <span
          className={
            'mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ' +
            (open ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')
          }
        >
          {hoursLabel(spot.hours)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {spotTags(spot).map((t) => (
          <span key={t} className="rounded-full border border-gray-300 px-2.5 py-0.5 text-xs">
            {t}
          </span>
        ))}
      </div>

      <section>
        <h3 className="mb-1 text-sm font-semibold">Hours</h3>
        <dl className="grid grid-cols-[110px_1fr] gap-y-1 text-sm">
          {'fri' in spot.hours ? (
            <>
              <dt className="text-gray-500">Mon to Thu</dt>
              <dd>{rangeLabel(spot.hours.weekday)}</dd>
              <dt className="text-gray-500">Friday</dt>
              <dd>{rangeLabel(spot.hours.fri)}</dd>
            </>
          ) : (
            <>
              <dt className="text-gray-500">Mon to Fri</dt>
              <dd>{rangeLabel(spot.hours.weekday)}</dd>
            </>
          )}
          <dt className="text-gray-500">Saturday</dt>
          <dd>{rangeLabel(spot.hours.sat)}</dd>
          <dt className="text-gray-500">Sunday</dt>
          <dd>{rangeLabel(spot.hours.sun)}</dd>
        </dl>
      </section>

      <section>
        <h3 className="mb-1 text-sm font-semibold">Seating</h3>
        <p className="text-sm text-gray-700">{spot.seating}</p>
      </section>

      <section>
        <h3 className="mb-1 text-sm font-semibold">Amenities</h3>
        <p className="text-sm text-gray-700">{spot.amenities.join(', ')}</p>
      </section>

      <a
        href={directions}
        target="_blank"
        rel="noreferrer"
        className="block w-full rounded-md bg-black py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800"
      >
        Walking directions
      </a>

      <p className="text-xs text-gray-400">
        Last verified: {spot.lastVerified ?? 'not yet verified'}
      </p>
    </div>
  )
}
