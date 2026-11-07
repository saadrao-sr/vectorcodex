import { useEffect, useRef } from 'react';

interface Props {
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
}

function shouldPlayVideo() {
  if (typeof window === 'undefined') return false;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return false;

  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;

  if (connection?.saveData) return false;
  if (connection?.effectiveType && /^(slow-)?2g$/.test(connection.effectiveType)) return false;

  // Keep mobile on the poster for bandwidth and LCP.
  if (window.matchMedia('(max-width: 767px)').matches) return false;

  return true;
}

/**
 * Progressive hero background video.
 * Poster stays visible; video sources are attached only when playback is appropriate.
 */
export default function HeroBackgroundVideo({ webmSrc, mp4Src, posterSrc }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const enable = () => {
      if (!shouldPlayVideo()) {
        video.removeAttribute('src');
        video.load();
        return;
      }

      if (!video.querySelector('source')) {
        const webm = document.createElement('source');
        webm.src = webmSrc;
        webm.type = 'video/webm';
        const mp4 = document.createElement('source');
        mp4.src = mp4Src;
        mp4.type = 'video/mp4';
        video.append(webm, mp4);
        video.load();
      }

      const play = () => {
        void video.play().catch(() => {
          /* Autoplay can still fail; poster remains. */
        });
      };

      if (video.readyState >= 2) play();
      else video.addEventListener('loadeddata', play, { once: true });
    };

    enable();

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => enable();
    media.addEventListener('change', onChange);
    window.addEventListener('resize', onChange);

    return () => {
      media.removeEventListener('change', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, [webmSrc, mp4Src]);

  return (
    <video
      ref={videoRef}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
      poster={posterSrc}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
