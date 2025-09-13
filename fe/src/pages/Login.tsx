import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, ArrowLeft, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import templeImage from "@/assests/temple-mountains.jpg";
import { Select, SelectTrigger } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { policeDepartments } from "@/lib/data";
import { useCurrentUser } from "@/store/useCurrentUser";
import { BACKEND_URL } from "@/config";



const Login = () => {
  const navigate = useNavigate();
  const {setUser} = useCurrentUser(); 

  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<string>("");
  const [policeDepartment, setPoliceDepartment] = useState<string>("");
  const [isLoading , setisLoading ] = useState(false); 
  const handleUserTypeChange = (value: string) => {
    setUserType(value);
    if (value !== "police") {
      setPoliceDepartment("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !userType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (userType === "police" && !policeDepartment) {
      toast({
        title: "Missing Information",
        description: "Please select your police department",
        variant: "destructive",
      });
      return;
    }

    try {
      setisLoading(true); 
      const loginData = {
        email,
        password,
        userType,
        ...(userType === "police" && { policeDepartment })
      };

      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user); 
        
        toast({
          title: "Login Successful ",
        });

        setTimeout(() => {
          if (userType === "police") {
            navigate("/police-dashboard");
          } else {
            navigate("/tourist-dashboard");
          }
        }, 1500);
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    }finally{
      setisLoading(false); 
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
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                {userType === "police" ? (
                  <Shield className="h-6 w-6 text-accent" />
                ) : (
                  <LogIn className="h-6 w-6 text-accent" />
                )}
              </div>
              <CardTitle className="font-heading text-2xl">Welcome</CardTitle>
              <CardDescription>
                {userType === "police" 
                  ? "Officer login to Utour security portal" 
                  : "Login to access your Utour account"
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userType">User Type *</Label>
                <Select value={userType} onValueChange={handleUserTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourist">Tourist</SelectItem>
                    <SelectItem value="police">Police </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userType === "police" && (
                <div className="space-y-2">
                  <Label htmlFor="policeDepartment">Police Department *</Label>
                  <Select value={policeDepartment} onValueChange={setPoliceDepartment}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {policeDepartments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={userType === "police" ? "officer.email@ukpolice.gov.in" : "your.email@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading || !userType}
                  className={`w-full shadow-golden ${
                    userType === "police" 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-accent hover:bg-accent-glow text-accent-foreground"
                  }`}
                >
                  {isLoading ? "Logging in..." : `Login as ${userType === "police" ? "Officer" : "Tourist"}`}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {userType === "police" 
                    ? "Need access? Contact your department administrator."
                    : "Don't have an account?"
                  }
                </p>
                {userType !== "police" && (
                  <div className="flex flex-col space-y-2">
                    <Link to="/register-tourist">
                      <Button variant="outline" className="w-full">
                        Register as Tourist
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {userType === "police" && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <Shield className="inline h-3 w-3 mr-1" />
                    Authorized personnel only. All access is logged and monitored.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;