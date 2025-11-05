import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser } from "@/api";
import { loginUser } from "@/api";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");

  const [signupForm, setSignupForm] = useState({
  full_name: "",
  email: "",
  password: "",
});
const [loginForm, setLoginForm] = useState({
  email: "",
  password: "",
});


 const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const user = await loginUser(loginForm);
    setIsLoading(false);
    localStorage.setItem("userRole", role); // Or use role from API response
    toast.success("Welcome back!");
    navigate(role === "teacher" ? "/teacher/dashboard" : "/dashboard");
  } catch (error) {
    setIsLoading(false);
    toast.error("Login failed!");
  }
};

 const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await registerUser({
      ...signupForm,
      role
    });
    setIsLoading(false);
    localStorage.setItem("userRole", role);
    toast.success("Account created successfully!");
    navigate(role === "teacher" ? "/teacher/dashboard" : "/dashboard");
  } catch (error) {
    setIsLoading(false);
    toast.error("Registration failed!");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">LearnHub</span>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3">
                <Label>I am a</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as "student" | "teacher")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="login-student" />
                    <Label htmlFor="login-student" className="font-normal cursor-pointer">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="login-teacher" />
                    <Label htmlFor="login-teacher" className="font-normal cursor-pointer">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
  id="login-email"
  name="email"
  type="email"
  placeholder="your@email.com"
  value={loginForm.email}
  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
  required
/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
               <Input
  id="login-password"
  name="password"
  type="password"
  placeholder="••••••••"
  value={loginForm.password}
  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
  required
/>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-light"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-3">
                <Label>I am a</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as "student" | "teacher")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="signup-student" />
                    <Label htmlFor="signup-student" className="font-normal cursor-pointer">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="signup-teacher" />
                    <Label htmlFor="signup-teacher" className="font-normal cursor-pointer">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
  id="signup-name"
  name="full_name"
  type="text"
  placeholder="John Doe"
  value={signupForm.full_name}
  onChange={e => setSignupForm(f => ({ ...f, full_name: e.target.value }))}
  required
/>

              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
  id="signup-email"
  name="email"
  type="email"
  placeholder="your@email.com"
  value={signupForm.email}
  onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
  required
/>

              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
  id="signup-password"
  name="password"
  type="password"
  placeholder="••••••••"
  value={signupForm.password}
  onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
  required
/>

              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-light"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Back to home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
