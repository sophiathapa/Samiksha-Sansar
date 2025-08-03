'use client'
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
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import bookClubLogo from "@/assets/book-club-logo.png";

const Login = () => {
  const [loginStatus, setLoginStatus] = useState<{ success: boolean; message: string } | null>(null);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
    },
  });

  return (
       <>
        <div className="flex flex-col justify-center items-center mb-8">
          <img 
            className="w-25 h-25 mb-4 rounded-full shadow-lg" 
            src='logo.png'
            alt="Book Club Logo"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-center">
            Sign in to continue your reading journey
          </p>
        </div>
        
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-foreground font-medium block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-destructive text-sm">{formik.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-foreground font-medium block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-destructive text-sm">{formik.errors.password}</p>
                )}
              </div>

              {loginStatus && (
                <div className={`p-3 rounded-md text-sm ${
                  loginStatus.success 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {loginStatus.message}
                </div>
              )}
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              onClick={formik.handleSubmit as any}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
     </>
  );
};

export default Login;
