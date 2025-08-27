import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterPolice = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-secondary" />
            </div>
            <CardTitle className="font-heading text-2xl">Police Registration</CardTitle>
            <CardDescription>
              Register to monitor and ensure tourist safety in Uttarakhand
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Official Email</Label>
              <Input id="email" type="email" placeholder="officer@uttarakhandpolice.gov.in" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badgeNumber">Badge Number</Label>
              <Input id="badgeNumber" placeholder="Enter badge number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rank">Rank</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="constable">Constable</SelectItem>
                  <SelectItem value="head-constable">Head Constable</SelectItem>
                  <SelectItem value="asi">Assistant Sub Inspector</SelectItem>
                  <SelectItem value="si">Sub Inspector</SelectItem>
                  <SelectItem value="inspector">Inspector</SelectItem>
                  <SelectItem value="dsp">Deputy Superintendent</SelectItem>
                  <SelectItem value="sp">Superintendent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="station">Police Station</Label>
              <Input id="station" placeholder="Enter station name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="almora">Almora</SelectItem>
                  <SelectItem value="bageshwar">Bageshwar</SelectItem>
                  <SelectItem value="chamoli">Chamoli</SelectItem>
                  <SelectItem value="champawat">Champawat</SelectItem>
                  <SelectItem value="dehradun">Dehradun</SelectItem>
                  <SelectItem value="haridwar">Haridwar</SelectItem>
                  <SelectItem value="nainital">Nainital</SelectItem>
                  <SelectItem value="pauri">Pauri Garhwal</SelectItem>
                  <SelectItem value="pithoragarh">Pithoragarh</SelectItem>
                  <SelectItem value="rudraprayag">Rudraprayag</SelectItem>
                  <SelectItem value="tehri">Tehri Garhwal</SelectItem>
                  <SelectItem value="udhamsingh">Udham Singh Nagar</SelectItem>
                  <SelectItem value="uttarkashi">Uttarkashi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jurisdiction">Jurisdiction Area</Label>
              <Input id="jurisdiction" placeholder="Area of responsibility" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm password" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the Terms of Service and Code of Conduct
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="verification" />
              <Label htmlFor="verification" className="text-sm text-muted-foreground">
                I confirm that all information provided is accurate and verifiable
              </Label>
            </div>

            <Button className="w-full bg-secondary hover:bg-secondary-light shadow-mountain">
              Register as Police Officer
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-secondary hover:underline">
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPolice;