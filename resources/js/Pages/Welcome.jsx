import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Welcome() {
    const [bookLoaded, setBookLoaded] = useState(false);
    const [titleLoaded, setTitleLoaded] = useState(false);

    const handleTap = () => {
        router.visit('/signup');
    };

    return (
        <>
            <Head title="Stellar Steps">
                <link rel="preload" href="/assets/img/LP_BG-960w.webp" as="image" />
            </Head>
            <div className="min-h-screen w-full flex items-center justify-center relative" style={{ backgroundColor: '#5c4a3d' }}>
                <img
                    src="/assets/img/LP_BG.webp"
                    srcSet="/assets/img/LP_BG-960w.webp 960w, /assets/img/LP_BG-1920w.webp 1920w"
                    sizes="100vw"
                    alt=""
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    aria-hidden
                />
                <button
                    type="button"
                    onClick={handleTap}
                    className="relative z-10 outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-xl"
                >
                    <div className="relative transform transition-transform duration-200 hover:scale-110">
                        <img
                            src="/assets/img/Book.webp"
                            srcSet="/assets/img/Book-800w.webp 800w, /assets/img/Book-1600w.webp 1600w"
                            sizes="(max-width: 768px) 384px, (max-width: 1024px) 512px, 672px"
                            alt="Story book"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={() => setBookLoaded(true)}
                            className={`max-w-sm md:max-w-lg lg:max-w-2xl drop-shadow-2xl pointer-events-none select-none transition-opacity duration-500 ${bookLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />

                        <img
                            src="/assets/img/title.webp"
                            srcSet="/assets/img/title-800w.webp 800w, /assets/img/title-1600w.webp 1600w"
                            sizes="(max-width: 768px) 75vw, (max-width: 1024px) 66vw, 50vw"
                            alt="Stellar Steps title"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={() => setTitleLoaded(true)}
                            className={`pointer-events-none select-none absolute top-[18%] left-1/2 -translate-x-[40%] w-3/4 md:w-2/3 title-logo-glow transition-opacity duration-500 ${titleLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />

                        {/* Visible immediately so user sees something while images load */}
                        <div className="absolute inset-x-0 bottom-[28%] flex justify-center">
                            <span
                                className="inline-block rounded-sans tracking-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-yellow-300 animate-pulse ml-8 transform transition-transform duration-200 hover:scale-110"
                                style={{
                                    textShadow:
                                        '0 0 8px rgba(250,250,150,0.9), 0 0 18px rgba(250,250,150,0.7)',
                                    WebkitTextStroke: '1px rgba(253, 224, 71, 0.8)',
                                    paintOrder: 'stroke fill',
                                }}
                            >
                                TAP TO OPEN
                            </span>
                        </div>
                    </div>
                </button>
            </div>
        </>
    );
}
