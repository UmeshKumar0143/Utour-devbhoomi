import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Mountain, Waves, TreePine, Users, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/uttarakhand-landscape.jpg";
import templeImage from "@/assets/temple-mountains.jpg";
import gangaImage from "@/assets/ganga-ghats.jpg";

const Index = () => {
  const features = [
    {
      icon: MapPin,
      title: "Sacred Destinations",
      description: "Explore holy sites like Kedarnath, Badrinath, and Gangotri"
    },
    {
      icon: Mountain,
      title: "Himalayan Adventures", 
      description: "Trek through pristine valleys and snow-capped peaks"
    },
    {
      icon: Waves,
      title: "Spiritual Rivers",
      description: "Experience the divine Ganga at Rishikesh and Haridwar"
    },
    {
      icon: TreePine,
      title: "Wildlife Sanctuaries",
      description: "Visit Jim Corbett and Valley of Flowers National Park"
    }
  ];

  const destinations = [
    { name: "Kedarnath", type: "Temple", status: "Open" },
    { name: "Badrinath", type: "Temple", status: "Open" }, 
    { name: "Rishikesh", type: "Spiritual", status: "Open" },
    { name: "Nainital", type: "Hill Station", status: "Open" },
    { name: "Mussoorie", type: "Hill Station", status: "Open" },
    { name: "Jim Corbett", type: "Wildlife", status: "Open" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-gradient opacity-80" />
        <div className="absolute inset-0 backdrop-mountain" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-float">
            <h1 className="font-heading text-6xl md:text-8xl font-bold text-white mb-6 text-balance">
              Welcome to <span className="spiritual-gradient bg-clip-text text-transparent">Utour</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-body">
              Explore Devbhoomi Uttarakhand - Land of Gods & Himalayas
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register-tourist">
              <Button size="lg" className="hero-button bg-primary hover:bg-primary-glow text-primary-foreground shadow-mountain px-8 py-6 text-lg font-semibold animate-glow">
                <Users className="mr-2 h-5 w-5" />
                Register as Tourist
              </Button>
            </Link>
            <Link to="/register-police">
              <Button size="lg" variant="outline" className="hero-button-outline bg-white/10 text-white border-white/30 hover:bg-white/20 px-8 py-6 text-lg font-semibold backdrop-blur-sm">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Register as Police
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-20 px-4 relative"
        style={{
          backgroundImage: `url(${templeImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Discover Divine <span className="text-primary">Uttarakhand</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From sacred temples to pristine mountains, experience the spiritual and natural beauty of Devbhoomi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-full bg-primary/10">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section 
        className="py-20 px-4 relative"
        style={{
          backgroundImage: `url(${gangaImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-muted/90 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Popular <span className="text-secondary">Destinations</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore the most visited sacred and scenic places in Uttarakhand
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination, index) => (
                <Card key={index} className="p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-heading text-xl font-semibold">{destination.name}</h3>
                      <p className="text-muted-foreground">{destination.type}</p>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                      {destination.status}
                    </span>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Explore <span className="text-accent">Devbhoomi</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of pilgrims and adventurers in discovering the divine beauty of Uttarakhand
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register-tourist">
              <Button size="lg" className="bg-primary hover:bg-primary-glow shadow-mountain">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Already Registered? Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;