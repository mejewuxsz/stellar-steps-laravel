import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Whisper3() {
    const [step, setStep] = useState(0); // 0 = Leo, 1 = Narrator eyes, 2 = Leo panic, 3 = Marky explanation, 4 = Narrator SFX, 5 = Leo realization
    const SPEAKERS = ['LEO', 'NARRATOR', 'LEO', 'MARKY', 'NARRATOR', 'LEO'];
    const LINES = [
        'What was that?!',
        '(Eyewitness: Two bright yellow eyes are visible in a dark bush. A low sound comes out: Grrrr...)',
        "It's a monster! Run!",
        'Wait! Listen closely, Leo. It does not look like a nasty growl. That sounds like a...',
        '(Sound Effect: Grr... Huhu... Huhu...)',
        'A cry? It sounds sad.',
    ];

    return (
        <>
            <Head title="Whisper 3 - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                {/* Background image – base wolf silhouette */}
                <img
                    src="/assets/img/whisperingwoods/bg wolf.png"
                    alt="Whispering Woods with distant wolf"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Closer woods shot that fades in on steps 3 & 4 */}
                {step >= 3 && (
                    <img
                        src="/assets/img/whisperingwoods/bg-%232.png"
                        alt="Whispering Woods close-up"
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                    />
                )}

                {/* Leo in the woods – shivering first, then turning to run, then curious */}
                <img
                    src={
                        step === 5
                            ? '/assets/img/LeoCurious-right.png'
                            : step >= 2
                              ? '/assets/img/whisperingwoods/Leo Shivering-right.png'
                              : '/assets/img/whisperingwoods/Leo Shivering.png'
                    }
                    alt={
                        step === 5
                            ? 'Leo curious and listening'
                            : step >= 2
                              ? 'Leo shivering and ready to run'
                              : 'Leo shivering'
                    }
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] left-[11%] w-[min(40vw,480px)] h-auto object-contain object-bottom pointer-events-none"
                    aria-hidden
                />

                {/* Marky beside Leo on the left side – slightly bigger than Leo, nudged a bit to the right */}
                <img
                    src="/assets/img/Marky3.png"
                    alt="Marky"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] left-[32%] w-[min(44vw,520px)] h-auto object-contain object-bottom pointer-events-none"
                    aria-hidden
                />

                {/* Branch pile on the far right – foreground, subtle shake burst every 3 seconds, lowered slightly more */}
                <img
                    src="/assets/img/whisperingwoods/treee branch.png"
                    alt="Broken tree branches"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[-7%] right-[4%] w-[min(38vw,460px)] h-auto object-contain object-bottom pointer-events-none z-[60] shake-twice-soft-loop"
                    aria-hidden
                />

                {/* Wolf appearing at the same spot as the branch pile – background; changes size and emotion by step */}
                <img
                    src={
                        step === 3
                            ? '/assets/img/whisperingwoods/wolf_emotions-%232.png'
                            : '/assets/img/whisperingwoods/wolf_emotions-%235.png'
                    }
                    alt="Scared wolf"
                    loading="eager"
                    decoding="async"
                    className={`absolute h-auto object-contain object-bottom pointer-events-none z-[40] ${
                        step === 0
                            ? 'bottom-[-6%] right-[4%] w-[min(50vw,580px)]'
                            : step === 1
                              ? 'bottom-[-6%] right-[1%] w-[min(60vw,720px)]'
                              : step === 2
                                ? 'bottom-[-10%] right-[-2%] w-[min(70vw,840px)]'
                                : 'bottom-[0%] right-[-1%] w-[min(50vw,600px)]'
                    }`}
                />

                {/* Narration bar – Leo then Narrator (eyes description) */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                {SPEAKERS[step]}
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {LINES[step]}
                            </div>
                        </div>
                        <button
                            type="button"
                            className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center ${
                                step < LINES.length - 1 ? 'hover:bg-yellow-200 cursor-pointer transition-colors' : 'opacity-60 cursor-default'
                            }`}
                            onClick={() => {
                                if (step < LINES.length - 1) {
                                    setStep(step + 1);
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

