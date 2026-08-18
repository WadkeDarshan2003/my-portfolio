import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio playback failed:", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Default to a soft volume
    }
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
        className="p-3 rounded-full bg-white/80 dark:bg-black/75 backdrop-blur-sm border border-white/40 dark:border-neutral-800 shadow-lg text-slate-700 dark:text-neutral-200 hover:scale-110 transition-all z-[60]"
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
};
