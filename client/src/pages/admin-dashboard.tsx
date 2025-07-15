import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Eye, Globe, TrendingUp, Clock, Monitor, Smartphone, MapPin } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Visitor {
  id: number;
  ipAddress: string;
  userAgent: string;
  country: string | null;
  region: string | null;
  city: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  referrer: string | null;
  page: string;
  timestamp: string;
  sessionId: string | null;
  timeSpent: number | null;
  organization: string | null;
  isp: string | null;
  domain: string | null;
  companyName: string | null;
  businessType: string | null;
  isBusinessVisitor: boolean;
}

interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  uniqueVisitors: number;
  businessVisitors: number;
  topPages: Array<{ page: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  topCompanies: Array<{ company: string; count: number }>;
  recentVisitors: Visitor[];
}

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: stats, isLoading: statsLoading } = useQuery<VisitorStats>({
    queryKey: ['/api/admin/visitors/stats', refreshKey],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/visitors/stats');
      return res.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: visitors, isLoading: visitorsLoading } = useQuery<Visitor[]>({
    queryKey: ['/api/admin/visitors', refreshKey],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/visitors');
      return res.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const formatTimeSpent = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getDeviceIcon = (device: string | null) => {
    if (device === 'Mobile') return <Smartphone className="w-4 h-4" />;
    if (device === 'Tablet') return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#00ff88]">Portfolio Analytics Dashboard</h1>
          <Button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/80"
          >
            Refresh Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-[#00ff88]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {statsLoading ? '...' : stats?.totalVisitors || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Today's Visitors</CardTitle>
              <Eye className="h-4 w-4 text-[#00ff88]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {statsLoading ? '...' : stats?.todayVisitors || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Unique Visitors</CardTitle>
              <Globe className="h-4 w-4 text-[#00ff88]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {statsLoading ? '...' : stats?.uniqueVisitors || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Business Visitors</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {statsLoading ? '...' : stats?.businessVisitors || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Live Tracking</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#00ff88]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00ff88]">
                ACTIVE
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visitors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900">
            <TabsTrigger value="visitors" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              Recent Visitors
            </TabsTrigger>
            <TabsTrigger value="personal" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              Personal ID
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              Companies
            </TabsTrigger>
            <TabsTrigger value="pages" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              Top Pages
            </TabsTrigger>
            <TabsTrigger value="countries" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              Top Countries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visitors" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#00ff88]">Recent Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visitorsLoading ? (
                    <div className="text-center py-8">Loading visitors...</div>
                  ) : (
                    visitors?.slice(0, 20).map((visitor) => (
                      <div key={visitor.id} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getDeviceIcon(visitor.device)}
                            <span className="font-medium">{visitor.ipAddress}</span>
                            {visitor.fullName && (
                              <Badge className="bg-blue-500 text-white">👤 {visitor.fullName}</Badge>
                            )}
                            {visitor.isBusinessVisitor && (
                              <Badge className="bg-yellow-500 text-black">Business</Badge>
                            )}
                            <Badge variant="outline" className="border-[#00ff88] text-[#00ff88]">
                              {visitor.browser || 'Unknown'}
                            </Badge>
                            <Badge variant="outline" className="border-gray-500 text-gray-300">
                              {visitor.os || 'Unknown'}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatTimestamp(visitor.timestamp)}
                          </span>
                        </div>
                        {(visitor.fullName || visitor.firstName || visitor.lastName) && (
                          <div className="mb-2 text-sm">
                            <span className="text-blue-400 font-medium">Name: </span>
                            <span className="text-white">
                              {visitor.fullName || `${visitor.firstName || ''} ${visitor.lastName || ''}`.trim()}
                            </span>
                            {visitor.email && (
                              <span className="text-gray-400 ml-2">({visitor.email})</span>
                            )}
                          </div>
                        )}
                        {(visitor.companyName || visitor.organization) && (
                          <div className="mb-2 text-sm">
                            <span className="text-yellow-400 font-medium">Company: </span>
                            <span className="text-white">{visitor.companyName || visitor.organization}</span>
                            {visitor.businessType && (
                              <span className="text-gray-400 ml-2">({visitor.businessType})</span>
                            )}
                          </div>
                        )}
                        {visitor.deviceName && (
                          <div className="mb-2 text-sm">
                            <span className="text-green-400 font-medium">Device: </span>
                            <span className="text-white">{visitor.deviceName}</span>
                            {visitor.screenResolution && (
                              <span className="text-gray-400 ml-2">{visitor.screenResolution}</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-4">
                            <span>Page: {visitor.page}</span>
                            {visitor.city && visitor.country && (
                              <span>📍 {visitor.city}, {visitor.country}</span>
                            )}
                            {visitor.referrer && (
                              <span>From: {visitor.referrer}</span>
                            )}
                            {visitor.timeSpent && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeSpent(visitor.timeSpent)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#00ff88]">Personal Identification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visitorsLoading ? (
                    <div className="text-center py-8">Loading personal data...</div>
                  ) : (
                    visitors?.filter(v => v.fullName || v.firstName || v.lastName || v.email || v.deviceName).slice(0, 15).map((visitor) => (
                      <div key={visitor.id} className="border border-blue-500 rounded-lg p-4 bg-blue-900/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400 font-bold">👤</span>
                            <span className="font-medium text-blue-300">
                              {visitor.fullName || `${visitor.firstName || ''} ${visitor.lastName || ''}`.trim() || 'Unknown User'}
                            </span>
                            {visitor.email && (
                              <Badge className="bg-blue-500 text-white">✉️ {visitor.email}</Badge>
                            )}
                            {visitor.isBusinessVisitor && (
                              <Badge className="bg-yellow-500 text-black">Business</Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatTimestamp(visitor.timestamp)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">IP: </span>
                            <span className="text-white">{visitor.ipAddress}</span>
                          </div>
                          {visitor.deviceName && (
                            <div>
                              <span className="text-gray-400">Device: </span>
                              <span className="text-white">{visitor.deviceName}</span>
                            </div>
                          )}
                          {visitor.screenResolution && (
                            <div>
                              <span className="text-gray-400">Screen: </span>
                              <span className="text-white">{visitor.screenResolution}</span>
                            </div>
                          )}
                          {visitor.timezone && (
                            <div>
                              <span className="text-gray-400">Timezone: </span>
                              <span className="text-white">{visitor.timezone}</span>
                            </div>
                          )}
                          {visitor.language && (
                            <div>
                              <span className="text-gray-400">Language: </span>
                              <span className="text-white">{visitor.language}</span>
                            </div>
                          )}
                          {visitor.batteryLevel && (
                            <div>
                              <span className="text-gray-400">Battery: </span>
                              <span className="text-white">{visitor.batteryLevel}%</span>
                              {visitor.isCharging && <span className="text-green-400 ml-1">⚡</span>}
                            </div>
                          )}
                        </div>
                        
                        {(visitor.companyName || visitor.organization) && (
                          <div className="mt-2 text-sm border-t border-gray-700 pt-2">
                            <span className="text-yellow-400 font-medium">Company: </span>
                            <span className="text-white">{visitor.companyName || visitor.organization}</span>
                            {visitor.businessType && (
                              <span className="text-gray-400 ml-2">({visitor.businessType})</span>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-2 text-sm text-gray-400">
                          <span>Page: {visitor.page}</span>
                          {visitor.city && visitor.country && (
                            <span className="ml-4">📍 {visitor.city}, {visitor.country}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {!visitorsLoading && visitors?.filter(v => v.fullName || v.firstName || v.lastName || v.email || v.deviceName).length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4" />
                      <p>No personal identification data available yet</p>
                      <p className="text-sm">Advanced fingerprinting will identify visitors as they arrive</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#00ff88]">Business Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statsLoading ? (
                    <div className="text-center py-8">Loading company data...</div>
                  ) : stats?.topCompanies.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4" />
                      <p>No business visitors identified yet</p>
                      <p className="text-sm">Company identification will appear as visitors arrive</p>
                    </div>
                  ) : (
                    stats?.topCompanies.map((company, index) => (
                      <div key={company.company} className="flex items-center justify-between p-3 border border-gray-700 rounded">
                        <div className="flex items-center space-x-3">
                          <span className="text-[#00ff88] font-bold">#{index + 1}</span>
                          <span className="text-yellow-400">{company.company}</span>
                        </div>
                        <Badge className="bg-yellow-500 text-black">{company.count} visits</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#00ff88]">Most Visited Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statsLoading ? (
                    <div className="text-center py-8">Loading page stats...</div>
                  ) : (
                    stats?.topPages.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between p-3 border border-gray-700 rounded">
                        <div className="flex items-center space-x-3">
                          <span className="text-[#00ff88] font-bold">#{index + 1}</span>
                          <span>{page.page}</span>
                        </div>
                        <Badge className="bg-[#00ff88] text-black">{page.count} visits</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="countries" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#00ff88]">Visitor Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statsLoading ? (
                    <div className="text-center py-8">Loading country stats...</div>
                  ) : stats?.topCountries.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <MapPin className="w-12 h-12 mx-auto mb-4" />
                      <p>No location data available yet</p>
                      <p className="text-sm">IP geolocation will be added soon</p>
                    </div>
                  ) : (
                    stats?.topCountries.map((country, index) => (
                      <div key={country.country} className="flex items-center justify-between p-3 border border-gray-700 rounded">
                        <div className="flex items-center space-x-3">
                          <span className="text-[#00ff88] font-bold">#{index + 1}</span>
                          <span>{country.country}</span>
                        </div>
                        <Badge className="bg-[#00ff88] text-black">{country.count} visits</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}