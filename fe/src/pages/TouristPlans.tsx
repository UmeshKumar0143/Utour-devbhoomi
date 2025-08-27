import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Users, Star, Search, Filter, ArrowLeft, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const TouristPlans = () => {
  const tourPlans = [
    {
      id: 1,
      title: "Char Dham Yatra Complete Package",
      description: "Visit all four sacred sites: Kedarnath, Badrinath, Gangotri, and Yamunotri",
      duration: "12 days",
      price: "₹45,000",
      rating: 4.8,
      difficulty: "Moderate",
      category: "Pilgrimage",
      includes: ["Transportation", "Accommodation", "Meals", "Guide"],
      highlights: ["Helicopter service to Kedarnath", "VIP Darshan", "Comfortable stay"]
    },
    {
      id: 2,
      title: "Valley of Flowers Trek",
      description: "Trek through the UNESCO World Heritage site filled with alpine flowers",
      duration: "6 days",
      price: "₹18,000",
      rating: 4.7,
      difficulty: "Challenging",
      category: "Adventure",
      includes: ["Trekking gear", "Guide", "Permits", "Camping"],
      highlights: ["Rare flora species", "Nanda Devi views", "Photography tours"]
    },
    {
      id: 3,
      title: "Rishikesh Spiritual Retreat",
      description: "Experience yoga, meditation, and Ganga Aarti in the yoga capital",
      duration: "5 days",
      price: "₹12,000",
      rating: 4.9,
      difficulty: "Easy",
      category: "Spiritual",
      includes: ["Yoga sessions", "Meditation", "Accommodation", "Meals"],
      highlights: ["Daily Ganga Aarti", "Yoga certification", "Ayurveda sessions"]
    },
    {
      id: 4,
      title: "Jim Corbett Wildlife Safari",
      description: "Explore India's first national park and spot the majestic Bengal tiger",
      duration: "3 days",
      price: "₹9,500",
      rating: 4.6,
      difficulty: "Easy",
      category: "Wildlife",
      includes: ["Safari rides", "Forest lodge", "Meals", "Guide"],
      highlights: ["Tiger spotting", "Bird watching", "Nature photography"]
    },
    {
      id: 5,
      title: "Nainital Hill Station Tour",
      description: "Enjoy the serene lakes and pleasant weather of the lake district",
      duration: "4 days",
      price: "₹8,000",
      rating: 4.5,
      difficulty: "Easy",
      category: "Leisure",
      includes: ["Hotel stay", "Boating", "Local sightseeing", "Meals"],
      highlights: ["Naini Lake boating", "Mall Road shopping", "Scenic viewpoints"]
    },
    {
      id: 6,
      title: "Har Ki Pauri Evening Aarti",
      description: "Witness the divine Ganga Aarti at the sacred ghats of Haridwar",
      duration: "1 day",
      price: "₹2,500",
      rating: 4.9,
      difficulty: "Easy",
      category: "Spiritual",
      includes: ["VIP seating", "Prasadam", "Transportation", "Guide"],
      highlights: ["Front row seating", "Photography allowed", "Spiritual discourse"]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "Challenging": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Pilgrimage": return "bg-purple-100 text-purple-800";
      case "Adventure": return "bg-orange-100 text-orange-800";
      case "Spiritual": return "bg-blue-100 text-blue-800";
      case "Wildlife": return "bg-green-100 text-green-800";
      case "Leisure": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/tourist-dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-heading text-xl font-semibold">Tour Plans</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Explore Sacred <span className="text-primary">Uttarakhand</span>
          </h1>
          <p className="text-muted-foreground">
            Choose from curated spiritual and adventure experiences in Devbhoomi
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search destinations, activities..." />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pilgrimage">Pilgrimage</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="spiritual">Spiritual</SelectItem>
                <SelectItem value="wildlife">Wildlife</SelectItem>
                <SelectItem value="leisure">Leisure</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="challenging">Challenging</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tour Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tourPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(plan.category)}>
                    {plan.category}
                  </Badge>
                  <Badge className={getDifficultyColor(plan.difficulty)}>
                    {plan.difficulty}
                  </Badge>
                </div>
                <CardTitle className="font-heading text-xl">{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {plan.duration}
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{plan.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Includes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {plan.includes.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Highlights:</h4>
                  <ul className="text-sm text-muted-foreground">
                    {plan.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-2xl font-bold text-primary">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/person</span>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <MapPin className="mr-1 h-4 w-4" />
                      Details
                    </Button>
                    <Link to="/tourist-dashboard/book-plan">
                      <Button size="sm" className="bg-primary hover:bg-primary-glow">
                        <Calendar className="mr-1 h-4 w-4" />
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouristPlans;