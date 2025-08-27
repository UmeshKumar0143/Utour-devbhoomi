import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class TouristAnomalyDetector:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = IsolationForest(
            contamination=0.1,  # Expect 10% anomalies
            random_state=42,
            n_estimators=100
        )
        self.feature_columns = []
        
    def load_data(self, train_url, test_url):
        """Load training and test datasets from URLs"""
        print("Loading datasets...")
        
        # Load training data
        train_df = pd.read_csv(train_url)
        print(f"Training data shape: {train_df.shape}")
        
        # Load test data
        test_df = pd.read_csv(test_url)
        print(f"Test data shape: {test_df.shape}")
        
        return train_df, test_df
    
    def preprocess_data(self, df):
        """Preprocess and engineer features for anomaly detection"""
        df = df.copy()
        
        # Convert timestamp to datetime
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Handle data type issues (some columns marked as 'date' but contain numbers)
        numeric_cols = ['bearing_diff', 'silent_duration', 'stationary_duration', 
                       'signal_drop_flag', 'hour_of_day']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Sort by timestamp
        df = df.sort_values('timestamp').reset_index(drop=True)
        
        return df
    
    def engineer_features(self, df):
        """Engineer features specifically for anomaly detection"""
        df = df.copy()
        
        # 1. Route Deviation Features
        df['route_deviation_severe'] = (df['distance_from_route'] > df['distance_from_route'].quantile(0.9)).astype(int)
        df['route_adherence_poor'] = (df['route_adherence_ratio'] < 0.3).astype(int)
        
        # 2. Movement Pattern Features
        df['speed_anomaly'] = ((df['speed'] > df['speed'].quantile(0.95)) | 
                              (df['speed'] < df['speed'].quantile(0.05))).astype(int)
        df['acceleration_extreme'] = (np.abs(df['acceleration']) > df['acceleration'].abs().quantile(0.9)).astype(int)
        df['speed_variance_high'] = (df['speed_variance'] > df['speed_variance'].quantile(0.9)).astype(int)
        
        # 3. Inactivity Features
        df['prolonged_stationary'] = (df['stationary_duration'] > 300).astype(int)  # > 5 minutes
        df['prolonged_silent'] = (df['silent_duration'] > 600).astype(int)  # > 10 minutes
        df['large_time_gap'] = (df['time_gap'] > 60).astype(int)  # > 1 minute gaps
        
        # 4. Communication Issues
        df['signal_issues'] = df['signal_drop_flag'].astype(int)
        
        # 5. Temporal Features
        df['is_night'] = ((df['hour_of_day'] >= 22) | (df['hour_of_day'] <= 6)).astype(int)
        df['is_rush_hour'] = ((df['hour_of_day'].between(7, 9)) | 
                             (df['hour_of_day'].between(17, 19))).astype(int)
        
        # 6. Rolling Statistics (movement patterns over time)
        df['speed_rolling_mean'] = df['speed'].rolling(window=5, min_periods=1).mean()
        df['speed_rolling_std'] = df['speed'].rolling(window=5, min_periods=1).std().fillna(0)
        df['distance_rolling_mean'] = df['distance_from_route'].rolling(window=5, min_periods=1).mean()
        
        # 7. Sudden Changes
        df['speed_change'] = df['speed'].diff().abs()
        df['location_jump'] = np.sqrt((df['lat'].diff())**2 + (df['lon'].diff())**2) * 111000  # Convert to meters
        df['sudden_location_change'] = (df['location_jump'] > 1000).astype(int)  # > 1km jump
        
        # Fill NaN values
        df = df.fillna(0)
        
        return df
    
    def select_features(self, df):
        """Select the most relevant features for anomaly detection"""
        feature_cols = [
            # Route deviation
            'distance_from_route', 'route_adherence_ratio', 'route_deviation_severe', 'route_adherence_poor',
            
            # Movement patterns
            'speed', 'acceleration', 'speed_variance', 'speed_anomaly', 'acceleration_extreme', 'speed_variance_high',
            
            # Inactivity indicators
            'silent_duration', 'stationary_duration', 'time_gap', 
            'prolonged_stationary', 'prolonged_silent', 'large_time_gap',
            
            # Communication issues
            'signal_drop_flag', 'signal_issues',
            
            # Temporal patterns
            'hour_of_day', 'is_night', 'is_rush_hour',
            
            # Rolling statistics
            'speed_rolling_mean', 'speed_rolling_std', 'distance_rolling_mean',
            
            # Sudden changes
            'speed_change', 'location_jump', 'sudden_location_change'
        ]
        
        # Only keep columns that exist in the dataframe
        available_features = [col for col in feature_cols if col in df.columns]
        self.feature_columns = available_features
        
        return df[available_features]
    
    def train(self, train_df):
        """Train the anomaly detection model"""
        print("Engineering features...")
        train_processed = self.preprocess_data(train_df)
        train_features = self.engineer_features(train_processed)
        
        print("Selecting features...")
        X_train = self.select_features(train_features)
        
        print(f"Training with {len(self.feature_columns)} features:")
        for i, feature in enumerate(self.feature_columns):
            print(f"  {i+1}. {feature}")
        
        print("Scaling features...")
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        print("Training anomaly detection model...")
        self.model.fit(X_train_scaled)
        
        # Get training anomaly scores for analysis
        train_scores = self.model.decision_function(X_train_scaled)
        train_predictions = self.model.predict(X_train_scaled)
        
        print(f"Training completed. Found {sum(train_predictions == -1)} anomalies out of {len(train_predictions)} samples")
        
        return train_processed, train_predictions, train_scores
    
    def predict(self, test_df):
        """Predict anomalies on test data"""
        print("Processing test data...")
        test_processed = self.preprocess_data(test_df)
        test_features = self.engineer_features(test_processed)
        X_test = self.select_features(test_features)
        
        print("Making predictions...")
        X_test_scaled = self.scaler.transform(X_test)
        test_predictions = self.model.predict(X_test_scaled)
        test_scores = self.model.decision_function(X_test_scaled)
        
        return test_processed, test_predictions, test_scores
    
    def analyze_anomalies(self, df, predictions, scores, dataset_name="Dataset"):
        """Analyze and categorize detected anomalies"""
        df = df.copy()
        df['anomaly'] = predictions
        df['anomaly_score'] = scores
        
        anomalies = df[df['anomaly'] == -1].copy()
        
        print(f"\n=== {dataset_name} Anomaly Analysis ===")
        print(f"Total samples: {len(df)}")
        print(f"Anomalies detected: {len(anomalies)} ({len(anomalies)/len(df)*100:.2f}%)")
        
        if len(anomalies) > 0:
            print("\nAnomaly Categories:")
            
            # Route deviation anomalies
            route_anomalies = anomalies[anomalies['distance_from_route'] > anomalies['distance_from_route'].quantile(0.9)]
            print(f"  • Route Deviation: {len(route_anomalies)} cases")
            
            # Prolonged inactivity
            inactivity_anomalies = anomalies[(anomalies['stationary_duration'] > 300) | 
                                            (anomalies['silent_duration'] > 600)]
            print(f"  • Prolonged Inactivity: {len(inactivity_anomalies)} cases")
            
            # Communication issues
            signal_anomalies = anomalies[anomalies['signal_drop_flag'] == 1]
            print(f"  • Signal/Communication Issues: {len(signal_anomalies)} cases")
            
            # Sudden location changes
            location_anomalies = anomalies[anomalies['sudden_location_change'] == 1]
            print(f"  • Sudden Location Changes: {len(location_anomalies)} cases")
            
            # Speed anomalies
            speed_anomalies = anomalies[anomalies['speed_anomaly'] == 1]
            print(f"  • Speed Anomalies: {len(speed_anomalies)} cases")
            
            # Show most severe anomalies
            print(f"\nTop 5 Most Severe Anomalies (lowest scores):")
            top_anomalies = anomalies.nsmallest(5, 'anomaly_score')
            for idx, row in top_anomalies.iterrows():
                print(f"  {idx}: Score={row['anomaly_score']:.3f}, "
                      f"Route Distance={row['distance_from_route']:.1f}m, "
                      f"Speed={row['speed']:.1f}, "
                      f"Silent={row['silent_duration']}s, "
                      f"Stationary={row['stationary_duration']}s")
        
        return anomalies
    
    def create_visualizations(self, train_df, train_predictions, test_df, test_predictions):
        """Create visualizations for anomaly detection results"""
        plt.figure(figsize=(15, 12))
        
        # 1. Anomaly distribution over time
        plt.subplot(2, 3, 1)
        train_df_viz = train_df.copy()
        train_df_viz['anomaly'] = train_predictions
        train_df_viz['hour'] = train_df_viz['hour_of_day']
        
        hourly_anomalies = train_df_viz.groupby('hour')['anomaly'].apply(lambda x: sum(x == -1)).reset_index()
        plt.bar(hourly_anomalies['hour'], hourly_anomalies['anomaly'])
        plt.title('Anomalies by Hour of Day (Training)')
        plt.xlabel('Hour')
        plt.ylabel('Number of Anomalies')
        
        # 2. Route deviation vs anomalies
        plt.subplot(2, 3, 2)
        normal_points = train_df[train_predictions == 1]
        anomaly_points = train_df[train_predictions == -1]
        
        plt.scatter(normal_points['distance_from_route'], normal_points['speed'], 
                   alpha=0.6, label='Normal', s=20)
        plt.scatter(anomaly_points['distance_from_route'], anomaly_points['speed'], 
                   alpha=0.8, label='Anomaly', s=20, color='red')
        plt.xlabel('Distance from Route (m)')
        plt.ylabel('Speed')
        plt.title('Route Deviation vs Speed')
        plt.legend()
        
        # 3. Speed patterns
        plt.subplot(2, 3, 3)
        plt.hist(normal_points['speed'], bins=30, alpha=0.7, label='Normal', density=True)
        plt.hist(anomaly_points['speed'], bins=30, alpha=0.7, label='Anomaly', density=True)
        plt.xlabel('Speed')
        plt.ylabel('Density')
        plt.title('Speed Distribution')
        plt.legend()
        
        # 4. Inactivity patterns
        plt.subplot(2, 3, 4)
        plt.scatter(normal_points['silent_duration'], normal_points['stationary_duration'], 
                   alpha=0.6, label='Normal', s=20)
        plt.scatter(anomaly_points['silent_duration'], anomaly_points['stationary_duration'], 
                   alpha=0.8, label='Anomaly', s=20, color='red')
        plt.xlabel('Silent Duration (s)')
        plt.ylabel('Stationary Duration (s)')
        plt.title('Inactivity Patterns')
        plt.legend()
        
        # 5. Route adherence
        plt.subplot(2, 3, 5)
        plt.hist(normal_points['route_adherence_ratio'], bins=20, alpha=0.7, label='Normal', density=True)
        plt.hist(anomaly_points['route_adherence_ratio'], bins=20, alpha=0.7, label='Anomaly', density=True)
        plt.xlabel('Route Adherence Ratio')
        plt.ylabel('Density')
        plt.title('Route Adherence Distribution')
        plt.legend()
        
        # 6. Geographic distribution of anomalies
        plt.subplot(2, 3, 6)
        plt.scatter(normal_points['lon'], normal_points['lat'], alpha=0.6, label='Normal', s=10)
        plt.scatter(anomaly_points['lon'], anomaly_points['lat'], alpha=0.8, label='Anomaly', s=15, color='red')
        plt.xlabel('Longitude')
        plt.ylabel('Latitude')
        plt.title('Geographic Distribution')
        plt.legend()
        
        plt.tight_layout()
        plt.show()

def main():
    # URLs for the datasets
    train_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tourist_route_train-4LqJRIE6Bhv3AlcaK8dm6ccJliN6Yr.csv"
    test_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tourist_route_test-664BZQpxXdSScBRV57OVv5XsACqdPe.csv"
    
    # Initialize detector
    detector = TouristAnomalyDetector()
    
    try:
        # Load data
        train_df, test_df = detector.load_data(train_url, test_url)
        
        # Train the model
        train_processed, train_predictions, train_scores = detector.train(train_df)
        
        # Predict on test data
        test_processed, test_predictions, test_scores = detector.predict(test_df)
        
        # Analyze anomalies
        print("\n" + "="*60)
        train_anomalies = detector.analyze_anomalies(train_processed, train_predictions, train_scores, "Training")
        test_anomalies = detector.analyze_anomalies(test_processed, test_predictions, test_scores, "Test")
        
        # Create visualizations
        print("\nGenerating visualizations...")
        detector.create_visualizations(train_processed, train_predictions, test_processed, test_predictions)
        
        # Save results
        print("\nSaving results...")
        
        # Save anomalies with detailed information
        test_results = test_processed.copy()
        test_results['anomaly'] = test_predictions
        test_results['anomaly_score'] = test_scores
        test_results['risk_level'] = pd.cut(test_scores, bins=[-np.inf, -0.2, -0.1, 0, np.inf], 
                                          labels=['Critical', 'High', 'Medium', 'Low'])
        
        # Flag specific types of anomalies
        test_results['route_deviation_flag'] = (test_results['distance_from_route'] > 1000).astype(int)
        test_results['inactivity_flag'] = ((test_results['stationary_duration'] > 300) | 
                                         (test_results['silent_duration'] > 600)).astype(int)
        test_results['communication_flag'] = test_results['signal_drop_flag'].astype(int)
        test_results['distress_flag'] = ((test_results['anomaly'] == -1) & 
                                       ((test_results['route_deviation_flag'] == 1) | 
                                        (test_results['inactivity_flag'] == 1) | 
                                        (test_results['communication_flag'] == 1))).astype(int)
        
        # Summary report
        print("\n" + "="*60)
        print("TOURIST SAFETY MONITORING REPORT")
        print("="*60)
        
        critical_cases = test_results[test_results['risk_level'] == 'Critical']
        high_risk_cases = test_results[test_results['risk_level'] == 'High']
        distress_cases = test_results[test_results['distress_flag'] == 1]
        
        print(f"Total monitoring points: {len(test_results)}")
        print(f"Anomalies detected: {sum(test_predictions == -1)} ({sum(test_predictions == -1)/len(test_predictions)*100:.1f}%)")
        print(f"Critical risk cases: {len(critical_cases)}")
        print(f"High risk cases: {len(high_risk_cases)}")
        print(f"Potential distress situations: {len(distress_cases)}")
        
        if len(distress_cases) > 0:
            print(f"\nIMMEDIATE ATTENTION REQUIRED:")
            for idx, case in distress_cases.head(5).iterrows():
                print(f"  • Timestamp: {case['timestamp']}")
                print(f"    Location: ({case['lat']:.6f}, {case['lon']:.6f})")
                print(f"    Issues: Route deviation={case['route_deviation_flag']}, "
                      f"Inactivity={case['inactivity_flag']}, "
                      f"Communication={case['communication_flag']}")
                print(f"    Risk Score: {case['anomaly_score']:.3f}")
                print()
        
        print("Model successfully trained and deployed for real-time tourist safety monitoring!")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
