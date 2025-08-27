import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TouristProfile() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            Tourist Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input placeholder="Enter your name" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" placeholder="Enter your email" />
          </div>

          {/* Tourist Info */}
          <div>
            <label className="block text-sm font-medium mb-1">Tourist Info</label>
            <Input placeholder="e.g. International / Domestic" />
          </div>

          {/* Save Button */}
          <Button className="w-full mt-4">Save Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
