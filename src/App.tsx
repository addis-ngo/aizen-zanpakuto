import React, { useState, useMemo, useEffect } from 'react';
import { YOUTUBE_VIDEOS, YouTubeVideoItem, getYouTubeEmbedUrl } from './data/videos';
import { BANNER_IMAGES, BannerImage } from './data/banners';
import { BRANDING_CONFIG, resolveImageUrl } from './data/branding';
import { RotateCcw, Home, Check, ArrowRight, X, Trophy, Flame, Sword } from 'lucide-react';

function shuffleAndPick<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const ALL_TYPES = ['op', 'end', 'ost'] as const;
const TYPE_LABELS: Record<string, string> = {
  op: 'OP',
  end: 'ED',
  ost: 'OST',
};

const TOTAL_EITHER_OR_ROUNDS = 10;

/**
 * Hook to handle the random temporary swap of the two header logos with glitch effects.
 * At random intervals (between minIntervalMs and maxIntervalMs), it glitches into the alternate
 * image for durationMs seconds, then glitches back to the default.
 */
function useRandomLogoGlitch() {
  const [isAlternate, setIsAlternate] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const executeGlitchRef = React.useRef<((toAlt: boolean, onDone?: () => void) => void) | null>(null);

  // Preload both images so there's zero loading lag during glitch transitions
  useEffect(() => {
    const dUrl = resolveImageUrl(BRANDING_CONFIG.defaultImageUrl || BRANDING_CONFIG.imageUrl);
    const aUrl = resolveImageUrl(BRANDING_CONFIG.alternateImageUrl);
    if (dUrl) {
      const img1 = new Image();
      img1.src = dUrl;
    }
    if (aUrl) {
      const img2 = new Image();
      img2.src = aUrl;
    }
  }, []);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    let glitchSwapTimerId: ReturnType<typeof setTimeout>;
    let glitchEndTimerId: ReturnType<typeof setTimeout>;
    let isCancelled = false;

    const minDelay = BRANDING_CONFIG.minIntervalMs ?? 10000;
    const maxDelay = BRANDING_CONFIG.maxIntervalMs ?? 24000;
    const duration = BRANDING_CONFIG.durationMs ?? 3500;

    const executeGlitchSwap = (toAlternate: boolean, onDone?: () => void) => {
      if (isCancelled) return;
      setIsGlitching(true);

      // Midpoint of glitch effect: swap active image under the glitch distortion
      glitchSwapTimerId = setTimeout(() => {
        if (isCancelled) return;
        setIsAlternate(toAlternate);
      }, 240);

      // End of glitch: stabilize cleanly onto the new image
      glitchEndTimerId = setTimeout(() => {
        if (isCancelled) return;
        setIsGlitching(false);
        if (onDone) onDone();
      }, 520);
    };

    executeGlitchRef.current = executeGlitchSwap;

    const scheduleNext = () => {
      const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      timerId = setTimeout(() => {
        if (isCancelled) return;
        // 1. Glitch transition into alternate logo
        executeGlitchSwap(true, () => {
          // 2. Stay on alternate logo for duration, then glitch back to default logo
          timerId = setTimeout(() => {
            if (isCancelled) return;
            executeGlitchSwap(false, () => {
              // 3. Schedule next random glitch cycle
              scheduleNext();
            });
          }, duration);
        });
      }, randomDelay);
    };

    scheduleNext();

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
      clearTimeout(glitchSwapTimerId);
      clearTimeout(glitchEndTimerId);
    };
  }, []);

  const triggerGlitch = () => {
    if (isGlitching) return;
    if (executeGlitchRef.current) {
      executeGlitchRef.current(!isAlternate);
    }
  };

  return { isAlternate, isGlitching, triggerGlitch };
}

function HeaderImageBox({
  isAlternate,
  isGlitching,
  onTriggerGlitch,
}: {
  isAlternate: boolean;
  isGlitching: boolean;
  onTriggerGlitch?: () => void;
}) {
  const [defaultError, setDefaultError] = useState(false);
  const [alternateError, setAlternateError] = useState(false);

  const defaultUrl = resolveImageUrl(BRANDING_CONFIG.defaultImageUrl || BRANDING_CONFIG.imageUrl);
  const alternateUrl = resolveImageUrl(BRANDING_CONFIG.alternateImageUrl);

  const showAlternate = isAlternate && Boolean(alternateUrl) && !alternateError;
  const currentActiveUrl = showAlternate ? alternateUrl : defaultUrl;

  return (
    <div
      onClick={(e) => {
        if (onTriggerGlitch) {
          e.stopPropagation();
          onTriggerGlitch();
        }
      }}
      title="Aizen Zanpakuto (Click to trigger glitch)"
      className={`w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 relative select-none cursor-pointer ${
        isGlitching ? 'glitch-container-active' : ''
      }`}
    >
      {/* Default Logo Image (Active normally) */}
      {defaultUrl && !defaultError ? (
        <img
          src={defaultUrl}
          alt={BRANDING_CONFIG.title}
          onError={() => setDefaultError(true)}
          className={`w-full h-full object-contain absolute inset-0 m-auto transition-opacity duration-300 ${
            showAlternate ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
      ) : null}

      {/* Alternate Logo Image (Reveals at random or on glitch trigger) */}
      {alternateUrl && !alternateError ? (
        <img
          src={alternateUrl}
          alt={`${BRANDING_CONFIG.title} (Alternate)`}
          onError={() => setAlternateError(true)}
          className={`w-full h-full object-contain absolute inset-0 m-auto transition-opacity duration-300 ${
            showAlternate ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      ) : null}

      {/* GLITCH EFFECT OVERLAYS: Active only during image transition */}
      {isGlitching && currentActiveUrl && (
        <>
          {/* Chromatic Cyan Slice Clone */}
          <img
            src={currentActiveUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain absolute inset-0 m-auto pointer-events-none glitch-clone-cyan"
          />

          {/* Chromatic Magenta Slice Clone */}
          <img
            src={currentActiveUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain absolute inset-0 m-auto pointer-events-none glitch-clone-magenta"
          />

          {/* Laser Scanlines tearing horizontally */}
          <div className="absolute inset-x-0 h-[2px] bg-cyan-300/90 pointer-events-none glitch-scanline-bar z-10" />
          <div className="absolute inset-x-0 h-[1.5px] bg-rose-400/80 pointer-events-none glitch-scanline-bar z-10 [animation-delay:0.18s]" />
        </>
      )}

      {/* Fallback Icon if images fail to load */}
      {(!defaultUrl || defaultError) && (!alternateUrl || alternateError) && (
        <div className="w-full h-full flex items-center justify-center">
          <Sword className="w-8 h-8 sm:w-10 sm:h-10 text-white/90 group-hover:rotate-12 transition-transform duration-300 stroke-[2.2]" />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [gameMode, setGameMode] = useState<'menu' | 'blind-ranking' | 'either-or'>('menu');
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);
  const [bgError, setBgError] = useState<boolean>(false);
  const {
    isAlternate: isLogoAlternate,
    isGlitching: isLogoGlitching,
    triggerGlitch: triggerLogoGlitch,
  } = useRandomLogoGlitch();

  const resolvedBgUrl = resolveImageUrl(BRANDING_CONFIG.backgroundImageUrl);

  // Preload and validate game background image from files (Google image link or direct URL)
  useEffect(() => {
    if (resolvedBgUrl) {
      setBgError(false);
      const img = new Image();
      img.src = resolvedBgUrl;
      img.onerror = () => setBgError(true);
      img.onload = () => setBgError(false);
    }
  }, [resolvedBgUrl]);

  const getRandomBanner = (current?: BannerImage | null): BannerImage => {
    if (BANNER_IMAGES.length === 0) return { id: '', title: '', url: '' };
    if (BANNER_IMAGES.length === 1) return BANNER_IMAGES[0];
    const available = BANNER_IMAGES.filter((b) => b.url !== current?.url);
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex] || BANNER_IMAGES[0];
  };

  // Background banner images state on button hover
  const [activeBannerTop, setActiveBannerTop] = useState<BannerImage>(() => getRandomBanner());
  const [activeBannerBottom, setActiveBannerBottom] = useState<BannerImage>(() => getRandomBanner());
  const [isHoveringTop, setIsHoveringTop] = useState(false);
  const [isHoveringBottom, setIsHoveringBottom] = useState(false);

  const handleMouseEnterTop = () => {
    setActiveBannerTop(getRandomBanner(activeBannerTop));
    setIsHoveringTop(true);
  };

  const handleMouseLeaveTop = () => {
    setIsHoveringTop(false);
  };

  const handleMouseEnterBottom = () => {
    setActiveBannerBottom(getRandomBanner(activeBannerBottom));
    setIsHoveringBottom(true);
  };

  const handleMouseLeaveBottom = () => {
    setIsHoveringBottom(false);
  };

  // Extract all unique anime series from video data
  const allAnimeList = useMemo(() => {
    const set = new Set<string>();
    YOUTUBE_VIDEOS.forEach((v) => {
      if (v.anime?.trim()) set.add(v.anime.trim());
    });
    return Array.from(set);
  }, []);

  // Multi-select state: Set of checked animes and Set of checked types
  const [selectedAnimes, setSelectedAnimes] = useState<Set<string>>(() => {
    const set = new Set<string>();
    YOUTUBE_VIDEOS.forEach((v) => {
      if (v.anime?.trim()) set.add(v.anime.trim());
    });
    return set;
  });

  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    () => new Set(['op', 'end', 'ost'])
  );

  // Filter videos based on checked animes & types
  const filteredVideos = useMemo(() => {
    const matched = YOUTUBE_VIDEOS.filter((v) => {
      const animeMatch = v.anime ? selectedAnimes.has(v.anime) : false;
      const typeMatch = v.category ? selectedTypes.has(v.category) : false;
      return animeMatch && typeMatch;
    });

    const readyVideos = matched.filter((v) => v.youtubeUrlOrId?.trim() !== '');
    return readyVideos.length >= 2 ? readyVideos : matched;
  }, [selectedAnimes, selectedTypes]);

  // Count videos per anime for sidebar badges
  const animeVideoCounts = useMemo(() => {
    const map: Record<string, number> = {};
    YOUTUBE_VIDEOS.forEach((v) => {
      if (v.anime?.trim()) {
        map[v.anime.trim()] = (map[v.anime.trim()] || 0) + 1;
      }
    });
    return map;
  }, []);

  // Blind Ranking State
  const [rankingPool, setRankingPool] = useState<YouTubeVideoItem[]>([]);
  const [currentRankIndex, setCurrentRankIndex] = useState(0);
  const [slots, setSlots] = useState<(YouTubeVideoItem | null)[]>([]);

  // Either / Or 10-Round King-of-the-Hill State
  const [eitherOrRound, setEitherOrRound] = useState<number>(1);
  const [champVideo, setChampVideo] = useState<YouTubeVideoItem | null>(null);
  const [challengerVideo, setChallengerVideo] = useState<YouTubeVideoItem | null>(null);
  const [usedVideoIds, setUsedVideoIds] = useState<Set<string>>(new Set());
  const [streakCount, setStreakCount] = useState<number>(1);
  const [isEitherOrFinished, setIsEitherOrFinished] = useState<boolean>(false);
  type AnimPhase = 'idle' | 'left-won' | 'right-won' | 'challenger-entering';
  const [animPhase, setAnimPhase] = useState<AnimPhase>('idle');

  const animTimeoutsRef = React.useRef<number[]>([]);
  const clearAnimTimeouts = () => {
    animTimeoutsRef.current.forEach(clearTimeout);
    animTimeoutsRef.current = [];
  };
  const addAnimTimeout = (cb: () => void, ms: number) => {
    const id = window.setTimeout(cb, ms);
    animTimeoutsRef.current.push(id);
    return id;
  };

  React.useEffect(() => {
    return () => {
      clearAnimTimeouts();
    };
  }, []);

  // Initialize Blind Ranking
  const startBlindRanking = (videos = filteredVideos) => {
    clearAnimTimeouts();
    const count = Math.min(5, videos.length);
    const picked = shuffleAndPick(videos, count);

    setRankingPool(picked);
    setCurrentRankIndex(0);
    setSlots(new Array(count).fill(null));
    setGameMode('blind-ranking');
  };

  // Helper to pick next challenger distinct from winner
  const pickNextChallenger = (
    currentWinner: YouTubeVideoItem,
    alreadyUsed: Set<string>,
    pool: YouTubeVideoItem[]
  ): YouTubeVideoItem | null => {
    // Candidates not equal to winner and not yet used
    const unused = pool.filter((v) => v.id !== currentWinner.id && !alreadyUsed.has(v.id));
    if (unused.length > 0) {
      const shuffled = shuffleAndPick(unused, 1);
      return shuffled[0];
    }
    // If all used, pick any different video from pool
    const anyDifferent = pool.filter((v) => v.id !== currentWinner.id);
    if (anyDifferent.length > 0) {
      const shuffled = shuffleAndPick(anyDifferent, 1);
      return shuffled[0];
    }
    return null;
  };

  // Initialize Either / Or (10 Rounds King-of-the-Hill)
  const startEitherOr = (videos = filteredVideos) => {
    clearAnimTimeouts();
    const picked = shuffleAndPick(videos, 2);
    if (picked.length >= 2) {
      setChampVideo(picked[0]);
      setChallengerVideo(picked[1]);
      setUsedVideoIds(new Set([picked[0].id, picked[1].id]));
      setStreakCount(1);
    } else {
      setChampVideo(null);
      setChallengerVideo(null);
    }
    setEitherOrRound(1);
    setIsEitherOrFinished(false);
    setAnimPhase('idle');
    setGameMode('either-or');
  };

  // Handle automatic Either / Or choice selection with drop-down, slide-over, and slide-up animations
  const handleEitherOrChoice = (side: 'left' | 'right') => {
    if (animPhase !== 'idle' || isEitherOrFinished || !champVideo || !challengerVideo) {
      return;
    }

    clearAnimTimeouts();
    const winner = side === 'left' ? champVideo : challengerVideo;

    if (side === 'left') {
      // 1. Right card (loser) drops below the screen. Left card stays in place.
      setAnimPhase('left-won');

      addAnimTimeout(() => {
        const nextStreak = streakCount + 1;
        setStreakCount(nextStreak);

        if (eitherOrRound >= TOTAL_EITHER_OR_ROUNDS) {
          setChampVideo(winner);
          setIsEitherOrFinished(true);
          setAnimPhase('idle');
        } else {
          const updatedUsed = new Set(usedVideoIds);
          const nextChallenger = pickNextChallenger(winner, updatedUsed, filteredVideos);
          if (nextChallenger) updatedUsed.add(nextChallenger.id);

          setChampVideo(winner);
          setChallengerVideo(nextChallenger);
          setUsedVideoIds(updatedUsed);
          setEitherOrRound((prev) => prev + 1);

          // Position new challenger below the screen
          setAnimPhase('challenger-entering');

          // Slide new challenger UP into its place on the right
          addAnimTimeout(() => {
            setAnimPhase('idle');
          }, 40);
        }
      }, 480);
    } else {
      // 2. Left card (loser) drops below screen. Right card (winner) slides across to the left!
      setAnimPhase('right-won');

      addAnimTimeout(() => {
        setStreakCount(1);

        if (eitherOrRound >= TOTAL_EITHER_OR_ROUNDS) {
          setChampVideo(winner);
          setIsEitherOrFinished(true);
          setAnimPhase('idle');
        } else {
          const updatedUsed = new Set(usedVideoIds);
          const nextChallenger = pickNextChallenger(winner, updatedUsed, filteredVideos);
          if (nextChallenger) updatedUsed.add(nextChallenger.id);

          // Winner now permanently takes the left throne!
          setChampVideo(winner);
          setChallengerVideo(nextChallenger);
          setUsedVideoIds(updatedUsed);
          setEitherOrRound((prev) => prev + 1);

          // Position new challenger below the screen
          setAnimPhase('challenger-entering');

          // Slide new challenger UP into its place on the right
          addAnimTimeout(() => {
            setAnimPhase('idle');
          }, 40);
        }
      }, 550);
    }
  };

  // Toggle single anime checkbox
  const toggleAnime = (anime: string) => {
    const next = new Set(selectedAnimes);
    if (next.has(anime)) {
      next.delete(anime);
    } else {
      next.add(anime);
    }
    setSelectedAnimes(next);
  };

  // Select all or deselect all anime
  const toggleAllAnimes = () => {
    if (selectedAnimes.size === allAnimeList.length) {
      setSelectedAnimes(new Set());
    } else {
      setSelectedAnimes(new Set(allAnimeList));
    }
  };

  // Toggle single type checkbox
  const toggleType = (type: string) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    setSelectedTypes(next);
  };

  // Select all or deselect all types
  const toggleAllTypes = () => {
    if (selectedTypes.size === ALL_TYPES.length) {
      setSelectedTypes(new Set());
    } else {
      setSelectedTypes(new Set(ALL_TYPES));
    }
  };

  const resetAllFilters = () => {
    setSelectedAnimes(new Set(allAnimeList));
    setSelectedTypes(new Set(ALL_TYPES));
  };

  const refreshActiveGame = () => {
    if (gameMode === 'blind-ranking') {
      startBlindRanking(filteredVideos);
    } else if (gameMode === 'either-or') {
      startEitherOr(filteredVideos);
    }
  };

  // Handle blind ranking slot pick
  const handleSlotPick = (slotIndex: number) => {
    if (slots[slotIndex] !== null || !rankingPool[currentRankIndex]) return;

    const updated = [...slots];
    updated[slotIndex] = rankingPool[currentRankIndex];
    setSlots(updated);
    setCurrentRankIndex((prev) => prev + 1);
  };

  const isBlindRankingComplete = slots.length > 0 && slots.every((s) => s !== null);
  const currentRankingVideo = rankingPool[currentRankIndex];

  const hasFilterCustomization =
    selectedAnimes.size !== allAnimeList.length || selectedTypes.size !== ALL_TYPES.length;

  return (
    <div className="min-h-screen bg-[#0d1d2b] text-white flex flex-col justify-between font-sans selection:bg-white/20 relative overflow-x-hidden">
      {/* GAME BACKGROUND LAYER (CONFIGURED IN src/data/branding.ts) */}
      {resolvedBgUrl && !bgError ? (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={resolvedBgUrl}
            alt="Game Background"
            onError={() => setBgError(true)}
            className="w-full h-full object-cover object-center transition-opacity duration-700"
            style={{
              filter: BRANDING_CONFIG.backgroundBlur ? `blur(${BRANDING_CONFIG.backgroundBlur}px)` : undefined,
              transform: BRANDING_CONFIG.backgroundBlur ? 'scale(1.04)' : undefined,
            }}
          />
          {/* Readability & Tint Overlays to keep HUD and video players high-contrast and crystal clear */}
          <div
            className="absolute inset-0 bg-[#09141f]"
            style={{ opacity: BRANDING_CONFIG.backgroundDim ?? 0.45 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09141f]/95 via-transparent to-[#09141f]/75" />
        </div>
      ) : (
        /* Default anime atmospheric gradient if no background image is set or if loading fails */
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#19354d] bg-gradient-to-b from-[#19354d] via-[#142a3e] to-[#0d1d2b]" />
      )}

      {/* FLOATING HUD HEADER (SOFT EDGES) */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-4 z-30 relative">
        <button
          onClick={() => setGameMode('menu')}
          className="flex items-center gap-3 sm:gap-5 md:gap-6 cursor-pointer group transition-transform hover:scale-[1.02] active:scale-[0.98]"
          title="Return to Main Menu"
        >
          <HeaderImageBox
            isAlternate={isLogoAlternate}
            isGlitching={isLogoGlitching}
            onTriggerGlitch={triggerLogoGlitch}
          />
          <div className="flex flex-col items-center text-center">
            <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-widest text-white uppercase text-center select-none">
              {BRANDING_CONFIG.title}
            </span>
            {gameMode !== 'menu' && (
              <span className="text-[11px] sm:text-sm font-extrabold tracking-widest text-white/70 uppercase">
                {gameMode === 'blind-ranking' ? 'BLIND RANK' : 'EITHER / OR'}
              </span>
            )}
          </div>
          <HeaderImageBox
            isAlternate={isLogoAlternate}
            isGlitching={isLogoGlitching}
            onTriggerGlitch={triggerLogoGlitch}
          />
        </button>

        {gameMode !== 'menu' && (
          <div className="absolute right-4 sm:right-6 flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (gameMode === 'blind-ranking') startBlindRanking();
                if (gameMode === 'either-or') startEitherOr();
              }}
              title="Restart"
              className="p-2 sm:p-2.5 rounded-2xl bg-[#102232] hover:bg-white hover:text-[#19354d] text-white border-2 border-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setGameMode('menu')}
              title="Main Menu"
              className="p-2 sm:p-2.5 rounded-2xl bg-[#102232] hover:bg-white hover:text-[#19354d] text-white border-2 border-white/20 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </header>

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center px-4 sm:px-6 py-1 sm:py-2 relative z-10">
        {filteredVideos.length < 2 ? (
          <div className="bg-[#102232] rounded-3xl p-10 border-2 border-white/20 max-w-md mx-auto text-center space-y-6 shadow-2xl">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white tracking-widest uppercase">
                NEED AT LEAST 2 VIDEOS
              </h2>
              <button
                onClick={resetAllFilters}
                className="w-full py-4 rounded-2xl bg-white text-[#102232] font-black text-sm uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                RESET PRESETS
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* VIEW 1: ELEVATING PARALLELOGRAM BUTTONS */}
            {gameMode === 'menu' && (
              <div className="w-full max-w-4xl mx-auto my-auto flex flex-col items-center justify-center px-2 sm:px-6">
                {/* Top Parallelogram: Blind Ranking */}
                <button
                  type="button"
                  onClick={() => startBlindRanking()}
                  onMouseEnter={handleMouseEnterTop}
                  onMouseLeave={handleMouseLeaveTop}
                  className={`group relative w-full h-36 sm:h-44 md:h-48 bg-[#102232] -skew-x-12 rounded-none border-2 transition-all duration-500 ease-out cursor-pointer flex items-center justify-between px-8 sm:px-14 active:scale-[0.99] overflow-hidden ${
                    isHoveringTop
                      ? '-translate-y-2.5 z-20 border-white shadow-2xl'
                      : 'translate-y-0 z-10 border-white/20 hover:border-white/60 shadow-xl'
                  }`}
                >
                  <div
                    className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden transition-opacity duration-700 ease-out ${
                      isHoveringTop ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={activeBannerTop.url}
                      alt=""
                      className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#102232] via-[#102232]/80 to-[#102232]/40" />
                  </div>

                  <div className="skew-x-12 relative z-10 flex items-center gap-5 sm:gap-8 text-left">
                    <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-none bg-white text-[#102232] flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 shadow-lg">
                      01
                    </span>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-none bg-white/10 text-white/80 text-[11px] font-black tracking-widest uppercase mb-1.5 border border-white/15">
                        5 SLOTS
                      </span>
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                        BLIND RANKING
                      </h2>
                    </div>
                  </div>

                  <div className="skew-x-12 relative z-10 hidden sm:flex items-center gap-3">
                    <span className="text-sm font-black tracking-wider uppercase text-white/70 group-hover:text-white transition-colors">
                      PLAY
                    </span>
                    <div className="w-12 h-12 rounded-none bg-white/10 group-hover:bg-white group-hover:text-[#102232] text-white flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-6 h-6 stroke-[3]" />
                    </div>
                  </div>
                </button>

                {/* Bottom Parallelogram: Either / Or (10 Rounds King-of-the-Hill) */}
                <button
                  type="button"
                  onClick={() => startEitherOr()}
                  onMouseEnter={handleMouseEnterBottom}
                  onMouseLeave={handleMouseLeaveBottom}
                  className={`group relative w-full h-36 sm:h-44 md:h-48 bg-[#102232] -skew-x-12 rounded-none border-2 transition-all duration-500 ease-out cursor-pointer flex items-center justify-between px-8 sm:px-14 active:scale-[0.99] -mt-[2px] overflow-hidden ${
                    isHoveringBottom
                      ? '-translate-y-2.5 z-20 border-white shadow-2xl'
                      : 'translate-y-0 z-10 border-white/20 hover:border-white/60 shadow-xl'
                  }`}
                >
                  <div
                    className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden transition-opacity duration-700 ease-out ${
                      isHoveringBottom ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={activeBannerBottom.url}
                      alt=""
                      className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#102232] via-[#102232]/80 to-[#102232]/40" />
                  </div>

                  <div className="skew-x-12 relative z-10 flex items-center gap-5 sm:gap-8 text-left">
                    <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-none bg-white text-[#102232] flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 shadow-lg">
                      02
                    </span>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-none bg-white/10 text-white/80 text-[11px] font-black tracking-widest uppercase mb-1.5 border border-white/15">
                        10 ROUNDS
                      </span>
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                        EITHER / OR
                      </h2>
                    </div>
                  </div>

                  <div className="skew-x-12 relative z-10 hidden sm:flex items-center gap-3">
                    <span className="text-sm font-black tracking-wider uppercase text-white/70 group-hover:text-white transition-colors">
                      PLAY
                    </span>
                    <div className="w-12 h-12 rounded-none bg-white/10 group-hover:bg-white group-hover:text-[#102232] text-white flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-6 h-6 stroke-[3]" />
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* VIEW 2: COMPACT NO-SCROLL BLIND RANKING (SHOWS VIDEO IN EVERY RANK) */}
            {gameMode === 'blind-ranking' && (
              <div className="w-full max-w-6xl mx-auto flex flex-col my-auto py-1">
                {!isBlindRankingComplete && currentRankingVideo ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                    {/* Left Column: Current Contender Stage */}
                    <div className="lg:col-span-7 bg-[#102232] rounded-3xl p-4 sm:p-6 border-2 border-white/20 shadow-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl bg-white text-[#102232] text-[11px] font-black uppercase tracking-widest shadow-sm">
                              {currentRankingVideo.anime || 'ANIME'}
                            </span>
                            {currentRankingVideo.category && (
                              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-[11px] font-black uppercase tracking-wider text-white">
                                {currentRankingVideo.category.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-black tracking-widest uppercase text-white/50">
                            CARD {currentRankIndex + 1} OF {slots.length}
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight mb-3 truncate">
                          {currentRankingVideo.title}
                        </h2>
                      </div>

                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mb-3 border-2 border-white/10 shadow-2xl max-h-[250px] sm:max-h-[280px]">
                        {currentRankingVideo.youtubeUrlOrId?.trim() ? (
                          <iframe
                            key={currentRankingVideo.id}
                            src={getYouTubeEmbedUrl(currentRankingVideo.youtubeUrlOrId, true)}
                            title={currentRankingVideo.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/30 uppercase tracking-widest">
                            NO EMBED URL
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-[11px] font-black tracking-widest uppercase text-white/40 mb-1.5">
                          CHOOSE RANK SLOT:
                        </div>
                        <div
                          className="grid gap-2"
                          style={{
                            gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))`,
                          }}
                        >
                          {slots.map((_, slotIdx) => {
                            const isTaken = slots[slotIdx] !== null;
                            return (
                              <button
                                key={slotIdx}
                                disabled={isTaken}
                                onClick={() => handleSlotPick(slotIdx)}
                                className={`py-3 sm:py-3.5 rounded-xl font-black text-base sm:text-lg transition-all duration-150 border-2 cursor-pointer ${
                                  isTaken
                                    ? 'bg-black/30 text-white/10 border-transparent cursor-not-allowed line-through'
                                    : 'bg-[#19354d] hover:bg-white hover:text-[#102232] text-white border-white/20 hover:border-white active:scale-95 shadow-md'
                                }`}
                              >
                                #{slotIdx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Live Ranks Shelf (Each song shows video embed!) */}
                    <div className="lg:col-span-5 bg-[#102232] rounded-3xl p-4 sm:p-5 border-2 border-white/15 shadow-xl flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/15">
                        <h3 className="text-xs font-black text-white/70 tracking-widest uppercase">
                          YOUR RANKS
                        </h3>
                        <span className="text-[11px] font-bold text-white/40 uppercase">
                          {slots.filter((s) => s !== null).length} / {slots.length} LOCKED
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 flex-1 justify-between">
                        {slots.map((filled, slotIdx) => {
                          const isTaken = filled !== null;
                          return isTaken ? (
                            /* FILLED RANK SLOT WITH VIDEO EMBED */
                            <div
                              key={slotIdx}
                              className="p-2 sm:p-2.5 rounded-2xl bg-black/40 border-2 border-white/20 shadow-md flex items-center justify-between gap-3 min-h-[64px]"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <span
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                    slotIdx === 0
                                      ? 'bg-white text-[#102232] shadow-sm'
                                      : 'bg-[#19354d] text-white border border-white/20'
                                  }`}
                                >
                                  #{slotIdx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-black text-white truncate" title={filled.title}>
                                    {filled.title}
                                  </h4>
                                  <p className="text-[10px] font-bold text-white/50 truncate uppercase">
                                    {filled.anime}
                                    {filled.category ? ` • ${filled.category.toUpperCase()}` : ''}
                                  </p>
                                </div>
                              </div>

                              {/* VIDEO EMBED IN RANKED SLOT */}
                              <div
                                className="w-24 sm:w-28 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-white/15 shadow-inner"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {filled.youtubeUrlOrId?.trim() ? (
                                  <iframe
                                    src={getYouTubeEmbedUrl(filled.youtubeUrlOrId)}
                                    title={filled.title}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-white/30 font-bold">
                                    NO VIDEO
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* EMPTY RANK SLOT (Clickable) */
                            <button
                              key={slotIdx}
                              onClick={() => handleSlotPick(slotIdx)}
                              className="p-2.5 rounded-2xl bg-[#19354d]/30 border-2 border-dashed border-white/20 hover:border-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between group min-h-[58px]"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 text-white/50 group-hover:bg-white group-hover:text-[#102232] flex items-center justify-center font-black text-xs shrink-0 transition-colors">
                                  #{slotIdx + 1}
                                </span>
                                <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-wider transition-colors">
                                  OPEN SLOT
                                </span>
                              </div>
                              <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-white/10 group-hover:bg-white group-hover:text-[#102232] text-white/50 uppercase tracking-widest transition-colors">
                                TAP
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Completed Leaderboard (Fits without scrolling, every rank shows video) */
                  <div className="max-w-6xl mx-auto w-full space-y-3">
                    <div className="bg-[#102232] rounded-3xl p-4 sm:p-5 border-2 border-white/20 shadow-2xl space-y-3">
                      <div className="flex items-center justify-between pb-2.5 border-b border-white/15">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-white text-[#102232] flex items-center justify-center shadow-md">
                            <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <h2 className="text-base sm:text-lg font-black text-white tracking-widest uppercase">
                            FINAL RANKINGS LOCKED
                          </h2>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-white text-[#102232] text-[11px] font-black uppercase">
                          COMPLETE
                        </span>
                      </div>

                      {/* All ranked songs side-by-side with video embeds */}
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
                        style={{
                          gridTemplateColumns:
                            typeof window !== 'undefined' && window.innerWidth >= 640
                              ? `repeat(${slots.length}, minmax(0, 1fr))`
                              : undefined,
                        }}
                      >
                        {slots.map((item, idx) => {
                          if (!item) return null;
                          const isGold = idx === 0;

                          return (
                            <div
                              key={idx}
                              className={`flex flex-col justify-between p-3 rounded-2xl border-2 transition-all ${
                                isGold
                                  ? 'bg-black/50 border-white shadow-xl ring-2 ring-white/20'
                                  : 'bg-black/30 border-white/15'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-xl flex items-center justify-center font-black text-xs ${
                                      isGold
                                        ? 'bg-white text-[#102232] shadow-md'
                                        : 'bg-[#19354d] text-white border border-white/20'
                                    }`}
                                  >
                                    #{idx + 1}
                                  </span>
                                  <span className="text-[10px] font-black text-white/60 truncate uppercase max-w-[90px]">
                                    {item.anime}
                                  </span>
                                </div>

                                {/* VIDEO EMBED */}
                                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-2 border border-white/15 shadow-inner">
                                  {item.youtubeUrlOrId?.trim() ? (
                                    <iframe
                                      src={getYouTubeEmbedUrl(item.youtubeUrlOrId)}
                                      title={item.title}
                                      className="w-full h-full border-0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30 font-bold">
                                      NO VIDEO
                                    </div>
                                  )}
                                </div>

                                <h3 className="text-xs font-black text-white truncate" title={item.title}>
                                  {item.title}
                                </h3>
                              </div>

                              <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white/50 uppercase">
                                  {item.category?.toUpperCase() || 'SONG'}
                                </span>
                                {isGold && (
                                  <span className="text-[9px] font-black text-white uppercase tracking-wider">
                                    #1 CHOICE
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-center gap-3 pt-1">
                        <button
                          onClick={() => startBlindRanking()}
                          className="px-6 py-2.5 sm:py-3 rounded-2xl bg-white text-[#102232] font-black text-xs uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-all shadow-xl cursor-pointer"
                        >
                          PLAY AGAIN
                        </button>
                        <button
                          onClick={() => setGameMode('menu')}
                          className="px-6 py-2.5 sm:py-3 rounded-2xl bg-[#102232] hover:bg-white hover:text-[#102232] text-white font-black text-xs uppercase tracking-wider border-2 border-white/20 transition-all cursor-pointer"
                        >
                          MENU
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: 10-ROUND KING-OF-THE-HILL EITHER / OR */}
            {gameMode === 'either-or' && champVideo && (
              <div className="w-full max-w-6xl mx-auto flex flex-col my-auto space-y-6">
                {!isEitherOrFinished && challengerVideo ? (
                  <>
                    {/* Round Tracker HUD */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 rounded-2xl bg-[#102232] border-2 border-white/20 text-xs sm:text-sm font-black tracking-widest uppercase">
                          ROUND {eitherOrRound} OF {TOTAL_EITHER_OR_ROUNDS}
                        </span>
                        {streakCount > 1 && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-[#102232] text-xs font-black shadow-md">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            <span>{streakCount} STREAK</span>
                          </div>
                        )}
                      </div>

                      {/* 10-Round Progress Dots */}
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: TOTAL_EITHER_OR_ROUNDS }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              idx + 1 === eitherOrRound
                                ? 'w-6 bg-white'
                                : idx + 1 < eitherOrRound
                                ? 'w-2 bg-white/70'
                                : 'w-2 bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Dual Matchup Arena with Drop-down and Slide-over animations */}
                    <div
                      className="relative overflow-hidden py-3 px-1 -mx-1"
                      style={{ '--arena-gap': '2rem' } as React.CSSProperties}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative">
                        {/* Floating Center VS Emblem */}
                        <div
                          className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white text-[#102232] items-center justify-center font-black text-base shadow-2xl border-4 border-[#19354d] transition-all duration-300 ${
                            animPhase !== 'idle' ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'
                          }`}
                        >
                          VS
                        </div>

                        {/* LEFT SIDE: DEFENDING CHAMPION (Moves here & stays until beaten) */}
                        <div
                          onClick={() => handleEitherOrChoice('left')}
                          className={`group relative bg-[#102232] rounded-3xl p-6 sm:p-8 border-2 shadow-2xl flex flex-col justify-between ${
                            animPhase === 'right-won'
                              ? 'translate-y-[150%] opacity-0 pointer-events-none transition-all duration-500 ease-in z-0'
                              : animPhase === 'left-won'
                              ? 'border-white ring-8 ring-white/30 scale-[1.01] z-20 transition-all duration-300'
                              : 'border-white/20 hover:border-white hover:scale-[1.005] translate-y-0 opacity-100 transition-all duration-300 cursor-pointer'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-xl bg-white text-[#102232] text-[11px] font-black uppercase tracking-wider shadow-sm">
                                  {animPhase === 'left-won'
                                    ? 'STAYS ON LEFT'
                                    : streakCount > 1
                                    ? `DEFENDING (${streakCount} WINS)`
                                    : eitherOrRound === 1
                                    ? 'LEFT SIDE'
                                    : 'DEFENDING'}
                                </span>
                                <span className="px-3 py-1 rounded-xl bg-white/10 text-white text-[11px] font-black uppercase tracking-widest border border-white/15">
                                  {champVideo.anime}
                                </span>
                              </div>
                              {champVideo.category && (
                                <span className="px-2.5 py-1 rounded-xl bg-white/10 text-white text-[11px] font-black uppercase tracking-wider">
                                  {champVideo.category.toUpperCase()}
                                </span>
                              )}
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-5">
                              {champVideo.title}
                            </h2>
                          </div>

                          <div
                            className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mb-6 border-2 border-white/10 shadow-inner"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {champVideo.youtubeUrlOrId?.trim() ? (
                              <iframe
                                src={getYouTubeEmbedUrl(champVideo.youtubeUrlOrId)}
                                title={champVideo.title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/30">
                                NO VIDEO
                              </div>
                            )}
                          </div>

                          <div>
                            <button
                              type="button"
                              disabled={animPhase !== 'idle'}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEitherOrChoice('left');
                              }}
                              className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wider transition-all duration-150 cursor-pointer border-2 ${
                                animPhase === 'left-won'
                                  ? 'bg-white text-[#102232] border-white shadow-2xl scale-[1.01]'
                                  : 'bg-[#19354d] hover:bg-white hover:text-[#102232] text-white border-white/20 hover:border-white active:scale-98'
                              }`}
                            >
                              {animPhase === 'left-won' ? 'WINNER • STAYS ON LEFT' : 'CHOOSE THIS'}
                            </button>
                          </div>
                        </div>

                        {/* RIGHT SIDE: CHALLENGER (Defeating Left moves this video to the Left!) */}
                        <div
                          onClick={() => handleEitherOrChoice('right')}
                          className={`group relative bg-[#102232] rounded-3xl p-6 sm:p-8 border-2 shadow-2xl flex flex-col justify-between ${
                            animPhase === 'left-won'
                              ? 'translate-y-[150%] opacity-0 pointer-events-none transition-all duration-500 ease-in z-0'
                              : animPhase === 'right-won'
                              ? 'md:translate-x-[calc(-100%-var(--arena-gap))] translate-y-[calc(-100%-var(--arena-gap))] md:translate-y-0 border-white ring-8 ring-white/30 scale-[1.01] z-30 transition-transform duration-500 ease-in-out shadow-2xl pointer-events-none'
                              : animPhase === 'challenger-entering'
                              ? 'translate-y-[140%] opacity-0 transition-none z-10 pointer-events-none'
                              : 'border-white/20 hover:border-white hover:scale-[1.005] translate-y-0 opacity-100 transition-all duration-400 ease-out cursor-pointer z-10'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-colors ${
                                    animPhase === 'right-won'
                                      ? 'bg-white text-[#102232] border-white shadow-sm'
                                      : 'bg-white/15 text-white border-white/20'
                                  }`}
                                >
                                  {animPhase === 'right-won' ? 'WINNER • SLIDING OVER' : 'CHALLENGER'}
                                </span>
                                <span className="px-3 py-1 rounded-xl bg-white/10 text-white text-[11px] font-black uppercase tracking-widest border border-white/15">
                                  {challengerVideo.anime}
                                </span>
                              </div>
                              {challengerVideo.category && (
                                <span className="px-2.5 py-1 rounded-xl bg-white/10 text-white text-[11px] font-black uppercase tracking-wider">
                                  {challengerVideo.category.toUpperCase()}
                                </span>
                              )}
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-5">
                              {challengerVideo.title}
                            </h2>
                          </div>

                          <div
                            className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mb-6 border-2 border-white/10 shadow-inner"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {challengerVideo.youtubeUrlOrId?.trim() ? (
                              <iframe
                                src={getYouTubeEmbedUrl(challengerVideo.youtubeUrlOrId)}
                                title={challengerVideo.title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/30">
                                NO VIDEO
                              </div>
                            )}
                          </div>

                          <div>
                            <button
                              type="button"
                              disabled={animPhase !== 'idle'}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEitherOrChoice('right');
                              }}
                              className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wider transition-all duration-150 cursor-pointer border-2 ${
                                animPhase === 'right-won'
                                  ? 'bg-white text-[#102232] border-white shadow-2xl scale-[1.01]'
                                  : 'bg-[#19354d] hover:bg-white hover:text-[#102232] text-white border-white/20 hover:border-white active:scale-98'
                              }`}
                            >
                              {animPhase === 'right-won' ? 'WINNER • SLIDING OVER' : 'CHOOSE THIS'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* 10-ROUND SURVIVOR / FINAL CHAMPION REVEAL */
                  <div className="max-w-2xl mx-auto w-full space-y-6 text-center">
                    <div className="bg-[#102232] rounded-3xl p-8 sm:p-10 border-2 border-white/25 shadow-2xl space-y-6">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-white text-[#102232] flex items-center justify-center shadow-xl mb-1">
                          <Trophy className="w-8 h-8 stroke-[2.5]" />
                        </div>
                        <span className="text-xs font-black tracking-widest text-white/50 uppercase">
                          10 ROUNDS COMPLETED
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                          UNDISPUTED CHAMPION
                        </h2>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/40 border-2 border-white/15 text-left space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-3.5 py-1.5 rounded-xl bg-white text-[#102232] text-xs font-black uppercase">
                            {champVideo.anime}
                          </span>
                          {champVideo.category && (
                            <span className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-black uppercase">
                              {champVideo.category.toUpperCase()}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {champVideo.title}
                        </h3>

                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                          {champVideo.youtubeUrlOrId?.trim() ? (
                            <iframe
                              src={getYouTubeEmbedUrl(champVideo.youtubeUrlOrId)}
                              title={champVideo.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/30">
                              NO VIDEO
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <button
                          onClick={() => startEitherOr()}
                          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-[#102232] font-black text-sm uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-all shadow-xl cursor-pointer"
                        >
                          PLAY AGAIN
                        </button>
                        <button
                          onClick={() => setGameMode('menu')}
                          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#19354d] hover:bg-white hover:text-[#102232] text-white font-black text-sm uppercase tracking-wider border-2 border-white/20 transition-all cursor-pointer"
                        >
                          MAIN MENU
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER PADDING */}
      <footer className="w-full max-w-6xl mx-auto py-3 relative z-10" />

      {/* INVISIBLE RIGHT-EDGE HOVER TRIGGER STRIP */}
      <div
        onMouseEnter={() => setIsSidebarHovered(true)}
        className="fixed right-0 top-0 bottom-0 w-8 sm:w-10 z-40 cursor-pointer"
      />

      {/* PRESETS SIDEBAR DRAWER (TRANSLUCENT BACKGROUND + SOFT EDGES) */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`fixed right-0 top-0 bottom-0 w-full max-w-xs sm:max-w-md bg-[#0d1d2b]/80 backdrop-blur-md h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto z-50 border-l-2 border-white/20 transition-transform duration-300 ease-out ${
          isSidebarHovered ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white" />
              <h2 className="text-xl font-black text-white uppercase tracking-widest">
                PRESETS
              </h2>
            </div>
            <button
              onClick={() => setIsSidebarHovered(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white hover:text-[#0d1d2b] text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {/* Anime Series Multi-Select Checkboxes (Soft Rounded) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-white/50">
                ANIME SERIES
              </span>
              <button
                onClick={toggleAllAnimes}
                className="text-xs font-black text-white hover:underline uppercase tracking-wider cursor-pointer"
              >
                {selectedAnimes.size === allAnimeList.length ? 'DESELECT ALL' : 'SELECT ALL'}
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {allAnimeList.map((animeName) => {
                const isChecked = selectedAnimes.has(animeName);
                const count = animeVideoCounts[animeName] || 0;

                return (
                  <label
                    key={animeName}
                    onClick={() => toggleAnime(animeName)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-white text-[#0d1d2b] border-white shadow-md'
                        : 'bg-black/40 border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 ${
                          isChecked
                            ? 'bg-[#0d1d2b] border-[#0d1d2b] text-white'
                            : 'border-white/30 bg-transparent'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-black truncate">{animeName}</span>
                    </div>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ml-2 ${
                        isChecked
                          ? 'bg-[#0d1d2b]/15 text-[#0d1d2b]'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Types Multi-Select Checkboxes (Soft Rounded) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-white/50">
                SONG TYPES
              </span>
              <button
                onClick={toggleAllTypes}
                className="text-xs font-black text-white hover:underline uppercase tracking-wider cursor-pointer"
              >
                {selectedTypes.size === ALL_TYPES.length ? 'DESELECT ALL' : 'SELECT ALL'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {ALL_TYPES.map((typeKey) => {
                const isChecked = selectedTypes.has(typeKey);
                return (
                  <button
                    key={typeKey}
                    onClick={() => toggleType(typeKey)}
                    className={`py-3 px-2 rounded-2xl border-2 font-black text-sm uppercase tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isChecked
                        ? 'bg-white text-[#0d1d2b] border-white shadow-md'
                        : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span>{TYPE_LABELS[typeKey]}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions (Soft Rounded) */}
        <div className="pt-6 border-t border-white/15 space-y-3">
          <div className="text-xs font-black uppercase tracking-widest text-white/50 text-center">
            {filteredVideos.length} VIDEOS IN POOL
          </div>

          {hasFilterCustomization && (
            <button
              onClick={resetAllFilters}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-white/20"
            >
              RESET FILTERS
            </button>
          )}

          <button
            onClick={() => {
              setIsSidebarHovered(false);
              refreshActiveGame();
            }}
            className="w-full py-4 rounded-2xl bg-white text-[#0d1d2b] font-black text-sm uppercase tracking-wider hover:bg-white/90 active:scale-95 transition-all cursor-pointer shadow-2xl"
          >
            APPLY FILTERS
          </button>
        </div>
      </aside>
    </div>
  );
}
