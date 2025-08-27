import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, ArrowLeft, Users, CreditCard, Shield, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";

const TouristBookPlan = () => {
  const [date, setDate] = useState<Date>();

  const selectedPlan = {
    title: "Char Dham Yatra Complete Package",
    price: 45000,
    duration: "12 days",
    category: "Pilgrimage"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/tourist-dashboard/view-plans" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tour Plans
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-heading text-xl font-semibold">Book Plan</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                Book Your <span className="text-primary">Sacred Journey</span>
              </h1>
              <p className="text-muted-foreground">
                Complete the details below to confirm your spiritual adventure
              </p>
            </div>

            {/* Personal Details */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Traveler Details
                </CardTitle>
                <CardDescription>Provide information for all travelers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leadName">Lead Traveler Name</Label>
                    <Input id="leadName" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Person</SelectItem>
                        <SelectItem value="2">2 People</SelectItem>
                        <SelectItem value="3">3 People</SelectItem>
                        <SelectItem value="4">4 People</SelectItem>
                        <SelectItem value="5+">5+ People (Group)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age Group</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-30">18-30 years</SelectItem>
                        <SelectItem value="31-50">31-50 years</SelectItem>
                        <SelectItem value="51-65">51-65 years</SelectItem>
                        <SelectItem value="65+">65+ years</SelectItem>
                        <SelectItem value="mixed">Mixed age group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                    <Label htmlFor="flexible">Flexible Dates</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Flexibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exact">Exact dates only</SelectItem>
                        <SelectItem value="±1">±1 day flexible</SelectItem>
                        <SelectItem value="±3">±3 days flexible</SelectItem>
                        <SelectItem value="±7">±1 week flexible</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Checkbox id={`req-${index}`} />
                      <Label htmlFor={`req-${index}`} className="text-sm">{requirement}</Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional">Additional Requests</Label>
                  <Textarea id="additional" placeholder="Any other special requirements or preferences..." />
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
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{(selectedPlan.price * 1.12).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <Button className="w-full bg-primary hover:bg-primary-glow shadow-mountain">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </Button>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure payment with 256-bit SSL encryption</span>
                  </div>
                </div>
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
                <p>• Medical certificate required for trekking</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristBookPlan;