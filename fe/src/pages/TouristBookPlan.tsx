import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, ArrowLeft, Users, CreditCard, Shield, Info, QrCode, Download, Copy, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useCurrentUser } from "@/store/useCurrentUser";
import { BACKEND_URL } from "@/config";

const TouristBookPlan = () => {

  const user = useCurrentUser((state)=>state.user); 


  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    travelers: '',
    ageGroup: '',
    dateOfBirth: '',
    nationality: 'Indian',
    aadhaarNumber: '',
    gender: '',
    profileImage: '',
    entryPoint: '',
    expectedExitDate: '',
    flexibility: '',
    specialRequirements: [],
    additionalRequests: '',
    emergencyContacts: [
      { name: '', phone: '', email: '', relationship: '', isPrimary: true }
    ]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [digitalId, setDigitalId] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedPlan = {
    title: "Char Dham Yatra Complete Package",
    price: 45000,
    duration: "12 days",
    category: "Pilgrimage",
    id: "trip-12345" // This would come from props or route params in real app
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (requirement, checked) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: checked 
        ? [...prev.specialRequirements, requirement]
        : prev.specialRequirements.filter(req => req !== requirement)
    }));
  };

  const handleEmergencyContactChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', email: '', relationship: '', isPrimary: false }]
    }));
  };

  const generateQRCode = (digitalIdData) => {
    const qrData = {
      digitalId: digitalIdData.digitalId,
      name: `${digitalIdData.firstName} ${digitalIdData.lastName}`,
      aadhaar: digitalIdData.aadhaarNumber,
      entryPoint: digitalIdData.entryPoint,
      entryDate: digitalIdData.entryDate,
      blockchainHash: digitalIdData.blockchainHash,
      verificationUrl: `https://verify.tourist-id.gov.in/${digitalIdData.digitalId}`
    };
    
    const qrString = encodeURIComponent(JSON.stringify(qrData));
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrString}`;
    setQrCodeUrl(qrUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      
      const token = cookieStore.get('token'); 
      const response = await fetch(`${BACKEND_URL}/users/trip/${user.id}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          aadhaarNumber: formData.aadhaarNumber,
          gender: formData.gender,
          profileImage: formData.profileImage,
          entryPoint: formData.entryPoint,
          expectedExitDate: formData.expectedExitDate || null,
          emergencyContacts: formData.emergencyContacts.filter(contact => contact.name && contact.phone)
        })
      });

      const result = await response.json();

      if (response.ok) {
        setDigitalId(result.tourist);
        generateQRCode(result.tourist);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create digital ID. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyDigitalId = () => {
    if (digitalId) {
      navigator.clipboard.writeText(digitalId.digitalId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `tourist-digital-id-${digitalId?.digitalId}.png`;
      link.click();
    }
  };

  if (digitalId) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setDigitalId(null)}
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Booking
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="font-heading text-xl font-semibold">Digital ID Created</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Digital ID Details */}
            <div className="space-y-6">
              <div>
                <h1 className="font-heading text-3xl font-bold text-green-600 mb-2">
                  ✅ Digital ID Created Successfully!
                </h1>
                <p className="text-muted-foreground">
                  Your universal digital ID is now active and accessible to all authorities
                </p>
              </div>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-green-600" />
                    Digital Identity Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Digital ID</p>
                        <p className="text-sm text-muted-foreground font-mono">{digitalId.digitalId}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyDigitalId}
                        className="flex items-center"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Name</p>
                        <p className="text-muted-foreground">{digitalId.firstName} {digitalId.lastName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Nationality</p>
                        <p className="text-muted-foreground">{digitalId.nationality}</p>
                      </div>
                      <div>
                        <p className="font-medium">Entry Point</p>
                        <p className="text-muted-foreground">{digitalId.entryPoint}</p>
                      </div>
                      <div>
                        <p className="font-medium">Entry Date</p>
                        <p className="text-muted-foreground">{new Date(digitalId.entryDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="font-medium text-sm mb-1">Blockchain Verification</p>
                      <p className="text-xs text-muted-foreground font-mono break-all">
                        {digitalId.blockchainHash}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading text-sm">Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {digitalId.emergencyContacts?.map((contact, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                          </div>
                          {contact.isPrimary && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-sm">
                          <p>📞 {contact.phone}</p>
                          {contact.email && <p>✉️ {contact.email}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
                <Button className="w-full">
                      Go to Dashboard
                      <ArrowRight className="mr-2 h-4 w-4" />
                </Button> 
            </div>

            {/* QR Code Section */}
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center">
                    <QrCode className="mr-2 h-5 w-5" />
                    Digital ID QR Code
                  </CardTitle>
                  <CardDescription>
                    Show this QR code to authorities for instant verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {qrCodeUrl && (
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-lg shadow-inner">
                        <img src={qrCodeUrl} alt="Digital ID QR Code" className="w-48 h-48" />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Button onClick={downloadQRCode} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download QR Code
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Save this QR code for offline verification
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading text-sm">Verification Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <p>Show QR code or Digital ID to any authority</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <p>Authority scans QR or enters Digital ID</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <p>Instant blockchain verification confirms identity</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading text-sm text-green-600">Trip Booking Confirmed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800">{selectedPlan.title}</h3>
                    <p className="text-sm text-green-600">{selectedPlan.duration} • {selectedPlan.category}</p>
                    <p className="text-lg font-bold text-green-700 mt-2">
                      ₹{(selectedPlan.price * 1.12).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your booking is confirmed and linked to your digital ID. 
                    You'll receive detailed itinerary via email.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tour Plans
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="font-heading text-xl font-semibold">Book Plan & Create Digital ID</span>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Book Your <span className="text-primary">Sacred Journey</span>
                </h1>
                <p className="text-muted-foreground">
                  Complete the details below to create your digital ID and confirm your spiritual adventure
                </p>
              </div>

              {/* Personal Details */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Personal & Identity Details
                  </CardTitle>
                  <CardDescription>Required for digital ID creation and trip booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input 
                        id="dateOfBirth" 
                        type="date" 
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality *</Label>
                      <Select onValueChange={(value) => handleInputChange('nationality', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Indian">Indian</SelectItem>
                          <SelectItem value="Foreign">Foreign National</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                      <Input 
                        id="aadhaarNumber" 
                        required
                        value={formData.aadhaarNumber}
                        onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                        placeholder="XXXX XXXX XXXX" 
                        maxLength={12}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entryPoint">Entry Point *</Label>
                      <Select onValueChange={(value) => handleInputChange('entryPoint', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select entry point" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Delhi Airport">Delhi Airport</SelectItem>
                          <SelectItem value="Mumbai Airport">Mumbai Airport</SelectItem>
                          <SelectItem value="Haridwar Railway">Haridwar Railway Station</SelectItem>
                          <SelectItem value="Rishikesh Bus">Rishikesh Bus Stand</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Emergency Contacts</CardTitle>
                  <CardDescription>At least one emergency contact is required</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Contact {index + 1}</h4>
                        {contact.isPrimary && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Primary</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Name *</Label>
                          <Input 
                            required={index === 0}
                            value={contact.name}
                            onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                            placeholder="Contact name" 
                          />
                        </div>
                        <div>
                          <Label>Phone *</Label>
                          <Input 
                            required={index === 0}
                            value={contact.phone}
                            onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                            placeholder="Phone number" 
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input 
                            type="email"
                            value={contact.email}
                            onChange={(e) => handleEmergencyContactChange(index, 'email', e.target.value)}
                            placeholder="Email address" 
                          />
                        </div>
                        <div>
                          <Label>Relationship</Label>
                          <Select onValueChange={(value) => handleEmergencyContactChange(index, 'relationship', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Parent">Parent</SelectItem>
                              <SelectItem value="Child">Child</SelectItem>
                              <SelectItem value="Sibling">Sibling</SelectItem>
                              <SelectItem value="Friend">Friend</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {formData.emergencyContacts.length < 3 && (
                    <Button type="button" variant="outline" onClick={addEmergencyContact}>
                      Add Another Contact
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Travel Dates */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Travel Dates
                  </CardTitle>
                  <CardDescription>Choose your preferred travel dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Departure Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick departure date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedExitDate">Expected Exit Date</Label>
                      <Input 
                        id="expectedExitDate" 
                        type="date"
                        value={formData.expectedExitDate}
                        onChange={(e) => handleInputChange('expectedExitDate', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Requirements */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Special Requirements</CardTitle>
                  <CardDescription>Let us know about any special needs or preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      "Wheelchair accessibility required",
                      "Vegetarian meals only",
                      "Medical assistance needed",
                      "Elderly traveler considerations",
                      "Photography service required"
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`req-${index}`} 
                          checked={formData.specialRequirements.includes(requirement)}
                          onCheckedChange={(checked) => handleRequirementChange(requirement, checked)}
                        />
                        <Label htmlFor={`req-${index}`} className="text-sm">{requirement}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional">Additional Requests</Label>
                    <Textarea 
                      id="additional" 
                      value={formData.additionalRequests}
                      onChange={(e) => handleInputChange('additionalRequests', e.target.value)}
                      placeholder="Any other special requirements or preferences..." 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card className="shadow-card sticky top-4">
                <CardHeader>
                  <CardTitle className="font-heading">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{selectedPlan.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedPlan.duration} • {selectedPlan.category}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Base Price (1 person)</span>
                      <span>₹{selectedPlan.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Taxes & Fees</span>
                      <span>₹{(selectedPlan.price * 0.12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Digital ID Creation</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{(selectedPlan.price * 1.12).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary-glow shadow-mountain"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Creating Digital ID...</>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Create Digital ID & Book Trip
                        </>
                      )}
                    </Button>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Blockchain-secured identity verification</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center text-sm">
                    <Info className="mr-2 h-4 w-4" />
                    Digital ID Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• ✅ Universal recognition by all authorities</p>
                  <p>• 🔒 Blockchain-secured verification</p>
                  <p>• 📱 Instant QR code access</p>
                  <p>• 🚀 Skip manual verification queues</p>
                  <p>• 🆔 One ID for all future trips</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center text-sm">
                    <Info className="mr-2 h-4 w-4" />
                    Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Free cancellation up to 7 days before departure</p>
                  <p>• Travel insurance recommended</p>
                  <p>• Valid ID required for all travelers</p>
                  <p>• Weather conditions may affect itinerary</p>
                  <p>• Digital ID valid for future trips</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TouristBookPlan;