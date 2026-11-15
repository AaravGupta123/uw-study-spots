function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full border px-3 py-1 text-xs transition-colors ' +
        (active
          ? 'border-black bg-black text-white'
          : 'border-gray-300 bg-white text-gray-800 hover:border-gray-500')
      }
    >
      {children}
    </button>
  )
}

export default function Filters({ query, setQuery, filters, setFilters, onFindNow, locating }) {
  const toggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }))
  const pick = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? 'any' : value }))

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search buildings or spots"
        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:bg-white"
      />

      <button
        type="button"
        onClick={onFindNow}
        disabled={locating}
        className="w-full rounded-md bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {locating ? 'Finding you...' : 'Find me a spot now'}
      </button>

      <div className="flex flex-wrap gap-2">
        <Chip active={filters.noise === 'quiet'} onClick={() => pick('noise', 'quiet')}>Quiet</Chip>
        <Chip active={filters.noise === 'moderate'} onClick={() => pick('noise', 'moderate')}>Moderate</Chip>
        <Chip active={filters.noise === 'loud'} onClick={() => pick('noise', 'loud')}>Loud OK</Chip>
        <Chip active={filters.outlets} onClick={() => toggle('outlets')}>Outlets</Chip>
        <Chip active={filters.group} onClick={() => toggle('group')}>Group seating</Chip>
        <Chip active={filters.openNow} onClick={() => toggle('openNow')}>Open now</Chip>
        <Chip active={filters.setting === 'indoor'} onClick={() => pick('setting', 'indoor')}>Indoor</Chip>
        <Chip active={filters.setting === 'outdoor'} onClick={() => pick('setting', 'outdoor')}>Outdoor</Chip>
      </div>
    </div>
  )
}
