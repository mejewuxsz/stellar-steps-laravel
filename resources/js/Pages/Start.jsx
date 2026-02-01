import { useState } from 'react';
import { Head } from '@inertiajs/react';

export default function Start() {
    const [bookState, setBookState] = useState('closed'); // 'closed' | 'opening' | 'open'
    const [closedBookLoaded, setClosedBookLoaded] = useState(false);
    const [openBookLoaded, setOpenBookLoaded] = useState(false);
    const [titleLoaded, setTitleLoaded] = useState(false);

    const handleTap = () => {
        if (bookState !== 'closed') return;

        setBookState('opening');

        // After a short fade-out, switch to the open book
        setTimeout(() => {
            setBookState('open');
        }, 600); // keep in sync with fade duration
    };

    return (
        <>
            <Head title="Stellar Steps">
                <link rel="preload" href="/assets/img/LP_BG.webp" as="image" />
                <link rel="preload" href="/assets/img/Book.webp" as="image" />
                <link rel="preload" href="/assets/img/openbooktape.webp" as="image" />
                <link rel="preload" href="/assets/img/title.webp" as="image" />
            </Head>
            {/* Warm wood-tone fallback so content is visible before images load */}
            <div
                className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center transition-colors duration-300"
                style={{
                    backgroundColor: '#5c4a3d',
                    backgroundImage: "url('/assets/img/LP_BG.webp')",
                }}
            >
                <button
                    type="button"
                    onClick={handleTap}
                    className="relative outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-xl"
                >
                    <div className="relative transform transition-transform duration-200 hover:scale-110">
                        {/* Closed book image - fade in when loaded */}
                        <img
                            src="/assets/img/Book.webp"
                            alt="Story book"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={() => setClosedBookLoaded(true)}
                            className={`max-w-sm md:max-w-lg lg:max-w-2xl drop-shadow-2xl pointer-events-none select-none transition-opacity duration-700 ${
                                bookState === 'open' ? 'opacity-0' : closedBookLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        />

                        {/* Open book image - fade in when loaded */}
                        <img
                            src="/assets/img/openbooktape.webp"
                            alt="Story book opened"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={() => setOpenBookLoaded(true)}
                            className={`max-w-sm md:max-w-lg lg:max-w-2xl drop-shadow-2xl pointer-events-none select-none absolute inset-0 m-auto transition-opacity duration-700 ${
                                bookState === 'open' ? (openBookLoaded ? 'opacity-100' : 'opacity-0') : 'opacity-0'
                            }`}
                        />

                        {/* Title - fade in when loaded, fades out when book opens */}
                        <img
                            src="/assets/img/title.webp"
                            alt="Stellar Steps title"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={() => setTitleLoaded(true)}
                            className={`pointer-events-none select-none absolute top-[18%] left-1/2 -translate-x-[40%] w-3/4 md:w-2/3 title-logo-glow transition-opacity duration-700 ${
                                bookState === 'open' ? 'opacity-0' : titleLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        />

                        {/* Visible immediately so user sees something while images load */}
                        <div
                            className={`absolute inset-x-0 bottom-[20%] flex justify-center transition-opacity duration-700 ${
                                bookState === 'open' ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            <span
                                className="inline-block font-extrabold tracking-[0.25em] text-sm md:text-base lg:text-lg text-yellow-300 animate-pulse ml-8 transform transition-transform duration-200 hover:scale-110"
                                style={{
                                    textShadow:
                                        '0 0 8px rgba(250,250,150,0.9), 0 0 18px rgba(250,250,150,0.7)',
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
