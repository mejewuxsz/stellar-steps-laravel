import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const NARRATIONS = [
    'Ewww. It is a musty-smelling place like old cheese.',
    'Who is that?',
    'That is King Crumble. He is the King of this story. But he looks very sad.',
    'Excuse me, Mr. King? Why are you crying?',
    "I lost it! I lost my Royal Crown! I set it somewhere, then there is too much stuff around, and I can not find it! I can not be King without my crown!",
    'Wow. This is the same as my bedroom when mom scolds me. Perhaps, by cleaning, we shall be able to find it?',
    "Clean up? But it's too hard! There is too much mess!",
    "You know, it is not an impossible task when we do it together. Come on, let's help the King!",
];
const SPEAKERS = ['LEO', 'LEO', 'MARKY', 'LEO', 'KING CRUMBLE', 'LEO', 'KING CRUMBLE', 'LEO'];

const BG_IMGS = [
    '/assets/img/C1F3-BG.png',
    '/assets/img/C1F3-BG.png',
    '/assets/img/C1F5-BG.png',
    '/assets/img/C1F6-BG.png',
    '/assets/img/C1F7-BG.png',
    '/assets/img/C1F2-BG.png',
    '/assets/img/C1F7-BG.png',
    '/assets/img/C1F2-BG.png',
];

export default function Kingdom2() {
    const [step, setStep] = useState(0);
    const bgImg = BG_IMGS[step];

    return (
        <>
            <Head title="Chapter 1: The Kingdom of Clutter" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                <img
                    key={bgImg}
                    src={bgImg}
                    alt="Kingdom of Clutter"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                />

                {/* Leo at lower left – steps 0 and 1 */}
                {step < 2 && (
                    <img
                        src={step === 0 ? '/assets/img/C1F3-Leopng.png' : '/assets/img/C1F4-Leo.png'}
                        alt="Leo"
                        loading="eager"
                        decoding="async"
                        className="absolute -bottom-[18%] left-[2%] w-[min(80vw,900px)] h-auto object-contain object-bottom pointer-events-none"
                        aria-hidden
                    />
                )}

                {/* Marky on left – step 2 (throne room) */}
                {step === 2 && (
                    <img
                        src="/assets/img/Marky2.png"
                        alt="Marky"
                        loading="eager"
                        decoding="async"
                        className="absolute left-[2%] bottom-[10%] w-[min(42vw,400px)] h-auto object-contain object-bottom pointer-events-none"
                        aria-hidden
                    />
                )}

                {/* Leo on right – step 3 only (addressing King Crumble) */}
                {step === 3 && (
                    <img
                        src="/assets/img/C1F6-Leo.png"
                        alt="Leo"
                        loading="eager"
                        decoding="async"
                        className="absolute right-[2%] -bottom-[6%] w-[min(58vw,650px)] h-auto object-contain object-bottom pointer-events-none"
                        aria-hidden
                    />
                )}

                {/* Leo in right corner – step 5 only (cluttered room, cleaning idea) */}
                {step === 5 && (
                    <img
                        src="/assets/img/Leo1-left.png"
                        alt="Leo"
                        loading="eager"
                        decoding="async"
                        className="absolute right-[2%] bottom-[10%] w-[min(45vw,480px)] h-auto object-contain object-bottom pointer-events-none"
                        aria-hidden
                    />
                )}

                {/* Leo in lower right – step 7 (encouraging to help the King) */}
                {step >= 7 && (
                    <img
                        src="/assets/img/C1F10-LEO.png"
                        alt="Leo"
                        loading="eager"
                        decoding="async"
                        className="absolute right-[2%] bottom-[2%] w-[min(50vw,550px)] h-auto object-contain object-bottom pointer-events-none"
                        aria-hidden
                    />
                )}

                {/* Narration bar – speaker label and Next arrow */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                {SPEAKERS[step]}
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                {NARRATIONS[step]}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center hover:bg-yellow-200 transition-colors"
                            onClick={() => {
                                if (step < NARRATIONS.length - 1) {
                                    setStep(step + 1);
                                } else {
                                    // Navigate to kingdom3 after last step
                                    router.visit(route('mainplay.kingdom3'));
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
