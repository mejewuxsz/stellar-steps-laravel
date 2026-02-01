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
                <link rel="preload" href="/assets/img/LP_BG.jpg" as="image" />
                <link rel="preload" href="/assets/img/Book.png" as="image" />
                <link rel="preload" href="/assets/img/title.png" as="image" />
            </Head>
            {/* Warm wood-tone fallback so content is visible before images load */}
            <div
                className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center transition-colors duration-300"
                style={{
                    backgroundColor: '#5c4a3d',
                    backgroundImage: "url('/assets/img/LP_BG.jpg')",
                }}
            >
                <button
                    type="button"
                    onClick={handleTap}
                    className="relative outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-xl"
                >
                    <div className="relative transform transition-transform duration-200 hover:scale-110">
                        <img
                            src="/assets/img/Book.png"
                            alt="Story book"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={() => setBookLoaded(true)}
                            className={`max-w-sm md:max-w-lg lg:max-w-2xl drop-shadow-2xl pointer-events-none select-none transition-opacity duration-500 ${bookLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />

                        <img
                            src="/assets/img/title.png"
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
