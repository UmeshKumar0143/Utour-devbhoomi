import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, ArrowLeft, Save, Send, Calendar, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

const PoliceFIR = () => {
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
            <span className="font-heading text-xl font-semibold">Generate FIR</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Generate <span className="text-secondary">FIR</span>
          </h1>
          <p className="text-muted-foreground">
            File a First Information Report for incidents involving tourists
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FIR Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Enter the fundamental details of the incident</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firNumber">FIR Number</Label>
                    <Input id="firNumber" value="FIR/2024/001523" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateTime">Date & Time of Incident</Label>
                    <Input id="dateTime" type="datetime-local" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location of Incident</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kedarnath">Kedarnath Temple Area</SelectItem>
                      <SelectItem value="badrinath">Badrinath Temple Area</SelectItem>
                      <SelectItem value="gangotri">Gangotri Temple Area</SelectItem>
                      <SelectItem value="yamunotri">Yamunotri Temple Area</SelectItem>
                      <SelectItem value="valley">Valley of Flowers</SelectItem>
                      <SelectItem value="rishikesh">Rishikesh</SelectItem>
                      <SelectItem value="haridwar">Haridwar</SelectItem>
                      <SelectItem value="corbett">Jim Corbett National Park</SelectItem>
                      <SelectItem value="nainital">Nainital</SelectItem>
                      <SelectItem value="mussoorie">Mussoorie</SelectItem>
                      <SelectItem value="other">Other Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specificLocation">Specific Location Details</Label>
                  <Input id="specificLocation" placeholder="Provide exact location details, landmarks, etc." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incidentType">Type of Incident</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theft">Theft/Robbery</SelectItem>
                      <SelectItem value="assault">Physical Assault</SelectItem>
                      <SelectItem value="fraud">Fraud/Cheating</SelectItem>
                      <SelectItem value="missing">Missing Person</SelectItem>
                      <SelectItem value="accident">Accident</SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="property">Property Damage</SelectItem>
                      <SelectItem value="drug">Drug Related</SelectItem>
                      <SelectItem value="cybercrime">Cybercrime</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Complainant Details */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Complainant Details
                </CardTitle>
                <CardDescription>Information about the person filing the complaint</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="complainantName">Full Name</Label>
                    <Input id="complainantName" placeholder="Enter complainant's full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complainantAge">Age</Label>
                    <Input id="complainantAge" type="number" placeholder="Enter age" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="complainantPhone">Phone Number</Label>
                    <Input id="complainantPhone" type="tel" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complainantEmail">Email Address</Label>
                    <Input id="complainantEmail" type="email" placeholder="email@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complainantAddress">Address</Label>
                  <Textarea id="complainantAddress" placeholder="Enter complete address" rows={2} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType">ID Document Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="license">Driving License</SelectItem>
                        <SelectItem value="voter">Voter ID</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input id="idNumber" placeholder="Enter ID number" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident Details */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Incident Details</CardTitle>
                <CardDescription>Detailed description of what happened</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="incidentDescription">Detailed Description of Incident</Label>
                  <Textarea 
                    id="incidentDescription" 
                    placeholder="Provide a comprehensive description of the incident, including sequence of events, people involved, and any other relevant details..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyLoss">Property Lost/Damaged (if applicable)</Label>
                  <Textarea 
                    id="propertyLoss" 
                    placeholder="List items lost, damaged, or stolen with approximate values..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witnessName">Witness Name (if any)</Label>
                    <Input id="witnessName" placeholder="Enter witness name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witnessContact">Witness Contact</Label>
                    <Input id="witnessContact" placeholder="Enter witness contact" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suspectDetails">Suspect Details (if known)</Label>
                  <Textarea 
                    id="suspectDetails" 
                    placeholder="Physical description, name, or any identifying information about the suspect(s)..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions and Evidence */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Actions Taken & Evidence</CardTitle>
                <CardDescription>Initial response and evidence collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="actionsTaken">Immediate Actions Taken</Label>
                  <Textarea 
                    id="actionsTaken" 
                    placeholder="Describe the immediate actions taken by the police, medical assistance provided, etc..."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Evidence Collected</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Photographs taken",
                      "Video recordings",
                      "Physical evidence collected",
                      "Witness statements recorded",
                      "Medical examination conducted",
                      "Digital evidence seized"
                    ].map((evidence, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`evidence-${index}`} />
                        <Label htmlFor={`evidence-${index}`} className="text-sm">{evidence}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalRemarks">Additional Remarks</Label>
                  <Textarea 
                    id="additionalRemarks" 
                    placeholder="Any additional information or remarks..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Officer Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Reporting Officer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Name:</span>
                  <p>Inspector Rajesh Kumar</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Badge Number:</span>
                  <p>UK-12345</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Station:</span>
                  <p>Kedarnath Police Station</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Date:</span>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* FIR Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">FIR Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Draft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Priority:</span>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Investigation Officer:</span>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Assign officer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si-sharma">SI Sharma</SelectItem>
                      <SelectItem value="inspector-verma">Inspector Verma</SelectItem>
                      <SelectItem value="hc-singh">HC Singh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button className="w-full bg-secondary hover:bg-secondary-light">
                  <Send className="mr-2 h-4 w-4" />
                  Submit FIR
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="shadow-card border-yellow-200">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-yellow-800">Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-yellow-700 space-y-2">
                <p>• Ensure all mandatory fields are filled accurately</p>
                <p>• Collect and preserve all physical evidence</p>
                <p>• Take detailed photographs of the scene</p>
                <p>• Record witness statements properly</p>
                <p>• Submit within 24 hours of incident</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceFIR;