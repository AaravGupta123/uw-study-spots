# UW Study Spots

Find a study spot on the UW Seattle campus by noise level, outlets, group seating, hours, and indoor or outdoor seating.

Built with React + Vite, Tailwind CSS, and Leaflet + OpenStreetMap.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Project layout

```
src/
  App.jsx                 page layout, filter state, "Find me a spot now"
  components/Filters.jsx  search bar, button, filter chips
  components/SpotCard.jsx one card in the list
  components/SpotDetail.jsx  spot detail panel
  components/MapView.jsx  Leaflet map, pins match the list
  data/spots.json         study spot data (edit this)
  data/buildings.json     buildings for "Distance from"
  lib/geo.js              distance + opening hours helpers
```

## Updating spot data

Each spot in `src/data/spots.json` looks like:

```json
{
  "id": "suzzallo-reading-room",
  "name": "Suzzallo Reading Room",
  "building": "Suzzallo Library",
  "lat": 47.65575,
  "lng": -122.30805,
  "noise": "quiet",            // quiet | moderate | loud
  "outlets": true,
  "groupSeating": false,
  "setting": "indoor",         // indoor | outdoor
  "seating": "Long shared tables",
  "amenities": ["Wi-Fi", "Restrooms"],
  "hours": { "weekday": ["07:30", "24:00"], "sat": ["09:00", "17:00"], "sun": null },
  "lastVerified": "2026-11-15"
}
```

Hours rules:
- `null` means closed that day.
- Add an optional `"fri"` entry when Friday differs from Mon to Thu.
- A close time earlier than the open time means it closes after midnight: `["10:00", "02:00"]` is 10 am to 2 am.
- `["00:00", "24:00"]` means open 24 hours.

Library and HUB hours were checked against lib.uw.edu and hub.washington.edu on 2026-11-15 (they change at finals and breaks). Spots with `"lastVerified": null` still need someone to check them in person.

## Deploy

Push to GitHub, then on vercel.com choose Add New, Project, import the repo, and deploy with the default Vite settings.
