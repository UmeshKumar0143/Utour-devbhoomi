import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, ArrowLeft, Search, Filter, CheckCircle, AlertCircle, Info, XCircle, Clock, User, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Notifications = () => {
  const notifications = [
    {
      id: "NOT001",
      type: "Green",
      title: "Weather Update: Clear Conditions",
      message: "Perfect weather conditions for Char Dham Yatra. Temperature: 18°C, Clear skies, Light breeze. Ideal for pilgrimage activities.",
      recipient: "All Active Tourists",
      location: "Char Dham Circuit",
      timestamp: "2024-01-15 14:30",
      status: "Sent",
      priority: "Low",
      readCount: 1247,
      totalSent: 1350
    },
    {
      id: "NOT002", 
      type: "Yellow",
      title: "Crowd Advisory: High Density Expected",
      message: "Heavy tourist influx expected at Badrinath Temple during weekend. Plan your visit early morning (5-7 AM) or late evening (6-8 PM) to avoid crowds.",
      recipient: "Badrinath Visitors",
      location: "Badrinath Temple",
      timestamp: "2024-01-15 12:15",
      status: "Sent",
      priority: "Medium",
      readCount: 892,
      totalSent: 950
    },
    {
      id: "NOT003",
      type: "Red",
      title: "URGENT: Route Temporarily Closed",
      message: "Kedarnath helicopter service suspended due to adverse weather. Alternative trekking route available with mandatory guide. Contact local authorities for permits.",
      recipient: "Kedarnath Bound Tourists",
      location: "Kedarnath Helipad",
      timestamp: "2024-01-15 10:45",
      status: "Sent",
      priority: "Critical",
      readCount: 234,
      totalSent: 278
    },
    {
      id: "NOT004",
      type: "Blue",
      title: "New Facility Alert: Medical Center Operational",
      message: "New 24/7 medical facility now operational at Gangotri base camp. Emergency contact: +91-94120-XXXXX. Free basic medical consultation available.",
      recipient: "Gangotri Area Tourists",
      location: "Gangotri",
      timestamp: "2024-01-15 09:20",
      status: "Sent",
      priority: "Low",
      readCount: 156,
      totalSent: 180
    },
    {
      id: "NOT005",
      type: "Yellow",
      title: "Traffic Advisory: Expect Delays",
      message: "Road maintenance work on NH7 between Rishikesh and Joshimath. Expected delay: 2-3 hours. Alternative route via Kotdwar suggested.",
      recipient: "NH7 Route Travelers",
      location: "NH7 - Rishikesh to Joshimath",
      timestamp: "2024-01-15 08:15",
      status: "Sent",
      priority: "Medium",
      readCount: 567,
      totalSent: 620
    },
    {
      id: "NOT006",
      type: "Green",
      title: "Valley of Flowers: Peak Blooming Season",
      message: "Over 300 flower species in full bloom! Best photography opportunities between 7 AM - 10 AM. Guided tours available at entry point.",
      recipient: "Nature Enthusiasts",
      location: "Valley of Flowers National Park",
      timestamp: "2024-01-14 16:30",
      status: "Sent",
      priority: "Low",
      readCount: 423,
      totalSent: 445
    },
    {
      id: "NOT007",
      type: "Red",
      title: "EMERGENCY: Flash Flood Warning",
      message: "Immediate evacuation advised for tourists camping near Alaknanda riverbanks. Move to higher ground immediately. Emergency helpline: 1363",
      recipient: "Alaknanda Valley Campers",
      location: "Alaknanda River Valley",
      timestamp: "2024-01-14 14:20",
      status: "Sent",
      priority: "Critical",
      readCount: 67,
      totalSent: 78
    },
    {
      id: "NOT008",
      type: "Blue",
      title: "Cultural Event: Extended Ganga Aarti",
      message: "Special extended Ganga Aarti ceremony during Kanwar Yatra season. Timings: 6:30 PM - 8:00 PM. Additional seating arrangements available.",
      recipient: "Haridwar Visitors",
      location: "Har Ki Pauri, Haridwar",
      timestamp: "2024-01-14 12:10",
      status: "Sent",
      priority: "Low",
      readCount: 789,
      totalSent: 823
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Green": return <CheckCircle className="h-5 w-5" />;
      case "Yellow": return <AlertCircle className="h-5 w-5" />;
      case "Red": return <XCircle className="h-5 w-5" />;
      case "Blue": return <Info className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
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
      case "Critical": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getReadPercentage = (readCount: number, totalSent: number) => {
    return Math.round((readCount / totalSent) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/police-dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Police Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-heading text-xl font-semibold">Notifications Center</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="bg-primary hover:bg-primary-glow">
              <Bell className="mr-2 h-4 w-4" />
              Send New Alert
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Notification <span className="text-primary">Center</span>
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all tourist notifications and alerts across Uttarakhand
          </p>
        </div>

        {/* Notification Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">3</h3>
              <p className="text-sm text-muted-foreground">Safe Notifications</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg">2</h3>
              <p className="text-sm text-muted-foreground">Advisory Alerts</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-red-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg">2</h3>
              <p className="text-sm text-muted-foreground">Emergency Alerts</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Info className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">1</h3>
              <p className="text-sm text-muted-foreground">Info Updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search notifications by location, type, or content..." />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Notification Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="green">Safe (Green)</SelectItem>
                <SelectItem value="yellow">Advisory (Yellow)</SelectItem>
                <SelectItem value="red">Emergency (Red)</SelectItem>
                <SelectItem value="blue">Information (Blue)</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`shadow-card border-2 ${getTypeColor(notification.type)}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-heading text-xl font-semibold">{notification.title}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {notification.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {notification.timestamp}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-1 h-3 w-3" />
                            {notification.recipient}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority} Priority
                        </Badge>
                        <Badge variant="outline">
                          {notification.status}
                        </Badge>
                        <Badge variant="outline">
                          #{notification.id}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-foreground">{notification.message}</p>
                    </div>
                    
                    {/* Delivery Statistics */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{notification.totalSent}</div>
                          <p className="text-sm text-blue-700">Total Sent</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{notification.readCount}</div>
                          <p className="text-sm text-green-700">Read</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{getReadPercentage(notification.readCount, notification.totalSent)}%</div>
                          <p className="text-sm text-muted-foreground">Read Rate</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Resend
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit & Send Again
                      </Button>
                      <Button variant="outline" size="sm">
                        View Recipients
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Statistics */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle className="font-heading">Notification Analytics</CardTitle>
            <CardDescription>Overall performance metrics for tourist communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4,523</div>
                <p className="text-sm text-muted-foreground">Total Notifications Sent</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">87.2%</div>
                <p className="text-sm text-muted-foreground">Average Read Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1.8s</div>
                <p className="text-sm text-muted-foreground">Average Delivery Time</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">23</div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;