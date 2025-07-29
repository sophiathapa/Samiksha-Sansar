import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-book-secondary to-book-warm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col justify-center items-center mb-8">
           <img  className='w-35 h-35 mb-3 rounded-full shadow-sm' src='logo.png'/>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Sign in to your book library</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              
                <label htmlFor="email" className="text-foreground font-medium block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 pr-10"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-foreground font-medium block mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 pr-10"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link
              href="/register"
              className="text-primary text-left hover:text-primary/80 font-sm transition-colors"
            >
              Forgot password?
            </Link>
            <Button className="w-full">Sign In</Button>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
