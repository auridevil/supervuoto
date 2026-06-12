// Canonical site origin — also set as "homepage" in package.json and used by
// scripts/generate-mix-pages.mjs for social previews.
export const SITE_URL = 'https://supervuoto.org';

export function mixShareUrl(id) {
  return `${SITE_URL}/mix/${id}/`;
}
