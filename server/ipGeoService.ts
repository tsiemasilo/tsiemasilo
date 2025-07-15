// IP Geolocation and Business Identification Service
// Combines multiple free APIs to identify companies and organizations

export interface GeoLocationData {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  organization?: string;
  isp?: string;
  domain?: string;
  companyName?: string;
  businessType?: string;
  isBusinessVisitor: boolean;
  nearbyBusinesses?: string[];
  currentBusiness?: string;
}

// Free IP geolocation APIs with business identification
const IP_APIS = [
  {
    name: 'ip-api.com',
    url: (ip: string) => `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,org,isp,as,query`,
    transform: (data: any): Partial<GeoLocationData> => ({
      country: data.country,
      region: data.regionName,
      city: data.city,
      organization: data.org,
      isp: data.isp,
      companyName: extractCompanyName(data.org || data.isp),
      businessType: identifyBusinessType(data.org || data.isp),
      isBusinessVisitor: isBusinessIP(data.org || data.isp)
    })
  },
  {
    name: 'ipapi.co',
    url: (ip: string) => `https://ipapi.co/${ip}/json/`,
    transform: (data: any): Partial<GeoLocationData> => ({
      country: data.country_name,
      region: data.region,
      city: data.city,
      organization: data.org,
      isp: data.org,
      companyName: extractCompanyName(data.org),
      businessType: identifyBusinessType(data.org),
      isBusinessVisitor: isBusinessIP(data.org)
    })
  },
  {
    name: 'ipwhois.app',
    url: (ip: string) => `https://ipwhois.app/json/${ip}`,
    transform: (data: any): Partial<GeoLocationData> => ({
      country: data.country,
      region: data.region,
      city: data.city,
      organization: data.org,
      isp: data.isp,
      companyName: extractCompanyName(data.org || data.isp),
      businessType: identifyBusinessType(data.org || data.isp),
      isBusinessVisitor: isBusinessIP(data.org || data.isp)
    })
  }
];

// Extract company name from organization string
function extractCompanyName(org: string | null): string | null {
  if (!org) return null;
  
  // Remove common suffixes and technical terms
  const cleanOrg = org
    .replace(/\s+(AS\d+|ASN\d+|Inc\.?|LLC|Ltd\.?|Corporation|Corp\.?|Company|Co\.?|Group|Holdings|Networks?|Internet|Services?|Systems?|Solutions?|Technologies?|Tech|Telecom|Communications?|Hosting|Cloud|Data|Center|Limited|Pty|GmbH|AG|SA|SAS|SARL|BV|AB|OY|ApS|A\/S|Sp\.\s*z\s*o\.o\.?|S\.L\.?|S\.A\.?|S\.R\.L\.?|B\.V\.?|N\.V\.?|Kft\.?|Zrt\.?|d\.o\.o\.?|a\.s\.?|s\.r\.o\.?|Pte\.?\s*Ltd\.?|Sdn\.?\s*Bhd\.?|Pvt\.?\s*Ltd\.?)$/i, '')
    .replace(/\s*\(.*\)$/, '') // Remove parentheses content
    .trim();

  return cleanOrg || null;
}

// Identify business type based on organization
function identifyBusinessType(org: string | null): string | null {
  if (!org) return null;
  
  const orgLower = org.toLowerCase();
  
  // Technology companies
  if (orgLower.includes('tech') || orgLower.includes('software') || orgLower.includes('digital') || orgLower.includes('systems') || orgLower.includes('solutions') || orgLower.includes('it ')) {
    return 'Technology';
  }
  
  // ISPs and Telecoms
  if (orgLower.includes('internet') || orgLower.includes('broadband') || orgLower.includes('fiber') || orgLower.includes('telecom') || orgLower.includes('communications') || orgLower.includes('wireless')) {
    return 'Internet Service Provider';
  }
  
  // Hosting and Cloud providers
  if (orgLower.includes('hosting') || orgLower.includes('cloud') || orgLower.includes('server') || orgLower.includes('data center') || orgLower.includes('datacenter')) {
    return 'Cloud/Hosting Provider';
  }
  
  // Educational institutions
  if (orgLower.includes('university') || orgLower.includes('college') || orgLower.includes('school') || orgLower.includes('education') || orgLower.includes('academic')) {
    return 'Educational Institution';
  }
  
  // Government
  if (orgLower.includes('government') || orgLower.includes('ministry') || orgLower.includes('municipal') || orgLower.includes('council') || orgLower.includes('department')) {
    return 'Government';
  }
  
  // Healthcare
  if (orgLower.includes('hospital') || orgLower.includes('medical') || orgLower.includes('health') || orgLower.includes('clinic')) {
    return 'Healthcare';
  }
  
  // Financial services
  if (orgLower.includes('bank') || orgLower.includes('financial') || orgLower.includes('insurance') || orgLower.includes('investment')) {
    return 'Financial Services';
  }
  
  // Manufacturing
  if (orgLower.includes('manufacturing') || orgLower.includes('industrial') || orgLower.includes('factory') || orgLower.includes('production')) {
    return 'Manufacturing';
  }
  
  // Consulting
  if (orgLower.includes('consulting') || orgLower.includes('advisory') || orgLower.includes('professional services')) {
    return 'Consulting';
  }
  
  return 'Corporate';
}

// Check if IP belongs to a business/organization
function isBusinessIP(org: string | null): boolean {
  if (!org) return false;
  
  const orgLower = org.toLowerCase();
  
  // Skip residential/mobile ISPs
  const residentialKeywords = [
    'residential', 'mobile', 'cellular', 'broadband', 'dsl', 'cable', 'fiber optic',
    'home', 'dynamic', 'dhcp', 'consumer', 'retail', 'household'
  ];
  
  if (residentialKeywords.some(keyword => orgLower.includes(keyword))) {
    return false;
  }
  
  // Business indicators
  const businessKeywords = [
    'corporation', 'company', 'enterprise', 'inc', 'llc', 'ltd', 'group',
    'organization', 'institution', 'university', 'college', 'school',
    'hospital', 'government', 'ministry', 'department', 'council',
    'bank', 'financial', 'consulting', 'professional', 'services',
    'technology', 'software', 'systems', 'solutions', 'networks',
    'hosting', 'cloud', 'data center', 'datacenter'
  ];
  
  return businessKeywords.some(keyword => orgLower.includes(keyword));
}

// Get nearby businesses using coordinates
async function getNearbyBusinesses(latitude: number, longitude: number): Promise<string[]> {
  const businesses: string[] = [];
  
  try {
    // Use OpenStreetMap Nominatim API to find nearby businesses
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&limit=10&extratags=1`,
      {
        headers: {
          'User-Agent': 'Portfolio-Analytics/1.0'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      
      for (const item of data) {
        if (item.display_name && item.type && item.type !== 'house') {
          // Extract business names from the display name
          const parts = item.display_name.split(',');
          if (parts.length > 0) {
            const businessName = parts[0].trim();
            if (businessName && !businessName.match(/^\d+$/)) {
              businesses.push(businessName);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log('Nearby businesses lookup failed:', error);
  }
  
  return businesses.slice(0, 5); // Return top 5 nearby businesses
}

// Determine current business location based on IP organization and coordinates
async function getCurrentBusiness(latitude: number, longitude: number, organization?: string): Promise<string | null> {
  // If organization suggests a specific business, use it
  if (organization) {
    const companyName = extractCompanyName(organization);
    if (companyName && !companyName.toLowerCase().includes('broadband') && !companyName.toLowerCase().includes('internet')) {
      return companyName;
    }
  }
  
  try {
    // Use reverse geocoding to get address details
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&extratags=1`,
      {
        headers: {
          'User-Agent': 'Portfolio-Analytics/1.0'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      
      // Check if the location is a business
      if (data.extratags && data.extratags.name) {
        return data.extratags.name;
      }
      
      // Check address components for business names
      if (data.address) {
        const businessKeys = ['office', 'shop', 'commercial', 'retail', 'building', 'amenity'];
        for (const key of businessKeys) {
          if (data.address[key]) {
            return data.address[key];
          }
        }
      }
    }
  } catch (error) {
    console.log('Current business lookup failed:', error);
  }
  
  return null;
}

// Main function to get comprehensive geo data
export async function getComprehensiveGeoData(ip: string): Promise<GeoLocationData> {
  const result: GeoLocationData = {
    ip,
    isBusinessVisitor: false
  };
  
  // Handle localhost and private IPs with demonstration data for testing
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    console.log(`Using demonstration data for private IP: ${ip}`);
    
    // Use sample data to demonstrate location features
    result.country = 'South Africa';
    result.region = 'Gauteng';
    result.city = 'Johannesburg';
    result.latitude = -26.2041;
    result.longitude = 28.0473;
    result.postalCode = '2000';
    result.address = 'Johannesburg, Gauteng, South Africa';
    result.organization = 'Corporate Network';
    result.isp = 'Business ISP';
    result.companyName = 'Tech Company Ltd';
    result.businessType = 'Technology';
    result.isBusinessVisitor = true;
    
    // Add demonstration businesses
    result.nearbyBusinesses = [
      'Sandton City Shopping Centre',
      'Nelson Mandela Square',
      'Standard Bank Centre',
      'Johannesburg Stock Exchange',
      'Carlton Centre'
    ];
    result.currentBusiness = 'Sandton Business District';
    
    console.log('Demonstration location data applied:', { 
      city: result.city, 
      country: result.country, 
      coordinates: [result.latitude, result.longitude],
      businesses: result.nearbyBusinesses?.length || 0
    });
    
    return result;
  }
  
  // Try multiple APIs for comprehensive data
  for (const api of IP_APIS) {
    try {
      const response = await fetch(api.url(ip), {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-Analytics/1.0)'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Skip if API returned error
        if (data.status === 'fail' || data.error) {
          continue;
        }
        
        const transformedData = api.transform(data);
        
        // Merge data, preferring non-null values
        Object.keys(transformedData).forEach(key => {
          if (transformedData[key] && !result[key]) {
            result[key] = transformedData[key];
          }
        });
        
        // If we have organization data, we can break early
        if (result.organization || result.companyName) {
          break;
        }
      }
    } catch (error) {
      console.log(`API ${api.name} failed for IP ${ip}:`, error.message);
      continue;
    }
  }
  
  // Get nearby businesses and current business if we have coordinates
  if (result.latitude && result.longitude) {
    try {
      const [nearbyBusinesses, currentBusiness] = await Promise.all([
        getNearbyBusinesses(result.latitude, result.longitude),
        getCurrentBusiness(result.latitude, result.longitude, result.organization)
      ]);
      
      result.nearbyBusinesses = nearbyBusinesses;
      result.currentBusiness = currentBusiness;
    } catch (error) {
      console.log('Business lookup failed:', error);
    }
  }
  
  // Final business visitor determination
  result.isBusinessVisitor = isBusinessIP(result.organization || result.isp);
  
  return result;
}

// Function to get real-time IP information
export async function getRealTimeIPInfo(ip: string): Promise<GeoLocationData> {
  try {
    return await getComprehensiveGeoData(ip);
  } catch (error) {
    console.error('Error getting IP information:', error);
    return {
      ip,
      isBusinessVisitor: false
    };
  }
}