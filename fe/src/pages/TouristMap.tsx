import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Navigation, Search, Filter, ArrowLeft, Route, Clock, AlertTriangle, Loader2, Target, Car, Users, Phone, Camera, Map } from "lucide-react";

const TouristMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [liveTracking, setLiveTracking] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // 🗺️ Comprehensive Uttarakhand destinations database
  const uttarakhandDestinations = [
    { name: "Kedarnath Temple", lat: 30.7346, lng: 79.0669, type: "temple", district: "Rudraprayag", status: "Open", danger: "Medium", description: "Sacred Hindu pilgrimage site" },
    { name: "Badrinath Temple", lat: 30.7433, lng: 79.4938, type: "temple", district: "Chamoli", status: "Open", danger: "Medium", description: "One of Char Dham pilgrimage sites" },
    { name: "Gangotri Temple", lat: 30.9993, lng: 78.9411, type: "temple", district: "Uttarkashi", status: "Open", danger: "High", description: "Source of River Ganga" },
    { name: "Yamunotri Temple", lat: 31.0117, lng: 78.4270, type: "temple", district: "Uttarkashi", status: "Open", danger: "High", description: "Source of River Yamuna" },
    { name: "Rishikesh", lat: 30.0869, lng: 78.2676, type: "spiritual", district: "Dehradun", status: "Open", danger: "Low", description: "Yoga capital of the world" },
    { name: "Haridwar", lat: 29.9457, lng: 78.1642, type: "spiritual", district: "Haridwar", status: "Open", danger: "Low", description: "Holy city on River Ganga" },
    { name: "Valley of Flowers", lat: 30.7268, lng: 79.6041, type: "national-park", district: "Chamoli", status: "Seasonal", danger: "High", description: "UNESCO World Heritage site" },
    { name: "Jim Corbett National Park", lat: 29.5316, lng: 78.9463, type: "wildlife", district: "Nainital", status: "Open", danger: "Low", description: "India's oldest national park" },
    { name: "Nainital", lat: 29.3803, lng: 79.4636, type: "hill-station", district: "Nainital", status: "Open", danger: "Low", description: "Beautiful lake city" },
    { name: "Mussoorie", lat: 30.4598, lng: 78.0664, type: "hill-station", district: "Dehradun", status: "Open", danger: "Low", description: "Queen of hill stations" },
    { name: "Dehradun", lat: 30.3165, lng: 78.0322, type: "city", district: "Dehradun", status: "Open", danger: "Low", description: "Capital of Uttarakhand" },
    { name: "Auli", lat: 30.5370, lng: 79.5640, type: "hill-station", district: "Chamoli", status: "Open", danger: "Medium", description: "Popular skiing destination" },
    { name: "Chopta", lat: 30.4597, lng: 79.1277, type: "hill-station", district: "Rudraprayag", status: "Open", danger: "Medium", description: "Mini Switzerland of India" },
    { name: "Lansdowne", lat: 29.8377, lng: 78.6897, type: "hill-station", district: "Pauri Garhwal", status: "Open", danger: "Low", description: "Cantonment hill station" },
    { name: "Ranikhet", lat: 29.6436, lng: 79.4220, type: "hill-station", district: "Almora", status: "Open", danger: "Low", description: "Queen's meadow" },
    { name: "Almora", lat: 29.5971, lng: 79.6590, type: "hill-station", district: "Almora", status: "Open", danger: "Low", description: "Cultural heart of Kumaon" },
    { name: "Kausani", lat: 29.8548, lng: 79.6065, type: "hill-station", district: "Bageshwar", status: "Open", danger: "Low", description: "Switzerland of India" },
    { name: "Binsar Wildlife Sanctuary", lat: 29.6836, lng: 79.7125, type: "wildlife", district: "Almora", status: "Open", danger: "Medium", description: "Rich biodiversity sanctuary" },
    { name: "Rajaji National Park", lat: 30.0523, lng: 78.0492, type: "national-park", district: "Haridwar", status: "Open", danger: "Low", description: "Elephant reserve" },
    { name: "Har Ki Pauri", lat: 29.9473, lng: 78.1675, type: "spiritual", district: "Haridwar", status: "Open", danger: "Low", description: "Sacred ghat on Ganga" },
    { name: "Laxman Jhula", lat: 30.1090, lng: 78.2792, type: "spiritual", district: "Dehradun", status: "Open", danger: "Low", description: "Iconic suspension bridge" },
    { name: "Tungnath Temple", lat: 30.4897, lng: 79.2124, type: "temple", district: "Rudraprayag", status: "Open", danger: "High", description: "Highest Shiva temple" },
    { name: "Hemkund Sahib", lat: 30.7268, lng: 79.6829, type: "temple", district: "Chamoli", status: "Seasonal", danger: "High", description: "Sikh pilgrimage site" }
  ];

  const restrictedAreas = [
    { name: "Kedarnath Approach Road", reason: "Landslide Warning", severity: "High" },
    // { name: "Char Dham Route (NH7)", reason: "Heavy Traffic", severity: "Medium" },
    // { name: "Valley of Flowers Trail", reason: "Weather Conditions", severity: "High" },
    // { name: "High Altitude Areas", reason: "Oxygen Levels", severity: "Medium" }
  ];

  // Utility functions
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-800";
      case "Seasonal": return "bg-yellow-100 text-yellow-800";
      case "Closed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDangerColor = (danger) => {
    switch (danger) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low": return "bg-blue-100 text-blue-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const estimateTravelTime = (distance) => {
    const avgSpeed = 40; // km/h average speed in hills
    const hours = parseFloat(distance) / avgSpeed;
    return Math.round(hours * 60); // Return in minutes
  };

  // Location functions
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setUserLocation(location);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          alert('Unable to get your location. Please check your GPS settings.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const startLiveTracking = () => {
    if (navigator.geolocation && !liveTracking) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setUserLocation(location);
        },
        (error) => console.error('Live tracking error:', error),
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );
      setWatchId(id);
      setLiveTracking(true);
    }
  };

  const stopLiveTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setLiveTracking(false);
    }
  };

  const handleEmergency = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode && userLocation) {
      const locationText = `Emergency! My location: ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)} - https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Emergency Location',
          text: locationText,
        });
      } else {
        navigator.clipboard.writeText(locationText).then(() => {
          alert('Emergency location copied to clipboard!');
        });
      }
    }
  };

  // Filter destinations based on search and type
  useEffect(() => {
    let filtered = uttarakhandDestinations;
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(dest => dest.type === typeFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredDestinations(filtered);
  }, [searchQuery, typeFilter]);

  // Initialize filtered destinations
  useEffect(() => {
    setFilteredDestinations(uttarakhandDestinations);
  }, []);

  // Calculate route info when destination is selected
  useEffect(() => {
    if (userLocation && selectedDestination) {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        selectedDestination.lat, selectedDestination.lng
      );
      const duration = estimateTravelTime(distance);
      setRouteInfo({
        distance: `${distance} km`,
        duration: formatDuration(duration),
        type: 'estimated'
      });
    } else {
      setRouteInfo(null);
    }
  }, [userLocation, selectedDestination]);

  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination);
  };

  const openInGoogleMaps = (destination) => {
    const url = userLocation 
      ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination.lat},${destination.lng}`
      : `https://www.google.com/maps/place/${destination.lat},${destination.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </button>
            <span className="text-gray-400">/</span>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🗺️ Uttarakhand Navigator
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant={liveTracking ? "default" : "outline"} 
              size="sm"
              onClick={() => liveTracking ? stopLiveTracking() : startLiveTracking()}
              className="transition-all duration-300"
            >
              {liveTracking ? (
                <>
                  <Target className="mr-2 h-4 w-4 animate-pulse" />
                  Live Tracking
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-4 w-4" />
                  Start Tracking
                </>
              )}
            </Button>
            {selectedDestination && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openInGoogleMaps(selectedDestination)}
                className="hover:bg-blue-50 transition-colors"
              >
                <Car className="mr-2 h-4 w-4" />
                Navigate
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => userLocation && navigator.share && navigator.share({
                title: 'My Location',
                text: `I'm here: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`,
              })}
              disabled={!userLocation}
            >
              <Users className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map View */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg h-[700px] overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Map className="mr-2 h-5 w-5" />
                    Interactive Map View
                    {userLocation && (
                      <Badge className="ml-2 bg-white/20 text-white border-white/30">
                        📍 Located
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {emergencyMode && (
                      <Badge className="bg-red-500 text-white animate-pulse">
                        🆘 Emergency
                      </Badge>
                    )}
                    {liveTracking && (
                      <Badge className="bg-green-500 text-white">
                        🔴 Live
                      </Badge>
                    )}
                  </div>
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Visual map representation with location tracking
                  {selectedDestination && (
                    <span className="block mt-1 font-medium text-white">
                      🎯 Destination: {selectedDestination.name}
                      {routeInfo && (
                        <span className="text-sm text-blue-100 ml-2">
                          • {routeInfo.distance} • {routeInfo.duration}
                        </span>
                      )}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full p-0 relative">
                <div className="w-full h-[600px] bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 relative overflow-hidden">
                  {/* Map Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                      backgroundImage: `radial-gradient(circle at 20px 20px, #3b82f6 2px, transparent 0),
                                       radial-gradient(circle at 60px 60px, #10b981 1px, transparent 0)`,
                      backgroundSize: '80px 80px'
                    }}></div>
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    <Button
                      onClick={getCurrentLocation}
                      disabled={loading}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Finding...
                        </span>
                      ) : (
                        '📍 Locate Me'
                      )}
                    </Button>
                    <Button
                      onClick={handleEmergency}
                      size="sm"
                      className={`shadow-lg transition-all ${
                        emergencyMode 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      🆘 Emergency
                    </Button>
                  </div>
                  
                  {/* Location Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8 bg-white/90 rounded-xl shadow-lg max-w-md">
                      <Map className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Interactive Map
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Click "Locate Me" to find your position and get directions to destinations
                      </p>
                      
                      {userLocation && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                            <span className="font-semibold text-blue-800">Your Location</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Lat: {userLocation.lat.toFixed(6)}<br/>
                            Lng: {userLocation.lng.toFixed(6)}<br/>
                            Accuracy: ±{userLocation.accuracy?.toFixed(0)}m
                          </p>
                          {liveTracking && (
                            <Badge className="mt-2 bg-green-100 text-green-800">
                              Live Tracking Active
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {selectedDestination && (
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                            <span className="font-semibold text-purple-800">Selected Destination</span>
                          </div>
                          <p className="text-sm text-purple-700">
                            {selectedDestination.name}<br/>
                            {selectedDestination.district} District
                          </p>
                          <Button 
                            size="sm" 
                            className="mt-2"
                            onClick={() => openInGoogleMaps(selectedDestination)}
                          >
                            Open in Maps
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Route Info Overlay */}
                  {routeInfo && userLocation && selectedDestination && (
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg z-10 border">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">Route Information</span>
                        </div>
                        <div className="text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <span>📏 Distance: {routeInfo.distance}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>⏱️ Estimated Time: {routeInfo.duration}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            * Estimated based on mountain terrain
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <CardTitle className="text-lg flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Find Destinations
                </CardTitle>
                <CardDescription className="text-green-100">
                  Search from {uttarakhandDestinations.length}+ places in Uttarakhand
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    className="pl-10 border-2 focus:border-blue-500 transition-colors" 
                    placeholder="Search destinations, districts..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="border-2 focus:border-blue-500">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types ({uttarakhandDestinations.length})</SelectItem>
                    <SelectItem value="temple">🛕 Temples ({uttarakhandDestinations.filter(d => d.type === 'temple').length})</SelectItem>
                    <SelectItem value="spiritual">🙏 Spiritual Sites ({uttarakhandDestinations.filter(d => d.type === 'spiritual').length})</SelectItem>
                    <SelectItem value="hill-station">🏔️ Hill Stations ({uttarakhandDestinations.filter(d => d.type === 'hill-station').length})</SelectItem>
                    <SelectItem value="wildlife">🦌 Wildlife Parks ({uttarakhandDestinations.filter(d => d.type === 'wildlife').length})</SelectItem>
                    <SelectItem value="national-park">🌲 National Parks ({uttarakhandDestinations.filter(d => d.type === 'national-park').length})</SelectItem>
                    <SelectItem value="city">🏙️ Cities ({uttarakhandDestinations.filter(d => d.type === 'city').length})</SelectItem>
                  </SelectContent>
                </Select>
                {searchQuery && (
                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                    Found {filteredDestinations.length} result(s) for "{searchQuery}"
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Destinations List */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Destinations ({filteredDestinations.length})
                  </div>
                  {selectedDestination && (
                    <Badge className="bg-white/20 text-white border-white/30">
                      Selected
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Click any destination for directions and details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-80 overflow-y-auto p-6">
                {filteredDestinations.map((destination, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      selectedDestination?.name === destination.name
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-lg ring-2 ring-blue-100 transform scale-105'
                        : 'bg-gray-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border-transparent hover:border-gray-200 hover:shadow-md hover:transform hover:scale-102'
                    }`}
                    onClick={() => handleDestinationClick(destination)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg ${
                          selectedDestination?.name === destination.name 
                            ? 'text-blue-800' 
                            : 'text-gray-800'
                        }`}>
                          {destination.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          📍 {destination.district} District
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {destination.description}
                        </p>
                      </div>
                      {userLocation && (
                        <div className="text-right text-sm text-gray-600 ml-2">
                          <div className="font-medium">
                            {calculateDistance(userLocation.lat, userLocation.lng, destination.lat, destination.lng)} km
                          </div>
                          <div className="text-xs">
                            ~{formatDuration(estimateTravelTime(calculateDistance(userLocation.lat, userLocation.lng, destination.lat, destination.lng)))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <Badge className={getStatusColor(destination.status)}>
                        {destination.status}
                      </Badge>
                      <Badge className={getDangerColor(destination.danger)}>
                        {destination.danger} Risk
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDestinationClick(destination);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Get Directions
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInGoogleMaps(destination);
                        }}
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Travel Alerts */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Travel Alerts
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Important safety and route information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                {restrictedAreas.map((area, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {area.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {area.reason}
                        </p>
                      </div>
                      <Badge className={getSeverityColor(area.severity)}>
                        {area.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Emergency Contacts
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>🚨 Emergency: 112</div>
                    <div>🚔 Police: 100</div>
                    <div>🚑 Ambulance: 108</div>
                    <div>🚒 Fire: 101</div>
                    <div>⛑️ Tourist Helpline: 1363</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {userLocation && (
              <Card className="shadow-xl border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Your Location Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold">
                        {filteredDestinations.length}
                      </div>
                      <div className="text-sm opacity-90">
                        Destinations Found
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold">
                        {selectedDestination ? calculateDistance(userLocation.lat, userLocation.lng, selectedDestination.lat, selectedDestination.lng) : '0'}
                      </div>
                      <div className="text-sm opacity-90">
                        KM to Destination
                      </div>
                    </div>
                  </div>
                  
                  {liveTracking && (
                    <div className="bg-green-500/30 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse mr-2"></div>
                        <span className="text-sm font-medium">Live Tracking Active</span>
                      </div>
                    </div>
                  )}
                  
                  {emergencyMode && (
                    <div className="bg-red-500 p-3 rounded-lg text-center animate-pulse">
                      <div className="flex items-center justify-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span className="text-sm font-bold">Emergency Mode Active</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristMap;