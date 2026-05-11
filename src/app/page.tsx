"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, BarChart3, Wallet, Shield } from "lucide-react";

export default function LandingPage() {
  const { user, isLoading, signIn, signUp } = useAuth();
  const router = useRouter();
  const [signInData, setSignInData] = useState({ email: "demo@tracker.com", password: "demo123" });
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(signInData.email, signInData.password);
    } catch {
      setError("Invalid credentials");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(signUpData.name, signUpData.email, signUpData.password);
    } catch {
      setError("Sign up failed");
    }
  };

  if (isLoading) return null;

  if (user) return null;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FinanceTrack</span>
          </div>
        </div>
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Take Control of Your <span className="text-blue-200">Finances</span>
          </h2>
          <p className="text-lg text-blue-100 max-w-md">
            Track expenses, monitor revenue, and gain powerful insights into your financial health with our intuitive dashboard.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: BarChart3, label: "Smart Analytics" },
              { icon: Wallet, label: "Multi-Account" },
              { icon: TrendingUp, label: "Revenue Tracking" },
              { icon: Shield, label: "Secure Data" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg bg-white/10 backdrop-blur px-4 py-3">
                <Icon className="h-5 w-5 text-blue-200" />
                <span className="text-sm font-medium text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-sm text-blue-200">&copy; 2026 FinanceTrack. All rights reserved.</p>
      </div>

      {/* Right side - Auth */}
      <div className="flex flex-1 items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">FinanceTrack</span>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input id="signin-email" type="email" value={signInData.email} onChange={(e) => setSignInData({ ...signInData, email: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input id="signin-password" type="password" value={signInData.password} onChange={(e) => setSignInData({ ...signInData, password: e.target.value })} required />
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Demo Credentials</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Email: demo@tracker.com / Password: demo123</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">Sign In</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create account</CardTitle>
                  <CardDescription>Get started with your free account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input id="signup-name" value={signUpData.name} onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" value={signUpData.email} onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" type="password" value={signUpData.password} onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })} required />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">Create Account</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
