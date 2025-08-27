import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  ArrowLeft, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info,
  Clock,
  MapPin,
  Volume2,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";

const TouristAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: "Green",
      title: "Weather Conditions Favorable",
      description: "Clear weather conditions for Char Dham Yatra. Perfect time for pilgrimage with mild temperatures and no precipitation expected.",
      location: "Char Dham Circuit",
      time: "2 hours ago",
      priority: "Low",
      category: "Weather"
    },
    // {
    //   id: 2,
    //   type: "Yellow",
    //   title: "High Tourist Influx Expected",
    //   description: "Heavy crowd expected at Badrinath Temple during weekend. Plan your visit early morning or late evening to avoid rush.",
    //   location: "Badrinath Temple",
    //   time: "4 hours ago",
    //   priority: "Medium",
    //   category: "Crowd Management"
    // },
    // {
    //   id: 3,
    //   type: "Red",
    //   title: "Route Temporarily Restricted",
    //   description: "Kedarnath helicopter service suspended due to adverse weather conditions. Alternative trekking route available with proper permits.",
    //   location: "Kedarnath Helipad",
    //   time: "6 hours ago",
    //   priority: "High",
    //   category: "Transportation"
    // },
    // {
    //   id: 4,
    //   type: "Blue",
    //   title: "New Facilities Available",
    //   description: "Free WiFi and medical facilities now available at Gangotri base camp. Emergency contact numbers updated.",
    //   location: "Gangotri",
    //   time: "1 day ago",
    //   priority: "Low",
    //   category: "Facilities"
    // },
    // {
    //   id: 5,
    //   type: "Yellow",
    //   title: "Traffic Advisory",
    //   description: "Slow moving traffic on NH7 due to road maintenance work. Expected delay of 2-3 hours. Plan accordingly.",
    //   location: "NH7 - Rishikesh to Joshimath",
    //   time: "1 day ago",
    //   priority: "Medium",
    //   category: "Traffic"
    // },
    // {
    //   id: 6,
    //   type: "Green",
    //   title: "Valley of Flowers Blooming Season",
    //   description: "Peak blooming season has started in Valley of Flowers. Over 300 species of flowers in full bloom. Best time for photography.",
    //   location: "Valley of Flowers National Park",
    //   time: "2 days ago",
    //   priority: "Low",
    //   category: "Seasonal"
    // },
    // {
    //   id: 7,
    //   type: "Red",
    //   title: "Flash Flood Warning",
    //   description: "Heavy rainfall in upper catchments may cause flash floods in river valleys. Avoid camping near riverbanks.",
    //   location: "Alaknanda River Valley",
    //   time: "3 days ago",
    //   priority: "High",
    //   category: "Safety"
    // },
    // {
    //   id: 8,
    //   type: "Blue",
    //   title: "Cultural Festival Starting",
    //   description: "Ganga Aarti timing extended during Kanwar Yatra season. Special arrangements for devotees with additional facilities.",
    //   location: "Har Ki Pauri, Haridwar",
    //   time: "3 days ago",
    //   priority: "Low",
    //   category: "Events"
    // }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "Green": return <CheckCircle className="h-5 w-5" />;
      case "Yellow": return <AlertCircle className="h-5 w-5" />;
      case "Red": return <XCircle className="h-5 w-5" />;
      case "Blue": return <Info className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "Green": return "bg-green-100 text-green-800 border-green-200";
      case "Yellow": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Red": return "bg-red-100 text-red-800 border-red-200";
      case "Blue": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/tourist-dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-heading text-xl font-semibold">Alerts & Safety</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Volume2 className="mr-2 h-4 w-4" />
              Audio Alerts
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Safety <span className="text-primary">Alerts</span> & Updates
          </h1>
          <p className="text-muted-foreground">
            Stay informed about current conditions, restrictions, and important updates for your journey
          </p>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">3</h3>
              <p className="text-sm text-muted-foreground">Safe Conditions</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg">2</h3>
              <p className="text-sm text-muted-foreground">Caution Advised</p>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg">2</h3>
              <p className="text-sm text-muted-foreground">Restricted Areas</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Info className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">1</h3>
              <p className="text-sm text-muted-foreground">General Updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search alerts by location, type, or keywords..." />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Alert Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="green">Safe (Green)</SelectItem>
                <SelectItem value="yellow">Caution (Yellow)</SelectItem>
                <SelectItem value="red">Restricted (Red)</SelectItem>
                <SelectItem value="blue">Information (Blue)</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
                <SelectItem value="facilities">Facilities</SelectItem>
                <SelectItem value="events">Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-6">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`shadow-card border-2 ${getAlertColor(alert.type)}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getAlertColor(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-heading text-lg font-semibold">{alert.title}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {alert.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {alert.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority} Priority
                        </Badge>
                        <Badge variant="outline">
                          {alert.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-foreground">{alert.description}</p>
                    
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Get Directions
                      </Button>
                      <Button variant="outline" size="sm">
                        Share Alert
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contacts */}
        <Card className="mt-8 shadow-card border-red-200">
          <CardHeader>
            <CardTitle className="font-heading text-red-800 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>Important numbers for emergencies and assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800">Police Emergency</h4>
                <p className="text-2xl font-bold text-red-600">100</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800">Medical Emergency</h4>
                <p className="text-2xl font-bold text-red-600">108</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800">Tourist Helpline</h4>
                <p className="text-2xl font-bold text-red-600">1363</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TouristAlerts;