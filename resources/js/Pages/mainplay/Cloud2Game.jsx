import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

const CLOUD_IMG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/cloud.PNG';
const ROCK_PLATFORM_IMG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/rock platform.webp';
const BAG_IMG = '/assets/img/The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Bag Icon.webp';

const WIN_SCORE = 10;

// Generate a row: 3 objects = 2 rocks + 1 cloud in random order
function generateRow() {
    const row = ['rock', 'rock', 'cloud'];
    for (let i = row.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [row[i], row[j]] = [row[j], row[i]];
    }
    return row;
}

// Center of each slot in a 3-column grid
const ROW_LEFT_PERCENT = [16.67, 50, 83.33];

// Vertical offset per row: lower = bag sits higher on the rock
const ROW_TOP_OFFSET = 10;

// Initial platforms: upper, middle, lower (bag starts on lower center)
const INITIAL_PLATFORMS = [
    generateRow(),
    generateRow(),
    ['rock', 'rock', 'cloud'], // lower - ensure center rock for start
];

function PlatformRow({ row, platformTypes }) {
    return (
        <div className="h-[33.33%] min-h-0 grid grid-cols-3 place-items-center relative shrink-0">
            {platformTypes.map((type, i) =>
                type === 'rock' ? (
                    <img
                        key={i}
                        src={encodeURI(ROCK_PLATFORM_IMG)}
                        alt=""
                        className="w-[min(44vw,380px)] h-auto object-contain object-bottom pointer-events-none"
                    />
                ) : (
                    <img
                        key={i}
                        src={encodeURI(CLOUD_IMG)}
                        alt=""
                        className="w-[min(36vw,320px)] h-auto object-contain pointer-events-none"
                    />
                )
            )}
        </div>
    );
}

export default function Cloud2Game() {
    const { playBGM, stopBGM, playSFX } = useAudio() ?? {};
    const [platforms, setPlatforms] = useState(INITIAL_PLATFORMS);
    const [score, setScore] = useState(0);
    const [row, setRow] = useState(2);  // start at lower
    const [pos, setPos] = useState(1);   // start on center rock
    const [isFalling, setIsFalling] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isBouncing, setIsBouncing] = useState(false);
    const [isShifting, setIsShifting] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [jumpArc, setJumpArc] = useState(null);
    const [shiftContent, setShiftContent] = useState(null); // [newUpper, newMiddle, oldUpper, oldMiddle, oldLower] during shift

    const getNextRow = useCallback((currentRow) => (currentRow - 1 + 3) % 3, []);
    const getRowLen = useCallback((r, plat = platforms) => plat[r]?.length ?? 3, [platforms]);

    const jumpRef = useRef(null);

    useEffect(() => {
        if (AUDIO.cloud2Game?.bgm && playBGM) playBGM(AUDIO.cloud2Game.bgm);
        return () => stopBGM?.();
    }, [playBGM, stopBGM]);

    const jump = useCallback((direction) => {
        if (isFalling || isJumping || isShifting || hasWon) return;

        const nextRow = getNextRow(row);
        const currentRowLen = getRowLen(row);
        const nextRowLen = getRowLen(nextRow);
        const scaled = Math.floor((pos + 0.5) * nextRowLen / currentRowLen);
        const nextPos = direction === 'left'
            ? Math.max(0, scaled - 1)
            : Math.min(nextRowLen - 1, scaled + 1);

        const platformType = platforms[nextRow][nextPos];

        const fromLeft = ROW_LEFT_PERCENT[pos];
        const fromTop = row * 33.33 + ROW_TOP_OFFSET;
        const toLeft = ROW_LEFT_PERCENT[nextPos];
        const toTop = nextRow * 33.33 + ROW_TOP_OFFSET;

        setJumpArc({ fromLeft, fromTop, toLeft, toTop });
        setIsJumping(true);

        setTimeout(() => {
            setJumpArc(null);
            setIsJumping(false);
            if (platformType === 'cloud') {
                playSFX?.(AUDIO.sfx?.incorrect);
                setRow(nextRow);
                setPos(nextPos);
                setIsFalling(true);
                setScore(0);
                setTimeout(() => {
                    setIsFalling(false);
                    setRow(2);
                    setPos(1);
                    setPlatforms([generateRow(), generateRow(), ['rock', 'rock', 'cloud']]);
                }, 800);
            } else if (nextRow === 0) {
                playSFX?.(AUDIO.sfx?.correct);
                // Bag reached upper section: trigger map shift
                const newUpper = generateRow();
                const newMiddle = generateRow();
                const oldUpper = platforms[0];
                const oldMiddle = platforms[1];
                const oldLower = platforms[2];
                setShiftContent([newUpper, newMiddle, oldUpper, oldMiddle, oldLower]);
                setIsShifting(true);
                setRow(2); // bag will land on lower (was upper)
                setPos(nextPos);
                setScore((s) => {
                    const newScore = s + 1;
                    if (newScore >= WIN_SCORE) setHasWon(true);
                    return newScore;
                });
                setIsBouncing(true);
                setTimeout(() => setIsBouncing(false), 350);
            } else {
                playSFX?.(AUDIO.sfx?.correct);
                setRow(nextRow);
                setPos(nextPos);
                setScore((s) => {
                    const newScore = s + 1;
                    if (newScore >= WIN_SCORE) setHasWon(true);
                    return newScore;
                });
                setIsBouncing(true);
                setTimeout(() => setIsBouncing(false), 350);
            }
        }, 600);
    }, [row, pos, isFalling, isJumping, isShifting, hasWon, platforms, getNextRow, getRowLen, playSFX]);
    jumpRef.current = jump;

    // When shift animation completes
    useEffect(() => {
        if (!isShifting || !shiftContent) return;
        const timer = setTimeout(() => {
            setPlatforms([shiftContent[0], shiftContent[1], shiftContent[2]]);
            setShiftContent(null);
            setIsShifting(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [isShifting, shiftContent]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); jumpRef.current?.('left'); }
            if (e.key === 'ArrowRight') { e.preventDefault(); jumpRef.current?.('right'); }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const displayPlatforms = shiftContent ?? platforms;

    useEffect(() => {
        if (hasWon) {
            const t = setTimeout(() => {
                router.visit(route('mainplay.cloud3'));
            }, 1200);
            return () => clearTimeout(t);
        }
    }, [hasWon]);

    if (hasWon) {
        return (
            <>
                <Head title="Cloud 2 Game - You Win!" />
                <div className="fixed inset-0 z-[100] w-full h-full bg-sky-400 flex flex-col items-center justify-center gap-6 px-4 fade-in-soft">
                    <div className="cartoon-thin text-3xl sm:text-4xl font-bold text-center drop-shadow text-white" style={{ WebkitTextStroke: '2px black' }}>
                        You did it! Score: {WIN_SCORE}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Cloud 2 Game - The Gate of Gratitude" />
            <div
                className="fixed inset-0 z-[100] w-full h-full bg-sky-400 flex flex-col select-none overflow-hidden"
                style={{ touchAction: 'manipulation' }}
                tabIndex={0}
                aria-label="Tap left or right to jump"
            >
                <BackToMapButton />
                {/* Score */}
                <div
                    className="absolute top-4 left-4 z-[120] cartoon-thin text-4xl sm:text-5xl font-bold"
                    style={{ color: 'white', WebkitTextStroke: '2px black' }}
                >
                    Score: {score}
                </div>

                {/* Platform rows - during shift: 5 rows, translate to animate fall */}
                <div
                    className={`flex-1 flex flex-col min-h-0 w-full overflow-hidden ${isShifting ? 'animate-map-shift' : ''}`}
                >
                    {displayPlatforms.map((platformTypes, i) => (
                        <PlatformRow key={i} row={i} platformTypes={platformTypes} />
                    ))}
                </div>

                {/* Tap zones: left half = jump left, right half = jump right */}
                <div className="absolute inset-0 z-[117] flex">
                    <div className="flex-1 cursor-pointer" onPointerDown={(e) => { e.preventDefault(); jump('left'); }} role="button" tabIndex={0} aria-label="Jump left" />
                    <div className="flex-1 cursor-pointer" onPointerDown={(e) => { e.preventDefault(); jump('right'); }} role="button" tabIndex={0} aria-label="Jump right" />
                </div>

                {/* Bag - positioned over current platform */}
                <img
                    src={encodeURI(BAG_IMG)}
                    alt="Bag"
                    className={`absolute w-20 h-auto sm:w-28 object-contain pointer-events-none z-[115] ${
                        isFalling ? 'animate-bag-fall' : isShifting ? 'animate-bag-shift-down' : isJumping && jumpArc ? 'animate-bag-jump-arc' : isBouncing ? 'animate-bag-bounce' : ''
                    }`}
                    style={{
                        ...(isJumping && jumpArc ? {
                            '--arc-from-left': `${jumpArc.fromLeft}%`,
                            '--arc-from-top': `${jumpArc.fromTop}%`,
                            '--arc-to-left': `${jumpArc.toLeft}%`,
                            '--arc-to-top': `${jumpArc.toTop}%`,
                            '--arc-mid-left': `${(jumpArc.fromLeft + jumpArc.toLeft) / 2}%`,
                            '--arc-mid-top': `${Math.min(jumpArc.fromTop, jumpArc.toTop) - 35}%`,
                            left: `${jumpArc.fromLeft}%`,
                            top: `${jumpArc.fromTop}%`,
                        } : {
                            left: `${ROW_LEFT_PERCENT[pos]}%`,
                            top: isShifting ? undefined : `${row * 33.33 + ROW_TOP_OFFSET}%`,
                        }),
                        transform: 'translate(-50%, -50%)',
                    }}
                    aria-hidden
                />
            </div>
        </>
    );
}
