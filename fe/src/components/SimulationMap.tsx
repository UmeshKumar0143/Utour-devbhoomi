import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Play, Square, Navigation, AlertTriangle, User, Clock, Shield, Zap, Route } from 'lucide-react';

interface Tourist {
  id: string;
  name: string;
  touristId: string;
  position: { lat: number; lng: number };
  checkpoint: number;
  status: 'online' | 'offline' | 'moving' | 'idle' | 'restricted';
  creditScore: number;
  currentPath: 'main' | 'restricted' | 'offline';
  lastUpdate: Date;
}

interface Alert {
  id: string;
  alertType: 'warning' | 'suggestion' | 'critical' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestion?: string;
  timestamp: Date;
}

const PersonalTouristTracker: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [tourist, setTourist] = useState<Tourist>({
    id: '1',
    name: 'baman2326',
    touristId: 'T83113',
    position: { lat: 30.0668, lng: 79.0193 },
    checkpoint: 0,
    status: 'online',
    creditScore: 100,
    currentPath: 'main',
    lastUpdate: new Date()
  });
  const [selectedPath, setSelectedPath] = useState<'main' | 'restricted' | 'offline'>('main');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  // Three different route paths
  const routePaths = {
    main: [
      { id: 1, name: "Dehradun Start", lat: 30.0668, lng: 79.0193, type: "green", safety: "high" },
      { id: 2, name: "Rishikesh Check", lat: 30.0869, lng: 78.2676, type: "green", safety: "high" },
      { id: 3, name: "Devprayag Junction", lat: 30.1462, lng: 78.5962, type: "yellow", safety: "medium" },
      { id: 4, name: "Rudraprayag Stop", lat: 30.2849, lng: 78.9811, type: "green", safety: "high" },
      { id: 5, name: "Guptkashi Rest", lat: 30.5330, lng: 79.0669, type: "yellow", safety: "medium" },
      { id: 6, name: "Kedarnath Temple", lat: 30.7343, lng: 79.6897, type: "green", safety: "high" }
    ],
    restricted: [
      { id: 1, name: "Dehradun Start", lat: 30.0668, lng: 79.0193, type: "green", safety: "high" },
      { id: 2, name: "Unauthorized Route", lat: 30.1200, lng: 78.3500, type: "red", safety: "low" },
      { id: 3, name: "Restricted Zone A", lat: 30.2500, lng: 78.7800, type: "red", safety: "low" },
      { id: 4, name: "Danger Zone", lat: 30.4200, lng: 79.2200, type: "red", safety: "critical" },
      { id: 5, name: "Blocked Area", lat: 30.6000, lng: 79.5500, type: "red", safety: "critical" },
      { id: 6, name: "Emergency Exit", lat: 30.7000, lng: 79.6500, type: "orange", safety: "low" }
    ],
    offline: [
      { id: 1, name: "Dehradun Start", lat: 30.0668, lng: 79.0193, type: "green", safety: "high" },
      { id: 2, name: "Signal Lost Area", lat: 30.0900, lng: 78.2800, type: "gray", safety: "unknown" },
      { id: 3, name: "Dead Zone", lat: 30.1800, lng: 78.6500, type: "gray", safety: "unknown" },
      { id: 4, name: "No Coverage", lat: 30.3200, lng: 79.0500, type: "gray", safety: "unknown" },
      { id: 5, name: "Reconnection Point", lat: 30.5800, lng: 79.4200, type: "yellow", safety: "medium" },
      { id: 6, name: "Temple Area", lat: 30.7343, lng: 79.6897, type: "green", safety: "high" }
    ]
  };

  const createAlert = (alertType: Alert['alertType'], severity: Alert['severity'], message: string, suggestion?: string) => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      alertType,
      severity,
      message,
      suggestion,
      timestamp: new Date()
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
  };

  const getPathSuggestions = (path: string, checkpoint: number) => {
    switch (path) {
      case 'main':
        if (checkpoint === 2) return "Weather looks good ahead. Carry extra water for the next stretch.";
        if (checkpoint === 4) return "Perfect timing! Rest here for 30 minutes before the final ascent.";
        return "You're on the safest route. Maintain steady pace.";
      
      case 'restricted':
        if (checkpoint === 1) return "⚠️ CRITICAL: You've entered a restricted zone! Return to main path immediately.";
        if (checkpoint === 3) return "🚨 DANGER: Unstable terrain ahead. Emergency services contacted.";
        return "❌ UNAUTHORIZED ROUTE: Immediate evacuation recommended.";
      
      case 'offline':
        if (checkpoint === 1) return "📱 Signal lost. Last known location saved. Continue on marked trail only.";
        if (checkpoint === 4) return "📶 Trying to reconnect... Stay on visible path markings.";
        return "🔄 Device offline. Emergency beacon activated automatically.";
      
      default:
        return "Continue following your selected route safely.";
    }
  };

  const startSimulation = () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setSimulationProgress(0);
    setElapsedTime(0);
    setAlerts([]);
    
    // Reset tourist to starting position with selected path
    setTourist(prev => ({
      ...prev,
      checkpoint: 0,
      position: { lat: routePaths[selectedPath][0].lat, lng: routePaths[selectedPath][0].lng },
      status: selectedPath === 'offline' ? 'offline' : 'online',
      creditScore: 100,
      currentPath: selectedPath,
      lastUpdate: new Date()
    }));

    createAlert('info', 'low', `Simulation started on ${selectedPath} path`, `Monitoring ${tourist.name}'s journey to Kedarnath`);

    // Simulation duration: 45 seconds
    const duration = 45000;
    const updateInterval = 2000;
    const steps = duration / updateInterval;
    let currentStep = 0;

    // Start time counter
    timeRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // Main simulation loop
    simulationRef.current = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 100;
      setSimulationProgress(progress);

      setTourist(prev => {
        const newTourist = { ...prev };
        const stepProgress = currentStep / steps;
        const currentPath = routePaths[selectedPath];
        const expectedCheckpoint = Math.min(Math.floor(stepProgress * (currentPath.length - 1)), currentPath.length - 1);
        
        // Update position based on selected path
        if (expectedCheckpoint > newTourist.checkpoint) {
          newTourist.checkpoint = expectedCheckpoint;
          newTourist.position = { 
            lat: currentPath[expectedCheckpoint].lat, 
            lng: currentPath[expectedCheckpoint].lng 
          };

          // Path-specific behavior
          switch (selectedPath) {
            case 'main':
              newTourist.status = expectedCheckpoint === currentPath.length - 1 ? 'online' : 'moving';
              if (expectedCheckpoint === 2) {
                createAlert('suggestion', 'low', 'Approaching weather checkpoint', getPathSuggestions('main', expectedCheckpoint));
              }
              if (expectedCheckpoint === currentPath.length - 1) {
                createAlert('info', 'low', '🎉 Destination reached successfully!', 'Journey completed safely via main route');
              }
              break;
              
            case 'restricted':
              newTourist.status = 'restricted';
              newTourist.creditScore = Math.max(0, newTourist.creditScore - 20);
              
              if (expectedCheckpoint === 1) {
                createAlert('critical', 'critical', '🚨 RESTRICTED ZONE ENTRY', getPathSuggestions('restricted', expectedCheckpoint));
              } else if (expectedCheckpoint === 3) {
                createAlert('critical', 'critical', '⚠️ DANGER ZONE DETECTED', getPathSuggestions('restricted', expectedCheckpoint));
                newTourist.creditScore = Math.max(0, newTourist.creditScore - 30);
              }
              break;
              
            case 'offline':
              newTourist.status = expectedCheckpoint < 4 ? 'offline' : 'online';
              
              if (expectedCheckpoint === 1) {
                createAlert('warning', 'medium', '📱 Connection lost', getPathSuggestions('offline', expectedCheckpoint));
              } else if (expectedCheckpoint === 4) {
                createAlert('info', 'medium', '📶 Signal restored', 'Connection reestablished. Location updated.');
                newTourist.status = 'online';
              }
              break;
          }

          // Generate suggestions for each checkpoint
          if (expectedCheckpoint > 0) {
            setTimeout(() => {
              createAlert('suggestion', 'low', 
                `Checkpoint ${expectedCheckpoint + 1} reached: ${currentPath[expectedCheckpoint].name}`, 
                getPathSuggestions(selectedPath, expectedCheckpoint)
              );
            }, 1000);
          }
        }
        
        newTourist.lastUpdate = new Date();
        return newTourist;
      });

      // Stop simulation when complete
      if (currentStep >= steps) {
        stopSimulation();
        createAlert('info', 'low', 'Simulation completed', 'All tracking data has been recorded');
      }
    }, updateInterval);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'moving': return 'bg-blue-100 text-blue-800';
      case 'idle': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'green': return 'bg-green-200 border-green-400';
      case 'yellow': return 'bg-yellow-200 border-yellow-400';
      case 'red': return 'bg-red-200 border-red-400';
      case 'orange': return 'bg-orange-200 border-orange-400';
      case 'gray': return 'bg-gray-200 border-gray-400';
      default: return 'bg-gray-200 border-gray-400';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'suggestion': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'info': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPathColor = (path: string) => {
    switch (path) {
      case 'main': return 'text-green-600';
      case 'restricted': return 'text-red-600';
      case 'offline': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPath = routePaths[selectedPath];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Personal Route Tracker
        </h1>
        <p className="text-gray-600">
          Individual monitoring for Kedarnath pilgrimage journey with smart suggestions
        </p>
      </div>

      {/* Path Selection & Controls */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Choose Your Route</h2>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => !isSimulating && setSelectedPath('main')}
                disabled={isSimulating}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedPath === 'main' 
                    ? 'bg-green-100 border-green-400 text-green-800' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                } ${isSimulating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Safe Main Route</span>
                </div>
              </button>
              <button
                onClick={() => !isSimulating && setSelectedPath('restricted')}
                disabled={isSimulating}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedPath === 'restricted' 
                    ? 'bg-red-100 border-red-400 text-red-800' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                } ${isSimulating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Restricted Path</span>
                </div>
              </button>
              <button
                onClick={() => !isSimulating && setSelectedPath('offline')}
                disabled={isSimulating}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedPath === 'offline' 
                    ? 'bg-gray-100 border-gray-400 text-gray-800' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                } ${isSimulating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Offline Route</span>
                </div>
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isSimulating ? (
              <Button onClick={startSimulation} className="bg-blue-600 hover:bg-blue-700">
                <Play className="mr-2 h-4 w-4" />
                Start Journey
              </Button>
            ) : (
              <Button onClick={stopSimulation} variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                Stop Tracking
              </Button>
            )}
          </div>
        </div>
        
        {/* Journey Info */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {tourist.name} ({tourist.touristId})
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(elapsedTime)}
          </div>
          <div className="flex items-center">
            <Route className="h-4 w-4 mr-1" />
            <span className={`font-semibold ${getPathColor(selectedPath)}`}>
              {selectedPath.charAt(0).toUpperCase() + selectedPath.slice(1)} Route
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm">Credits: </span>
            <span className={`ml-1 font-semibold ${tourist.creditScore < 80 ? 'text-red-600' : 'text-green-600'}`}>
              {tourist.creditScore}/100
            </span>
          </div>
        </div>
        
        {isSimulating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Journey Progress</span>
              <span>{Math.round(simulationProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ease-out ${
                  selectedPath === 'main' ? 'bg-green-600' :
                  selectedPath === 'restricted' ? 'bg-red-600' : 'bg-gray-600'
                }`}
                style={{ width: `${simulationProgress}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Navigation className="mr-2 h-5 w-5" />
              Live Route Tracking - {selectedPath.charAt(0).toUpperCase() + selectedPath.slice(1)} Path
            </h3>
            
            <div className="h-96 rounded-lg relative overflow-hidden border" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23f0fdf4'/%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C!-- Mountains --%3E%3Cpolygon points='0,200 100,150 200,180 300,120 400,160 500,100 600,140 600,400 0,400' fill='%23065f46' opacity='0.1'/%3E%3Cpolygon points='50,250 150,200 250,230 350,170 450,210 550,150 600,190 600,400 0,400' fill='%23047857' opacity='0.15'/%3E%3C!-- Rivers --%3E%3Cpath d='M 0 350 Q 150 340 300 360 T 600 350' stroke='%2306b6d4' stroke-width='6' fill='none' opacity='0.3'/%3E%3Cpath d='M 100 380 Q 250 370 400 390 T 600 380' stroke='%2306b6d4' stroke-width='4' fill='none' opacity='0.2'/%3E%3C!-- Forest areas --%3E%3Ccircle cx='120' cy='180' r='25' fill='%23166534' opacity='0.2'/%3E%3Ccircle cx='180' cy='160' r='20' fill='%23166534' opacity='0.2'/%3E%3Ccircle cx='250' cy='200' r='30' fill='%23166534' opacity='0.2'/%3E%3Ccircle cx='320' cy='140' r='25' fill='%23166534' opacity='0.2'/%3E%3Ccircle cx='380' cy='180' r='20' fill='%23166534' opacity='0.2'/%3E%3Ccircle cx='450' cy='120' r='35' fill='%23166534' opacity='0.2'/%3E%3C/svg%3E")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              {/* All Route Paths (Background) */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Main Route (always visible as reference) */}
                <path
                  d="M 60 320 Q 120 280 180 250 Q 240 220 300 190 Q 360 160 420 130 Q 480 100 540 80"
                  stroke="#10b981"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8,4"
                  className={`drop-shadow-sm transition-opacity ${selectedPath === 'main' ? 'opacity-100' : 'opacity-30'}`}
                />
                
                {/* Restricted Route (always visible as reference) */}
                <path
                  d="M 60 320 Q 100 300 140 320 Q 200 340 260 320 Q 320 300 380 280 Q 440 260 500 240"
                  stroke="#ef4444"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8,4"
                  className={`drop-shadow-sm transition-opacity ${selectedPath === 'restricted' ? 'opacity-100' : 'opacity-30'}`}
                />
                
                {/* Offline Route (always visible as reference) */}
                <path
                  d="M 60 320 L 120 310 L 180 305 L 240 300 L 300 295 L 360 290 L 420 285 L 480 280 L 540 80"
                  stroke="#6b7280"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="12,6"
                  className={`drop-shadow-sm transition-opacity ${selectedPath === 'offline' ? 'opacity-100' : 'opacity-30'}`}
                />
                
                {/* Active Route Highlight */}
                <path
                  d={selectedPath === 'main' ? 
                    "M 60 320 Q 120 280 180 250 Q 240 220 300 190 Q 360 160 420 130 Q 480 100 540 80" :
                    selectedPath === 'restricted' ?
                    "M 60 320 Q 100 300 140 320 Q 200 340 260 320 Q 320 300 380 280 Q 440 260 500 240" :
                    "M 60 320 L 120 310 L 180 305 L 240 300 L 300 295 L 360 290 L 420 285 L 480 280 L 540 80"
                  }
                  stroke={selectedPath === 'main' ? '#10b981' : selectedPath === 'restricted' ? '#ef4444' : '#6b7280'}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={selectedPath === 'offline' ? "12,6" : "none"}
                  className="drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))',
                    animation: isSimulating ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                  }}
                />
              </svg>

              {/* All Checkpoints for Reference */}
              {Object.entries(routePaths).map(([pathType, checkpoints]) => {
                const positions = pathType === 'main' ? [
                  { x: 50, y: 310 }, { x: 130, y: 270 }, { x: 210, y: 240 },
                  { x: 290, y: 180 }, { x: 370, y: 150 }, { x: 450, y: 70 }
                ] : pathType === 'restricted' ? [
                  { x: 50, y: 310 }, { x: 110, y: 290 }, { x: 170, y: 310 },
                  { x: 230, y: 330 }, { x: 290, y: 310 }, { x: 350, y: 230 }
                ] : [
                  { x: 50, y: 310 }, { x: 110, y: 300 }, { x: 170, y: 295 },
                  { x: 230, y: 290 }, { x: 290, y: 285 }, { x: 450, y: 70 }
                ];

                return checkpoints.map((checkpoint, index) => (
                  <div
                    key={`${pathType}-${checkpoint.id}`}
                    className={`absolute group transition-opacity ${
                      pathType === selectedPath ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{
                      left: `${positions[index]?.x || 50 + index * 80}px`,
                      top: `${positions[index]?.y || 310 - index * 40}px`
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shadow-lg ${getZoneColor(checkpoint.type)} ${
                      pathType === selectedPath ? 'scale-110' : 'scale-90'
                    } transition-transform`}>
                      {checkpoint.id}
                    </div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      <div className="font-semibold">{checkpoint.name}</div>
                      <div>Safety: {checkpoint.safety}</div>
                      <div>Path: {pathType}</div>
                    </div>
                  </div>
                ));
              })}

              {/* Tourist Position */}
              {(() => {
                const positions = selectedPath === 'main' ? [
                  { x: 50, y: 310 }, { x: 130, y: 270 }, { x: 210, y: 240 },
                  { x: 290, y: 180 }, { x: 370, y: 150 }, { x: 450, y: 70 }
                ] : selectedPath === 'restricted' ? [
                  { x: 50, y: 310 }, { x: 110, y: 290 }, { x: 170, y: 310 },
                  { x: 230, y: 330 }, { x: 290, y: 310 }, { x: 350, y: 230 }
                ] : [
                  { x: 50, y: 310 }, { x: 110, y: 300 }, { x: 170, y: 295 },
                  { x: 230, y: 290 }, { x: 290, y: 285 }, { x: 450, y: 70 }
                ];
                
                const currentPos = positions[tourist.checkpoint] || positions[0];
                
                return (
                  <div
                    className="absolute group"
                    style={{
                      left: `${currentPos.x}px`,
                      top: `${currentPos.y - 20}px`,
                      zIndex: 30
                    }}
                  >
                    <div className={`w-10 h-10 rounded-full border-4 border-white shadow-xl flex items-center justify-center ${getStatusColor(tourist.status)} ${isSimulating ? 'animate-bounce' : ''} transform scale-125`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white border px-3 py-2 rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      <div className="font-semibold">{tourist.name}</div>
                      <div>ID: {tourist.touristId}</div>
                      <div>Status: <span className="capitalize">{tourist.status}</span></div>
                      <div>Credits: {tourist.creditScore}</div>
                      <div>Path: {selectedPath}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Route Legend */}
              <div className="absolute top-4 left-4 bg-white border rounded-lg p-3 shadow-lg text-xs space-y-2">
                <div className="font-semibold text-gray-800">Available Routes:</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-1 bg-green-500 rounded"></div>
                    <span className={`${selectedPath === 'main' ? 'font-bold text-green-600' : 'text-gray-600'}`}>Main (Safe)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-1 bg-red-500 rounded"></div>
                    <span className={`${selectedPath === 'restricted' ? 'font-bold text-red-600' : 'text-gray-600'}`}>Restricted (Danger)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-1 bg-gray-500 rounded" style={{borderStyle: 'dashed'}}></div>
                    <span className={`${selectedPath === 'offline' ? 'font-bold text-gray-600' : 'text-gray-600'}`}>Offline (Limited)</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className={`font-semibold ${getPathColor(selectedPath)}`}>
                    Active: {selectedPath.charAt(0).toUpperCase() + selectedPath.slice(1)}
                  </div>
                </div>
              </div>

              {/* Status Legend */}
              <div className="absolute bottom-4 left-4 bg-white border rounded-lg p-3 shadow-lg text-xs space-y-2">
                <div className="font-semibold text-gray-800">Tourist Status:</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(tourist.status).replace('text-', 'border-').replace('bg-', 'bg-')}`}></div>
                  <span className="capitalize">{tourist.status}</span>
                </div>
                <div className="text-gray-600">
                  Progress: {tourist.checkpoint + 1}/{currentPath.length}
                </div>
              </div>

              {/* Map Features Legend */}
              <div className="absolute top-4 right-4 bg-white border rounded-lg p-3 shadow-lg text-xs space-y-2">
                <div className="font-semibold text-gray-800">Map Features:</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-green-900 opacity-20"></div>
                    <span>Forest Areas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-1 bg-blue-400"></div>
                    <span>Rivers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-2 bg-green-800 opacity-20" style={{clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'}}></div>
                    <span>Mountains</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Tourist Profile */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Tourist Profile
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-sm mb-2">{tourist.name}</div>
                <div className="text-xs space-y-1 text-gray-700">
                  <div>ID: {tourist.touristId}</div>
                  <div>Current Status: 
                    <Badge className={`ml-2 ${getStatusColor(tourist.status)}`}>
                      {tourist.status}
                    </Badge>
                  </div>
                  <div>Progress: {tourist.checkpoint + 1}/{currentPath.length} checkpoints</div>
                  <div>Current Location: {currentPath[tourist.checkpoint]?.name}</div>
                  <div>Credits: 
                    <span className={`ml-1 font-semibold ${tourist.creditScore < 80 ? 'text-red-600' : 'text-green-600'}`}>
                      {tourist.creditScore}/100
                    </span>
                  </div>
                  <div>Route: <span className={`capitalize font-semibold ${getPathColor(tourist.currentPath)}`}>{tourist.currentPath}</span></div>
                  <div>Last Update: {tourist.lastUpdate.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Route Information */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Route className="mr-2 h-5 w-5" />
              Route Details
            </h3>
            <div className="space-y-3">
              <div className="text-xs space-y-2">
                <div className="font-semibold">All Available Paths:</div>
                <div className="space-y-2">
                  <div className={`p-2 rounded ${selectedPath === 'main' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Shield className="h-3 w-3 text-green-600" />
                      <span className="font-medium text-green-600">Main Route</span>
                    </div>
                    <div className="text-xs text-gray-600">✅ Safest path with full support</div>
                    <div className="text-xs text-gray-500">6 checkpoints • High safety rating</div>
                  </div>
                  
                  <div className={`p-2 rounded ${selectedPath === 'restricted' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                      <span className="font-medium text-red-600">Restricted Path</span>
                    </div>
                    <div className="text-xs text-gray-600">⚠️ Unauthorized dangerous route</div>
                    <div className="text-xs text-gray-500">6 checkpoints • Critical danger zones</div>
                  </div>
                  
                  <div className={`p-2 rounded ${selectedPath === 'offline' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap className="h-3 w-3 text-gray-600" />
                      <span className="font-medium text-gray-600">Offline Route</span>
                    </div>
                    <div className="text-xs text-gray-600">📱 Limited connectivity areas</div>
                    <div className="text-xs text-gray-500">6 checkpoints • Signal dead zones</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Smart Alerts & Suggestions */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Smart Alerts & Suggestions
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.alertType)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`${getAlertColor(alert.alertType)} border-0`}>
                        {alert.alertType.toUpperCase()}
                      </Badge>
                      <span className="text-xs opacity-75">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{alert.message}</p>
                    {alert.suggestion && (
                      <p className="text-xs opacity-80 mt-2 italic">💡 {alert.suggestion}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No alerts yet</p>
                  <p className="text-xs">Start your journey to see smart suggestions</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalTouristTracker;