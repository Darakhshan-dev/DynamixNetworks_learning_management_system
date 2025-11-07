import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Award, BookOpen, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  email: "",
  bio: "",
  courses: 0,
  hours: 0,
  complete: 0,
  achievements: [],
};

const Profile = () => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    // Fetch profile data from backend
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile({ ...DEFAULT_PROFILE, ...data }))
      .catch(() => toast.error("Failed to load profile!"));
  }, []);

  const handleSaveProfile = () => {
    fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        toast.success("Profile updated successfully!");
      })
      .catch(() => toast.error("Failed to update profile."));
  };

  // Achievements can be dynamic from backend, fallback to UI sample
  const achievements =
    profile.achievements.length > 0
      ? profile.achievements
      : [
          { title: "Fast Learner", description: "Completed 5 courses", icon: TrendingUp },
          { title: "Dedicated Student", description: "100 hours of learning", icon: Clock },
          { title: "Course Champion", description: "Finished first course", icon: Award },
        ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={e =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={e =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={e =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={e =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-primary to-primary-light">
                  Save Changes
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Learning Goals</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Complete 10 Courses</span>
                    <Badge variant="outline">{profile.courses}/10</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-light"
                      style={{ width: `${(profile.courses / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Study 50 Hours This Month</span>
                    <Badge variant="outline">{profile.hours}/50</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent"
                      style={{ width: `${(profile.hours / 50) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg mb-1">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Student</p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {profile.courses}
                  </div>
                  <div className="text-xs text-muted-foreground">Courses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {profile.hours}
                  </div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {profile.complete}
                  </div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <achievement.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
