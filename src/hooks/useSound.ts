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
  negotiate: 'https://cdn.freesound.org/previews/256/256113_4772965-lq.mp3',
  saleStart: 'https://cdn.freesound.org/previews/411/411462_5121236-lq.mp3',
  pageChange: 'https://cdn.freesound.org/previews/220/220207_4100637-lq.mp3',
  skillUp: 'https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3',
  error: 'https://cdn.freesound.org/previews/415/415079_7863133-lq.mp3',
};

type SoundType = keyof typeof SOUNDS;

export function useSound() {
  const [muted, setMuted] = useState(() => {
    const saved = localStorage.getItem('game_sound_muted');
    return saved === 'true';
  });
  
  const [sfxVolume, setSfxVolumeState] = useState(() => {
    const saved = localStorage.getItem('game_sfx_volume');
    return saved ? parseFloat(saved) : 0.3;
  });
  
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map());

  // Preload sounds
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = sfxVolume;
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

  // Update volume on all audio elements when it changes
  useEffect(() => {
    audioRefs.current.forEach(audio => {
      audio.volume = sfxVolume;
    });
  }, [sfxVolume]);

  const playSound = useCallback((type: SoundType) => {
    if (muted) return;
    
    const audio = audioRefs.current.get(type);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('game_sound_muted', String(newValue));
      return newValue;
    });
  }, []);

  const setSfxVolume = useCallback((volume: number) => {
    setSfxVolumeState(volume);
    localStorage.setItem('game_sfx_volume', String(volume));
  }, []);

  return { playSound, muted, toggleMute, sfxVolume, setSfxVolume };
}

// Use a local audio file for reliable playback
import backgroundMusicFile from '@/assets/audio/background-music.mp3';
 
// Global audio instance for background music - singleton pattern
class BackgroundMusicManager {
  private static instance: BackgroundMusicManager;
  private audio: HTMLAudioElement | null = null;
  private initialized = false;
  private userInteracted = false;

  static getInstance(): BackgroundMusicManager {
    if (!BackgroundMusicManager.instance) {
      BackgroundMusicManager.instance = new BackgroundMusicManager();
    }
    return BackgroundMusicManager.instance;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.audio = new Audio(backgroundMusicFile);
    this.audio.loop = true;
    this.audio.volume = parseFloat(localStorage.getItem('game_music_volume') || '0.15');
    this.audio.preload = 'auto';

    const enableAudio = () => {
      this.userInteracted = true;
      const shouldPlay = localStorage.getItem('game_music_playing') === 'true';
      if (shouldPlay && this.audio) {
        this.audio.play().catch(() => {});
      }
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
  }

  play() {
    if (this.audio && this.userInteracted) {
      this.audio.play().catch(() => {});
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = volume;
    }
  }
}

// Initialize on module load
const musicManager = BackgroundMusicManager.getInstance();

export function useBackgroundMusic() {
  const [playing, setPlaying] = useState(() => {
    const saved = localStorage.getItem('game_music_playing');
    return saved === 'true';
  });

  const [musicVolume, setMusicVolumeState] = useState(() => {
    const saved = localStorage.getItem('game_music_volume');
    return saved ? parseFloat(saved) : 0.15;
  });

  // Initialize music manager once
  useEffect(() => {
    musicManager.init();
  }, []);

  // Sync play state
  useEffect(() => {
    if (playing) {
      musicManager.play();
    } else {
      musicManager.pause();
    }
  }, [playing]);

  const toggleMusic = useCallback(() => {
    setPlaying(prev => {
      const newValue = !prev;
      localStorage.setItem('game_music_playing', String(newValue));
      return newValue;
    });
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    setMusicVolumeState(volume);
    localStorage.setItem('game_music_volume', String(volume));
    musicManager.setVolume(volume);
  }, []);

  return { playing, toggleMusic, musicVolume, setMusicVolume };
}
