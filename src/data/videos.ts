export interface YouTubeVideoItem {
  id: string;
  title: string;
  /**
   * The anime series name (e.g., 'Jujutsu Kaisen', 'Re:Zero', 'Rascal Does Not Dream').
   */
  anime?: string;
  /**
   * Song category: 'op' (Opening), 'end' (Ending), or 'ost' (Soundtrack / Insert / Theme).
   */
  category?: 'op' | 'end' | 'ost' | string;
  /**
   * YouTube embed URL, full video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...),
   * or direct YouTube video ID (e.g., '5qap5aO4i9A').
   */
  youtubeUrlOrId: string;
}

/**
 * Helper to extract the 11-character YouTube video ID.
 */
export function extractYouTubeId(input: string): string {
  const trimmed = input?.trim() || '';
  if (!trimmed) return '';

  if (trimmed.includes('youtube.com/embed/')) {
    const match = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Fallback for any 11-char sequence if present
  const generalMatch = trimmed.match(/([a-zA-Z0-9_-]{11})/);
  return generalMatch ? generalMatch[1] : trimmed;
}

/**
 * Helper to extract YouTube embed URL from full URL, short URL, or video ID.
 * Uses official standard embed URL with playsinline, enablejsapi, and origin to avoid playback/buffering freezes.
 */
export function getYouTubeEmbedUrl(input: string, autoPlay: boolean = false): string {
  const id = extractYouTubeId(input);
  if (!id) return '';

  const autoplayParam = autoPlay ? '&autoplay=1' : '&autoplay=0';
  // Use standard www.youtube.com/embed which does not suffer from nocookie third-party cookie blocking
  return `https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1${autoplayParam}`;
}

/**
 * Returns direct YouTube watch page link.
 */
export function getYouTubeWatchUrl(input: string): string {
  const id = extractYouTubeId(input);
  return id ? `https://www.youtube.com/watch?v=${id}` : '';
}

/**
 * Returns the video thumbnail image URL from YouTube.
 */
export function getYouTubeThumbnailUrl(input: string): string {
  const id = extractYouTubeId(input);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

/**
 * List of YouTube videos for Blind Ranking and Either/Or games.
 */

export const YOUTUBE_VIDEOS: YouTubeVideoItem[] = [
  // =========================
  // RASCAL DOES NOT DREAM
  // =========================

  {
    id: 'rascal-op-1',
    title: 'Kimi no Sei',
    anime: 'Rascal Does Not Dream',
    category: 'op',
    youtubeUrlOrId: 'HIoeEngUiKU',
  },
  {
    id: 'rascal-ed-1',
    title: 'Fukashigi no Karte',
    anime: 'Rascal Does Not Dream',
    category: 'end',
    youtubeUrlOrId: 'CCADAIE2FnE',
  },
  {
    id: 'rascal-op-2',
    title: 'Snowdrop',
    anime: 'Rascal Does Not Dream',
    category: 'op',
    youtubeUrlOrId: 'cL-iFsAL-xI',
  },
  {
    id: 'rascal-ed-2',
    title: 'Suiheisen wa Boku no Furukizu',
    anime: 'Rascal Does Not Dream',
    category: 'end',
    youtubeUrlOrId: 'v96uFHiU9Do',
  },

  // =========================
  // JUJUTSU KAISEN
  // =========================

  {
    id: 'jjk-op-1',
    title: 'Kaikai Kitan',
    anime: 'Jujutsu Kaisen',
    category: 'op',
    youtubeUrlOrId: 'GwaRztMaoY0',
  },
  {
    id: 'jjk-ed-1',
    title: 'LOST IN PARADISE',
    anime: 'Jujutsu Kaisen',
    category: 'end',
    youtubeUrlOrId: '6riDJMI-Y8U',
  },
  {
    id: 'jjk-op-2',
    title: 'VIVID VICE',
    anime: 'Jujutsu Kaisen',
    category: 'op',
    youtubeUrlOrId: 'LFTE4W--Htk',
  },
  {
    id: 'jjk-ed-2',
    title: 'give it back',
    anime: 'Jujutsu Kaisen',
    category: 'end',
    youtubeUrlOrId: 'f8JWhakG2Pc',
  },
  {
    id: 'jjk-movie-1',
    title: 'Ichizu',
    anime: 'Jujutsu Kaisen',
    category: 'ost',
    youtubeUrlOrId: 'e8nij7jRB6M',
  },
  {
    id: 'jjk-movie-2',
    title: 'Sakayume',
    anime: 'Jujutsu Kaisen',
    category: 'ost',
    youtubeUrlOrId: 'OvE_AFXA4gk',
  },
  {
    id: 'jjk-op-3',
    title: 'Ao no Sumika',
    anime: 'Jujutsu Kaisen',
    category: 'op',
    youtubeUrlOrId: 'gcgKUcJKxIs',
  },
  {
    id: 'jjk-ed-3',
    title: 'Akari',
    anime: 'Jujutsu Kaisen',
    category: 'end',
    youtubeUrlOrId: 'ZSLmP-af8W0',
  },
  {
    id: 'jjk-op-4',
    title: 'SPECIALZ',
    anime: 'Jujutsu Kaisen',
    category: 'op',
    youtubeUrlOrId: '5yb2N3pnztU',
  },
  {
    id: 'jjk-ed-4',
    title: 'more than words',
    anime: 'Jujutsu Kaisen',
    category: 'end',
    youtubeUrlOrId: 'fR0tqhqM7Yg',
  },
  {
    id: 'jjk-op-5',
    title: 'AIZO',
    anime: 'Jujutsu Kaisen',
    category: 'op',
    youtubeUrlOrId: 'Xr032EhUDPw',
  },
  {
    id: 'jjk-ed-5',
    title: 'Yoake no Uta',
    anime: 'Jujutsu Kaisen',
    category: 'end',
    youtubeUrlOrId: '-i8LR9-WVps',
  },

  // =========================
  // RE:ZERO
  // =========================

  {
    id: 'rezero-op-1',
    title: 'Redo',
    anime: 'Re:Zero',
    category: 'op',
    youtubeUrlOrId: 'k6qFYNpCupE',
  },
  {
    id: 'rezero-ed-1',
    title: 'STYX HELIX',
    anime: 'Re:Zero',
    category: 'end',
    youtubeUrlOrId: 'IiaeDOO113A',
  },
  {
    id: 'rezero-op-2',
    title: 'Paradisus-Paradoxum',
    anime: 'Re:Zero',
    category: 'op',
    youtubeUrlOrId: 'iu_0kOfMGD0',
  },
  {
    id: 'rezero-ed-2',
    title: 'Stay Alive',
    anime: 'Re:Zero',
    category: 'end',
    youtubeUrlOrId: 'WgUSRQlPyH4',
  },
  {
    id: 'rezero-op-3',
    title: 'Realize',
    anime: 'Re:Zero',
    category: 'op',
    youtubeUrlOrId: 'w-RUTZBbGwM',
  },
  {
    id: 'rezero-ed-3',
    title: 'Memento',
    anime: 'Re:Zero',
    category: 'end',
    youtubeUrlOrId: 'lQaufCqi5v4',
  },
  {
    id: 'rezero-op-4',
    title: 'Long Shot',
    anime: 'Re:Zero',
    category: 'op',
    youtubeUrlOrId: 'lUmLhQBGtYw',
  },
  {
    id: 'rezero-ed-4',
    title: 'Believe in You',
    anime: 'Re:Zero',
    category: 'end',
    youtubeUrlOrId: 'o_MT4YLhZxM',
  },
  {
    id: 'rezero-op-5',
    title: 'Reweave',
    anime: 'Re:Zero',
    category: 'op',
    youtubeUrlOrId: 'hCxZx7uHO1I',
  },
  {
    id: 'rezero-ed-5',
    title: 'NOX LUX',
    anime: 'Re:Zero',
    category: 'end',
    youtubeUrlOrId: '9nFoF88EwVk',
  },
  {
    id: 'rezero-op-6',
    title: 'Recollect',
    anime: 'Re:Zero',
    category: 'op',
    youtubeUrlOrId: 'VDGG9zi53rQ',
  },
  {
    id: 'rezero-ed-6',
    title: 'Ender Ember',
    anime: 'Re:Zero',
    category: 'end',
    youtubeUrlOrId: 'iKLqlb_oX60',
  },
  // =========================
  // SWORD ART ONLINE
  // =========================

  // Season 1 - Aincrad
  {
    id: 'sao-op-1',
    title: 'crossing field',
    anime: 'Sword Art Online',
    category: 'op',
    youtubeUrlOrId: 'Y4kfe8R1Iqs',
  },
  {
    id: 'sao-ed-1',
    title: 'Yume Sekai',
    anime: 'Sword Art Online',
    category: 'end',
    youtubeUrlOrId: 'PcSvnfDhSvI',
  },

  // Season 1 - Fairy Dance
  {
    id: 'sao-op-2',
    title: 'INNOCENCE',
    anime: 'Sword Art Online',
    category: 'op',
    youtubeUrlOrId: 'vdPPA-2ErW8',
  },
  {
    id: 'sao-ed-2',
    title: 'Overfly',
    anime: 'Sword Art Online',
    category: 'end',
    youtubeUrlOrId: '4cyPZua08_0',
  },

  // Season 2 - Phantom Bullet
  {
    id: 'sao-op-3',
    title: 'IGNITE',
    anime: 'Sword Art Online',
    category: 'op',
    youtubeUrlOrId: 'UgQeSizFJ3A',
  },
  {
    id: 'sao-ed-3',
    title: 'Ending 3',
    anime: 'Sword Art Online',
    category: 'end',
    youtubeUrlOrId: 'z7TZICaHoZE',
  },
  {
    id: 'sao-op-4',
    title: 'Courage',
    anime: 'Sword Art Online',
    category: 'op',
    youtubeUrlOrId: 'NJ6JKunL-Wg',
  },
    {
    id: 'sao-ed-4',
    title: 'Startear',
    anime: 'Sword Art Online',
    category: 'end',
    youtubeUrlOrId: 'wGm2vgrQfsI',
  },

  // Alicization
  {
    id: 'sao-op-5',
    title: 'ADAMAS',
    anime: 'Sword Art Online',
    category: 'op',
    youtubeUrlOrId: '3hdJ8PKNXrc',
  },

  // =========================
  // BLEACH
  // =========================

  // Original Series

  {
    id: 'bleach-op-1',
    title: 'Asterisk',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'wW9TwZdWpjw',
  },
  {
    id: 'bleach-op-2',
    title: 'D-tecnoLife',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'h1MoLQ9Wcv0',
  },
  {
    id: 'bleach-op-3',
    title: 'Ichirin no Hana',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'eIm0dpBjQPg',
  },
  {
    id: 'bleach-op-4',
    title: 'TONIGHT, TONIGHT, TONIGHT',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'oi3wY1-EwDs',
  },
  {
    id: 'bleach-op-5',
    title: 'Rolling Star',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'PSDIaaRC3jc',
  },
  {
    id: 'bleach-op-6',
    title: 'ALONES',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'WEN4qOcVKeM',
  },
  {
    id: 'bleach-op-7',
    title: 'After Dark',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'Rv5V-5CErRE',
  },
  {
    id: 'bleach-op-8',
    title: 'CHU-BURA',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'cZ8Xpej1hXo',
  },
  {
    id: 'bleach-op-9',
    title: 'Velonica',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'almG54sVBuw',
  },
  {
    id: 'bleach-op-10',
    title: 'ShojoS',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'HN_-WaTLD_A',
  },
  {
    id: 'bleach-op-11',
    title: 'Anima Rossa',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'd3ze_mYwhR0',
  },
  {
    id: 'bleach-op-12',
    title: 'chAngE',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'i0we6am_25g',
  },
  {
    id: 'bleach-op-13',
    title: 'Ranbu no Melody',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: '5emM3JGI5JA',
  },
  {
    id: 'bleach-op-14',
    title: 'BLUE',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'lTkCqZA4i3U',
  },
  {
    id: 'bleach-op-15',
    title: 'HARUKAZE',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'T6wo7bfYYu4',
  },

  // Original Series Endings

  {
    id: 'bleach-ed-1',
    title: 'Life is Like a Boat',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'hYD6Ocj8dp8',
  },
  {
    id: 'bleach-ed-2',
    title: 'Thank You!!',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'EEh_fsD7-ZM',
  },
  {
    id: 'bleach-ed-3',
    title: 'Hoki Boshi',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'QJGy2n7ReHk',
  },
  {
    id: 'bleach-ed-4',
    title: 'happypeople',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'ca11p-P3P-A',
  },
  {
    id: 'bleach-ed-5',
    title: 'LIFE',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'CYbKRePEKOw',
  },
  {
    id: 'bleach-ed-6',
    title: 'My Pace',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'W_M7D_qxOUk',
  },
  {
    id: 'bleach-ed-7',
    title: 'HANABI',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'svwlbXKZrn0',
  },
  {
    id: 'bleach-ed-8',
    title: 'MOVIN!!',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'gxWdDTYKtGA',
  },
  {
    id: 'bleach-ed-9',
    title: "BABY IT'S YOU",
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'ocOJpCwrr24',
  },
  {
    id: 'bleach-ed-10',
    title: 'Sakura Biyori',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'fGO-jmLujyg',
  },
  {
    id: 'bleach-ed-11',
    title: 'Tsumasaki',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'B5NO509N_NI',
  },
  {
    id: 'bleach-ed-12',
    title: 'Daidai',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'NNwnH6Q-YMs',
  },
  {
    id: 'bleach-ed-13',
    title: 'Tane wo Maku Hibi',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'tGf48itMSPM',
  },
  {
    id: 'bleach-ed-14',
    title: 'Kansha.',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'KA4OGln46yI',
  },
  {
    id: 'bleach-ed-15',
    title: 'Orange',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'F4DXogJ7qpM',
  },

  // =========================
  // THOUSAND-YEAR BLOOD WAR
  // =========================

  // Part 1
  {
    id: 'bleach-op-16',
    title: 'Scar',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'mjeR7vUrDvM',
  },
  {
    id: 'bleach-ed-31',
    title: 'Saihate',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'LYdCktLgvak',
  },

  // Part 2 - The Separation
  {
    id: 'bleach-op-17',
    title: 'STARS',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'bHME-AwOnc4',
  },
  {
    id: 'bleach-ed-32',
    title: 'Endroll',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: 'Um9bJRK58PY',
  },

  // Part 3 - The Conflict
  {
    id: 'bleach-op-18',
    title: 'Kotoba ni Sezu Tomo',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: 'ECWciPlUt0s',
  },
  {
    id: 'bleach-ed-33',
    title: 'MONOCHROME',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: '4fqkxYTXITs',
  },

  // Final Part - The Calamity
  {
    id: 'bleach-op-19',
    title: 'I-BULL',
    anime: 'Bleach',
    category: 'op',
    youtubeUrlOrId: '3b00HiT4B04',
  },
  {
    id: 'bleach-ed-34',
    title: 'RASEN',
    anime: 'Bleach',
    category: 'end',
    youtubeUrlOrId: '3AljQAapii4',
  },
  // =========================
  // OSHI NO KO
  // =========================

  // Season 1
  {
    id: 'oshinoko-op-1',
    title: 'Idol',
    anime: 'Oshi no Ko',
    category: 'op',
    youtubeUrlOrId: 'PgBvV9ofjmA',
  },
  {
    id: 'oshinoko-ed-1',
    title: 'Mephisto',
    anime: 'Oshi no Ko',
    category: 'end',
    youtubeUrlOrId: '0saw1cGIl1A',
  },

  // Season 2
  {
    id: 'oshinoko-op-2',
    title: 'Fatal',
    anime: 'Oshi no Ko',
    category: 'op',
    youtubeUrlOrId: 'PAcf55v6zqQ',
  },
  {
    id: 'oshinoko-ed-2',
    title: 'Burning',
    anime: 'Oshi no Ko',
    category: 'end',
    youtubeUrlOrId: 'JuS4iuhG-vc',
  },

  // Season 3
  {
    id: 'oshinoko-op-3',
    title: 'TEST ME',
    anime: 'Oshi no Ko',
    category: 'op',
    youtubeUrlOrId: 'QgIQbeRzkkc',
  },
  {
    id: 'oshinoko-ed-3',
    title: 'Serenade',
    anime: 'Oshi no Ko',
    category: 'end',
    youtubeUrlOrId: 'ZWvFR00t-NE',
  },
// =========================
// HUNTER X HUNTER (2011)
// =========================

// Opening 1
{
  id: 'hxh-op-1',
  title: 'Departure!',
  anime: 'Hunter x Hunter',
  category: 'op',
  youtubeUrlOrId: 'faqmNf_fZlE',
},

// Opening 2
{
  id: 'hxh-op-5',
  title: 'Departure! -second version-',
  anime: 'Hunter x Hunter',
  category: 'op',
  youtubeUrlOrId: 'a-Jttwd1ipI',
},

// Ending 1
{
  id: 'hxh-ed-1',
  title: 'Just Awake',
  anime: 'Hunter x Hunter',
  category: 'end',
  youtubeUrlOrId: 'ELuVDnlB8PE',
},

// Ending 2
{
  id: 'hxh-ed-2',
  title: 'Hunting For Your Dream',
  anime: 'Hunter x Hunter',
  category: 'end',
  youtubeUrlOrId: 'tK-d2LJlaaQ',
},

// Ending 3
{
  id: 'hxh-ed-3',
  title: 'Reason',
  anime: 'Hunter x Hunter',
  category: 'end',
  youtubeUrlOrId: 'wnOGkmMDMuM',
},

// Ending 4
{
  id: 'hxh-ed-4',
  title: 'Nagareboshi Kirari',
  anime: 'Hunter x Hunter',
  category: 'end',
  youtubeUrlOrId: 'kc6MHszfb2I',
},

// Ending 5
{
  id: 'hxh-ed-5',
  title: 'Hyori Ittai',
  anime: 'Hunter x Hunter',
  category: 'end',
  youtubeUrlOrId: 'MCYm453CE6Y',
},

// Ending 6
{
  id: 'hxh-ed-6',
  title: 'Hyori Ittai v2',
  anime: 'Hunter x Hunter',
  category: 'end',
  youtubeUrlOrId: 'Kag5vCMycwg',
},

// =========================
// RENT-A-GIRLFRIEND
// =========================

// Season 1
{
  id: 'rentagirlfriend-op-1',
  title: 'Centimeter',
  anime: 'Rent-a-Girlfriend',
  category: 'op',
  youtubeUrlOrId: 'FBHkdDPN4dA',
},
{
  id: 'rentagirlfriend-ed-1',
  title: 'Kokuhaku Bungee Jump',
  anime: 'Rent-a-Girlfriend',
  category: 'end',
  youtubeUrlOrId: 'lYUdHGhxCw4',
},

// Special Ending - Episode 7
{
  id: 'rentagirlfriend-ed-2',
  title: 'First Drop',
  anime: 'Rent-a-Girlfriend',
  category: 'end',
  youtubeUrlOrId: 'CUT4-fCRvs4',
},

// Season 2
{
  id: 'rentagirlfriend-op-2',
  title: 'Himitsu Koi-Gokoro',
  anime: 'Rent-a-Girlfriend',
  category: 'op',
  youtubeUrlOrId: 'IS6WS8BlPwk',
},
{
  id: 'rentagirlfriend-ed-4',
  title: 'Ienai feat. asmi',
  anime: 'Rent-a-Girlfriend',
  category: 'end',
  youtubeUrlOrId: 'rFGkTnDnlRQ',
},

// Season 3
{
  id: 'rentagirlfriend-op-3',
  title: 'Renai Miri Film',
  anime: 'Rent-a-Girlfriend',
  category: 'op',
  youtubeUrlOrId: 'kiSQvJgtvZ4',
},
{
  id: 'rentagirlfriend-ed-5',
  title: 'End Roll',
  anime: 'Rent-a-Girlfriend',
  category: 'end',
  youtubeUrlOrId: 'RMnpj0LZN1Q',
},


// Season 4
{
  id: 'rentagirlfriend-op-4',
  title: 'Umitsuki',
  anime: 'Rent-a-Girlfriend',
  category: 'op',
  youtubeUrlOrId: 'f0W74MWAVK8',
},
{
  id: 'rentagirlfriend-ed-7',
  title: 'Boku no Vega',
  anime: 'Rent-a-Girlfriend',
  category: 'end',
  youtubeUrlOrId: '2t8l6LKr-oc',
},

// Season 5
{
  id: 'rentagirlfriend-op-5',
  title: 'Non Scenario Etude',
  anime: 'Rent-a-Girlfriend',
  category: 'op',
  youtubeUrlOrId: 'SCv4mleVUMQ',
},
{
  id: 'rentagirlfriend-ed-8',
  title: '204-goushitsu',
  anime: 'Rent-a-Girlfriend',
  category: 'end',
  youtubeUrlOrId: 'AvckMXaA11s',
},

// =========================
// TO BE HERO X
// =========================

{
  id: 'tbhx-op-1',
  title: 'INERTIA',
  anime: 'To Be Hero X',
  category: 'op',
  youtubeUrlOrId: 'j0KhH04xMlE',
},
{
  id: 'tbhx-ed-1',
  title: 'KONTINUUM',
  anime: 'To Be Hero X',
  category: 'end',
  youtubeUrlOrId: 'QZSfLU6HqXM',
},

// =========================
// THE QUINTESSENTIAL QUINTUPLETS
// =========================

// Season 1
{
  id: 'quintuplets-op-1',
  title: 'Gotoubun no Kimochi',
  anime: 'The Quintessential Quintuplets',
  category: 'op',
  youtubeUrlOrId: 'FKIT6G_lw7c',
},
{
  id: 'quintuplets-ed-1',
  title: 'Sign',
  anime: 'The Quintessential Quintuplets',
  category: 'end',
  youtubeUrlOrId: '3_2J9wkieEE',
},

// Season 2
{
  id: 'quintuplets-op-2',
  title: 'Gotoubun no Katachi',
  anime: 'The Quintessential Quintuplets',
  category: 'op',
  youtubeUrlOrId: '2oQSUoGhEBg',
},
{
  id: 'quintuplets-ed-2',
  title: 'Hatsukoi',
  anime: 'The Quintessential Quintuplets',
  category: 'end',
  youtubeUrlOrId: 'evL5Wt5G_KA',
},

// =========================
// HORIMIYA
// =========================

// Season 1
{
  id: 'horimiya-op-1',
  title: 'Iro Kousui',
  anime: 'Horimiya',
  category: 'op',
  youtubeUrlOrId: 'OkPUJspnE6Q',
},
{
  id: 'horimiya-ed-1',
  title: 'Yakusoku',
  anime: 'Horimiya',
  category: 'end',
  youtubeUrlOrId: '',
},

// =========================
// DEATH NOTE
// =========================

{
  id: 'deathnote-op-1',
  title: 'the WORLD',
  anime: 'Death Note',
  category: 'op',
  youtubeUrlOrId: 'Bt3D3Ca9nww',
},
// =========================
// BLACK CLOVER
// =========================

// OPENINGS

{
  id: 'blackclover-op-1',
  title: 'Haruka Mirai',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: '_6KZI74zKfE',
},
{
  id: 'blackclover-op-2',
  title: 'PAiNT it BLACK',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: '5zSx8QD-fkA',
},
{
  id: 'blackclover-op-3',
  title: 'Black Rover',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'dUiDZJMPh-s',
},
{
  id: 'blackclover-op-4',
  title: 'Guess Who Is Back',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'URwMxNidO-8',
},
{
  id: 'blackclover-op-5',
  title: 'Gamushara',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 't5hsrDnWmhY',
},
{
  id: 'blackclover-op-6',
  title: 'Rakugaki Page',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: '6edby9ExKOE',
},
{
  id: 'blackclover-op-7',
  title: 'JUSTadICE',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'fFd1VkGc-SI',
},
{
  id: 'blackclover-op-8',
  title: 'sky & blue',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'ROJx29cyQmg',
},
{
  id: 'blackclover-op-9',
  title: 'RiGHT NOW',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'ShkJLkDtWZA',
},
{
  id: 'blackclover-op-10',
  title: 'Black Catcher',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'XMeQeIG_rQg',
},
{
  id: 'blackclover-op-11',
  title: 'Stories',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'IM4amhrJTvE',
},
{
  id: 'blackclover-op-12',
  title: 'Everlasting Shine',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'uFDkYBKUc3Y',
},
{
  id: 'blackclover-op-13',
  title: 'Grandeur',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'aaZq6SXXNt4',
},

// ENDINGS

{
  id: 'blackclover-ed-1',
  title: 'Aoi Hono',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: '1Covbkescmg',
},
{
  id: 'blackclover-ed-2',
  title: 'Amazing Dreams',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: 'P4aGgehT35A',
},
{
  id: 'blackclover-ed-3',
  title: 'Black to the dreamlight',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: 'C74JE0h83hY',
},
{
  id: 'blackclover-ed-4',
  title: 'four',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: 'Y4tDSohjUu4',
},
{
  id: 'blackclover-ed-5',
  title: 'Tenjou Tenge',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: 'VnpsJHvLdIY',
},
{
  id: 'blackclover-ed-6',
  title: 'My Song My Days',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: '8R90vY1TKM0',
},
{
  id: 'blackclover-ed-7',
  title: 'Hana ga Saku Michi',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: '9zYw45Bw1z8',
},
{
  id: 'blackclover-ed-8',
  title: 'against the gods',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: 'fzFFMGVP7rQ',
},
{
  id: 'blackclover-ed-9',
  title: 'Jinsei wa Senjou da',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: 'Ix414TSFmhA',
},
{
  id: 'blackclover-ed-10',
  title: 'New Page',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: '65_exPZjAKg',
},
{
  id: 'blackclover-ed-11',
  title: 'Answer',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: 'CuPSOesiglU',
},
{
  id: 'blackclover-ed-12',
  title: 'A Walk',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: 'NFzwbDplw14',
},
{
  id: 'blackclover-ed-13',
  title: 'BEAUTIFUL',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: '-SYs1Y_m7kE',
},

// =========================
// BLACK CLOVER - SEASON 2
// =========================

{
  id: 'blackclover-op-14',
  title: 'Kienai Riyuu',
  anime: 'Black Clover',
  category: 'op',
  youtubeUrlOrId: 'PtBmc0oFIx4',
},
{
  id: 'blackclover-ed-14',
  title: 'Yellow Brick Road',
  anime: 'Black Clover',
  category: 'end',
  youtubeUrlOrId: 'umzOm3846cA',
},

// =========================
// CLASSROOM OF THE ELITE
// =========================

// Season 1
{
  id: 'classroomelite-op-1',
  title: 'Caste Room',
  anime: 'Classroom of the Elite',
  category: 'op',
  youtubeUrlOrId: 'hsfBOwAIhOw',
},
{
  id: 'classroomelite-ed-1',
  title: 'Beautiful Soldier',
  anime: 'Classroom of the Elite',
  category: 'end',
  youtubeUrlOrId: 'tUxKNNcV5Sk',
},

// Season 2
{
  id: 'classroomelite-op-2',
  title: 'Dance in the Game',
  anime: 'Classroom of the Elite',
  category: 'op',
  youtubeUrlOrId: '9deedzO71hk',
},
{
  id: 'classroomelite-ed-2',
  title: 'Hito Jibai',
  anime: 'Classroom of the Elite',
  category: 'end',
  youtubeUrlOrId: 'NZaSmoeRj2E',
},

// Season 3
{
  id: 'classroomelite-op-3',
  title: 'Minor Piece',
  anime: 'Classroom of the Elite',
  category: 'op',
  youtubeUrlOrId: 'RkkGHJUpJCw',
},
{
  id: 'classroomelite-ed-3',
  title: 'Konse Daikakumei',
  anime: 'Classroom of the Elite',
  category: 'end',
  youtubeUrlOrId: 'RjMpoSuExxM',
},

// Season 4
{
  id: 'classroomelite-op-4',
  title: 'MONSTER',
  anime: 'Classroom of the Elite',
  category: 'op',
  youtubeUrlOrId: 'Bc0OpYrMbUI',
},
{
  id: 'classroomelite-ed-4',
  title: 'Liar Veil',
  anime: 'Classroom of the Elite',
  category: 'end',
  youtubeUrlOrId: '-nD2GklKrFA',
},

// =========================
// MUSHOKU TENSEI
// =========================

// Season 1
{
  id: 'mushokutensei-ed-1',
  title: 'Only',
  anime: 'Mushoku Tensei',
  category: 'end',
  youtubeUrlOrId: 'mcaPCJeDXz4',
},

// Season 2 - Part 1
{
  id: 'mushokutensei-op-6',
  title: 'Spiral',
  anime: 'Mushoku Tensei',
  category: 'op',
  youtubeUrlOrId: 'https://youtu.be/_NIp8wvNXmM',
},

// Season 2 - Part 2
{
  id: 'mushokutensei-op-7',
  title: 'On the Frontline',
  anime: 'Mushoku Tensei',
  category: 'op',
  youtubeUrlOrId: 'kQ5Zfgpirwc',
},

// Season 3
{
  id: 'mushokutensei-ed-4',
  title: 'Inori, Owareba',
  anime: 'Mushoku Tensei',
  category: 'end',
  youtubeUrlOrId: 'UKcJqQqiXq0',
},
// =========================
// WOTAKOI: LOVE IS HARD FOR OTAKU
// =========================

{
  id: 'wotakoi-op-1',
  title: 'Fiction',
  anime: 'Wotakoi: Love Is Hard for Otaku',
  category: 'op',
  youtubeUrlOrId: 'XjHqfhOcK_0',
},
{
  id: 'wotakoi-ed-1',
  title: 'Kimi no Tonari',
  anime: 'Wotakoi: Love Is Hard for Otaku',
  category: 'end',
  youtubeUrlOrId: 'UaAVfExoTDo',
},

// =========================
// THE APOTHECARY DIARIES
// =========================

// Season 1
{
  id: 'apothecary-op-1',
  title: 'Be a flower',
  anime: 'The Apothecary Diaries',
  category: 'op',
  youtubeUrlOrId: 'z9JZB08qy44',
},
{
  id: 'apothecary-ed-1',
  title: 'Aikotoba',
  anime: 'The Apothecary Diaries',
  category: 'end',
  youtubeUrlOrId: 'MuVVmOm5FYY',
},
{
  id: 'apothecary-op-2',
  title: 'Ambivalent',
  anime: 'The Apothecary Diaries',
  category: 'op',
  youtubeUrlOrId: '29pmd1QiK-4',
},
{
  id: 'apothecary-ed-2',
  title: 'Ai wa Kusuri',
  anime: 'The Apothecary Diaries',
  category: 'end',
  youtubeUrlOrId: 'bYNlZ0KkPuo',
},

// Season 2
{
  id: 'apothecary-op-3',
  title: 'Hyakka Ryouran',
  anime: 'The Apothecary Diaries',
  category: 'op',
  youtubeUrlOrId: 'sYC5BfJy2nw',
},
{
  id: 'apothecary-ed-3',
  title: 'Shiawase no Recipe',
  anime: 'The Apothecary Diaries',
  category: 'end',
  youtubeUrlOrId: 'kswDfgziS9I',
},
{
  id: 'apothecary-op-4',
  title: 'Kusushiki',
  anime: 'The Apothecary Diaries',
  category: 'op',
  youtubeUrlOrId: 'ZuYu-dJrWDk',
},
{
  id: 'apothecary-ed-4',
  title: 'Hitorigoto',
  anime: 'The Apothecary Diaries',
  category: 'end',
  youtubeUrlOrId: '2ujbjT7k6ak',
},

// =========================
// MY HERO ACADEMIA
// =========================

// Season 1
{
  id: 'mha-op-1',
  title: 'THE DAY',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: 'L1FdEBTJXus',
},
{
  id: 'mha-ed-1',
  title: 'HEROES',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'YRU7MZWDmgg',
},

// Season 2
{
  id: 'mha-op-2',
  title: 'Peace Sign',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: 'Q7w5IMyJ3pM',
},
{
  id: 'mha-ed-2',
  title: 'Dakara, Hitori ja Nai',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'YqIBL3_uEAw',
},
{
  id: 'mha-op-3',
  title: 'Sora ni Utaeba',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: '2ieT6Vh7jZE',
},
{
  id: 'mha-ed-3',
  title: 'Datte Atashi no Hero.',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'C0AcfFDbXQA',
},

// Season 3
{
  id: 'mha-op-4',
  title: 'ODD FUTURE',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: 'v1YojYU5nPQ',
},
{
  id: 'mha-ed-4',
  title: 'Update',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: '_A5vGzbp6Tw',
},
{
  id: 'mha-op-5',
  title: 'Make My Story',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: 'XhIA35OAIw4',
},
{
  id: 'mha-ed-5',
  title: 'Long Hope Philia',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'Co06YzyUYTA',
},

// Season 4
{
  id: 'mha-op-6',
  title: 'Polaris',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: '-t5--PiJsWo',
},
{
  id: 'mha-ed-6',
  title: 'Kokai no Uta',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'XwZryxMnQD0',
},
{
  id: 'mha-op-7',
  title: 'Star Marker',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: 'JY9FLZDicLQ',
},
{
  id: 'mha-ed-7',
  title: 'Shout Baby',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'Ei0LbNH02-Y',
},

// Season 5
{
  id: 'mha-op-8',
  title: 'No.1',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: 'PTbRl5h64tU',
},
{
  id: 'mha-ed-8',
  title: 'Ashiato',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: '1DsMEWI6ig4',
},
{
  id: 'mha-op-9',
  title: 'Merry-Go-Round',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: '9_mxwsQD4as',
},
{
  id: 'mha-ed-9',
  title: 'Uso ja Nai',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'SuUEHizaxJ4',
},

// Season 6
{
  id: 'mha-op-10',
  title: 'Hitamuki',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: 'cM1F9TbJhkk',
},
{
  id: 'mha-ed-10',
  title: 'SKETCH',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'oEpWxrNXvck',
},
{
  id: 'mha-op-11',
  title: 'Bokurano',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: 'JFDFFoBClLY',
},
{
  id: 'mha-ed-11',
  title: 'Kita Kaze',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'wKl67b08gIs',
},

// Season 7
{
  id: 'mha-op-12',
  title: 'Tagatame',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: '-YYXLo-tZsc',
},
{
  id: 'mha-ed-12',
  title: 'Tsubomi',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: '4sNU44RD7pU',
},
{
  id: 'mha-op-13',
  title: 'Curtain Call',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: '6R5EqW4nOik',
},
{
  id: 'mha-ed-13',
  title: 'Rokutosei',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'yr6wnrnT4qE',
},

// Final Season
{
  id: 'mha-op-14',
  title: 'THE REVO',
  anime: 'My Hero Academia',
  category: 'op',
  youtubeUrlOrId: '5ALFVv_tdYw',
},
{
  id: 'mha-ed-14',
  title: 'I',
  anime: 'My Hero Academia',
  category: 'end',
  youtubeUrlOrId: 'K0v0lTbZnvM',
},

{
  id: 'naruto-op-16',
  title: 'Silhouette',
  anime: 'Naruto Shippuden',
  category: 'op',
  youtubeUrlOrId: 'zVgKnfN9i34',
},

{
  id: 'tokyoghoul-op-1',
  title: 'unravel',
  anime: 'Tokyo Ghoul',
  category: 'op',
  youtubeUrlOrId: '7aMOurgDB-o',
},

{
  id: 'sololeveling-op-1',
  title: 'LEveL',
  anime: 'Solo Leveling',
  category: 'op',
  youtubeUrlOrId: 'XqD0oCHLIF8',
},

// =========================
// YOUR LIE IN APRIL
// =========================

{
  id: 'yourlieinapril-op-1',
  title: 'Hikaru Nara',
  anime: 'Your Lie in April',
  category: 'op',
  youtubeUrlOrId: 'fWRPihlt2ho',
},

{
  id: 'yourlieinapril-op-2',
  title: 'Nanairo Symphony',
  anime: 'Your Lie in April',
  category: 'op',
  youtubeUrlOrId: 'sD_UPWar3SI',
},

{
  id: 'vinlandsaga-op-1',
  title: 'Mukanjyo',
  anime: 'Vinland Saga',
  category: 'op',
  youtubeUrlOrId: 'l5wAdQ-UkWY',
},
// =========================
// MY DRESS-UP DARLING
// =========================

// Season 1
{
  id: 'dressupdarling-op-1',
  title: 'Sansan Days',
  anime: 'My Dress-Up Darling',
  category: 'op',
  youtubeUrlOrId: 'oG4eu4HMtbo',
},
{
  id: 'dressupdarling-ed-1',
  title: 'Koi no Yukue',
  anime: 'My Dress-Up Darling',
  category: 'end',
  youtubeUrlOrId: '_8rk_af6ApM',
},

// Season 2
{
  id: 'dressupdarling-op-2',
  title: 'Ao to Kirameki',
  anime: 'My Dress-Up Darling',
  category: 'op',
  youtubeUrlOrId: 'ie5GcVid_8k',
},
{
  id: 'dressupdarling-ed-2',
  title: 'Kawaii Kaiwai',
  anime: 'My Dress-Up Darling',
  category: 'end',
  youtubeUrlOrId: 'bLA3pkr6KN4',
},

// =========================
// MARRIAGETOXIN
// =========================

{
  id: 'marriagetoxin-op-1',
  title: 'Kill or Kiss',
  anime: 'Marriage Toxin',
  category: 'op',
  youtubeUrlOrId: '8kDuurgaQow',
},
{
  id: 'marriagetoxin-ed-1',
  title: 'Shake Na Baby',
  anime: 'Marriage Toxin',
  category: 'end',
  youtubeUrlOrId: 'ZDT7hxqGN98',
},

{
  id: 'codegeass-op-1',
  title: 'COLORS',
  anime: 'Code Geass',
  category: 'op',
  youtubeUrlOrId: 'G8CFuZ9MseQ',
},

{
  id: 'domesticgirlfriend-op-1',
  title: 'Kawaki wo Ameku',
  anime: 'Domestic Girlfriend',
  category: 'op',
  youtubeUrlOrId: 'SaKdpMnwZf0',
},

// =========================
// KONOSUBA
// =========================

// Season 1
{
  id: 'konosuba-op-1',
  title: 'fantastic dreamer',
  anime: 'KonoSuba',
  category: 'op',
  youtubeUrlOrId: 'fpG3BPNQepY',
},

// Season 2
{
  id: 'konosuba-op-2',
  title: 'TOMORROW',
  anime: 'KonoSuba',
  category: 'op',
  youtubeUrlOrId: 'vdcddjV0l5o',
},


// Season 3
{
  id: 'konosuba-op-3',
  title: 'Growing Up',
  anime: 'KonoSuba',
  category: 'op',
  youtubeUrlOrId: 'JdAUmKsxxJk',
},
// =========================
// THE 100 GIRLFRIENDS WHO REALLY, REALLY,
// REALLY, REALLY, REALLY LOVE YOU
// =========================

// Season 1
{
  id: '100girlfriends-op-1',
  title: 'Dai Dai Dai Dai Daisuki na Kimi e♡',
  anime: 'The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You',
  category: 'op',
  youtubeUrlOrId: 'ZmA3O50cMTY',
},
{
  id: '100girlfriends-ed-1',
  title: 'Sweet Sign',
  anime: 'The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You',
  category: 'end',
  youtubeUrlOrId: 'WJhtMxz-L-M',
},

// Season 2
{
  id: '100girlfriends-op-2',
  title: 'Arigato, Daisuki ni Nattekurete',
  anime: 'The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You',
  category: 'op',
  youtubeUrlOrId: '5cXLBCc_O5U',
},
{
  id: '100girlfriends-ed-2',
  title: 'Unmei?',
  anime: 'The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You',
  category: 'end',
  youtubeUrlOrId: 'LsWpwZ_04Pw',
},

// =========================
// THE FRAGRANT FLOWER BLOOMS WITH DIGNITY
// =========================

{
  id: 'fragrantflower-op-1',
  title: 'Manazashi wa Hikari',
  anime: 'The Fragrant Flower Blooms with Dignity',
  category: 'op',
  youtubeUrlOrId: 'FVz3FhGqicI',
},
{
  id: 'fragrantflower-ed-1',
  title: 'Harenohini',
  anime: 'The Fragrant Flower Blooms with Dignity',
  category: 'end',
  youtubeUrlOrId: 'VuKSlOT__9s',
},

// =========================
// DAN DA DAN
// =========================

// Season 1
{
  id: 'dandadan-op-1',
  title: 'Otonoke',
  anime: 'Dandadan',
  category: 'op',
  youtubeUrlOrId: 'a4na2opArGY',
},
{
  id: 'dandadan-ed-1',
  title: 'TAIDADA',
  anime: 'Dandadan',
  category: 'end',
  youtubeUrlOrId: 'ovW7yRi1iJ8',
},

// Season 2
{
  id: 'dandadan-op-2',
  title: 'Kakumei Douchuu',
  anime: 'Dandadan',
  category: 'op',
  youtubeUrlOrId: 'DCCRNzKvWRg',
},
{
  id: 'dandadan-ed-2',
  title: 'Doukashiteru',
  anime: 'Dandadan',
  category: 'end',
  youtubeUrlOrId: 'AhNYcpN1pEU',
},

{
  id: 'alya-op-1',
  title: '1-ban Kagayaku Hoshi',
  anime: 'Alya Sometimes Hides Her Feelings in Russian',
  category: 'op',
  youtubeUrlOrId: 'CVXc3DhH5xk',
},

{
  id: 'alya-ed-2',
  title: 'Kawaikute Gomen',
  anime: 'Alya Sometimes Hides Her Feelings in Russian',
  category: 'end',
  youtubeUrlOrId: 'JM-j8q9pYWE',
},

// =========================
// ATTACK ON TITAN
// =========================

// Season 1
{
  id: 'aot-op-1',
  title: 'Guren no Yumiya',
  anime: 'Attack on Titan',
  category: 'op',
  youtubeUrlOrId: '8OkpRK2_gVs',
},

{
  id: 'aot-op-2',
  title: 'Jiyuu no Tsubasa',
  anime: 'Attack on Titan',
  category: 'op',
  youtubeUrlOrId: 'PbWFpzi8C94',
},

// Season 2
{
  id: 'aot-op-3',
  title: 'Shinzou wo Sasageyo!',
  anime: 'Attack on Titan',
  category: 'op',
  youtubeUrlOrId: 'LKP-vZvjbh8',
},

// Season 3 - Part 1
{
  id: 'aot-op-4',
  title: 'Red Swan',
  anime: 'Attack on Titan',
  category: 'op',
  youtubeUrlOrId: 'RTvVqCCynvo',
},

// Final Season - Part 1
{
  id: 'aot-op-6',
  title: 'My War',
  anime: 'Attack on Titan',
  category: 'op',
  youtubeUrlOrId: 'P75q_3Qlrqg',
},
{
  id: 'aot-ed-6',
  title: 'Shougeki',
  anime: 'Attack on Titan',
  category: 'end',
  youtubeUrlOrId: 'BS1oeApgMss',
},

// Final Season - Part 2
{
  id: 'aot-op-7',
  title: 'The Rumbling',
  anime: 'Attack on Titan',
  category: 'op',
  youtubeUrlOrId: 'EtjQVqXUPHo',
},
{
  id: 'aot-ed-7',
  title: 'Akuma no Ko',
  anime: 'Attack on Titan',
  category: 'end',
  youtubeUrlOrId: '-ZmAcmUSMHM',
},

// =========================
// KAGUYA-SAMA: LOVE IS WAR
// =========================

// Season 1
{
  id: 'kaguya-op-1',
  title: 'Love Dramatic',
  anime: 'Kaguya-sama: Love Is War',
  category: 'op',
  youtubeUrlOrId: '6vRxlXHH4H8',
},
{
  id: 'kaguya-ed-1',
  title: 'Sentimental Crisis',
  anime: 'Kaguya-sama: Love Is War',
  category: 'end',
  youtubeUrlOrId: 'bIH5-Y91rwg',
},

// Season 2
{
  id: 'kaguya-op-2',
  title: 'DADDY! DADDY! DO!',
  anime: 'Kaguya-sama: Love Is War',
  category: 'op',
  youtubeUrlOrId: 'lTlzDfhPtFA',
},
{
  id: 'kaguya-ed-2',
  title: 'Kaze ni Fukarete',
  anime: 'Kaguya-sama: Love Is War',
  category: 'end',
  youtubeUrlOrId: 'eqjFmsZGBSc',
},

// Season 3 - Ultra Romantic
{
  id: 'kaguya-op-3',
  title: 'GIRI GIRI',
  anime: 'Kaguya-sama: Love Is War',
  category: 'op',
  youtubeUrlOrId: 'j3p6sXq_uUM',
},
{
  id: 'kaguya-ed-3',
  title: 'Heart wa Oteage',
  anime: 'Kaguya-sama: Love Is War',
  category: 'end',
  youtubeUrlOrId: 'sVoz_fH59Ew',
},


// The First Kiss That Never Ends
{
  id: 'kaguya-op-4',
  title: 'Love is Show',
  anime: 'Kaguya-sama: Love Is War',
  category: 'op',
  youtubeUrlOrId: 'e1P5WxxMBmE',
},
{
  id: 'kaguya-ed-5',
  title: 'Heart Notes',
  anime: 'Kaguya-sama: Love Is War',
  category: 'end',
  youtubeUrlOrId: 'Jk6S15iIgxc',
},

// Stairway to Adulthood
{
  id: 'kaguya-op-5',
  title: 'Abunaikioku',
  anime: 'Kaguya-sama: Love Is War',
  category: 'op',
  youtubeUrlOrId: '4ANpychCrf0',
},

// =========================
// HELL'S PARADISE
// =========================

// Season 1
{
  id: 'hellsparadise-op-1',
  title: 'WORK',
  anime: "Hell's Paradise",
  category: 'op',
  youtubeUrlOrId: '04WuoQMhhxw',
},
{
  id: 'hellsparadise-ed-1',
  title: 'Kamihitoe',
  anime: "Hell's Paradise",
  category: 'end',
  youtubeUrlOrId: 'BMmi-d38svI',
},

// Season 2
{
  id: 'hellsparadise-op-2',
  title: 'Kasuka na Hana',
  anime: "Hell's Paradise",
  category: 'op',
  youtubeUrlOrId: '3zgow3WAYs8',
},
{
  id: 'hellsparadise-ed-2',
  title: 'PERSONAL',
  anime: "Hell's Paradise",
  category: 'end',
  youtubeUrlOrId: 'jV1sNQ9d9RM',
},

// =========================
// FULLMETAL ALCHEMIST: BROTHERHOOD
// ALL OPENINGS + ENDING 1
// =========================

{
  id: 'fmab-op-1',
  title: 'Again',
  anime: 'Fullmetal Alchemist: Brotherhood',
  category: 'op',
  youtubeUrlOrId: 'K0GbHoMHXUw',
},
{
  id: 'fmab-op-2',
  title: 'Hologram',
  anime: 'Fullmetal Alchemist: Brotherhood',
  category: 'op',
  youtubeUrlOrId: 'STacGwRRSz0',
},
{
  id: 'fmab-op-3',
  title: 'Golden Time Lover',
  anime: 'Fullmetal Alchemist: Brotherhood',
  category: 'op',
  youtubeUrlOrId: 'vrC_cmEAjjI',
},
{
  id: 'fmab-op-4',
  title: 'Period',
  anime: 'Fullmetal Alchemist: Brotherhood',
  category: 'op',
  youtubeUrlOrId: 'tLVK83HWNAk',
},
{
  id: 'fmab-op-5',
  title: 'Rain',
  anime: 'Fullmetal Alchemist: Brotherhood',
  category: 'op',
  youtubeUrlOrId: 'cMsDqVx777k',
},
{
  id: 'fmab-ed-1',
  title: 'Uso',
  anime: 'Fullmetal Alchemist: Brotherhood',
  category: 'end',
  youtubeUrlOrId: '-XlSNDOhuI0',
},

{
  id: 'demonslayer-op-1',
  title: 'Gurenge',
  anime: 'Demon Slayer',
  category: 'op',
  youtubeUrlOrId: 'pmanD_s7G3U',
},

// =========================
// CHAINSAW MAN
// OPENINGS ONLY
// =========================

// TV Anime
{
  id: 'chainsawman-op-1',
  title: 'KICK BACK',
  anime: 'Chainsaw Man',
  category: 'op',
  youtubeUrlOrId: 'dFlDRhvM4L0',
},

// Reze Arc Movie
{
  id: 'chainsawman-op-2',
  title: 'IRIS OUT',
  anime: 'Chainsaw Man',
  category: 'op',
  youtubeUrlOrId: 'ux3QETpLcPs',
},

{
  id: 'shiunji-op-1',
  title: 'Honey Lemon',
  anime: 'The Shiunji Family Children',
  category: 'op',
  youtubeUrlOrId: 'MqKDozk20eA',
},

// =========================
// STEINS;GATE
// =========================

// Original Series
{
  id: 'steinsgate-op-1',
  title: 'Hacking to the Gate',
  anime: 'Steins;Gate',
  category: 'op',
  youtubeUrlOrId: 'TR3ma_60-m4',
},
{
  id: 'steinsgate-ed-1',
  title: 'Tokitsukasadoru Juuni no Meiyaku',
  anime: 'Steins;Gate',
  category: 'end',
  youtubeUrlOrId: 'nL2E6q24aQo',
},

// =========================
// SOUL EATER
// =========================

{
  id: 'souleater-op-1',
  title: 'Resonance',
  anime: 'Soul Eater',
  category: 'op',
  youtubeUrlOrId: 'zzJ8U8OtEsE',
},

// =========================
// PUELLA MAGI MADOKA MAGICA
// =========================

// TV Series
{
  id: 'madoka-op-1',
  title: 'Connect',
  anime: 'Puella Magi Madoka Magica',
  category: 'op',
  youtubeUrlOrId: 'UmxpKC6F53A',
},

// =========================
// THE EMINENCE IN SHADOW - SEASON 1
// =========================

{
  id: 'eminence-op-1',
  title: 'HIGHEST',
  anime: 'The Eminence in Shadow',
  category: 'op',
  youtubeUrlOrId: 'xT7EkRCGO8I',
},
{
  id: 'eminence-ed-1',
  title: 'Darling in the Night',
  anime: 'The Eminence in Shadow',
  category: 'end',
  youtubeUrlOrId: 'FeCUTTZ_clQ',
},
];
