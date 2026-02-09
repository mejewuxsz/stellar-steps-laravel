import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';
import { useState, useEffect } from 'react';

const KINGDOM3_BGM = '/assets/audio/bgm/BGM - Frame 10 - 14.wav';
const SFX_CROWN = '/assets/audio/bgm/SFX - My Crown! You found it!.MP3';

export default function Kingdom3() {
    const { playSFX, playBGM } = useAudio() ?? {};
    const [showNarration, setShowNarration] = useState(false);
    const [placements, setPlacements] = useState({
        toyBox: false,
        bin: false,
        hamper: false,
    });
    const [placedItems, setPlacedItems] = useState({
        banana: false,
        socks: false,
        robot: false,
    });
    const [wrongDropTarget, setWrongDropTarget] = useState(null);
    const [allPlaced, setAllPlaced] = useState(false);
    const [shuffledItems, setShuffledItems] = useState([]);
    const [shuffledTargets, setShuffledTargets] = useState([]);

    useEffect(() => {
        if (KINGDOM3_BGM && playBGM) playBGM(KINGDOM3_BGM, true);
    }, [playBGM]);

    // Shuffle items on mount
    useEffect(() => {
        const items = [
{ id: 'banana', src: '/assets/img/stuff/BananaGlow.webp', alt: 'Banana' },
   { id: 'socks', src: '/assets/img/stuff/SocksGlow.webp', alt: 'Socks' },
   { id: 'robot', src: '/assets/img/stuff/RobotGlow.webp', alt: 'Robot' },
        ];
        // Fisher-Yates shuffle algorithm
        const shuffled = [...items];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setShuffledItems(shuffled);

        const targets = [
            { 
                id: 'toyBox', 
src: '/assets/img/stuff/ToyBox.webp',
   filledSrc: '/assets/img/stuff/ToyBoxRobot.webp',
                alt: 'Toy Box'
            },
            { 
                id: 'bin', 
src: '/assets/img/stuff/Bin.webp',
   filledSrc: '/assets/img/stuff/BinWithBanana.webp',
                alt: 'Trash Bin'
            },
            { 
                id: 'hamper', 
src: '/assets/img/stuff/Hamper.webp',
   filledSrc: '/assets/img/stuff/HamperWSocks.webp',
                alt: 'Laundry Hamper'
            },
        ];
        // Fisher-Yates shuffle algorithm for targets
        const shuffledTargets = [...targets];
        for (let i = shuffledTargets.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTargets[i], shuffledTargets[j]] = [shuffledTargets[j], shuffledTargets[i]];
        }
        setShuffledTargets(shuffledTargets);
    }, []);

    // Check if all items are placed
    useEffect(() => {
        if (placements.toyBox && placements.bin && placements.hamper) {
            setAllPlaced(true);
        }
    }, [placements]);

    useEffect(() => {
        if (allPlaced && playSFX) playSFX(SFX_CROWN);
    }, [allPlaced, playSFX]);

    // Navigate to kingdom-end after crown appears (with delay to let animation play)
    useEffect(() => {
        if (!allPlaced) return;
        const t = setTimeout(() => {
            router.visit(route('mainplay.kingdom-end'));
        }, 3000); // 3 seconds after crown appears
        return () => clearTimeout(t);
    }, [allPlaced]);

    const handleDragStart = (event, item) => {
        if (event.dataTransfer) {
            event.dataTransfer.setData('text/plain', item);
        }
    };

    const handleDrop = (event, target) => {
        event.preventDefault();
        const item = event.dataTransfer?.getData('text/plain');
        if (!item) return;

        // Check if item is already placed
        if (placedItems[item]) return;

        // Correct pairings: robot → toy box, banana → bin, socks → hamper
        const isCorrect =
            (target === 'toyBox' && item === 'robot') ||
            (target === 'bin' && item === 'banana') ||
            (target === 'hamper' && item === 'socks');

        if (isCorrect) {
            playSFX?.(AUDIO.sfx?.correct);
            // Correct drop: update placement and hide the item
            setPlacements((prev) => {
                if (target === 'toyBox') return { ...prev, toyBox: true };
                if (target === 'bin') return { ...prev, bin: true };
                if (target === 'hamper') return { ...prev, hamper: true };
                return prev;
            });
            setPlacedItems((prev) => ({ ...prev, [item]: true }));
        } else {
            playSFX?.(AUDIO.sfx?.incorrect);
            // Wrong drop: trigger shake and red glow
            setWrongDropTarget(target);
            setTimeout(() => setWrongDropTarget(null), 2000); // Reset after 2 seconds
        }
    };

    useEffect(() => {
        // Show narration after images are displayed (short delay)
        const t1 = setTimeout(() => setShowNarration(true), 500);
        // Hide narration after 5 seconds
        const t2 = setTimeout(() => setShowNarration(false), 5500);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <>
            <Head title="Chapter 1: The Kingdom of Clutter" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Darkened background */}
                <div className="absolute inset-0">
                    <img
                        src="/assets/img/C1F2-BG.webp"
                        alt="Kingdom of Clutter"
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                        aria-hidden
                    />
                    {/* Dark overlay to darken the background */}
                    <div className="absolute inset-0 bg-black/50" aria-hidden />
                </div>

                {/* Top row: BananaGlow, SocksGlow, RobotGlow (draggable items) or Crown (when all placed) */}
                <div className={`absolute left-1/2 -translate-x-1/2 flex justify-center z-[110] transition-all duration-500 ${
                    allPlaced ? 'items-start w-fit' : 'top-[8%] items-center gap-8 sm:gap-12'
                }`} style={allPlaced ? { top: '-160px', marginTop: 0, paddingTop: 0 } : {}}>
                    {allPlaced ? (
                        <img
                            src="/assets/img/stuff/Crown.webp"
                            alt="Crown"
                            loading="eager"
                            decoding="async"
                            className="w-[min(85vw,1200px)] h-auto object-contain object-top yellow-blink-glow fade-in-slow cursor-pointer transition-transform duration-300 hover:scale-125 hover:brightness-110 hover:drop-shadow-2xl"
                            style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, top: 0, display: 'block' }}
                        />
                    ) : (
                        <>
                            {shuffledItems.map((item) => (
                                !placedItems[item.id] && (
                                    <img
                                        key={item.id}
                                        src={item.src}
                                        alt={item.alt}
                                        loading="eager"
                                        decoding="async"
                                        draggable
                                        onDragStart={(event) => handleDragStart(event, item.id)}
                                        className="w-[min(28vw,350px)] h-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-125 hover:brightness-110 hover:drop-shadow-2xl subtle-white-glow"
                                    />
                                )
                            ))}
                        </>
                    )}
                </div>

                {/* Bottom row: ToyBox, Bin, Hamper – drop targets (closer together when all placed) */}
                <div className={`absolute bottom-[8%] left-1/2 -translate-x-1/2 flex items-center justify-center z-[110] transition-all duration-500 ${
                    allPlaced ? 'gap-0 sm:gap-1' : 'gap-8 sm:gap-12'
                }`}>
                    {shuffledTargets.map((target) => (
                        <img
                            key={target.id}
                            src={placements[target.id] ? target.filledSrc : target.src}
                            alt={target.alt}
                            loading="eager"
                            decoding="async"
                            className={`w-[min(35vw,450px)] h-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-125 hover:brightness-110 hover:drop-shadow-2xl ${
                                wrongDropTarget === target.id ? 'shake-wrong red-blink-glow' : ''
                            } ${
                                placements[target.id] ? 'white-blink-glow' : ''
                            }`}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => handleDrop(event, target.id)}
                        />
                    ))}
                </div>

                {/* Direction narration */}
                {showNarration && (
                    <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[120] fade-in-soft">
                        <div className="mx-auto max-w-4xl rounded-2xl bg-orange-300 text-white px-5 py-4 sm:px-6 sm:py-5 border-2 border-white flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-center text-base sm:text-lg font-bold uppercase tracking-wider text-white mb-2">
                                    DIRECTION
                                </div>
                                <div className="h-px bg-white/50 mb-2" aria-hidden />
                                <div className="cartoon-thin narration-text text-xl sm:text-2xl font-bold leading-relaxed drop-shadow text-left text-white">
                                    Move things to the right place!
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
