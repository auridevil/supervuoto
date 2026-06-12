// supervuoto — live broadcast schedule on Back In Town radio.
// Times are Italy time (Europe/Rome).

export const RADIO_URL = 'https://backintown.it/radio-player/';
export const RADIO_NAME = 'back in town radio';

// day: JS weekday (0 = sunday … 6 = saturday); hours in Europe/Rome.
export const SCHEDULE = [
  { day: 5, label: 'friday', start: 18, end: 19 },
  { day: 6, label: 'saturday', start: 21, end: 22 },
];

const DAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function isOnAirNow(now = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Rome',
      weekday: 'short',
      hour: 'numeric',
      hour12: false,
    }).formatToParts(now);
    const get = (type) => parts.find((p) => p.type === type)?.value;
    const day = DAY_MAP[get('weekday')];
    const hour = parseInt(get('hour'), 10);
    if (day === undefined || Number.isNaN(hour)) return false;
    return SCHEDULE.some((s) => s.day === day && hour >= s.start && hour < s.end);
  } catch {
    return false;
  }
}
