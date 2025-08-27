import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { MapPin, Calendar, Bell, Map, User, LogOut, Volume2, Mic } from "lucide-react";
import { MapPin, Calendar, Bell, Map, User, LogOut, Volume2, Mic, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SimulationMap from "@/components/SimulationMap";
import touristBackground from "@/assets/tourist-map-bg.jpg";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

const TouristDashboard = () => {
  const { user, logout } = useAuth();
   const { speak, isPlaying, stop } = useTextToSpeech();
  const quickActions = [
    { icon: Calendar, title: "View Plans", description: "Browse available tour packages", link: "/tourist-dashboard/view-plans" },
    { icon: MapPin, title: "Book Plan", description: "Reserve your spiritual journey", link: "/tourist-dashboard/book-plan" },
    { icon: Map, title: "Map & Navigation", description: "Navigate to destinations", link: "/tourist-dashboard/map" },
    { icon: Bell, title: "Alerts & Safety", description: "Latest safety updates", link: "/tourist-dashboard/alerts" }
  ];

  const recentBookings = [
    { destination: "Kedarnath Temple", date: "2025-08-27", status: "Confirmed", type: "Pilgrimage" },
    // { destination: "Valley of Flowers", date: "2024-04-02", status: "Pending", type: "Trekking" },
    // { destination: "Rishikesh Ganga Aarti", date: "2024-03-20", status: "Confirmed", type: "Spiritual" }
  ];

  const alerts = [
    { type: "Green", message: "Weather conditions are favorable for Char Dham Yatra", time: "2 hours ago" },
    
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "Green": return "bg-green-100 text-green-800";
      case "Yellow": return "bg-yellow-100 text-yellow-800";
      case "Red": return "bg-red-100 text-red-800";
      case "Blue": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${touristBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
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
                    speak(`Welcome to Uttarakhand Tourism Safety Platform, ${user?.fullName || 'Tourist'}! You can use this dashboard to plan your routes, view safety alerts, and explore tourist attractions safely.`);
                  }
                }}
                variant="outline" 
                size="sm"
              >
                {isPlaying ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Stop Audio' : 'Listen to Guide'}
              </Button>
              {/* <Button variant="outline" size="sm">
                <Mic className="mr-2 h-4 w-4" />
                Voice Record
              </Button> */}
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.fullName || 'Devotee'}! 🙏
            </h1>
            <p className="text-muted-foreground">
              Tourist ID: <span className="font-mono font-semibold text-primary">{user?.touristId || 'Not Assigned'}</span> | 
              Plan your divine journey through the sacred lands of Uttarakhand
            </p>
          </div>

          {/* Simulation Demo Section */}
          <Card className="mb-8 shadow-card border-primary/20">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-primary">🎯 Route Simulation Demo</CardTitle>
              <CardDescription>Experience live tracking and real-time navigation system</CardDescription>
            </CardHeader>
            <CardContent>
              <SimulationMap viewMode="tourist" />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-full bg-primary/10">
                        <action.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Recent Bookings</CardTitle>
                <CardDescription>Your upcoming spiritual journeys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{booking.destination}</h4>
                      <p className="text-sm text-muted-foreground">{booking.date} • {booking.type}</p>
                    </div>
                    <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Latest Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Safety Alerts</CardTitle>
                <CardDescription>Stay informed about conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Badge className={getAlertColor(alert.type)}>
                      {alert.type}
                    </Badge>
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