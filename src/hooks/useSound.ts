import { useCallback, useEffect, useRef, useState } from 'react';

// Sound URLs (using free sound effects)
const SOUNDS = {
  repair: 'https://cdn.freesound.org/previews/352/352659_6565101-lq.mp3',
  repairComplete: 'https://cdn.freesound.org/previews/320/320181_5260872-lq.mp3',
  repairFail: 'https://cdn.freesound.org/previews/415/415079_7863133-lq.mp3',
  customerCall: 'https://cdn.freesound.org/previews/352/352432_6565101-lq.mp3',
  cashRegister: 'https://cdn.freesound.org/previews/352/352310_6565101-lq.mp3',
  buttonClick: 'https://cdn.freesound.org/previews/220/220206_4100637-lq.mp3',
  purchase: 'https://cdn.freesound.org/previews/131/131660_2398403-lq.mp3',
  levelUp: 'https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3',
  achievement: 'https://cdn.freesound.org/previews/270/270319_5123851-lq.mp3',
  energyBonus: 'https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3',
};

type SoundType = keyof typeof SOUNDS;

export function useSound() {
  const [muted, setMuted] = useState(() => {
    const saved = localStorage.getItem('game_sound_muted');
    return saved === 'true';
  });
  
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map());

  // Preload sounds
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 0.3;
      audioRefs.current.set(key as SoundType, audio);
    });
    
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current.clear();
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (muted) return;
    
    const audio = audioRefs.current.get(type);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('game_sound_muted', String(newValue));
      return newValue;
    });
  }, []);

  return { playSound, muted, toggleMute };
}

export function useBackgroundMusic() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Relaxing background music
    const audio = new Audio('https://cdn.freesound.org/previews/612/612321_13724389-lq.mp3');
    audio.loop = true;
    audio.volume = 0.1;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  return { playing, toggleMusic };
}
