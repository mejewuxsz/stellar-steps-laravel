import { Head } from '@inertiajs/react';

export default function Whisper3() {
    return (
        <>
            <Head title="Whisper 3 - The Whispering Woods" />
            <div className="fixed inset-0 z-[100] w-full h-full bg-black">
                {/* Background image – wolf silhouette */}
                <img
                    src="/assets/img/whisperingwoods/bg wolf.png"
                    alt="Whispering Woods with wolf"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover fade-in-soft"
                />

                {/* Leo shivering in the woods – nudged slightly more left again */}
                <img
                    src="/assets/img/whisperingwoods/Leo Shivering.png"
                    alt="Leo shivering"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] left-[9%] w-[min(40vw,480px)] h-auto object-contain object-bottom pointer-events-none"
                    aria-hidden
                />

                {/* Marky beside Leo on the left side – slightly bigger than Leo */}
                <img
                    src="/assets/img/Marky3.png"
                    alt="Marky"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[4%] left-[30%] w-[min(44vw,520px)] h-auto object-contain object-bottom pointer-events-none"
                    aria-hidden
                />

                {/* Branch pile on the far right – nudged slightly larger */}
                <img
                    src="/assets/img/whisperingwoods/treee branch.png"
                    alt="Broken tree branches"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[2%] right-[4%] w-[min(38vw,460px)] h-auto object-contain object-bottom pointer-events-none"
                    aria-hidden
                />

                {/* Wolf appearing at the same spot as the branch pile */}
                <img
                    src={encodeURI('/assets/img/whisperingwoods/wolf_emotions-#5.png')}
                    alt="Scared wolf"
                    loading="eager"
                    decoding="async"
                    className="absolute bottom-[2%] right-[4%] w-[min(38vw,460px)] h-auto object-contain object-bottom pointer-events-none"
                />

                {/* Narration bar – Leo reacts to the sound */}
                <div className="absolute inset-x-4 sm:inset-x-10 bottom-6 sm:bottom-8 z-[110]">
                    <div className="mx-auto max-w-4xl rounded-2xl bg-black/70 text-white px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm border border-white/20 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-center text-sm sm:text-base font-semibold uppercase tracking-wider text-white/90 mb-2">
                                LEO
                            </div>
                            <div className="h-px bg-white/30 mb-2" aria-hidden />
                            <div className="cartoon-thin text-base sm:text-lg leading-relaxed drop-shadow text-left">
                                What was that?!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

