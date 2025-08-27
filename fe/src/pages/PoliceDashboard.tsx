import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, AlertTriangle, BarChart3, Shield, LogOut, Bell, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SimulationMap from "@/components/SimulationMap";
import policeBackground from "@/assets/police-dashboard-bg.jpg";

const PoliceDashboard = () => {
  const { user, logout } = useAuth();
  const quickActions = [
    { icon: Users, title: "Manage Crowd", description: "Monitor tourist density", link: "/police-dashboard/manage-crowd", color: "bg-blue-100 text-blue-800" },
    { icon: AlertTriangle, title: "View Alerts", description: "Check safety alerts", link: "/police-dashboard/alerts", color: "bg-yellow-100 text-yellow-800" },
    { icon: FileText, title: "Generate FIR", description: "File incident reports", link: "/police-dashboard/fir", color: "bg-red-100 text-red-800" },
    { icon: BarChart3, title: "AI Monitoring", description: "View analytics", link: "/monitoring", color: "bg-green-100 text-green-800" }
  ];

  const currentAlerts = [
    { id: 1, type: "High", location: "Kedarnath Temple", message: "Crowd density exceeding safe limits", time: "5 min ago" },
    { id: 2, type: "Medium", location: "Badrinath Route", message: "Traffic congestion reported", time: "15 min ago" },
    { id: 3, type: "Low", location: "Rishikesh Ghat", message: "Normal crowd flow", time: "30 min ago" },
    { id: 4, type: "High", location: "Valley Trek", message: "Weather conditions deteriorating", time: "45 min ago" }
  ];

  const recentActivity = [
    { action: "FIR Generated", location: "Gangotri", officer: "SI Sharma", time: "2 hours ago", status: "Processed" },
    { action: "Crowd Alert", location: "Kedarnath", officer: "Constable Patel", time: "4 hours ago", status: "Resolved" },
    { action: "Route Blocked", location: "NH7", officer: "Inspector Kumar", time: "6 hours ago", status: "Active" },
    { action: "Tourist Assistance", location: "Badrinath", officer: "HC Singh", time: "8 hours ago", status: "Completed" }
  ];

  const touristStats = {
    totalToday: 8,
    currentlyActive: 4,
    alertsGenerated: 2,
    incidentsResolved: 0
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-orange-100 text-orange-800";
      case "Processed": return "bg-blue-100 text-blue-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${policeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-card border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="font-heading text-2xl font-bold text-secondary">
                Utour Police
              </Link>
              <span className="text-muted-foreground">Control Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Radio className="mr-2 h-4 w-4" />
                Emergency Radio
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Alerts
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="mr-2 h-4 w-4" />
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
              Welcome, {user?.fullName || 'Officer'}! 👮‍♂️
            </h1>
            <p className="text-muted-foreground">
              Monitor and ensure tourist safety across Uttarakhand
            </p>
          </div>

          {/* Simulation Demo Section */}
          <Card className="mb-8 shadow-card border-secondary/20">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-secondary">🎯 Live Route Simulation</CardTitle>
              <CardDescription>Monitor all tourists in real-time with advanced tracking system</CardDescription>
            </CardHeader>
            <CardContent>
              <SimulationMap viewMode="police" />
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{touristStats.totalToday.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Tourists Today</p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{touristStats.currentlyActive.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Currently Active</p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{touristStats.alertsGenerated}</div>
                <p className="text-sm text-muted-foreground">Alerts Generated</p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{touristStats.incidentsResolved}</div>
                <p className="text-sm text-muted-foreground">Incidents Resolved</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className={`p-3 rounded-full ${action.color}`}>
                        <action.icon className="h-6 w-6" />
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
            {/* Current Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Live Alerts
                </CardTitle>
                <CardDescription>Real-time safety and crowd monitoring alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Badge className={getAlertColor(alert.type)}>
                      {alert.type}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm">{alert.location}</h4>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          Respond
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Delegate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Recent Activity</CardTitle>
                <CardDescription>Latest actions taken by the police force</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* {recentActivity.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">{activity.action}</h4>
                      <p className="text-xs text-muted-foreground">{activity.location} • {activity.officer}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))} */}
              </CardContent>
            </Card>
          </div>

          {/* Jurisdiction Map */}
          <Card className="mt-8 shadow-card">
            <CardHeader>
              <CardTitle className="font-heading">Jurisdiction Overview</CardTitle>
              <CardDescription>Real-time monitoring of your patrol area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Shield className="h-12 w-12 text-secondary mx-auto" />
                  <h3 className="font-semibold">Live Jurisdiction Map</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive map showing current patrol areas, tourist hotspots, and incident locations
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <Badge variant="outline">Tourist Density</Badge>
                    <Badge variant="outline">Patrol Routes</Badge>
                    <Badge variant="outline">Incident Markers</Badge>
                    <Badge variant="outline">Emergency Points</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;