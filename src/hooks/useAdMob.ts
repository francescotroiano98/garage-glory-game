import { useState, useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

// AdMob configuration
const ADMOB_CONFIG = {
  appId: 'ca-app-pub-9422801100712013~6515517081',
  rewardedAdUnitId: 'ca-app-pub-9422801100712013/8627712510',
  // Test IDs for development
  testRewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917',
};

// Use test ads in development, real ads in production
const IS_PRODUCTION = Capacitor.isNativePlatform();
const REWARDED_AD_ID = IS_PRODUCTION
  ? ADMOB_CONFIG.rewardedAdUnitId
  : ADMOB_CONFIG.testRewardedAdUnitId;

type AdMobModule = typeof import('@capacitor-community/admob');

let admobModule: AdMobModule | null = null;
let admobInitialized = false;

async function getAdMob(): Promise<AdMobModule | null> {
  if (!Capacitor.isNativePlatform()) return null;
  if (admobModule) return admobModule;
  try {
    admobModule = await import('@capacitor-community/admob');
    return admobModule;
  } catch {
    console.warn('AdMob module not available');
    return null;
  }
}

async function initAdMob() {
  if (admobInitialized) return;
  const mod = await getAdMob();
  if (!mod) return;
  
  try {
    await mod.AdMob.initialize({
      initializeForTesting: !IS_PRODUCTION,
    });
    admobInitialized = true;
    console.log('AdMob initialized');
  } catch (e) {
    console.error('AdMob init error:', e);
  }
}

export function useAdMob() {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isNative) {
      initAdMob();
    }
  }, [isNative]);

  const prepareRewardedAd = useCallback(async () => {
    const mod = await getAdMob();
    if (!mod) return false;

    setIsAdLoading(true);
    try {
      await mod.AdMob.prepareRewardVideoAd({
        adId: REWARDED_AD_ID,
        isTesting: !IS_PRODUCTION,
      });
      setIsAdLoaded(true);
      setIsAdLoading(false);
      return true;
    } catch (e) {
      console.error('Failed to prepare rewarded ad:', e);
      setIsAdLoading(false);
      return false;
    }
  }, []);

  const showRewardedAd = useCallback(async (): Promise<boolean> => {
    const mod = await getAdMob();
    if (!mod) return false;

    // If ad not loaded yet, prepare it first
    if (!isAdLoaded) {
      const prepared = await prepareRewardedAd();
      if (!prepared) return false;
    }

    setIsShowingAd(true);
    try {
      const result = await mod.AdMob.showRewardVideoAd();
      setIsAdLoaded(false);
      setIsShowingAd(false);
      // Preload next ad
      prepareRewardedAd();
      // result contains reward info
      return true;
    } catch (e) {
      console.error('Failed to show rewarded ad:', e);
      setIsAdLoaded(false);
      setIsShowingAd(false);
      return false;
    }
  }, [isAdLoaded, prepareRewardedAd]);

  return {
    isNative,
    isAdLoaded,
    isAdLoading,
    isShowingAd,
    showRewardedAd,
    prepareRewardedAd,
  };
}
