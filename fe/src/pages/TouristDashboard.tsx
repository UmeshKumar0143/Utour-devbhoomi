// components/TouristDashboard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Bell, Map, User, LogOut, Volume2, VolumeX, Plus, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SimulationMap from "@/components/SimulationMap";
import touristBackground from "@/assests/tourist-map-bg.jpg";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useCurrentUser } from "@/store/useCurrentUser";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/config";
import { Trip } from "@/lib/types";



const TouristDashboard = () => {
  const { user, clearUser } = useCurrentUser();
  const { speak, isPlaying, stop } = useTextToSpeech();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);




  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/users/trips/cmeto1ncm00007mbutoip0iqp`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
        setTrips(data.trips || []);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTrips();
  }, []);

  const quickActions = [
    { icon: Calendar, title: "View Plans", description: "Browse available tour packages", link: "/tourist-dashboard/view-plans" },
    { icon: Plus, title: "Book New Trip", description: "Plan your spiritual journey", link: "/tourist-dashboard/book-plan", highlight: true },
    { icon: Map, title: "Map & Navigation", description: "Navigate to destinations", link: "/tourist-dashboard/map", disabled: trips.length === 0 },
    { icon: Bell, title: "Alerts & Safety", description: "Latest safety updates", link: "/tourist-dashboard/alerts" },
  ];

  const alerts = [
    { type: "Green", message: "Weather conditions are favorable for Char Dham Yatra", time: "2 hours ago" },
    { type: "Blue", message: "New safety guidelines published for high-altitude treks", time: "4 hours ago" },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "Green": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "Yellow": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "Red": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "Blue": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        clearUser();

        toast({
          title: "Logged out successfully",
          description: "See you again soon!",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${touristBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-card border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="font-heading text-2xl font-bold text-primary">
                Utour
              </Link>
              <span className="text-muted-foreground">Tourist Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => {
                  if (isPlaying) {
                    stop();
                  } else {
                    speak(`Welcome to Uttarakhand Tourism Safety Platform, ${user?.name || "Tourist"}! You can use this dashboard to plan your routes, view safety alerts, and explore tourist attractions safely.`);
                  }
                }}
                variant="outline"
                size="sm"
              >
                {isPlaying ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                {isPlaying ? "Stop Audio" : "Listen to Guide"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name || "Devotee"}! 🙏
            </h1>
            <p className="text-muted-foreground">
              Plan your divine journey through the sacred lands of Uttarakhand
            </p>
          </div>

          {/* Conditional Content Based on Trips */}
          {!isLoading && trips.length === 0 ? (
            // Show Book Trip CTA when no trips
            <div className="mb-8">
              <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 rounded-full bg-primary/10">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-heading text-2xl font-semibold mb-4">Start Your Spiritual Journey</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't booked any trips yet. Explore our sacred destinations and plan your perfect pilgrimage through Uttarakhand's divine landscapes.
                  </p>
                  <Link to="/tourist-dashboard/book-plan">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-5 w-5" />
                      Book Your First Trip
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Show Simulation Map when user has trips
            !isLoading && trips.length > 0 && (
              <Card className="mb-8 shadow-card border-primary/20">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-primary">🎯 Route Simulation Demo</CardTitle>
                  <CardDescription>Experience live tracking and real-time navigation system</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimulationMap />
                </CardContent>
              </Card>
            )
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => {
              const isDisabled = action.disabled;
              const CardWrapper = isDisabled ? 'div' : Link;
              const cardProps = isDisabled ? {} : { to: action.link };

              return (
                <CardWrapper key={index} {...cardProps}>
                  <Card className={`transition-all duration-300 ${isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : action.highlight
                        ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer border-primary/30 bg-primary/5'
                        : 'hover:shadow-card hover:-translate-y-1 cursor-pointer'
                    }`}>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className={`p-3 rounded-full ${action.highlight ? 'bg-primary/20' : 'bg-primary/10'
                          }`}>
                          <action.icon className={`h-6 w-6 ${action.highlight ? 'text-primary' : 'text-primary'
                            }`} />
                        </div>
                      </div>
                      <h3 className="font-heading text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      {isDisabled && (
                        <p className="text-xs text-red-500 mt-2">Book a trip first to access this feature</p>
                      )}
                    </CardContent>
                  </Card>
                </CardWrapper>
              );
            })}
          </div>
            
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
         <Card className="shadow-card">
  <CardHeader>
    <CardTitle className="font-heading">Your Trips</CardTitle>
    <CardDescription>
      {trips.length > 0 ? "Your upcoming spiritual journeys" : "No trips booked yet"}
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {isLoading ? (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ) : trips.length > 0 ? (
      trips.slice(0, 3).map((trip, index) => (
        <div
          key={trip.id || index}
          className="flex justify-between items-center p-4 bg-muted/30 rounded-lg"
        >
          <div>
            <h4 className="font-semibold">{trip.destination || trip.entryPoint}</h4>
            <p className="text-sm text-muted-foreground">
              {trip.date || new Date(trip.entryDate).toLocaleDateString()} •{" "}
              {trip.type || trip.nationality}
            </p>
          </div>
          <Badge variant={trip.status === "Confirmed" ? "default" : "secondary"}>
            {trip.status}
          </Badge>
        </div>
      ))
    ) : (
      <div className="text-center py-8 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No trips booked yet</p>
        <Link to="/tourist-dashboard/book-plan">
          <Button variant="outline" size="sm" className="mt-2">
            Book Your First Trip
          </Button>
        </Link>
      </div>
    )}
  </CardContent>
</Card>


            {/* Latest Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Safety Alerts</CardTitle>
                <CardDescription>Stay informed about current conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Badge className={getAlertColor(alert.type)}>{alert.type}</Badge>
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Language Support */}
          <Card className="mt-8 shadow-card">
            <CardHeader>
              <CardTitle className="font-heading">Multilingual Support</CardTitle>
              <CardDescription>Choose your preferred language for better experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["English", "हिंदी", "ગુજરાતી", "ਪੰਜਾਬੀ", "বাংলা", "தமிழ்"].map((lang, index) => (
                  <Button key={index} variant="outline" size="sm">
                    {lang}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;