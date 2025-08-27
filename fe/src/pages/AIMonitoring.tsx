import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Radio, TrendingUp, Shield, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';

const TouristAnomalyDetector = () => {
  const [inputData, setInputData] = useState({
    distance_from_route: 0,
    bearing_diff: 0,
    speed: 0,
    speed_variance: 0,
    acceleration: 0,
    time_gap: 0,
    silent_duration: 0,
    stationary_duration: 0,
    signal_drop_flag: 0,
    route_adherence_ratio: 1.0,
    hour_of_day: 12
  });

  const [prediction, setPrediction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Core anomaly detection logic
  const detectAnomalies = (data) => {
    const flags = {};
    let anomalyScore = 0;
    let anomalyCount = 0;

    // Route deviation checks
    if (data.distance_from_route > 100) {
      flags.route_deviation = true;
      anomalyScore -= 0.3;
      anomalyCount++;
    }
    
    if (data.route_adherence_ratio < 0.3) {
      flags.poor_route_adherence = true;
      anomalyScore -= 0.2;
      anomalyCount++;
    }

    // Speed anomaly checks
    if (data.speed > 15 || (data.speed < 0.5 && data.speed > 0)) {
      flags.speed_anomaly = true;
      anomalyScore -= 0.25;
      anomalyCount++;
    }

    if (Math.abs(data.acceleration) > 5) {
      flags.extreme_acceleration = true;
      anomalyScore -= 0.2;
      anomalyCount++;
    }

    // Inactivity checks
    if (data.stationary_duration > 300) {
      flags.prolonged_stationary = true;
      anomalyScore -= 0.4;
      anomalyCount++;
    }

    if (data.silent_duration > 600) {
      flags.prolonged_silent = true;
      anomalyScore -= 0.35;
      anomalyCount++;
    }

    if (data.time_gap > 60) {
      flags.large_time_gap = true;
      anomalyScore -= 0.15;
      anomalyCount++;
    }

    // Communication issues
    if (data.signal_drop_flag === 1) {
      flags.signal_issues = true;
      anomalyScore -= 0.3;
      anomalyCount++;
    }

    // Bearing changes
    if (Math.abs(data.bearing_diff) > 45) {
      flags.sudden_direction_change = true;
      anomalyScore -= 0.15;
      anomalyCount++;
    }

    // Night time activity (higher risk)
    const isNight = data.hour_of_day >= 22 || data.hour_of_day <= 6;
    if (isNight && anomalyCount > 0) {
      anomalyScore -= 0.1;
      flags.night_activity = true;
    }

    // Determine overall risk
    let risk = 'Low';
    let isAnomaly = false;
    
    if (anomalyScore <= -0.5) {
      risk = 'Critical';
      isAnomaly = true;
    } else if (anomalyScore <= -0.3) {
      risk = 'High';
      isAnomaly = true;
    } else if (anomalyScore <= -0.1) {
      risk = 'Medium';
      isAnomaly = true;
    }

    // Distress flag
    const distressFlag = (flags.route_deviation || flags.prolonged_silent || flags.signal_issues) && risk !== 'Low';

    return {
      isAnomaly,
      anomalyScore,
      riskLevel: risk,
      flags,
      distressFlag,
      anomalyCount
    };
  };

  const handleInputChange = (field, value) => {
    const numValue = field === 'signal_drop_flag' ? parseInt(value) || 0 : parseFloat(value) || 0;
    setInputData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const runDetection = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = detectAnomalies(inputData);
    setPrediction(result);
    setIsProcessing(false);
  };

  const resetForm = () => {
    setInputData({
      distance_from_route: 0,
      bearing_diff: 0,
      speed: 0,
      speed_variance: 0,
      acceleration: 0,
      time_gap: 0,
      silent_duration: 0,
      stationary_duration: 0,
      signal_drop_flag: 0,
      route_adherence_ratio: 1.0,
      hour_of_day: 12
    });
    setPrediction(null);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'High': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-green-700 bg-green-100 border-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Anomaly Detection Test</h1>
              <p className="text-gray-600">Tourist Safety ML Model Validation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Parameters */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Input Parameters</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distance from Route (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputData.distance_from_route}
                      onChange={(e) => handleInputChange('distance_from_route', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 35.2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bearing Difference (°)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputData.bearing_diff}
                      onChange={(e) => handleInputChange('bearing_diff', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 12.4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speed (m/s)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputData.speed}
                      onChange={(e) => handleInputChange('speed', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 3.8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speed Variance
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputData.speed_variance}
                      onChange={(e) => handleInputChange('speed_variance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 0.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Acceleration (m/s²)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputData.acceleration}
                      onChange={(e) => handleInputChange('acceleration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., -0.3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Route Adherence Ratio
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={inputData.route_adherence_ratio}
                      onChange={(e) => handleInputChange('route_adherence_ratio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 0.95"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Gap (s)
                    </label>
                    <input
                      type="number"
                      value={inputData.time_gap}
                      onChange={(e) => handleInputChange('time_gap', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Silent Duration (s)
                    </label>
                    <input
                      type="number"
                      value={inputData.silent_duration}
                      onChange={(e) => handleInputChange('silent_duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stationary Duration (s)
                    </label>
                    <input
                      type="number"
                      value={inputData.stationary_duration}
                      onChange={(e) => handleInputChange('stationary_duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Signal Drop Flag
                    </label>
                    <select
                      value={inputData.signal_drop_flag}
                      onChange={(e) => handleInputChange('signal_drop_flag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>No Signal Drop (0)</option>
                      <option value={1}>Signal Drop (1)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hour of Day (0-23)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={inputData.hour_of_day}
                      onChange={(e) => handleInputChange('hour_of_day', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 14"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={runDetection}
                  disabled={isProcessing}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all ${
                    isProcessing
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.02]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Detect Anomaly
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detection Results</h2>
              
              {!prediction ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="mx-auto h-16 w-16 mb-4 opacity-30" />
                  <p>Enter parameters and click<br/>"Detect Anomaly" to test</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-2 ${getRiskColor(prediction.riskLevel)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Risk Level</span>
                      {prediction.isAnomaly ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="text-lg font-bold">{prediction.riskLevel}</div>
                    <div className="text-sm mt-1">
                      Score: {prediction.anomalyScore.toFixed(3)}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Status</h4>
                    <div className={`text-sm font-medium ${
                      prediction.isAnomaly ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {prediction.isAnomaly ? '⚠️ Anomaly Detected' : '✅ Normal Behavior'}
                    </div>
                    
                    {prediction.distressFlag && (
                      <div className="mt-2 px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm font-semibold">
                        🚨 DISTRESS SITUATION
                      </div>
                    )}
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Detected Issues</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {Object.keys(prediction.flags).length === 0 ? (
                        <p className="text-green-600 text-sm">No issues detected</p>
                      ) : (
                        Object.entries(prediction.flags).map(([flag, active]) => active && (
                          <div key={flag} className="flex items-center text-sm text-red-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            {flag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Summary</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Anomalies Found: {prediction.anomalyCount}</div>
                      <div>Classification: {prediction.isAnomaly ? 'Anomalous' : 'Normal'}</div>
                      <div>Confidence: {((1 + prediction.anomalyScore) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Detection Features</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Route deviation monitoring</li>
                <li>• Prolonged inactivity detection</li>
                <li>• Communication loss alerts</li>
                <li>• Speed anomaly detection</li>
                <li>• Night-time risk assessment</li>
                <li>• Multi-factor risk scoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristAnomalyDetector;