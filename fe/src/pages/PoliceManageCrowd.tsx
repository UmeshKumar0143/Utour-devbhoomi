import React, { useState, useEffect, useRef } from 'react';

const CrowdDensityPredictor = () => {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    location_lat: 27.1767,
    location_long: 78.0081,
    movement_speed: 1.2,
    temperature: 25,
    distance_between_people: 2.0,
    time_spent: 15,
    weather: 'clear',
    event_type: 'normal',
    hour: 12,
    day_of_week: 1
  });

  const [predictions, setPredictions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate LSTM model prediction based on input parameters
  const simulateModelPrediction = (params) => {
    const baseIntensity = Math.random() * 0.3 + 0.2;
    
    // Weather impact
    const weatherMultiplier = {
      'clear': 1.2,
      'cloudy': 1.0,
      'rainy': 0.6
    };
    
    // Event type impact
    const eventMultiplier = {
      'normal': 1.0,
      'medical_emergency': 1.8,
      'religious_activity': 1.5,
      'transport_delay': 1.3
    };
    
    // Time of day impact (peak hours)
    const timeMultiplier = params.hour >= 9 && params.hour <= 18 ? 1.4 : 0.8;
    
    // Temperature impact
    const tempMultiplier = params.temperature > 30 ? 0.7 : 
                          params.temperature < 10 ? 0.6 : 1.0;
    
    // Movement speed impact (slower = more crowded)
    const speedMultiplier = 2.0 / Math.max(params.movement_speed, 0.5);
    
    // Distance impact (closer = more crowded)
    const distanceMultiplier = 3.0 / Math.max(params.distance_between_people, 0.5);
    
    const intensity = Math.min(1.0, baseIntensity * 
      weatherMultiplier[params.weather] * 
      eventMultiplier[params.event_type] * 
      timeMultiplier * 
      tempMultiplier * 
      speedMultiplier * 
      distanceMultiplier * 0.3);
    
    return intensity;
  };

  // Generate crowd density data points
  const generateCrowdData = () => {
    const data = [];
    const centerLat = formData.location_lat;
    const centerLong = formData.location_long;
    
    // Generate multiple hotspots around the center
    const numHotspots = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < numHotspots; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.01;
      const offsetLong = (Math.random() - 0.5) * 0.01;
      
      const hotspotParams = {
        ...formData,
        location_lat: centerLat + offsetLat,
        location_long: centerLong + offsetLong
      };
      
      const intensity = simulateModelPrediction(hotspotParams);
      
      data.push({
        lat: centerLat + offsetLat,
        lng: centerLong + offsetLong,
        intensity: intensity,
        radius: 20 + Math.random() * 30
      });
    }
    
    return data;
  };

  // Draw heatmap on canvas
  const drawHeatmap = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw location marker (center)
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw label
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('📍 Target Location', centerX + 15, centerY + 5);
    
    // Draw crowd density hotspots
    data.forEach((point, index) => {
      const x = centerX + (point.lng - formData.location_long) * 8000;
      const y = centerY - (point.lat - formData.location_lat) * 8000;
      
      // Create radial gradient for heatmap effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, point.radius);
      
      const alpha = point.intensity;
      const red = Math.floor(255 * point.intensity);
      const yellow = Math.floor(255 * (1 - point.intensity * 0.5));
      
      gradient.addColorStop(0, `rgba(${red}, ${yellow}, 0, ${alpha * 0.8})`);
      gradient.addColorStop(0.5, `rgba(${red}, ${Math.floor(yellow * 0.7)}, 0, ${alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(${red}, 0, 0, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, point.radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw intensity value
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${(point.intensity * 100).toFixed(1)}%`, x, y + 3);
    });
    
    // Draw legend
    drawLegend(ctx, width, height);
  };

  const drawLegend = (ctx, width, height) => {
    const legendX = width - 150;
    const legendY = 20;
    
    // Legend background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(legendX - 10, legendY - 10, 140, 120);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Crowd Density', legendX, legendY + 10);
    
    // Density scale
    const colors = ['#ff0000', '#ff8800', '#ffff00', '#88ff00', '#00ff00'];
    const labels = ['Very High', 'High', 'Medium', 'Low', 'Very Low'];
    
    colors.forEach((color, i) => {
      const y = legendY + 25 + i * 18;
      ctx.fillStyle = color;
      ctx.fillRect(legendX, y, 15, 12);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Arial';
      ctx.fillText(labels[i], legendX + 20, y + 9);
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const updatePrediction = async () => {
    setIsGenerating(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPredictions = generateCrowdData();
    setPredictions(newPredictions);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (predictions.length > 0) {
      drawHeatmap(predictions);
    }
  }, [predictions, formData]);

  useEffect(() => {
    // Initial prediction
    updatePrediction();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-8 text-center">
          <h1 className="text-4xl font-light mb-2">Crowd Density Predictor</h1>
          <p className="text-lg opacity-90">AI-Powered Real-time Crowd Analysis & Prediction</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Input Form */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">⚙️</span>
                Model Parameters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (Latitude)
                  </label>
                  <input
                    type="number"
                    name="location_lat"
                    value={formData.location_lat}
                    onChange={handleInputChange}
                    step="0.0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (Longitude)
                  </label>
                  <input
                    type="number"
                    name="location_long"
                    value={formData.location_long}
                    onChange={handleInputChange}
                    step="0.0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Movement Speed (m/s)
                  </label>
                  <input
                    type="number"
                    name="movement_speed"
                    value={formData.movement_speed}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0.1"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    min="-10"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance Between People (m)
                  </label>
                  <input
                    type="number"
                    name="distance_between_people"
                    value={formData.distance_between_people}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0.5"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Spent at Location (minutes)
                  </label>
                  <input
                    type="number"
                    name="time_spent"
                    value={formData.time_spent}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weather Conditions
                  </label>
                  <select
                    name="weather"
                    value={formData.weather}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="clear">Clear</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="rainy">Rainy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="normal">Normal</option>
                    <option value="medical_emergency">Medical Emergency</option>
                    <option value="religious_activity">Religious Activity</option>
                    <option value="transport_delay">Transport Delay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hour (0-23)
                  </label>
                  <input
                    type="number"
                    name="hour"
                    value={formData.hour}
                    onChange={handleInputChange}
                    min="0"
                    max="23"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  onClick={updatePrediction}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Prediction...
                    </span>
                  ) : (
                    '🚀 Update Prediction'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Heatmap Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-700">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">🗺️</span>
                  Live Crowd Density Heatmap
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  AI-generated predictions based on LSTM model simulation
                </p>
              </div>
              
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  style={{ maxHeight: '600px' }}
                />
                
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-800 font-medium">Processing LSTM Model...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            {predictions.length > 0 && !isGenerating && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {predictions.length}
                  </div>
                  <div className="text-sm opacity-90">Hotspots Detected</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {Math.max(...predictions.map(p => p.intensity * 100)).toFixed(1)}%
                  </div>
                  <div className="text-sm opacity-90">Peak Density</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-400 to-purple-500 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {(predictions.reduce((sum, p) => sum + p.intensity, 0) / predictions.length * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm opacity-90">Avg Density</div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-400 to-rose-500 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {formData.weather === 'rainy' ? 'Low' : formData.event_type !== 'normal' ? 'High' : 'Medium'}
                  </div>
                  <div className="text-sm opacity-90">Risk Level</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdDensityPredictor;