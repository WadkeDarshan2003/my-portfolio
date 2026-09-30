import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(() => {
    return localStorage.getItem('audio_muted') !== 'true';
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        localStorage.setItem('audio_muted', 'true');
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          localStorage.removeItem('audio_muted');
          setIsPlaying(true);
        }).catch(err => {
          console.error("Audio playback error:", err);
        });
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25; // Smooth ambient volume level

    if (localStorage.getItem('audio_muted') === 'true') {
      setIsPlaying(false);
      return;
    }

    const startAudio = () => {
      if (localStorage.getItem('audio_muted') !== 'true' && audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay policy prevented immediate playback, wait for first user gesture
          const handleFirstGesture = () => {
            if (localStorage.getItem('audio_muted') !== 'true' && audio.paused) {
              audio.play().then(() => setIsPlaying(true)).catch(() => {});
            }
            window.removeEventListener('click', handleFirstGesture);
            window.removeEventListener('scroll', handleFirstGesture);
            window.removeEventListener('keydown', handleFirstGesture);
          };
          window.addEventListener('click', handleFirstGesture, { once: true });
          window.addEventListener('scroll', handleFirstGesture, { once: true });
          window.addEventListener('keydown', handleFirstGesture, { once: true });
        });
      }
    };

    startAudio();
  }, []);

  return (
    <>
      <audio 
        ref={audioRef} 
        src="/bg-music.mp3" 
        loop 
        preload="auto"
      />
      <button 
        onClick={togglePlay}
        className="p-3 rounded-full bg-white/80 dark:bg-black/75 backdrop-blur-sm border border-white/40 dark:border-neutral-800 shadow-lg text-slate-700 dark:text-neutral-200 hover:scale-110 transition-all z-60 cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
        title={isPlaying ? "Mute background music" : "Play background music"}
      >
        {isPlaying ? (
          <Volume2 size={20} className="text-slate-900 dark:text-white" />
        ) : (
          <VolumeX size={20} className="text-red-500 dark:text-red-500" />
        )}
      </button>
    </>
  );
};
