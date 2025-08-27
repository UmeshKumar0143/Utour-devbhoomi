import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  userType: 'tourist' | 'police';
  fullName: string;
  touristId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('utour_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const generateTouristId = () => {
    return 'T' + Math.floor(10000 + Math.random() * 90000).toString();
  };

  const login = async (email: string, password: string, userType: string) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, create a mock user
      const touristId = userType === 'tourist' ? generateTouristId() : undefined;
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        userType: userType as 'tourist' | 'police',
        fullName: email.split('@')[0],
        touristId
      };

      // Store in localStorage for persistence
      localStorage.setItem('utour_user', JSON.stringify(newUser));
      
      // Create tourist profile if user is a tourist
      if (userType === 'tourist' && touristId) {
        try {
          await supabase.from('tourist_profiles').insert({
            user_id: newUser.id,
            tourist_id: touristId,
            current_location: { lat: 30.0668, lng: 79.0193 }, // Dehradun coordinates
            destination: { lat: 30.7343, lng: 79.6897 }, // Kedarnath coordinates
            route_data: {
              checkpoints: [
                { id: 1, name: "Dehradun Start", lat: 30.0668, lng: 79.0193, completed: false },
                { id: 2, name: "Rishikesh Check", lat: 30.0869, lng: 78.2676, completed: false },
                { id: 3, name: "Devprayag Junction", lat: 30.1462, lng: 78.5962, completed: false },
                { id: 4, name: "Rudraprayag Stop", lat: 30.2849, lng: 78.9811, completed: false },
                { id: 5, name: "Guptkashi Rest", lat: 30.5330, lng: 79.0669, completed: false },
                { id: 6, name: "Kedarnath Temple", lat: 30.7343, lng: 79.6897, completed: false }
              ]
            },
            credit_score: 100,
            status: 'offline'
          });
        } catch (error) {
          console.error('Error creating tourist profile:', error);
        }
      }
      
      setUser(newUser);
      setIsLoading(false);
      
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: (error as Error).message };
    }
  };

  const logout = async () => {
    localStorage.removeItem('utour_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};