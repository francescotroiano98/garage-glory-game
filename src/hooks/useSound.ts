import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

// Local sound assets - bundled with the app for reliability
import repairSfx from '@/assets/audio/sfx/repair.wav';
import repairCompleteSfx from '@/assets/audio/sfx/repair-complete.wav';
import errorSfx from '@/assets/audio/sfx/error.wav';
import phoneRingSfx from '@/assets/audio/sfx/phone-ring.wav';
import clickSfx from '@/assets/audio/sfx/click.wav';
import hangupSfx from '@/assets/audio/sfx/hangup.wav';
import cashRegisterSfx from '@/assets/audio/sfx/cash-register.wav';
import coinSfx from '@/assets/audio/sfx/coin.wav';
import negotiateSfx from '@/assets/audio/sfx/negotiate.wav';
import buttonClickSfx from '@/assets/audio/sfx/button-click.wav';
import pageChangeSfx from '@/assets/audio/sfx/page-change.wav';
import paperRustleSfx from '@/assets/audio/sfx/paper-rustle.wav';
import notificationSfx from '@/assets/audio/sfx/notification.wav';
import levelUpSfx from '@/assets/audio/sfx/level-up.wav';
import achievementSfx from '@/assets/audio/sfx/achievement.wav';
import energyBonusSfx from '@/assets/audio/sfx/energy-bonus.wav';

const SOUNDS = {
  repair: repairSfx,
  repairComplete: repairCompleteSfx,
  repairFail: errorSfx,
  customerCall: phoneRingSfx,
  phonePickup: clickSfx,
  phoneHangup: hangupSfx,
  cashRegister: cashRegisterSfx,
  purchase: coinSfx,
  negotiate: negotiateSfx,
  buttonClick: buttonClickSfx,
  pageChange: pageChangeSfx,
  saleStart: notificationSfx,
  newspaperOpen: paperRustleSfx,
  levelUp: levelUpSfx,
  achievement: achievementSfx,
  energyBonus: energyBonusSfx,
  skillUp: energyBonusSfx,
  error: errorSfx,
  inspect: clickSfx,
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
