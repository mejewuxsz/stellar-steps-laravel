import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const STAGE_1_BG_2 = '/assets/img/Attic Background -20260201T170631Z-3-001/Attic Background/attic2.webp';

function BookHandHint({ visible }) {
    return (
        <div
            className="absolute select-none pointer-events-none"
            style={{
                left: '50%',
                top: '56%',
                transform: 'translateX(-50%) rotate(-20deg)',
                opacity: visible ? 1 : 0,
                transition: 'opacity 400ms ease-out',
                filter:
                    'drop-shadow(0 0 6px rgba(254,240,138,0.95)) drop-shadow(0 0 14px rgba(250,204,21,0.75)) drop-shadow(0 0 26px rgba(234,179,8,0.55))',
            }}
            aria-hidden
        >
            <div className="animate-bounce" style={{ animationDuration: '1.1s' }}>
                <img
                    src="/assets/img/pointt.png"
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="w-[90px] h-[90px] object-contain"
                />
            </div>
        </div>
    );
}

export default function Stage2Attic() {
    const [narrationStep, setNarrationStep] = useState(0);
    const [showDirtyBook, setShowDirtyBook] = useState(false);
    const [showPostClickNarration, setShowPostClickNarration] = useState(false);
    const [postClickStep, setPostClickStep] = useState(0); // 0: dirty cover text, 1: wipe direction
    const [heroCongratsVisible, setHeroCongratsVisible] = useState(false);
    const [heroCongratsStep, setHeroCongratsStep] = useState(0); // 0: Well done, 1: book shakes text
    const [shakePhase, setShakePhase] = useState('none'); // 'none' | 'gentle' | 'strong'
    const [fadeToWhite, setFadeToWhite] = useState(false);
    const dirtCanvasRef = useRef(null);
    const isWipingRef = useRef(false);
    const [wipeProgress, setWipeProgress] = useState(0);
    const [wipeComplete, setWipeComplete] = useState(false);

    const narrationLinesBeforeClick = [
        'The old paper and cinnamon smell of the attic. It is silent... until the humming begins to come back. Hmmmmmmm. It is coming out of the middle of the room.',
        '"Oh... over... there."',
        '"I have never read a book that shines."',
    ];

    const preClickDone = narrationStep >= narrationLinesBeforeClick.length;

    // When the dirty book is shown, draw the dirt texture onto the canvas.
    useEffect(() => {
        if (!showDirtyBook) return;
        const canvas = dirtCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const img = new Image();
        img.src = '/assets/img/dirt.png';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(img, 0, 0);
        };
    }, [showDirtyBook]);

    function updateWipeProgress() {
        const canvas = dirtCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        const { width, height } = canvas;
        if (!width || !height) return;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const totalPixels = width * height;
        let clearedPixels = 0;

        // Alpha channel is every 4th byte starting at index 3.
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] === 0) {
                clearedPixels++;
            }
        }

        const progress = Math.min(100, Math.round((clearedPixels / totalPixels) * 100));
        setWipeProgress(progress);
        if (progress >= 90 && !heroCongratsVisible && shakePhase === 'none') {
            setHeroCongratsVisible(true);
            setHeroCongratsStep(0);
        }
        if (progress >= 100) {
            setWipeComplete(true);
        }
    }

    // After "Well done, Hero!" narration, make the book shake gently, then stronger.
    useEffect(() => {
        if (shakePhase !== 'gentle') return;
        const t = setTimeout(() => setShakePhase('strong'), 1200);
        return () => clearTimeout(t);
    }, [shakePhase]);

    // When shaking strongly, wait 3 seconds, fade to white, then navigate to prologue-end.
    useEffect(() => {
        if (shakePhase !== 'strong') return;
        const t = setTimeout(() => {
            setFadeToWhite(true);
            setTimeout(() => {
                router.visit(route('mainplay.prologue-end'));
            }, 800);
        }, 3000);
        return () => clearTimeout(t);
    }, [shakePhase]);

    return (
        <>
            <Head title="Stage 1: The Attic – The Book" />
            <div
                className="fixed inset-0 z-[100] w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${encodeURI(STAGE_1_BG_2)}')` }}
            >
                {/* Dark overlay over background only – starts dark, lightens after "Oh... over... there." */}
                <div
                    className="absolute inset-0 bg-black transition-opacity duration-700 ease-out pointer-events-none"
                    style={{
                        // narrationStep 0 = first line (very dark); once we advance to step 1 ("Oh... over... there."),
                        // fade the background back to normal.
                        opacity: narrationStep === 0 ? 0.7 : 0,
                    }}
                    aria-hidden
                />
                {/* Extra darkening during hero congrats, shaking, and fade-out */}
                {(heroCongratsVisible || shakePhase !== 'none' || fadeToWhite) && (
                    <div className="absolute inset-0 bg-black/70 pointer-events-none" aria-hidden />
                )}
                {/* Fade-to-white overlay at the very end before transitioning */}
                {fadeToWhite && (
                    <div className="absolute inset-0 bg-white white-fade-in z-[130]" aria-hidden />
                )}

                {/* Hero congrats overlay after most of the dirt is wiped – uses the same narration style */}
                {heroCongratsVisible && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[120]">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20">
                            <div className="cartoon-thin text-base sm:text-lg leading-relaxed drop-shadow">
                                {heroCongratsStep === 0
                                    ? 'Well done, Hero!'
                                    : 'The Book suddenly shakes! Rumble... Rumble... The Book suddenly opens.'}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="cartoon-thin px-5 py-2 rounded-xl bg-yellow-300 text-black font-bold hover:bg-yellow-200 transition-colors"
                                    onClick={() => {
                                        if (heroCongratsStep === 0) {
                                            setHeroCongratsStep(1);
                                            setShakePhase('gentle');
                                        } else {
                                            setHeroCongratsVisible(false);
                                        }
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Leo – appears on the right for first narration, then on the left (Leo1-left) for "Oh... over... there." */}
                {!showDirtyBook && (
                    <img
                        src={narrationStep === 0 ? '/assets/img/Leo1-left.png' : '/assets/img/Leo1.webp'}
                        alt=""
                        loading="eager"
                        decoding="async"
                        className="absolute w-[480px] h-auto select-none pointer-events-none"
                        style={
                            narrationStep === 0
                                ? {
                                      // To the right of the narration box
                                      right: '6%',
                                      bottom: '10%',
                                  }
                                : {
                                      // To the left of the narration box
                                      left: '6%',
                                      bottom: '10%',
                                  }
                        }
                        aria-hidden
                    />
                )}

                {/* Dirty book covers the center after click: original title book art with erasable dirt overlay */}
                {showDirtyBook && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={shakePhase !== 'none' ? 'scale-up-slow' : ''}>
                            <div
                                className={`relative w-[min(80vw,520px)] ${
                                    shakePhase === 'gentle'
                                        ? 'gentle-tilt-move-shake'
                                        : shakePhase === 'strong'
                                            ? 'strong-tilt-move-shake'
                                            : ''
                                }`}
                            >
                            {/* Base book from the opening scene */}
                            <img
                                src="/assets/img/Book.webp"
                                alt="A magical story book"
                                loading="eager"
                                decoding="async"
                                className="w-full h-auto drop-shadow-2xl"
                            />
                            {/* Stellar Steps title, nudged a bit further to the right.
                                When the dirt is 90% wiped or more, add the same glowing
                                shine effect used on the landing screen title. */}
                            <img
                                src="/assets/img/title.webp"
                                alt="Stellar Steps"
                                loading="eager"
                                decoding="async"
                                className={`absolute top-[22%] left-[54%] -translate-x-1/2 w-4/5 opacity-90 pointer-events-none ${
                                    wipeProgress >= 90 ? 'title-logo-glow' : ''
                                }`}
                            />
                            {/* Dirt overlay on a canvas the user can wipe away */}
                            <canvas
                                ref={dirtCanvasRef}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-auto max-h-[80vh] cursor-pointer"
                                onPointerDown={(e) => {
                                    isWipingRef.current = true;
                                    setShowPostClickNarration(false);
                                    const canvas = dirtCanvasRef.current;
                                    if (!canvas) return;
                                    const rect = canvas.getBoundingClientRect();
                                    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
                                    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
                                    const ctx = canvas.getContext('2d');
                                    if (!ctx) return;
                                    ctx.globalCompositeOperation = 'destination-out';
                                    ctx.beginPath();
                                    ctx.arc(x, y, 130, 0, Math.PI * 2);
                                    ctx.fill();
                                }}
                                onPointerMove={(e) => {
                                    if (!isWipingRef.current) return;
                                    const canvas = dirtCanvasRef.current;
                                    if (!canvas) return;
                                    const rect = canvas.getBoundingClientRect();
                                    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
                                    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
                                    const ctx = canvas.getContext('2d');
                                    if (!ctx) return;
                                    ctx.globalCompositeOperation = 'destination-out';
                                    ctx.beginPath();
                                    ctx.arc(x, y, 130, 0, Math.PI * 2);
                                    ctx.fill();
                                }}
                                onPointerUp={() => {
                                    isWipingRef.current = false;
                                    updateWipeProgress();
                                }}
                                onPointerLeave={() => {
                                    isWipingRef.current = false;
                                    updateWipeProgress();
                                }}
                            />
                            </div>
                        </div>
                    </div>
                )}

                {/* Post-click narration over dirty book – Leo curious + two-step narration before wiping */}
                {showDirtyBook && showPostClickNarration && (
                    <>
                        <img
                            src="/assets/img/LeoCurious.png"
                            alt=""
                            loading="eager"
                            decoding="async"
                            className="absolute w-[420px] h-auto select-none pointer-events-none"
                            style={{
                                right: '6%',
                                bottom: '8%',
                            }}
                            aria-hidden
                        />
                        <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8">
                            <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20">
                                <div className="cartoon-thin text-base sm:text-lg leading-relaxed drop-shadow">
                                    {postClickStep === 0 ? (
                                        <>
                                            Leo reaches his hand out. He would like to open it, then the cover is so dirty! Years
                                            and years of dust like gray cover it. You can&apos;t even read the title.
                                        </>
                                    ) : (
                                        <>Wipe the screen to remove the dust on the book!</>
                                    )}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        className="cartoon-thin px-5 py-2 rounded-xl bg-yellow-300 text-black font-bold hover:bg-yellow-200 transition-colors"
                                        onClick={() => {
                                            if (postClickStep === 0) {
                                                setPostClickStep(1);
                                            } else {
                                                setShowPostClickNarration(false);
                                            }
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Narration before click */}
                {!showDirtyBook && !preClickDone && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/65 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20">
                            <div className="cartoon-thin text-base sm:text-lg leading-relaxed drop-shadow">
                                {narrationLinesBeforeClick[narrationStep]}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="cartoon-thin px-5 py-2 rounded-xl bg-yellow-300 text-black font-bold hover:bg-yellow-200 transition-colors"
                                    onClick={() => setNarrationStep((s) => s + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Clickable area over the bright blue book.
                    Enabled only after the pre-click narration is done. */}
                <button
                    type="button"
                    className="absolute bg-transparent border-0 p-0 m-0"
                    style={{
                        left: '50%',
                        top: '52%',
                        width: '30%',
                        height: '40%',
                        transform: 'translateX(-50%)',
                        cursor: preClickDone && !showDirtyBook ? 'pointer' : 'default',
                        pointerEvents: preClickDone && !showDirtyBook ? 'auto' : 'none',
                    }}
                    aria-label="Glowing book"
                    onClick={() => {
                        if (!preClickDone) return;
                        setShowDirtyBook(true);
                        setShowPostClickNarration(true);
                        setPostClickStep(0);
                    }}
                />

                {/* Pointing hand hint to tap the book – only after narration, before click */}
                <BookHandHint visible={preClickDone && !showDirtyBook} />

            </div>
        </>
    );
}

