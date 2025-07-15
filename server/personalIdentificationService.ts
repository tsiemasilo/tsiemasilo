import { Request } from 'express';
import { getComprehensiveGeoData } from './ipGeoService';

interface PersonalIdentificationData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  deviceName?: string;
  deviceId?: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  platform?: string;
  networkType?: string;
  connectionSpeed?: string;

  deviceMemory?: number;
  hardwareConcurrency?: number;
  socialMediaHandle?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  twitterHandle?: string;
}

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

}

// Extract device information from User-Agent
function extractDeviceInfo(userAgent: string): { deviceName?: string; platform?: string } {
  const devicePatterns = [
    // Mobile devices
    { pattern: /iPhone/i, name: 'iPhone' },
    { pattern: /iPad/i, name: 'iPad' },
    { pattern: /iPod/i, name: 'iPod' },
    { pattern: /Android/i, name: 'Android Device' },
    { pattern: /BlackBerry/i, name: 'BlackBerry' },
    { pattern: /Windows Phone/i, name: 'Windows Phone' },
    
    // Desktop platforms
    { pattern: /Macintosh/i, name: 'Mac' },
    { pattern: /Windows NT/i, name: 'Windows PC' },
    { pattern: /Linux/i, name: 'Linux PC' },
    { pattern: /X11/i, name: 'Unix System' },
  ];

  for (const device of devicePatterns) {
    if (device.pattern.test(userAgent)) {
      return { deviceName: device.name, platform: device.name };
    }
  }

  return {};
}

// Extract potential personal information from various sources
async function extractPersonalInfo(req: Request, fingerprint?: DeviceFingerprint): Promise<PersonalIdentificationData> {
  const result: PersonalIdentificationData = {};
  
  // Extract basic device info
  const deviceInfo = extractDeviceInfo(req.headers['user-agent'] || '');
  result.deviceName = deviceInfo.deviceName;
  result.platform = deviceInfo.platform;
  
  // Extract language and timezone from headers
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    result.language = acceptLanguage.split(',')[0].split(';')[0].trim();
  }
  
  // Extract timezone from fingerprint
  if (fingerprint?.timezone) {
    result.timezone = fingerprint.timezone;
  }
  
  // Extract screen resolution
  if (fingerprint?.screen) {
    result.screenResolution = `${fingerprint.screen.width}x${fingerprint.screen.height}`;
  }
  
  // Extract device capabilities
  if (fingerprint?.navigator) {
    result.hardwareConcurrency = fingerprint.navigator.hardwareConcurrency;
    result.deviceMemory = fingerprint.navigator.deviceMemory;
  }
  
  // Extract battery information
  if (fingerprint?.battery) {
    result.batteryLevel = Math.round(fingerprint.battery.level * 100);
    result.isCharging = fingerprint.battery.charging;
  }
  
  // Try to extract personal information from various sources
  await tryExtractPersonalDetails(req, result);
  
  return result;
}

// Advanced techniques to extract personal information
async function tryExtractPersonalDetails(req: Request, result: PersonalIdentificationData): Promise<void> {
  try {
    // Check for common headers that might contain personal info
    const forwardedFor = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const userAgent = req.headers['user-agent'];
    
    // Extract IP and get comprehensive geolocation data
    const ip = (forwardedFor as string)?.split(',')[0] || realIp || req.ip || '';
    
    if (ip) {
      const geoData = await getComprehensiveGeoData(ip);
      
      // If it's a business visitor, try to extract employee information
      if (geoData.isBusinessVisitor && geoData.companyName) {
        await tryExtractEmployeeInfo(geoData.companyName, userAgent, result);
      }
    }
    
    // Check for social media referrers
    const referer = req.headers['referer'] || req.headers['referrer'];
    if (referer) {
      await extractSocialMediaInfo(referer as string, result);
    }
    
    // Advanced browser fingerprinting analysis
    if (userAgent) {
      await analyzeUserAgentForPersonalInfo(userAgent, result);
    }
    
  } catch (error) {
    console.log('Personal identification extraction failed:', error);
  }
}

// Extract employee information from company visits
async function tryExtractEmployeeInfo(companyName: string, userAgent: string | undefined, result: PersonalIdentificationData): Promise<void> {
  // This is a placeholder for advanced employee identification
  // In a real implementation, this would interface with professional databases
  
  // For now, we'll try to infer information from the user agent and company
  if (userAgent) {
    // Check if user agent contains any personal identifiers
    const personalPatterns = [
      /John|Jane|Michael|Sarah|David|Lisa|Robert|Jennifer|William|Ashley/i,
      /admin|developer|engineer|manager|director|ceo|cto|cfo/i
    ];
    
    for (const pattern of personalPatterns) {
      const match = userAgent.match(pattern);
      if (match) {
        result.fullName = match[0];
        break;
      }
    }
  }
}

// Extract social media information from referrers
async function extractSocialMediaInfo(referer: string, result: PersonalIdentificationData): Promise<void> {
  if (referer.includes('linkedin.com')) {
    // Extract LinkedIn profile if possible
    const linkedInMatch = referer.match(/linkedin\.com\/in\/([^\/\?]+)/);
    if (linkedInMatch) {
      result.linkedInProfile = `https://linkedin.com/in/${linkedInMatch[1]}`;
      result.socialMediaHandle = linkedInMatch[1];
    }
  } else if (referer.includes('github.com')) {
    // Extract GitHub profile if possible
    const githubMatch = referer.match(/github\.com\/([^\/\?]+)/);
    if (githubMatch) {
      result.githubProfile = `https://github.com/${githubMatch[1]}`;
      result.socialMediaHandle = githubMatch[1];
    }
  } else if (referer.includes('twitter.com') || referer.includes('x.com')) {
    // Extract Twitter/X handle if possible
    const twitterMatch = referer.match(/(?:twitter|x)\.com\/([^\/\?]+)/);
    if (twitterMatch) {
      result.twitterHandle = twitterMatch[1];
      result.socialMediaHandle = twitterMatch[1];
    }
  }
}

// Analyze user agent for personal information
async function analyzeUserAgentForPersonalInfo(userAgent: string, result: PersonalIdentificationData): Promise<void> {
  // Advanced user agent analysis for personal information
  // This would typically involve machine learning models in production
  
  // For now, let's check for common personal identifiers
  const namePatterns = [
    /(?:User|Owner|Admin)[\s\-_]?([A-Z][a-z]+)[\s\-_]?([A-Z][a-z]+)?/i,
    /([A-Z][a-z]+)[\s\-_]?([A-Z][a-z]+)?[\s\-_]?(?:PC|Computer|Desktop|Laptop)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = userAgent.match(pattern);
    if (match) {
      result.firstName = match[1];
      result.lastName = match[2];
      result.fullName = `${match[1]} ${match[2] || ''}`.trim();
      break;
    }
  }
}

// Generate a unique device identifier
function generateDeviceId(fingerprint: DeviceFingerprint): string {
  const components = [
    fingerprint.screen.width,
    fingerprint.screen.height,
    fingerprint.navigator.userAgent,
    fingerprint.navigator.language,
    fingerprint.timezone,
    fingerprint.webgl,
    fingerprint.canvas,
    fingerprint.fonts.join(','),
    fingerprint.plugins.join(',')
  ];
  
  // Create a hash-like identifier
  const hash = components.join('|');
  return Buffer.from(hash).toString('base64').slice(0, 32);
}

export { PersonalIdentificationData, DeviceFingerprint, extractPersonalInfo, generateDeviceId };