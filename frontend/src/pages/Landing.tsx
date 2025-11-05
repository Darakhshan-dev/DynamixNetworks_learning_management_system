import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Target, Award, TrendingUp, Users, Clock } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const Landing = () => {
  const features = [
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Track your progress and learn at your own pace with customized recommendations.",
    },
    {
      icon: Award,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your achievements and stay motivated with detailed analytics.",
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Active Students" },
    { icon: BookOpen, value: "200+", label: "Courses" },
    { icon: Clock, value: "10K+", label: "Hours of Content" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Students learning" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-accent/25" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in drop-shadow-sm">
              Transform Your Future with
              <span className="block text-primary"> Expert-Led Courses</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed drop-shadow-sm">
              Join thousands of learners mastering new skills through our comprehensive online courses.
              Start your journey today and unlock your potential.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/courses">Explore Courses</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative bg-card border-t border-border">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 justify-center">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose LearnHub?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community today and get access to hundreds of courses taught by industry experts
          </p>
          <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-xl">
            <Link to="/auth">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
