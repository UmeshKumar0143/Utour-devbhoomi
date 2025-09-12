// components/RegisterTourist.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/store/useCurrentUser";
import { useToast } from "@/hooks/use-toast";
import templeImage from "@/assests/temple-mountains.jpg";

const RegisterTourist = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useCurrentUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.password) return "Password is required";
    if (!formData.gender) return "Gender is required";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (!termsAccepted) return "Please accept the terms and conditions";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address";

    if (formData.password.length < 6) return "Password must be at least 6 characters long";

    // Optional phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      return "Please enter a valid 10-digit phone number";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          gender: formData.gender,
          phone: formData.phone || null,
          notificationsEnabled,
          userType: 'tourist'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user in Zustand
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: 'tourist',
          gender: data.user.gender,
          phone: data.user.phone,
        });

        toast({
          title: "Registration Successful!",
          description: `Welcome to Utour, ${data.user.name}!`,
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          gender: "",
          phone: "",
        });
        setTermsAccepted(false);
        setNotificationsEnabled(false);

        // Redirect to tourist dashboard
        setTimeout(() => {
          navigate("/tourist-dashboard");
        }, 1500);
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Registration failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen py-12 px-4 relative"
      style={{
        backgroundImage: `url(${templeImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-heading text-2xl">Tourist Registration</CardTitle>
              <CardDescription>
                Join Utour to explore the divine beauty of Uttarakhand safely
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={handleGenderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-5">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>{" "}
                      *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={(checked) => setNotificationsEnabled(checked as boolean)}
                    />
                    <Label htmlFor="notifications" className="text-sm text-muted-foreground leading-5">
                      Receive notifications about weather alerts, safety updates, and travel advisories
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 shadow-golden"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Register as Tourist"}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?
                  </p>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Login here
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card className="mt-6 shadow-card">
            <CardContent className="p-4">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">🙏 <strong>Welcome to Uttarakhand's Sacred Journey</strong></p>
                <p>Experience divine destinations with real-time safety monitoring and guided navigation.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterTourist;