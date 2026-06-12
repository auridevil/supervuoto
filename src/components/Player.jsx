import { useState } from 'react';
import {
  getEmbedUrlFor,
  PLATFORM_HEIGHTS,
  availablePlatforms,
} from '../lib/embeds.js';
import { PLATFORM_ICONS } from './Icons.jsx';
import { mixShareUrl } from '../lib/site.js';

// squareArt: render soundcloud as a square visual player (full uncropped
// artwork) — used for the featured entry. Elsewhere soundcloud uses the
// classic player, whose square thumbnail is never cropped.
export default function Player({ entry, minHeight = 0, squareArt = false }) {
  const platforms = availablePlatforms(entry);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  if (platforms.length === 0) return null;

  const share = () => {
    navigator.clipboard
      .writeText(mixShareUrl(entry.id))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const platform =
    selected && platforms.includes(selected) ? selected : platforms[0];
  const url = entry.links[platform];
  const square = squareArt && platform === 'soundcloud';
  const src = getEmbedUrlFor(platform, url, { visual: square });
  const height = Math.max(PLATFORM_HEIGHTS[platform] ?? 166, minHeight);

  return (
    <div className="player">
      {platforms.length > 1 && (
        <div className="player-tabs">
          {platforms.map((p) => {
            const Icon = PLATFORM_ICONS[p];
            return (
              <button
                key={p}
                type="button"
                className={'player-tab' + (p === platform ? ' is-active' : '')}
                onClick={() => setSelected(p)}
              >
                {Icon && <Icon />} {p}
              </button>
            );
          })}
        </div>
      )}
      {src && (
        <div className={'card-embed' + (square ? ' is-square' : '')}>
          <iframe
            key={src}
            src={src}
            title={`${entry.title} — ${platform}`}
            loading="lazy"
            allow="autoplay; encrypted-media"
            width="100%"
            height={square ? undefined : height}
            frameBorder="0"
          />
        </div>
      )}
      <div className="player-actions">
        <a className="player-open" href={url} target="_blank" rel="noreferrer">
          {(() => {
            const Icon = PLATFORM_ICONS[platform];
            return Icon ? <Icon /> : null;
          })()}
          open on {platform} ↗
        </a>
        <button type="button" className="player-share" onClick={share}>
          {copied ? '✓ link copied' : '⎘ share'}
        </button>
      </div>
    </div>
  );
}
