import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { heroVideo } from '../data/media';

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayAllowed, setAutoplayAllowed] = useState(false);
  const [intent, setIntent] = useState<'auto' | 'play' | 'pause'>('auto');
  const [request, setRequest] = useState(0);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [source, setSource] = useState<string>();
  const [playing, setPlaying] = useState(false);
  const [frameVisible, setFrameVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const wantsPlayback = intent === 'play' || (intent === 'auto' && autoplayAllowed);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData: boolean } }).connection;
    const syncPreference = () => setAutoplayAllowed(!preference.matches && !connection?.saveData);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncPreference();
    preference.addEventListener('change', syncPreference);
    document.addEventListener('visibilitychange', syncVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', syncPreference);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  useEffect(() => {
    // Attach media only on demand; reduced-motion/data-saving visits keep the poster.
    if (wantsPlayback && inView && pageVisible && !source) {
      setSource(window.matchMedia('(max-width: 700px)').matches ? heroVideo.mobile : heroVideo.desktop);
    }
  }, [wantsPlayback, inView, pageVisible, source]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source || failed) return;
    video.muted = true;
    video.defaultMuted = true;
    if (wantsPlayback && inView && pageVisible) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
    return () => video.pause();
  }, [wantsPlayback, inView, pageVisible, source, request, failed]);

  const toggle = () => {
    setIntent(playing ? 'pause' : 'play');
    setRequest(previous => previous + 1);
  };

  return <>
    <video
      ref={videoRef}
      className="hero-video"
      data-ready={frameVisible}
      data-state={failed ? 'unavailable' : playing ? 'playing' : 'paused'}
      src={source}
      poster={heroVideo.poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => { setPlaying(true); setFrameVisible(true); }}
      onPause={() => setPlaying(false)}
      onError={() => { setFailed(true); setPlaying(false); setFrameVisible(false); }}
    />
    {!failed && <button
      type="button"
      className="icon-button hero-video-toggle"
      onClick={toggle}
      aria-label={playing ? 'Pausar video de portada' : 'Reproducir video de portada'}
      title={playing ? 'Pausar video' : 'Reproducir video'}
    >{playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}</button>}
    <a className="hero-video-credit" href={heroVideo.sourcePage} target="_blank" rel="noreferrer">{heroVideo.credit}</a>
  </>;
}
