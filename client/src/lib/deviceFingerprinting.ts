// Advanced device fingerprinting for personal identification
interface DeviceFingerprint {
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelDepth: number;
  };
  navigator: {
    userAgent: string;
    language: string;
    languages: string[];
    platform: string;
    cookieEnabled: boolean;
    doNotTrack: string;
    hardwareConcurrency: number;
    deviceMemory: number;
    maxTouchPoints: number;
  };
  timezone: string;
  webgl: string;
  canvas: string;
  audio: string;
  fonts: string[];
  plugins: string[];
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  webSQL: boolean;
  battery?: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  };
  personalIdentifiers: {
    deviceName?: string;
    userName?: string;
    computerName?: string;
    networkName?: string;
    bluetoothName?: string;
  };
}

// Generate canvas fingerprint
function generateCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Create a complex pattern that varies by device
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Personal Device Fingerprint 🔍', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Advanced Identification', 4, 45);
    
    return canvas.toDataURL();
  } catch (e) {
    return '';
  }
}

// Generate WebGL fingerprint
function generateWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return '';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return `${vendor}-${renderer}`;
    }
    
    return '';
  } catch (e) {
    return '';
  }
}

// Generate audio fingerprint
function generateAudioFingerprint(): string {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const analyser = audioContext.createAnalyser();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.value = 10000;
    
    gainNode.gain.value = 0;
    oscillator.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    
    oscillator.stop();
    audioContext.close();
    
    return Array.from(frequencyData).slice(0, 30).join(',');
  } catch (e) {
    return '';
  }
}

// Detect available fonts
function getAvailableFonts(): string[] {
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const fontList = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Trebuchet MS', 'Comic Sans MS', 'Impact',
    'Arial Black', 'Tahoma', 'Lucida Console', 'Palatino',
    'Garamond', 'Bookman', 'Avant Garde', 'Calibri', 'Candara',
    'Century Gothic', 'Franklin Gothic', 'Futura', 'Gill Sans',
    'Myriad Pro', 'Optima', 'Segoe UI', 'Consolas', 'Monaco'
  ];
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return [];
  
  context.font = testSize + ' monospace';
  const baseWidths = baseFonts.map(baseFont => {
    context.font = testSize + ' ' + baseFont;
    return context.measureText(testString).width;
  });
  
  return fontList.filter(font => {
    return baseFonts.some((baseFont, index) => {
      context.font = testSize + ' ' + font + ', ' + baseFont;
      return context.measureText(testString).width !== baseWidths[index];
    });
  });
}

// Get installed plugins
function getPlugins(): string[] {
  const plugins = [];
  for (let i = 0; i < navigator.plugins.length; i++) {
    plugins.push(navigator.plugins[i].name);
  }
  return plugins;
}

// Advanced personal identification techniques
async function extractPersonalIdentifiers(): Promise<DeviceFingerprint['personalIdentifiers']> {
  const identifiers: DeviceFingerprint['personalIdentifiers'] = {};
  
  try {
    // Try to get device name from user agent
    const userAgent = navigator.userAgent;
    const deviceNameMatch = userAgent.match(/\(([^)]+)\)/);
    if (deviceNameMatch) {
      identifiers.deviceName = deviceNameMatch[1];
    }
    
    // Try to extract computer name from various sources
    if ('bluetooth' in navigator) {
      try {
        const bluetooth = navigator.bluetooth as any;
        if (bluetooth.getDevices) {
          const devices = await bluetooth.getDevices();
          if (devices.length > 0) {
            identifiers.bluetoothName = devices[0].name;
          }
        }
      } catch (e) {
        // Bluetooth API might not be available
      }
    }
    
    // Try to get network information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        identifiers.networkName = connection.effectiveType;
      }
    }
    
    // Check for WebRTC to get local IP and network info
    try {
      const rtcPeerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      const dataChannel = rtcPeerConnection.createDataChannel('');
      
      rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (ipMatch) {
            identifiers.networkName = ipMatch[1];
          }
        }
      };
      
      await rtcPeerConnection.createOffer().then(offer => {
        rtcPeerConnection.setLocalDescription(offer);
      });
      
      // Clean up
      setTimeout(() => {
        rtcPeerConnection.close();
      }, 1000);
    } catch (e) {
      // WebRTC might not be available
    }
    
  } catch (error) {
    console.log('Personal identification failed:', error);
  }
  
  return identifiers;
}

// Main fingerprinting function
export async function generateAdvancedFingerprint(): Promise<DeviceFingerprint> {
  const fingerprint: DeviceFingerprint = {
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    },
    navigator: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages as string[],
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    webgl: generateWebGLFingerprint(),
    canvas: generateCanvasFingerprint(),
    audio: generateAudioFingerprint(),
    fonts: getAvailableFonts(),
    plugins: getPlugins(),
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    indexedDB: !!window.indexedDB,
    webSQL: !!(window as any).openDatabase,
    personalIdentifiers: await extractPersonalIdentifiers()
  };
  
  // Try to get battery information
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      fingerprint.battery = {
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      };
    } catch (e) {
      // Battery API might not be available
    }
  }
  
  return fingerprint;
}

// Generate a unique device identifier
export function generateDeviceId(fingerprint: DeviceFingerprint): string {
  const components = [
    fingerprint.screen.width,
    fingerprint.screen.height,
    fingerprint.navigator.userAgent,
    fingerprint.navigator.language,
    fingerprint.timezone,
    fingerprint.webgl,
    fingerprint.canvas,
    fingerprint.fonts.join(','),
    fingerprint.plugins.join(','),
    fingerprint.personalIdentifiers.deviceName || '',
    fingerprint.personalIdentifiers.userName || '',
    fingerprint.personalIdentifiers.computerName || ''
  ];
  
  // Create a hash-like identifier
  const hash = components.join('|');
  return btoa(hash).slice(0, 32);
}

export type { DeviceFingerprint };