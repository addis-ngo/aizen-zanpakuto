/**
 * =========================================================================
 * AIZEN ZANPAKUTO - BRANDING & IMAGE CONFIGURATION
 * =========================================================================
 * 
 * Paste your image address from Google (or any web image address) below!
 * 
 * HOW TO ADD AN IMAGE ADDRESS FROM GOOGLE:
 * 1. Search for any image on Google (e.g., "Aizen Zanpakuto", "Kyoka Suigetsu", "Bleach")
 * 2. Right-click the image in Google Images and click "Copy image address" (or "Copy image link")
 * 3. Replace the URL inside AIZEN_ZANPAKUTO_IMAGE_URL below with your copied link!
 * 
 * NOTE: Both direct image links (.png, .jpg, .webp) and Google Images preview links
 * (encrypted-tbn0.gstatic.com or google.com/imgres?imgurl=...) will automatically work.
 */

// >>> 1. DEFAULT LOGO: PASTE YOUR DEFAULT GOOGLE IMAGE ADDRESS HERE <<<
export const DEFAULT_LOGO_IMAGE_URL =
  'https://www.pngkey.com/png/full/573-5733387_sosuke-aizen-transparent-aizen-png.png';

// Backward compatibility alias:
export const AIZEN_ZANPAKUTO_IMAGE_URL = DEFAULT_LOGO_IMAGE_URL;

// >>> 2. ALTERNATE LOGO: PASTE YOUR SECOND GOOGLE IMAGE ADDRESS HERE <<<
// At random intervals every now and then, both logos will switch to this image for a few seconds and then return back!
export const ALTERNATE_LOGO_IMAGE_URL =
  'https://www.pngmart.com/files/21/Aizen-PNG-Photo.png';

// >>> 3. GAME BACKGROUND: PASTE YOUR GOOGLE IMAGE ADDRESS FOR THE GAME BACKGROUND HERE <<<
// ---------------------------------------------------------------------------------------
// How to set a custom background image from Google:
// 1. Search for any wallpaper or anime image on Google (e.g. "Bleach Wallpaper 4K", "Aizen Throne", "Anime night sky")
// 2. Right-click the image and click "Copy image address"
// 3. Paste the URL inside the quotes below!
//
// Leave as-is for the default aesthetic background, or paste your own Google Image address!
export const GAME_BACKGROUND_IMAGE_URL =
  'https://i.redd.it/k9rzah1z3or21.png';

/**
 * Global branding settings for the header and application.
 */
export const BRANDING_CONFIG = {
  // Title displayed in the header navigation
  title: 'AIZEN ZANPAKUTO',

  // Default logo image address (active normally)
  defaultImageUrl: DEFAULT_LOGO_IMAGE_URL,

  // Secondary logo image address (revealed at random for a few seconds)
  alternateImageUrl: ALTERNATE_LOGO_IMAGE_URL,

  // Game background image address (paste your Google image link into GAME_BACKGROUND_IMAGE_URL above)
  backgroundImageUrl: GAME_BACKGROUND_IMAGE_URL,

  // Background overlay dimming: 0.0 (raw bright image) to 0.9 (very dark).
  // 0.45 is recommended so all text, videos, and game cards remain crystal clear!
  backgroundDim: 0.45,

  // Background blur in pixels (0 for crisp image, 3-6 for soft focus aesthetic)
  backgroundBlur: 0,

  // Fallback property for backward compatibility
  imageUrl: DEFAULT_LOGO_IMAGE_URL,

  // Timing settings for the random swap (in milliseconds)
  minIntervalMs: 10000, // minimum time (e.g., 10s) before next random swap
  maxIntervalMs: 24000, // maximum time (e.g., 24s) before next random swap
  durationMs: 3500,     // how long the alternate image stays on screen (e.g., 3.5s)
};

/**
 * Resolves raw URLs, including extracting the true image source if a user pastes
 * a Google Image redirect link (e.g. google.com/imgres?imgurl=...).
 */
export function resolveImageUrl(input?: string): string {
  if (!input) return '';
  let trimmed = input.trim();
  // Strip accidental outer quotes (double, single, or backticks) if copied with them
  trimmed = trimmed.replace(/^["'`]|["'`]$/g, '').trim();
  if (!trimmed) return '';

  // Handle Google Image search redirect links
  if (trimmed.includes('google.') && trimmed.includes('imgurl=')) {
    try {
      const urlObj = new URL(trimmed);
      const extracted = urlObj.searchParams.get('imgurl');
      if (extracted) {
        return decodeURIComponent(extracted);
      }
    } catch {
      const match = trimmed.match(/[?&]imgurl=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }
  }

  return trimmed;
}
