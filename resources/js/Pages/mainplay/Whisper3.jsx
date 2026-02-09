import { Head, router } from '@inertiajs/react';
import BackToMapButton from '@/Components/BackToMapButton';
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AUDIO } from '@/config/audio';

export default function Whisper3() {
    const [step, setStep] = useState(0); // 0–6 = prior steps, 7 = Wolf speaks
    const { playVoice } = useAudio() ?? {};
    const SPEAKERS = ['LEO', 'NARRATOR', 'LEO', 'MARKY', 'NARRATOR', 'LEO', 'NARRATOR', 'WOLF'];
    const LINES = [
        'What was that?!',
        '(Eyewitness: Two bright yellow eyes are visible in a dark bush. A low sound comes out: Grrrr...)',
        "It's a monster! Run!",
        'Wait! Listen closely, Leo. It does not look like a nasty growl. That sounds like a...',
        '(Sound Effect: Grr... Huhu... Huhu...)',
        'A cry? It sounds sad.',
        '(Scene: Leo goes closer to the bush. A giant BLUE WOLF steps out. It is really frightening with large teeth though it is holding back its paw. A large red thorn in its foot has stuck.)',
        'Owoooo! It hurts! Please go away, little boy. I am big and scary. Everyone runs away from me.',
    ];
    useEffect(() => {
        const src = AUDIO.whisper3?.voice?.[step];
        const vol = AUDIO.whisper3?.voiceVolume?.[step];
        if (src && playVoice) playVoice(src, vol);
    }, [step, playVoice]);

    return (
        <>
            <Head title="Whisper 3 - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <BackToMapButton />
                {/* Background image – base wolf silhouette */}
                <img
                    src="/assets/img/whisperingwoods/bg wolf.webp"
                    alt="Whispering Woods with distant wolf"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Closer woods shot that fades in on steps 3 & 4 */}
                {step >= 3 && (
                    <img
                        src="/assets/img/whisperingwoods/bg-%232.webp"
                        alt="Whispering Woods close-up"
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                    />
                )}

                {/* Leo in the woods – shivering first, then turning to run, then curious, magnifying glass in step 6, shivering in step 7 */}
                <img
                    src={
                        step === 6
                            ? '/assets/img/Leo1.webp'
                            : step === 7
                              ? '/assets/img/whisperingwoods/Leo Shivering-right.webp'
                              : step === 5
                                ? '/assets/img/LeoCurious-right.webp'
                                : step >= 2
                                  ? '/assets/img/whisperingwoods/Leo Shivering-right.webp'
                                  : '/assets/img/whisperingwoods/Leo Shivering.webp'
                    }
                    alt={
                        step === 6
                            ? 'Leo with magnifying glass'
                            : step === 7
                              ? 'Leo shivering'
                              : step === 5
                                ? 'Leo curious and listening'
                                : step >= 2
                                  ? 'Leo shivering and ready to run'
                                  : 'Leo shivering'
                    }
                    loading="eager"
                    decoding="async"
                    className={`absolute bottom-[4%] h-auto object-contain object-bottom pointer-events-none ${
                        step === 6 || step === 7
                            ? 'left-[44%] w-[min(54vmin,62vw,680px)]'
                            : 'left-[12%] w-[min(54vmin,62vw,680px)]'
                    }`}
                    aria-hidden
                />

                {/* Marky beside Leo – steps 6 & 7 use Marky3-right, centered with Leo */}
                <img
                    src={step === 6 || step === 7 ? '/assets/img/whisperingwoods/Marky3-right.webp' : '/assets/img/Marky3.webp'}
                    alt="Marky"
                    loading="eager"
                    decoding="async"
                    className={`absolute bottom-[4%] h-auto object-contain object-bottom pointer-events-none ${
                        step === 6 || step === 7
                            ? 'left-[24%] w-[min(54vmin,62vw,680px)]'
                            : 'left-[32%] w-[min(54vmin,62vw,680px)]'
                    }`}
                    aria-hidden
                />

                {/* Branch pile on the far right – foreground, subtle shake burst every 3 seconds, lowered slightly more */}
                <img
                    src="/assets/img/whisperingwoods/treee branch.webp"
                    alt="Broken tree branches"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[-7%] right-[4%] w-[min(50vmin,56vw,620px)] h-auto object-contain object-bottom pointer-events-none z-[60] shake-twice-soft-loop"
                    aria-hidden
                />

                {/* Wolf appearing at the same spot as the branch pile – background; changes size and emotion by step */}
                <img
                    src={
                        step >= 3
                            ? '/assets/img/whisperingwoods/wolf_emotions-%232.webp'
                            : '/assets/img/whisperingwoods/wolf_emotions-%235.webp'
                    }
                    alt="Scared wolf"
                    loading="eager"
                    decoding="async"
                    className={`absolute h-auto object-contain object-bottom pointer-events-none z-[40] bottom-[0%] ${step >= 3 ? 'right-[1%] w-[min(78vmin,82vw,980px)]' : 'right-[4%] w-[min(42vmin,46vw,550px)]'}`}
                />

                {/* Narration bar – Leo then Narrator (eyes description) */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                {SPEAKERS[step]}
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin narration-text text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {LINES[step]}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 cursor-pointer transition-colors"
                            onClick={() => {
                                if (step < LINES.length - 1) {
                                    setStep(step + 1);
                                } else {
                                    router.visit(route('mainplay.whisper4'));
                                }
                            }}
                            aria-label="Next"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

