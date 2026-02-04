import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const WOOD_BG = '/assets/img/LP_BG.webp';

// Simple two-step chapter 1 intro:
// 1) Wooden background with Stellar Steps title and chapter 1 subtitle
// 2) Black screen with big Leo and first narration line, then Next → chapter 1 gameplay

export default function Chapter1Intro() {
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
            <Head title="Chapter 1: The Kingdom of Clutter" />
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
                                Chapter 1: The Kingdom of Clutter
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'leo' && (
                    <>
                        {/* Pure black screen, no Leo or narration box – only a Next button to continue */}
                        <div className="absolute inset-0 bg-black" aria-hidden />
                        <div className="absolute right-6 sm:right-10 bottom-6 sm:bottom-8">
                            <button
                                type="button"
                                className="cartoon-thin px-5 py-2 rounded-xl bg-yellow-300 text-black font-bold hover:bg-yellow-200 transition-colors"
                                onClick={() => router.visit(route('mainplay.chapter1'))}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
