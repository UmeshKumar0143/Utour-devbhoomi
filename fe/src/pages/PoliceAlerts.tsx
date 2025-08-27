import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ArrowLeft, Search, Filter, Clock, MapPin, Plus, Send, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PoliceAlerts = () => {
  const alertHistory = [
    {
      id: "ALT001",
      type: "Critical",
      title: "Flash Flood Warning Issued",
      description: "Heavy rainfall in upper catchments causing potential flash flood risk in Alaknanda valley",
      location: "Alaknanda River Valley",
      createdBy: "Inspector Kumar",
      timestamp: "2024-01-15 14:30",
      status: "Active",
      affectedTourists: 45,
      response: "Evacuation in progress"
    },
    {
      id: "ALT002", 
      type: "High",
      title: "Crowd Density Alert",
      description: "Tourist count at Kedarnath Temple exceeding safe capacity limits",
      location: "Kedarnath Temple",
      createdBy: "SI Sharma",
      timestamp: "2024-01-15 12:15",
      status: "Resolved",
      affectedTourists: 150,
      response: "Crowd dispersed successfully"
    },
    {
      id: "ALT003",
      type: "Medium",
      title: "Road Closure Notification",
      description: "NH7 blocked due to landslide, alternative routes suggested",
      location: "NH7 - Rishikesh to Joshimath",
      createdBy: "Constable Patel",
      timestamp: "2024-01-15 10:45",
      status: "Active",
      affectedTourists: 200,
      response: "Traffic diverted to alternate route"
    },
    {
      id: "ALT004",
      type: "Low",
      title: "Weather Advisory",
      description: "Light snowfall expected in higher altitudes, tourists advised to carry warm clothing",
      location: "Valley of Flowers",
      createdBy: "HC Singh",
      timestamp: "2024-01-15 08:30",
      status: "Active",
      affectedTourists: 30,
      response: "Advisory sent to all tourists"
    },
    {
      id: "ALT005",
      type: "High",
      title: "Medical Emergency Alert",
      description: "Tourist requiring immediate medical attention, helicopter rescue initiated",
      location: "Gangotri Glacier",
      createdBy: "Inspector Verma",
      timestamp: "2024-01-14 16:20",
      status: "Resolved",
      affectedTourists: 1,
      response: "Tourist safely evacuated"
    },
    {
      id: "ALT006",
      type: "Medium",
      title: "Wildlife Encounter Warning",
      description: "Bear sighting reported near trekking trail, tourists advised to avoid area",
      location: "Jim Corbett National Park",
      createdBy: "Forest Guard Thapa",
      timestamp: "2024-01-14 14:10",
      status: "Active",
      affectedTourists: 25,
      response: "Area cordoned off, patrol increased"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-orange-100 text-orange-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <AlertTriangle className="h-4 w-4" />;
      case "Resolved": return <CheckCircle className="h-4 w-4" />;
      case "Pending": return <Clock className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
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
            <span className="font-heading text-xl font-semibold">Alert Management</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="bg-secondary hover:bg-secondary-light">
              <Plus className="mr-2 h-4 w-4" />
              Create Alert
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert History */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                Alert <span className="text-secondary">History</span>
              </h1>
              <p className="text-muted-foreground">
                Track and manage all safety alerts and notifications
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search alerts by location, type, or keywords..." />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Alert Cards */}
            <div className="space-y-4">
              {alertHistory.map((alert) => (
                <Card key={alert.id} className={`shadow-card border-2 ${getTypeColor(alert.type)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge className={getTypeColor(alert.type)}>
                          {alert.type}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {getStatusIcon(alert.status)}
                          <span className="ml-1">{alert.status}</span>
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">#{alert.id}</span>
                    </div>

                    <h3 className="font-heading text-xl font-semibold mb-2">{alert.title}</h3>
                    <p className="text-muted-foreground mb-4">{alert.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {alert.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {alert.timestamp}
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Created by:</span>
                          <p>{alert.createdBy}</p>
                        </div>
                        <div>
                          <span className="font-medium">Affected Tourists:</span>
                          <p>{alert.affectedTourists} people</p>
                        </div>
                        <div>
                          <span className="font-medium">Response:</span>
                          <p>{alert.response}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                      <Button variant="outline" size="sm">
                        Send Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Create New Alert */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Alert
                </CardTitle>
                <CardDescription>Issue safety alerts and notifications to tourists</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alert Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kedarnath">Kedarnath Temple</SelectItem>
                      <SelectItem value="badrinath">Badrinath Temple</SelectItem>
                      <SelectItem value="gangotri">Gangotri Temple</SelectItem>
                      <SelectItem value="yamunotri">Yamunotri Temple</SelectItem>
                      <SelectItem value="valley">Valley of Flowers</SelectItem>
                      <SelectItem value="rishikesh">Rishikesh</SelectItem>
                      <SelectItem value="haridwar">Haridwar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Alert Title</label>
                  <Input placeholder="Enter alert title" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe the situation and provide necessary instructions..." rows={4} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Affected Tourists</label>
                  <Input type="number" placeholder="Enter number of affected tourists" />
                </div>

                <Button className="w-full bg-secondary hover:bg-secondary-light">
                  <Send className="mr-2 h-4 w-4" />
                  Send Alert
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Alert Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Alerts</span>
                  <Badge className="bg-orange-100 text-orange-800">4</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resolved Today</span>
                  <Badge className="bg-green-100 text-green-800">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Critical Alerts</span>
                  <Badge className="bg-red-100 text-red-800">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total This Week</span>
                  <Badge variant="outline">28</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="shadow-card border-red-200">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-red-800">Emergency Protocols</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full text-red-600 border-red-200">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Emergency Response Team
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200">
                  Medical Emergency Unit
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200">
                  Disaster Management Cell
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceAlerts;