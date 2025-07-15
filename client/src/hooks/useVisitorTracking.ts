import { useEffect, useRef } from 'react';
import { generateAdvancedFingerprint, generateDeviceId, type DeviceFingerprint } from '@/lib/deviceFingerprinting';

// Generate a unique session ID
function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Get or create session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
}

export function useVisitorTracking() {
  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    // Track visitor on initial load
    if (!hasTrackedRef.current) {
      hasTrackedRef.current = true;
      
      const trackVisitor = async () => {
        try {
          const sessionId = getSessionId();
          const referrer = document.referrer || null;
          const page = window.location.pathname;
          
          // Generate advanced fingerprint for personal identification
          const fingerprint = await generateAdvancedFingerprint();
          const deviceId = generateDeviceId(fingerprint);
          
          // Extract personal information from fingerprint
          const personalData = {
            deviceName: fingerprint.personalIdentifiers.deviceName,
            userName: fingerprint.personalIdentifiers.userName,
            computerName: fingerprint.personalIdentifiers.computerName,
            deviceId: deviceId,
            screenResolution: `${fingerprint.screen.width}x${fingerprint.screen.height}`,
            timezone: fingerprint.timezone,
            language: fingerprint.navigator.language,
            platform: fingerprint.navigator.platform,
            deviceMemory: fingerprint.navigator.deviceMemory,
            hardwareConcurrency: fingerprint.navigator.hardwareConcurrency,

            networkType: fingerprint.personalIdentifiers.networkName,
          };
          
          const response = await fetch('/api/track-visitor', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              page,
              referrer,
              fingerprint: fingerprint,
              personalData: personalData,
              sessionId,
              timeSpent: null
            })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.error('Failed to track visitor:', error);
        }
      };

      trackVisitor();
    }

    // Track time spent when user leaves
    const handleBeforeUnload = async () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      const sessionId = getSessionId();
      const page = window.location.pathname;
      
      // Use sendBeacon for reliable tracking on page unload
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({
          page,
          referrer: document.referrer || null,
          sessionId,
          timeSpent
        })], { type: 'application/json' });
        
        navigator.sendBeacon('/api/track-visitor', blob);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}