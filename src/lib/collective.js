// Collective helpers shared by the app modal (Participants.jsx) and the static
// /collective/ page (scripts/generate-mix-pages.mjs), so both list the same
// people in the same order. Takes the mix data as an argument — no JSON import,
// so Node can load it as-is.

export const GROUPS = [
  { kind: 'dj', label: 'transmitters' },
  { kind: 'lens', label: 'lens' },
];

// Symbol shown beside the name of the core crew: resident, then host.
export function badgeFor(p) {
  if (p.resident) return { symbol: '∴', label: 'resident' };
  if (p.host) return { symbol: '✦', label: 'host' };
  return null;
}

// Episodes a participant appears in — as a DJ (artist) or as the cover
// photographer (cover credit). Derived from the mix data, newest first.
export function episodesFor(name, mixtapes) {
  const key = name.toLowerCase();
  return mixtapes
    .filter(
      (e) =>
        (e.artists || []).some((a) => a.name.toLowerCase() === key) ||
        (e.cover?.credit || '').toLowerCase() === key
    )
    .map((e) => {
      const num = (e.title.match(/episode\s+(\d+)/i) || [])[1];
      const name = (e.title.split(/BIT\s*-\s*/i)[1] || e.title).trim();
      return {
        id: e.id,
        path: e.path,
        date: e.date,
        label: num ? `ep${num} · ${name}` : name,
      };
    });
}

// Residents first, then hosts, then by most recent episode (newest first);
// anyone with no episode goes last. Ties keep the order of PARTICIPANTS.
function lastMixDate(p, mixtapes) {
  if (p.resident) return '9999';
  if (p.host) return '9998';
  return episodesFor(p.name, mixtapes).reduce(
    (max, ep) => (ep.date > max ? ep.date : max),
    ''
  );
}

export function groupMembers(participants, kind, mixtapes) {
  return participants
    .filter((p) => p.kind === kind)
    .sort((a, b) => lastMixDate(b, mixtapes).localeCompare(lastMixDate(a, mixtapes)));
}
