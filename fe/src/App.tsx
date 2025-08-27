import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RegisterTourist from "./pages/RegisterTourist";
import RegisterPolice from "./pages/RegisterPolice";
import Login from "./pages/Login";
import EmailVerification from "./pages/EmailVerification";
import TouristDashboard from "./pages/TouristDashboard";
import TouristPlans from "./pages/TouristPlans";
import TouristBookPlan from "./pages/TouristBookPlan";
import TouristMap from "./pages/TouristMap";
import TouristAlerts from "./pages/TouristAlerts";
import PoliceDashboard from "./pages/PoliceDashboard";
import PoliceManageCrowd from "./pages/PoliceManageCrowd";
import PoliceAlerts from "./pages/PoliceAlerts";
import PoliceFIR from "./pages/PoliceFIR";
import AIMonitoring from "./pages/AIMonitoring";
import RestrictedPoints from "./pages/RestrictedPoints";
import Notifications from "./pages/Notifications";
import TouristProfile from "./pages/TouristProfile";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            
<Route path="/tourist-profile" element={<TouristProfile />} />
            <Route path="/" element={<Index />} />
            <Route path="/register-tourist" element={<RegisterTourist />} />
            <Route path="/register-police" element={<RegisterPolice />} />
            <Route path="/login" element={<Login />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/tourist-dashboard" element={<TouristDashboard />} />
            <Route path="/tourist-dashboard/view-plans" element={<TouristPlans />} />
            <Route path="/tourist-dashboard/book-plan" element={<TouristBookPlan />} />
            <Route path="/tourist-dashboard/map" element={<TouristMap />} />
            <Route path="/tourist-dashboard/alerts" element={<TouristAlerts />} />
            <Route path="/police-dashboard" element={<PoliceDashboard />} />
            <Route path="/police-dashboard/manage-crowd" element={<PoliceManageCrowd />} />
            <Route path="/police-dashboard/alerts" element={<PoliceAlerts />} />
            <Route path="/police-dashboard/fir" element={<PoliceFIR />} />
            <Route path="/monitoring" element={<AIMonitoring />} />
            <Route path="/restricted" element={<RestrictedPoints />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
