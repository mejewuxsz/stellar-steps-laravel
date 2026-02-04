import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const WOOD_BG = '/assets/img/LP_BG.webp';

// Simple two-step prologue intro:
// 1) Attic background with Stellar Steps title and prologue subtitle
// 2) Black screen with big Leo and first narration line, then Next → prologue1-attic

export default function PrologueIntro() {
    const [phase, setPhase] = useState('title'); // 'title' | 'leo';

    useEffect(() => {
        if (phase !== 'title') return;
        const t = setTimeout(() => setPhase('leo'), 2600);
        return () => clearTimeout(t);
    }, [phase]);

    const firstLine =
        'This is Leo. Leo loves adventures. He likes tree climbing, collecting shiny rocks, and puzzles. Still, Leo has never had a bigger adventure than he has today: The Attic.';

    return (
        <>
            <Head title="Prologue: The Secret in the Attic" />
            <div
                className="fixed inset-0 z-[100] w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${encodeURI(WOOD_BG)}')` }}
            >
                {phase === 'title' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex flex-col items-center gap-6">
                            <img
                                src="/assets/img/title.webp"
                                alt="Stellar Steps"
                                loading="eager"
                                decoding="async"
                                className="w-[78vw] max-w-[880px] drop-shadow-2xl"
                            />
                            <div className="cartoon-thin text-white text-2xl sm:text-3xl md:text-4xl text-center drop-shadow-lg">
                                Prologue: The Secret in the Attic
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'leo' && (
                    <>
                        <div className="absolute inset-0 bg-black" aria-hidden />
                        <img
                            src="/assets/img/Leo0.png"
                            alt="Leo waving hello"
                            loading="eager"
                            decoding="async"
                            className="absolute inset-0 m-auto w-[min(70vw,520px)] h-auto object-contain pointer-events-none"
                            aria-hidden
                        />
                        <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8">
                            <div className="mx-auto max-w-4xl rounded-2xl bg-black/55 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/15">
                                <div className="cartoon-thin text-base sm:text-lg leading-relaxed drop-shadow">
                                    {firstLine}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        className="cartoon-thin px-5 py-2 rounded-xl bg-yellow-300 text-black font-bold hover:bg-yellow-200 transition-colors"
                                        onClick={() => router.visit(route('mainplay.prologue1-attic'))}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

