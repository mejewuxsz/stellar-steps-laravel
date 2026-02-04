import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/** Stage 1 full-screen background (attic). */
const STAGE_1_BG_1 = '/assets/img/Attic Background -20260201T170631Z-3-001/Attic Background/attic1.webp';
const STAGE_1_BG_2 = '/assets/img/Attic Background -20260201T170631Z-3-001/Attic Background/attic2.webp';

function GlowingHandSign({ visible }) {
    return (
        <div
            className="absolute select-none pointer-events-none"
            style={{
                // Points at the ladder. Adjust these two numbers to fine-tune placement.
                left: '52%',
                top: '26%',
                transform: 'translate(-50%, -50%) rotate(-12deg)',
                opacity: visible ? 1 : 0,
                transition: 'opacity 500ms ease-out',
                filter:
                    'drop-shadow(0 0 6px rgba(254,240,138,0.95)) drop-shadow(0 0 14px rgba(250,204,21,0.75)) drop-shadow(0 0 26px rgba(234,179,8,0.55))',
            }}
            aria-hidden
        >
            <div
                className="animate-bounce"
                style={{
                    animationDuration: '1.2s',
                }}
            >
                <img
                    src="/assets/img/pointt.png"
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="w-[110px] h-[110px] object-contain"
                    aria-hidden
                />
            </div>
            <div className="absolute inset-0 animate-pulse" style={{ opacity: 0.65 }} />
        </div>
    );
}

export default function Stage1Attic() {
    /** Overlay sequence: 'dark' → 'text' (title fades in) → 'revealed' (dark fades out) → 'done' (title fades out). */
    const [overlayPhase, setOverlayPhase] = useState('dark');
    /** Leo sprite: starts waving, then curious, climbs, then reacts with "oh!". */
    const [leoSprite, setLeoSprite] = useState('wave'); // 'wave' | 'curious' | 'climb' | 'oh'
    const [leoClimbing, setLeoClimbing] = useState(false);
    /** Narration progression: hand + interaction starts only after narration. */
    const [narrationStep, setNarrationStep] = useState(0);
    /** Ladder interaction – counting steps instead of quiz. */
    const [stepCount, setStepCount] = useState(0); // 0–8
    const [handVisible, setHandVisible] = useState(true);

    const close = () => {
        router.visit(route('mainplay'));
    };

    useEffect(() => {
        setOverlayPhase('dark');
        setLeoSprite('wave');
        setLeoClimbing(false);
        // After arriving from the intro screen, show Leo + narration quickly.
        const t = setTimeout(() => setOverlayPhase('done'), 1000);
        return () => {
            clearTimeout(t);
        };
    }, []);

    // After Leo appears (done phase), switch to curious after 3 seconds
    useEffect(() => {
        if (overlayPhase !== 'done') return;
        if (leoSprite === 'climb') return;
        const t = setTimeout(() => setLeoSprite('curious'), 3000);
        return () => clearTimeout(t);
    }, [overlayPhase, leoSprite]);

    const narrationLines = [
        '"Lola said there are only old boxes up in the attic. But I tell you I heard someone humming up there. Like a giant bee... or magic?"',
        "Leo looks up. All the way up the ladder, and the door is firmly closed. He attempts to get up to it alone, but he is a bit too short. He needs a helper. He needs you.",
        "Tap the ladder and make Leo climb it!",
    ];

    const narrationDone = overlayPhase === 'done' && narrationStep >= narrationLines.length;

    function onLadderClick() {
        if (!narrationDone) return;
        setHandVisible(false);
        setStepCount((prev) => {
            const next = Math.min(8, prev + 1);
            if (next === 8) {
                // Start climb animation, then move to the Stage 2 attic page.
                setLeoSprite('climb');
                setLeoClimbing(true);
                setTimeout(() => {
                    router.visit(route('mainplay.prologue1-attic.prologue2-attic'));
                }, 900);
            }
            return next;
        });
    }

    return (
        <>
            <Head title="Prologue: The Secret in the Attic" />
            <div
                className="fixed inset-0 z-[100] w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${encodeURI(STAGE_1_BG_1)}')` }}
            >

                {/* Leo character: starts near sofa, then moves beside ladder and eventually climbs */}
                <img
                    src={
                        leoSprite === 'climb'
                            ? '/assets/img/Leo2.webp'
                            : narrationStep === 0
                                ? '/assets/img/Leo1.webp'
                                : narrationStep === 1
                                    ? '/assets/img/Leo1-left.png'
                                    : '/assets/img/Leo2.webp'
                    }
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="absolute w-[480px] h-auto select-none pointer-events-none transition-opacity duration-700 ease-out"
                    style={{
                        // Before climbing: start near sofa, then (after narration) move to the left side of the ladder.
                        left:
                            leoSprite === 'climb'
                                ? '40%' // mid-ladder
                                : narrationStep <= 1
                                    ? '74%' // intro near sofa (both first and second lines)
                                    : '34%', // from third line onward, beside ladder
                        bottom: leoSprite === 'climb' ? '-4%' : '-6%',
                        // When climbing, move Leo much higher up the ladder.
                        transform: `translateX(-50%) translateY(${leoClimbing ? '-55%' : '0%'})`,
                        opacity: overlayPhase === 'done' ? 1 : 0,
                        transition: 'opacity 700ms ease-out, transform 900ms ease-out',
                    }}
                    aria-hidden
                />

                {/* Glowing hand sign pointing to ladder */}
                <GlowingHandSign visible={narrationDone && handVisible} />

                {/* Invisible clickable ladder hitbox (enabled after narration) */}
                <button
                    type="button"
                    onClick={onLadderClick}
                    className="absolute bg-transparent border-0 p-0 m-0"
                    style={{
                        // Hitbox around the ladder area (tune as needed).
                        // Percent-based so it aligns with the background.
                        left: '45%',
                        top: '6%',
                        width: '20%',
                        height: '72%',
                        cursor: narrationDone ? 'pointer' : 'default',
                        pointerEvents: narrationDone ? 'auto' : 'none',
                    }}
                    aria-label="Ladder"
                />

                {/* Step numbers alongside the ladder (for counting 1–8) */}
                {narrationDone && (
                    <div
                        className="absolute z-20 flex flex-col items-center justify-between text-white cartoon-heading text-4xl sm:text-5xl"
                        style={{
                            // Position numbers at 45% from the right (slightly closer to ladder)
                            right: '45%',
                            top: '14%',
                            bottom: '16%',
                        }}
                        aria-hidden
                    >
                        {[8, 7, 6, 5, 4, 3, 2, 1].map((n) => {
                            const isActive = stepCount >= n;
                            const baseCircle =
                                'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2';
                            const activeCircle =
                                'bg-yellow-300 border-yellow-400 text-black [box-shadow:0_0_12px_rgba(250,250,150,0.9)]';
                            const inactiveCircle =
                                'bg-black/70 border-white/70 text-white [box-shadow:0_0_6px_rgba(0,0,0,0.9)]';
                            return (
                                <div
                                    key={n}
                                    className={`${baseCircle} ${isActive ? activeCircle : inactiveCircle}`}
                                >
                                    <span className="drop-shadow-lg text-2xl sm:text-3xl">{n}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Narration box for attic1 (before ladder tap) */}
                {overlayPhase === 'done' && !narrationDone && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-black/55 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/15">
                            <div className="cartoon-thin text-base sm:text-lg leading-relaxed drop-shadow">
                                {narrationLines[narrationStep]}
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

                {/* Steps question modal removed – replaced with step-by-step ladder counting */}

                {/* Close button (back to Mainplay) */}
                <button
                    type="button"
                    className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white text-2xl hover:bg-black/60 transition-colors"
                    onClick={close}
                    aria-label="Back to Mainplay"
                >
                    ×
                </button>
            </div>
        </>
    );
}

