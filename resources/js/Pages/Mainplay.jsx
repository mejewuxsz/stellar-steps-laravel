import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { CircleUserRound, Undo2 } from 'lucide-react';

/** Number of gold stars to show (0–3). Future: drive from hero achievement. */
const STARS_UNLOCK_DELAY_MS = 1200;

function StarsTabContent({ goldStarCount: propGoldCount }) {
    // Internal state for "on load" effect; can be overridden by prop for future hero achievement
    const [goldStarCount, setGoldStarCount] = useState(propGoldCount ?? 0);
    const effectiveGoldCount = propGoldCount !== undefined ? propGoldCount : goldStarCount;

    useEffect(() => {
        if (propGoldCount !== undefined) return;
        const t = setTimeout(() => setGoldStarCount(1), STARS_UNLOCK_DELAY_MS);
        return () => clearTimeout(t);
    }, [propGoldCount]);

    const grayStarClass = 'w-16 h-16 sm:w-[4rem] sm:h-[4rem] object-contain [filter:drop-shadow(0_0_2px_#1f2937)_drop-shadow(0_0_6px_#111827)_drop-shadow(0_0_10px_#000)]';
    const goldStarGlow = '[filter:drop-shadow(0_0_1px_#fff)_drop-shadow(0_0_2px_#fff)_drop-shadow(0_0_3px_#fff)_drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]';
    const goldStarBlink = 'animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]';

    return (
        <div className="flex items-center gap-0 -space-x-3 sm:-space-x-4">
            {[0, 1, 2].map((index) => {
                const isGold = index < effectiveGoldCount;
                return (
                    <div key={index} className="relative w-16 h-16 sm:w-[4rem] sm:h-[4rem] flex-shrink-0">
                        {isGold ? (
                            <>
                                <img src="/assets/img/Star.png" alt="" className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${goldStarBlink}`} aria-hidden />
                                <img src="/assets/img/Star.png" alt="" className={`relative z-10 w-full h-full object-contain ${goldStarGlow} ${index === 0 ? 'animate-star-unlock' : ''}`} aria-hidden />
                            </>
                        ) : (
                            <img src="/assets/img/Graystar.png" alt="" className={grayStarClass} aria-hidden />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

const tabsStatic = [
    {
        id: 'menu',
        label: 'Menu',
        content: (
            <svg className="w-[5.5rem] h-[5.5rem] sm:w-[6rem] sm:h-[6rem] text-white animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        ),
    },
    {
        id: 'help',
        label: 'Help',
        content: <span className="cartoon-body text-white text-6xl sm:text-7xl font-bold animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">?</span>,
    },
    {
        id: 'stars',
        label: 'Stars',
        content: null, // filled in Mainplay with <StarsTabContent />
    },
    {
        id: 'map',
        label: 'My Adventure Map',
        content: (
            <span className="cartoon-thin text-white text-base sm:text-lg font-bold whitespace-nowrap flex flex-col items-center leading-tight animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                <span>My Adventure</span>
                <span>Map</span>
            </span>
        ),
    },
    {
        id: 'profile',
        label: 'Profile',
        content: <CircleUserRound className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] text-white animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]" aria-hidden />,
    },
];

/** Menu wood left offset (transform) - single source of truth so it doesn't revert */
const MENU_TAB_TRANSLATE_LEFT = ' -translate-x-[15rem] sm:-translate-x-[16rem]';

/** Rightward offset for Help, Stars, Map, Profile tabs */
const OTHER_TABS_TRANSLATE_RIGHT = '9rem';

/** Reference layout size – entire UI is scaled to fit viewport while keeping this layout */
const LAYOUT_REF_WIDTH = 1600;
const LAYOUT_REF_HEIGHT = 900;

function getLayoutScale() {
    if (typeof window === 'undefined') return 1;
    return Math.min(window.innerWidth / LAYOUT_REF_WIDTH, window.innerHeight / LAYOUT_REF_HEIGHT);
}

const PROFILE_BOUNCE_OUT_MS = 250;
const WOODEN_SIGN_SLIDE_DOWN_MS = 400;

/** Stage system: 0 = locked, 1 = play, 2 = replay */
const BUTTON_IMGS = ['/assets/img/locked.png', '/assets/img/play.png', '/assets/img/replay.png'];
/** Stage 1 full-screen background (attic) when Play is clicked */
const STAGE_1_FULLSCREEN_BG = '/assets/img/Attic Background -20260201T170631Z-3-001/Attic Background/attic1.jpeg';
/** Stage illustration B (uncleared) and C (cleared) – stages 1–5 */
const STAGE_ILLUSTRATIONS = [
    { B: '/assets/img/prologueB.png', C: '/assets/img/prologueC.png' },  // Stage 1 – prologue left
    { B: '/assets/img/castleB.png', C: '/assets/img/castleC.png' },       // Stage 2 – castle
    { B: '/assets/img/woodsB.png', C: '/assets/img/woodsC.png' },         // Stage 3 – woods
    { B: '/assets/img/gateB.png', C: '/assets/img/gateC.png' },           // Stage 4 – gate
    { B: '/assets/img/prologueB.png', C: '/assets/img/prologueC.png' },  // Stage 5 – prologue right
];

export default function Mainplay() {
    const { auth } = usePage().props || {};
    const user = auth?.user ?? null;
    const [scale, setScale] = useState(getLayoutScale);
    const [showProfileExtension, setShowProfileExtension] = useState(false);
    const [profileClosing, setProfileClosing] = useState(false);
    const [showWoodenSign, setShowWoodenSign] = useState(false);
    const [woodenSignClosing, setWoodenSignClosing] = useState(false);
    /** Which stages are cleared (1–5). Cleared = illustration shows C, button shows Replay. */
    const [clearedStages, setClearedStages] = useState([false, false, false, false, false]);
    /** Stage 1: when true, show full-screen attic background overlay. */
    const [showStage1FullScreen, setShowStage1FullScreen] = useState(false);
    /** Stage 1 overlay sequence: 'dark' → 'text' (title fades in) → 'revealed' (dark fades out). */
    const [stage1OverlayPhase, setStage1OverlayPhase] = useState('dark');

    /** Button state for stage index (0–4): 0 Locked, 1 Play, 2 Replay. Stage 1 is always Play or Replay. */
    function getStageButtonState(stageIndex) {
        if (clearedStages[stageIndex]) return 2; // Replay
        if (stageIndex === 0) return 1;          // Stage 1 always Play until cleared
        return clearedStages[stageIndex - 1] ? 1 : 0; // Play if previous cleared, else Locked
    }

    function onStageButtonClick(stageIndex) {
        const state = getStageButtonState(stageIndex);
        // Stage 1: both Play and Replay show the full-screen attic image
        if (stageIndex === 0 && (state === 1 || state === 2)) {
            setShowStage1FullScreen(true);
            return;
        }
        if (state !== 1) return; // for other stages, only Play clears
        setClearedStages((prev) => {
            const next = [...prev];
            next[stageIndex] = true;
            return next;
        });
    }

    function closeStage1FullScreen() {
        setShowStage1FullScreen(false);
        setStage1OverlayPhase('dark');
        setClearedStages((prev) => {
            const next = [...prev];
            next[0] = true;
            return next;
        });
    }

    // Stage 1 overlay sequence: start dark → show title → reveal image
    useEffect(() => {
        if (!showStage1FullScreen) return;
        setStage1OverlayPhase('dark');
        const t1 = setTimeout(() => setStage1OverlayPhase('text'), 400);
        const t2 = setTimeout(() => setStage1OverlayPhase('revealed'), 1800);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [showStage1FullScreen]);

    useEffect(() => {
        const onResize = () => setScale(getLayoutScale());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    function toggleProfileExtension() {
        if (showProfileExtension && !profileClosing) {
            setProfileClosing(true);
            return;
        }
        if (!showProfileExtension) {
            setShowProfileExtension(true);
        }
    }

    useEffect(() => {
        if (!profileClosing) return;
        const t = setTimeout(() => {
            setShowProfileExtension(false);
            setProfileClosing(false);
        }, PROFILE_BOUNCE_OUT_MS);
        return () => clearTimeout(t);
    }, [profileClosing]);

    useEffect(() => {
        if (!woodenSignClosing) return;
        const t = setTimeout(() => {
            setShowWoodenSign(false);
            setWoodenSignClosing(false);
        }, WOODEN_SIGN_SLIDE_DOWN_MS);
        return () => clearTimeout(t);
    }, [woodenSignClosing]);

    return (
        <>
            <Head title="Main Play" />
            {/* Stage 1 full-screen attic background – shown when Play/Replay is clicked; fade-in: dark → title → reveal */}
            {showStage1FullScreen && (
                <div
                    className="fixed inset-0 z-[100] w-full h-full bg-cover bg-center bg-no-repeat cursor-pointer"
                    style={{ backgroundImage: `url('${encodeURI(STAGE_1_FULLSCREEN_BG)}')` }}
                    onClick={closeStage1FullScreen}
                    role="button"
                    tabIndex={0}
                    aria-label="Close stage view"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') closeStage1FullScreen(); }}
                >
                    {/* Dark overlay: opaque at start, fades out when phase is 'revealed' */}
                    <div
                        className="absolute inset-0 bg-black transition-opacity duration-[1800ms] ease-out pointer-events-none"
                        style={{ opacity: stage1OverlayPhase === 'revealed' ? 0 : 1 }}
                        aria-hidden
                    />
                    {/* Center title: fades in when phase is 'text' or 'revealed' */}
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        aria-hidden
                    >
                        <span
                            className="cartoon-heading text-white text-4xl sm:text-5xl md:text-6xl text-center drop-shadow-lg transition-opacity duration-500 ease-out"
                            style={{
                                opacity: stage1OverlayPhase === 'dark' ? 0 : 1,
                                textShadow: '0 0 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                            }}
                        >
                            Stage 1: The Attic
                        </span>
                    </div>
                    <div className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white text-2xl hover:bg-black/60 transition-colors pointer-events-auto" onClick={(e) => { e.stopPropagation(); closeStage1FullScreen(); }} aria-label="Close">
                        ×
                    </div>
                </div>
            )}
            <div
                className="relative w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/assets/img/LP_BG.jpg')" }}
            >
                {/* Fixed-size layout canvas – scaled to fit viewport */}
                <div
                    className="absolute left-1/2 top-1/2 origin-center flex flex-col"
                    style={{
                        width: LAYOUT_REF_WIDTH,
                        height: LAYOUT_REF_HEIGHT,
                        transform: `translate(-50%, -50%) scale(${scale})`,
                    }}
                >
                    {/* Nav bar – top of layout */}
                    <nav
                        role="navigation"
                        aria-label="Main navigation"
                        className="main-nav relative z-30 flex-shrink-0 flex items-center justify-center gap-3 sm:gap-4 w-full pt-0 pb-2 sm:pb-3 px-2 sm:px-4 min-h-[148px] sm:min-h-[164px] -mt-1 animate-slide-down-in"
                    >
                    {(tabsStatic.map((tab) => {
                        if (tab.id === 'stars') return { ...tab, content: <StarsTabContent /> };
                        if (tab.id === 'menu' && (showWoodenSign || woodenSignClosing)) {
                            return { ...tab, content: <Undo2 className="w-[5.5rem] h-[5.5rem] sm:w-[6rem] sm:h-[6rem] text-white animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]" aria-hidden /> };
                        }
                        return tab;
                    })).map((tab) => {
                        const isButtonTab = tab.id === 'menu' || tab.id === 'profile' || tab.id === 'map' || tab.id === 'stars' || tab.id === 'help';
                        const Wrapper = isButtonTab ? 'button' : 'div';
                        const baseClass = 'relative w-[185px] h-[148px] sm:w-[205px] sm:h-[164px] flex-shrink-0 flex items-center justify-center';
                        const menuLeftClass = tab.id === 'menu' ? MENU_TAB_TRANSLATE_LEFT : '';
                        const menuStyle = tab.id === 'menu' ? { transform: 'translateX(-15rem)' } : (tab.id !== 'menu' ? { transform: `translateX(${OTHER_TABS_TRANSLATE_RIGHT})` } : undefined);
                        const wrapperProps = isButtonTab
                            ? { type: 'button', 'aria-label': tab.label || tab.id, title: tab.label || tab.id, style: { ...menuStyle, outline: 'none', boxShadow: 'none', border: 'none', WebkitTapHighlightColor: 'transparent' }, className: baseClass + menuLeftClass + ' wood-tab-btn group transition-all duration-200 rounded', ...(tab.id === 'profile' ? { onClick: toggleProfileExtension } : {}), ...(tab.id === 'menu' ? { onClick: () => { if (showWoodenSign && !woodenSignClosing) setWoodenSignClosing(true); else if (!showWoodenSign) setShowWoodenSign(true); } } : {}) }
                            : { style: menuStyle, className: baseClass + menuLeftClass + ' group transition-all duration-200' };
                        return (
                            <Wrapper key={tab.id} {...wrapperProps}>
                                <div className="relative w-full h-full transition-transform duration-200 origin-center group-hover:scale-105">
                                    <img
                                        src="/assets/img/tabframe.png"
                                        alt=""
                                        className="absolute inset-0 w-full h-full object-contain object-center drop-shadow-md pointer-events-none select-none transition-all duration-200 group-hover:brightness-110 group-hover:drop-shadow-xl"
                                        aria-hidden
                                    />
                                    <div className="relative z-10 flex items-center justify-center w-full h-full p-2 sm:p-3 transition-transform duration-200 origin-center group-hover:scale-[0.952] opacity-0 animate-fade-in-after-slide drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                                        {tab.content}
                                    </div>
                                </div>
                            </Wrapper>
                        );
                    })}
                    </nav>

                    {/* Book area – fills remaining space within layout */}
                    <div className="relative flex-1 min-h-0 w-full flex justify-center items-start -mt-36">
                        <div className="relative w-full h-full flex justify-center items-start">
                            {/* Open book background */}
                            <img
                                src="/assets/img/openbook.png"
                                alt="Story book opened"
                                className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-2xl pointer-events-none select-none block"
                            />

                            {/* Stage 1 – prologue left (B → C when cleared) */}
                            <div
                                className="absolute z-20 box-border cursor-pointer"
                                style={{
                                    left: 90,
                                    top: 100,
                                    width: 380,
                                    height: 300,
                                    minWidth: 200,
                                    minHeight: 160,
                                }}
                            >
                                <img
                                    src={clearedStages[0] ? STAGE_ILLUSTRATIONS[0].C : STAGE_ILLUSTRATIONS[0].B}
                                    alt="Stage 1 Prologue"
                                    className="w-full h-full object-contain object-left-top select-none block"
                                />
                                <img src={BUTTON_IMGS[getStageButtonState(0)]} alt={getStageButtonState(0) === 0 ? 'Locked' : getStageButtonState(0) === 1 ? 'Play' : 'Replay'} className="absolute -bottom-[68px] left-[38%] -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl" onClick={(e) => { e.stopPropagation(); onStageButtonClick(0); }} aria-hidden />
                            </div>

                            {/* Stage 5 – prologue right (B → C when cleared) */}
                            <div
                                className="absolute z-20 box-border cursor-pointer"
                                style={{
                                    right: 90,
                                    top: 100,
                                    width: 380,
                                    height: 300,
                                    minWidth: 200,
                                    minHeight: 160,
                                }}
                            >
                                <img
                                    src={clearedStages[4] ? STAGE_ILLUSTRATIONS[4].C : STAGE_ILLUSTRATIONS[4].B}
                                    alt="Stage 5 Prologue"
                                    className={`w-full h-full object-contain object-right-top select-none block ${!clearedStages[4] ? '[filter:brightness(0.5)_contrast(1.35)]' : ''}`}
                                />
                                <img src={BUTTON_IMGS[getStageButtonState(4)]} alt={getStageButtonState(4) === 0 ? 'Locked' : getStageButtonState(4) === 1 ? 'Play' : 'Replay'} className="absolute -bottom-[68px] left-[62%] -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl" onClick={(e) => { e.stopPropagation(); onStageButtonClick(4); }} aria-hidden />
                            </div>

                            {/* Stage 2 – castle (B → C when cleared) */}
                            <div
                                className="absolute z-20 box-border cursor-pointer"
                                style={{
                                    left: 170,
                                    bottom: 60,
                                    width: 460,
                                    height: 400,
                                    minWidth: 260,
                                    minHeight: 220,
                                }}
                            >
                                <img
                                    src={clearedStages[1] ? STAGE_ILLUSTRATIONS[1].C : STAGE_ILLUSTRATIONS[1].B}
                                    alt="Stage 2 Castle"
                                    className={`w-full h-full object-contain object-center select-none block ${!clearedStages[1] ? '[filter:brightness(0.6)_contrast(1.3)]' : ''}`}
                                />
                                <img src={BUTTON_IMGS[getStageButtonState(1)]} alt={getStageButtonState(1) === 0 ? 'Locked' : getStageButtonState(1) === 1 ? 'Play' : 'Replay'} className="absolute -bottom-[68px] left-1/2 -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl" onClick={(e) => { e.stopPropagation(); onStageButtonClick(1); }} aria-hidden />
                            </div>

                            {/* Stage 4 – gate (B → C when cleared) */}
                            <div
                                className="absolute z-20 box-border cursor-pointer"
                                style={{
                                    right: 170,
                                    bottom: 60,
                                    width: 460,
                                    height: 400,
                                    minWidth: 260,
                                    minHeight: 220,
                                }}
                            >
                                <img
                                    src={clearedStages[3] ? STAGE_ILLUSTRATIONS[3].C : STAGE_ILLUSTRATIONS[3].B}
                                    alt="Stage 4 Gate"
                                    className={`w-full h-full object-contain object-center select-none block ${!clearedStages[3] ? '[filter:brightness(0.4)_contrast(1.35)]' : ''}`}
                                />
                                <img src={BUTTON_IMGS[getStageButtonState(3)]} alt={getStageButtonState(3) === 0 ? 'Locked' : getStageButtonState(3) === 1 ? 'Play' : 'Replay'} className="absolute -bottom-[68px] left-1/2 -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl" onClick={(e) => { e.stopPropagation(); onStageButtonClick(3); }} aria-hidden />
                            </div>

                            {/* Stage 3 – woods (B → C when cleared) */}
                            <div
                                className="absolute z-20 box-border cursor-pointer"
                                style={{
                                    left: 570,
                                    top: 50,
                                    width: 460,
                                    height: 400,
                                    minWidth: 260,
                                    minHeight: 220,
                                }}
                            >
                                <img
                                    src={clearedStages[2] ? STAGE_ILLUSTRATIONS[2].C : STAGE_ILLUSTRATIONS[2].B}
                                    alt="Stage 3 Woods"
                                    className={`w-full h-full object-contain object-center select-none block ${!clearedStages[2] ? '[filter:brightness(0.55)_contrast(1.3)]' : ''}`}
                                />
                                <img src={BUTTON_IMGS[getStageButtonState(2)]} alt={getStageButtonState(2) === 0 ? 'Locked' : getStageButtonState(2) === 1 ? 'Play' : 'Replay'} className="absolute -bottom-[68px] left-1/2 -translate-x-1/2 h-[200px] w-auto max-w-[95%] object-contain select-none cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-110 hover:drop-shadow-xl" onClick={(e) => { e.stopPropagation(); onStageButtonClick(2); }} aria-hidden />
                            </div>

                            {/* Wooden sign – only when Menu is clicked; slide up then bounce, slide down on close */}
                            {(showWoodenSign || woodenSignClosing) && (
                            <div className={`group absolute -left-[20%] bottom-0 w-[100%] max-w-[1100px] z-[50] origin-left-bottom transition-transform duration-200 hover:scale-105 ${woodenSignClosing ? 'animate-slide-down-out' : 'animate-slide-up-then-bounce'}`}>
                                <img
                                    src="/assets/img/woodboard2.png"
                                    alt=""
                                    className="w-full h-auto object-contain object-left-bottom drop-shadow-lg pointer-events-none select-none transition-all duration-200 group-hover:brightness-110 group-hover:drop-shadow-xl"
                                    aria-hidden
                                />
                                <div className="absolute top-[12%] bottom-[42%] left-0 right-0 flex flex-col items-center justify-center gap-6 sm:gap-8 pointer-events-none">
                                    <button
                                        type="button"
                                        className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap leading-tight animate-glow-blink [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)] pointer-events-auto cursor-pointer bg-transparent border-none outline-none py-1 px-2 rounded transition-all duration-200 hover:scale-110 hover:brightness-125 hover:[filter:drop-shadow(0_0_6px_#fef08a)_drop-shadow(0_0_16px_#facc15)_drop-shadow(0_0_28px_#eab308)]"
                                        aria-label="Settings"
                                    >
                                        Settings
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.post(route('logout'))}
                                        className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap leading-tight animate-glow-blink [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)] pointer-events-auto cursor-pointer bg-transparent border-none outline-none py-1 px-2 rounded transition-all duration-200 hover:scale-110 hover:brightness-125 hover:[filter:drop-shadow(0_0_6px_#fef08a)_drop-shadow(0_0_16px_#facc15)_drop-shadow(0_0_28px_#eab308)]"
                                        aria-label="Sign out"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                            )}

                            {/* Content overlay - book pages only; z-25 so profile extension sits above woods/castle/gate/prologue (z-20); nav stays z-30; pointer-events-none so hover reaches illustrations below */}
                            <div className="absolute inset-y-[10%] inset-x-[10%] flex flex-col pointer-events-none z-[25]">
                                <div className="flex flex-1 min-h-0 w-full">
                                    <div className="w-1/2 h-full relative flex items-center justify-center px-[5%] -ml-4 md:-ml-6">
                                        <div className="flex flex-col gap-8 md:gap-10 items-center justify-center w-full max-w-full">
                                            {/* Left page content placeholder */}
                                        </div>
                                    </div>
                                    <div className="w-1/2 h-full relative overflow-visible flex items-center justify-center">
                                        <div className="h-full w-[92%] flex flex-col items-center justify-start overflow-visible pt-[2%] pb-[2%]">
                                            {/* Profile extension – wooden plaque (only when Profile tab is clicked; bounce-out on close) */}
                                            {(showProfileExtension || profileClosing) && (
                                            <div className={`group relative z-[30] pointer-events-auto flex flex-col items-center justify-center w-full max-w-5xl -mt-[2%] ml-[32rem] sm:ml-[36rem] transition-transform duration-200 origin-center hover:scale-[1.01] cursor-pointer ${profileClosing ? 'animate-bounce-out' : 'animate-bounce-in'}`}>
                                                <div className="relative w-full flex flex-col items-center p-16 sm:p-20 min-h-[16rem] sm:min-h-[20rem]">
                                                    <img
                                                        src="/assets/img/tabframe.png"
                                                        alt=""
                                                        className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none select-none opacity-100 transition-all duration-200 group-hover:brightness-105 group-hover:drop-shadow-lg"
                                                        aria-hidden
                                                    />
                                                    <div className="relative z-10 flex flex-col items-center gap-2 text-center w-full px-4 py-6">
                                                        <span className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap flex flex-col items-center leading-tight animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                                                            {user?.name ?? 'Guest'}
                                                        </span>
                                                        {user?.role === 'hero' && user?.hero_code ? (
                                                            <span className="cartoon-thin text-white text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap flex flex-col items-center leading-tight animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                                                                Hero Code: {user.hero_code}
                                                            </span>
                                                        ) : user?.role === 'guardian' ? (
                                                            <span className="cartoon-thin text-white text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap flex flex-col items-center leading-tight animate-glow-blink group-hover:animate-none group-hover:opacity-100 [filter:drop-shadow(0_0_4px_#fef08a)_drop-shadow(0_0_12px_#facc15)_drop-shadow(0_0_24px_#eab308)]">
                                                                Guardian
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
