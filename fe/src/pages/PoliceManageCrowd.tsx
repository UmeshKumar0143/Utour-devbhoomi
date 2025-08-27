import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Filter, ArrowLeft, AlertTriangle, Eye, MessageSquare, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const PoliceManageCrowd = () => {
  const crowdData = [
    { id: "TID001", name: "Rajesh Kumar", location: "Kedarnath Temple", entryTime: "09:30 AM", status: "Active", riskLevel: "Low", group: "4 people" },
    { id: "TID002", name: "Priya Sharma", location: "Badrinath Temple", entryTime: "08:15 AM", status: "Active", riskLevel: "Medium", group: "2 people" },
    { id: "TID003", name: "Amit Patel", location: "Valley Trek", entryTime: "07:45 AM", status: "Delayed", riskLevel: "High", group: "6 people" },
    { id: "TID004", name: "Sunita Devi", location: "Gangotri Temple", entryTime: "10:00 AM", status: "Active", riskLevel: "Low", group: "8 people" },
    { id: "TID005", name: "Vikram Singh", location: "Yamunotri Route", entryTime: "06:30 AM", status: "Completed", riskLevel: "Low", group: "3 people" },
    { id: "TID006", name: "Maya Gupta", location: "Rishikesh Ghat", entryTime: "11:20 AM", status: "Active", riskLevel: "Medium", group: "1 person" },
    { id: "TID007", name: "Karan Mehta", location: "Haridwar Ghat", entryTime: "09:00 AM", status: "Active", riskLevel: "Low", group: "5 people" },
    { id: "TID008", name: "Deepika Roy", location: "Jim Corbett Park", entryTime: "07:00 AM", status: "Active", riskLevel: "Low", group: "4 people" },
    { id: "TID009", name: "Rahul Joshi", location: "Nainital Lake", entryTime: "10:45 AM", status: "Active", riskLevel: "Low", group: "2 people" },
    { id: "TID010", name: "Anjali Reddy", location: "Mussoorie Hills", entryTime: "08:30 AM", status: "Delayed", riskLevel: "Medium", group: "3 people" }
  ];

  const locationStats = [
    { location: "Kedarnath Temple", current: 1250, capacity: 1500, alert: "Normal" },
    { location: "Badrinath Temple", current: 980, capacity: 1200, alert: "Normal" },
    { location: "Gangotri Temple", current: 750, capacity: 800, alert: "High" },
    { location: "Valley of Flowers", current: 120, capacity: 150, alert: "High" },
    { location: "Rishikesh Ghat", current: 2100, capacity: 2500, alert: "Normal" },
    { location: "Haridwar Ghat", current: 3200, capacity: 3000, alert: "Critical" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Delayed": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertColor = (alert: string) => {
    switch (alert) {
      case "Normal": return "bg-green-100 text-green-800";
      case "High": return "bg-yellow-100 text-yellow-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCrowdPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
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
            <span className="font-heading text-xl font-semibold">Crowd Management</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Send Alert
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Crowd <span className="text-secondary">Management</span> System
          </h1>
          <p className="text-muted-foreground">
            Monitor tourist movement, density, and safety across all locations
          </p>
        </div>

        {/* Location Capacity Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {locationStats.map((location, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-heading text-lg">{location.location}</CardTitle>
                  <Badge className={getAlertColor(location.alert)}>
                    {location.alert}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Occupancy</span>
                    <span className="font-semibold">{location.current} / {location.capacity}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        getCrowdPercentage(location.current, location.capacity) > 90 
                          ? 'bg-red-500' 
                          : getCrowdPercentage(location.current, location.capacity) > 70 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${getCrowdPercentage(location.current, location.capacity)}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">
                      {getCrowdPercentage(location.current, location.capacity)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tourist Tracking Table */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-heading flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Active Tourist Tracking
                </CardTitle>
                <CardDescription>Real-time monitoring of tourist IDs and locations</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Export Data</Button>
                <Button variant="outline" size="sm">Refresh</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search by Tourist ID, Name, or Location..." />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tourist ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Current Location</TableHead>
                    <TableHead>Entry Time</TableHead>
                    <TableHead>Group Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crowdData.map((tourist) => (
                    <TableRow key={tourist.id}>
                      <TableCell className="font-medium">{tourist.id}</TableCell>
                      <TableCell>{tourist.name}</TableCell>
                      <TableCell>{tourist.location}</TableCell>
                      <TableCell>{tourist.entryTime}</TableCell>
                      <TableCell>{tourist.group}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(tourist.status)}>
                          {tourist.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(tourist.riskLevel)}>
                          {tourist.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <AlertTriangle className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary mb-2">2,847</div>
              <p className="text-sm text-muted-foreground">Total Active Tourists</p>
            </CardContent>
          </Card>
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600 mb-2">23</div>
              <p className="text-sm text-muted-foreground">Delayed Tourists</p>
            </CardContent>
          </Card>
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600 mb-2">5</div>
              <p className="text-sm text-muted-foreground">High Risk Cases</p>
            </CardContent>
          </Card>
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600 mb-2">156</div>
              <p className="text-sm text-muted-foreground">Completed Safely</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoliceManageCrowd;