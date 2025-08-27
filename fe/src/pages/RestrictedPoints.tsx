import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ArrowLeft, Search, Filter, MapPin, Clock, Plus, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const RestrictedPoints = () => {
  const restrictedAreas = [
    {
      id: "RES001",
      name: "Kedarnath Landslide Zone",
      location: "Kedarnath Temple - 2km North",
      coordinates: "30.7346° N, 79.0669° E",
      reason: "Unstable terrain due to recent landslides",
      severity: "Critical",
      dateAdded: "2024-01-10",
      radius: "500m",
      status: "Active",
      affectedTourists: 0,
      lastUpdated: "2 hours ago",
      restrictions: "Complete area closure, no entry permitted"
    },
    {
      id: "RES002",
      name: "Gangotri Glacier Danger Zone",
      location: "Gangotri Glacier - Gomukh Area",
      coordinates: "30.9159° N, 79.0883° E",
      reason: "Glacier instability and crevasse formation",
      severity: "High",
      dateAdded: "2024-01-05",
      radius: "1km",
      status: "Active",
      affectedTourists: 0,
      lastUpdated: "6 hours ago",
      restrictions: "Guided access only with special permits"
    },
    {
      id: "RES003",
      name: "Valley of Flowers - Eastern Trail",
      location: "Valley of Flowers National Park",
      coordinates: "30.7268° N, 79.6152° E",
      reason: "Wildlife breeding season protection",
      severity: "Medium",
      dateAdded: "2024-01-01",
      radius: "2km",
      status: "Seasonal",
      affectedTourists: 15,
      lastUpdated: "1 day ago",
      restrictions: "Restricted during March-May breeding season"
    },
    {
      id: "RES004",
      name: "Badrinath Avalanche Zone",
      location: "Badrinath - Mana Village Route",
      coordinates: "30.7433° N, 79.4938° E",
      reason: "High avalanche risk after heavy snowfall",
      severity: "Critical",
      dateAdded: "2024-01-12",
      radius: "800m",
      status: "Active",
      affectedTourists: 3,
      lastUpdated: "4 hours ago",
      restrictions: "Complete closure until snow conditions improve"
    },
    {
      id: "RES005",
      name: "Yamunotri River Crossing",
      location: "Yamunotri Temple - River Crossing Point",
      coordinates: "31.0111° N, 78.4419° E",
      reason: "Flash flood risk due to heavy monsoon",
      severity: "High",
      dateAdded: "2024-01-08",
      radius: "300m",
      status: "Temporary",
      affectedTourists: 0,
      lastUpdated: "12 hours ago",
      restrictions: "Temporary bridge closure, alternate route provided"
    },
    {
      id: "RES006",
      name: "Jim Corbett Core Zone Buffer",
      location: "Jim Corbett National Park - Core Area",
      coordinates: "29.5943° N, 78.7568° E",
      reason: "Tiger movement and breeding area protection",
      severity: "Medium",
      dateAdded: "2023-12-20",
      radius: "5km",
      status: "Permanent",
      affectedTourists: 0,
      lastUpdated: "1 week ago",
      restrictions: "No tourist access, conservation area only"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";  
      case "Low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-red-100 text-red-800";
      case "Temporary": return "bg-yellow-100 text-yellow-800";
      case "Seasonal": return "bg-blue-100 text-blue-800";
      case "Permanent": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
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
            <span className="font-heading text-xl font-semibold">Restricted Points</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Restriction
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Restricted <span className="text-red-600">Areas</span> Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage restricted zones for tourist safety across Uttarakhand
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">3</div>
              <p className="text-sm text-muted-foreground">Critical Restrictions</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">2</div>
              <p className="text-sm text-muted-foreground">High Risk Areas</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-yellow-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">18</div>
              <p className="text-sm text-muted-foreground">Affected Tourists</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
              <p className="text-sm text-muted-foreground">Total Restrictions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restricted Areas List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search by location, reason, or coordinates..." />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
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
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Restricted Areas Cards */}
            <div className="space-y-6">
              {restrictedAreas.map((area) => (
                <Card key={area.id} className={`shadow-card border-2 ${getSeverityColor(area.severity)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getSeverityColor(area.severity)}`}>
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-semibold">{area.name}</h3>
                          <p className="text-sm text-muted-foreground">{area.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getSeverityColor(area.severity)}>
                          {area.severity}
                        </Badge>
                        <Badge className={getStatusColor(area.status)}>
                          {area.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg mb-4">
                      <p className="font-medium text-sm mb-2">Reason for Restriction:</p>
                      <p className="text-sm text-muted-foreground">{area.reason}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="font-medium">Coordinates:</span>
                        <p className="text-muted-foreground">{area.coordinates}</p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Restriction Radius:</span>
                        <p className="text-muted-foreground">{area.radius}</p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Date Added:</span>
                        <p className="text-muted-foreground">{area.dateAdded}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Current Restrictions:</p>
                          <p className="text-sm text-yellow-700">{area.restrictions}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span>Affected: {area.affectedTourists} tourists</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>Updated: {area.lastUpdated}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">#{area.id}</span>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-3 w-3" />
                        View on Map
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Send Alert
                      </Button>
                      {area.status === "Temporary" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Lift Restriction
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add New Restriction */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading flex items-center text-red-800">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Restriction
                </CardTitle>
                <CardDescription>Create a new restricted area for tourist safety</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location Name</label>
                  <Input placeholder="Enter location name" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity Level</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
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
                  <label className="text-sm font-medium">Coordinates</label>
                  <Input placeholder="Latitude, Longitude" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Restriction Radius</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100m">100 meters</SelectItem>
                      <SelectItem value="500m">500 meters</SelectItem>
                      <SelectItem value="1km">1 kilometer</SelectItem>
                      <SelectItem value="2km">2 kilometers</SelectItem>
                      <SelectItem value="5km">5 kilometers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason</label>
                  <Textarea placeholder="Describe the reason for restriction..." rows={3} />
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Create Restriction
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Actions */}
            <Card className="shadow-card border-red-200">
              <CardHeader>
                <CardTitle className="font-heading text-red-800">Emergency Actions</CardTitle>
                <CardDescription>Quick actions for immediate restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full text-red-600 border-red-200">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Mass Evacuation Alert
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200">
                  Weather Emergency
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200">
                  Geological Hazard
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200">
                  Wildlife Encounter
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Restrictions</span>
                  <Badge className="bg-red-100 text-red-800">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lifted Restrictions</span>
                  <Badge className="bg-green-100 text-green-800">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Updated Areas</span>
                  <Badge className="bg-blue-100 text-blue-800">3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Alerts Sent</span>
                  <Badge variant="outline">45</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestrictedPoints;