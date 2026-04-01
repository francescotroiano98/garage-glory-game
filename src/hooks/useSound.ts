import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

// Sound URLs - coherent game sounds from freesound.org
const SOUNDS = {
  // Repair sounds
  repair: 'https://cdn.freesound.org/previews/352/352659_6565101-lq.mp3',        // wrench/tool working
  repairComplete: 'https://cdn.freesound.org/previews/320/320181_5260872-lq.mp3', // success chime
  repairFail: 'https://cdn.freesound.org/previews/415/415079_7863133-lq.mp3',     // error buzz
  
  // Phone & customers
  customerCall: 'https://cdn.freesound.org/previews/352/352432_6565101-lq.mp3',   // phone ringing
  phonePickup: 'https://cdn.freesound.org/previews/399/399934_1676145-lq.mp3',    // phone pick up click
  phoneHangup: 'https://cdn.freesound.org/previews/514/514132_3905081-lq.mp3',    // phone hang up
  
  // Money & commerce
  cashRegister: 'https://cdn.freesound.org/previews/352/352310_6565101-lq.mp3',   // cash register
  purchase: 'https://cdn.freesound.org/previews/131/131660_2398403-lq.mp3',       // coin/purchase
  negotiate: 'https://cdn.freesound.org/previews/256/256113_4772965-lq.mp3',      // negotiation sound
  
  // Navigation & UI
  buttonClick: 'https://cdn.freesound.org/previews/220/220206_4100637-lq.mp3',    // soft click
  pageChange: 'https://cdn.freesound.org/previews/220/220207_4100637-lq.mp3',     // page turn
  saleStart: 'https://cdn.freesound.org/previews/411/411462_5121236-lq.mp3',      // listing notification
  
  // Newspaper
  newspaperOpen: 'https://cdn.freesound.org/previews/350/350405_6466307-lq.mp3',  // paper rustle
  
  // Progress & rewards
  levelUp: 'https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3',        // fanfare
  achievement: 'https://cdn.freesound.org/previews/270/270319_5123851-lq.mp3',    // achievement jingle
  energyBonus: 'https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3',    // energy collect
  skillUp: 'https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3',        // skill upgrade
  
  // Error
  error: 'https://cdn.freesound.org/previews/415/415079_7863133-lq.mp3',          // error sound

  // Inspection
  inspect: 'https://cdn.freesound.org/previews/399/399934_1676145-lq.mp3',        // magnifying glass / click
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
  
  const howlsRef = useRef<Map<SoundType, Howl>>(new Map());
  const initialized = useRef(false);

  // Initialize Howler sounds once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    Object.entries(SOUNDS).forEach(([key, url]) => {
      const howl = new Howl({
        src: [url],
        volume: sfxVolume,
        preload: true,
        html5: false, // Use Web Audio API for better performance
      });
      howlsRef.current.set(key as SoundType, howl);
    });
    
    return () => {
      howlsRef.current.forEach(howl => howl.unload());
      howlsRef.current.clear();
      initialized.current = false;
    };
  }, []);

  // Update volume on all howls when it changes
  useEffect(() => {
    howlsRef.current.forEach(howl => {
      howl.volume(sfxVolume);
    });
  }, [sfxVolume]);

  // Update global mute
  useEffect(() => {
    Howler.mute(muted);
  }, [muted]);

  const playSound = useCallback((type: SoundType) => {
    if (muted) return;
    const howl = howlsRef.current.get(type);
    if (howl) {
      howl.play();
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
 
// Global audio instance for background music - singleton pattern using Howler
class BackgroundMusicManager {
  private static instance: BackgroundMusicManager;
  private howl: Howl | null = null;
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

    this.howl = new Howl({
      src: [backgroundMusicFile],
      loop: true,
      volume: parseFloat(localStorage.getItem('game_music_volume') || '0.15'),
      preload: true,
      html5: true, // Use HTML5 Audio for long music tracks (better streaming)
    });

    const enableAudio = () => {
      this.userInteracted = true;
      const shouldPlay = localStorage.getItem('game_music_playing') === 'true';
      if (shouldPlay && this.howl) {
        this.howl.play();
      }
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
  }

  play() {
    if (this.howl && this.userInteracted) {
      if (!this.howl.playing()) {
        this.howl.play();
      }
    }
  }

  pause() {
    if (this.howl) {
      this.howl.pause();
    }
  }

  setVolume(volume: number) {
    if (this.howl) {
      this.howl.volume(volume);
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

  useEffect(() => {
    musicManager.init();
  }, []);

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
