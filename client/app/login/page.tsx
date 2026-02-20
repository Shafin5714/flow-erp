"use client";

import Link from "next/link";
import { Mail, Lock, EyeOff, Eye, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const [login, { loading: isLoading, error }] = useMutation(LOGIN_MUTATION);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login({
        variables: {
          input: {
            email: data.email,
            password: data.password,
          },
        },
      });

      if (result.data?.login?.token) {
        localStorage.setItem("token", result.data.login.token);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden font-sans">
      {/* LEFT SIDE: Branding / Visual (Hidden on mobile, visible on large screens) */}
      <div className="relative hidden lg:flex flex-col w-1/2 bg-black h-screen sticky top-0">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBFJK808j5ytA0-SCvOSdkGe-xU4W9NC_meyXCL1REEYyMw-8wqd63vB9tRg8U2ybNV4coXka9ncuen5dFROqua6zqDLR-n5AXsd8N6Ir3CKud1aONABV8pYg7P5YiBmNGiDu-VM_BQA-hN3kN6scDLnny0yY46VZTyiu5RaAg8RU5K9QFjzhPOmAf8FI6qczyLD3B5IV7NRggZp1RIC7Po69DX6Ci_oDHJ_Ftay5brD33XeeTpSrvBrGK7nnYytSygwSgJuva-R5M")',
          }}
        ></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#0d7ff2]/90 to-[#0a4a8f]/90 mix-blend-multiply"></div>
        {/* Content on top of image */}
        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="size-8 text-white">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Flow-ERP</h2>
          </div>
          <div className="max-w-lg mb-10">
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Manage your business with clarity.
            </h1>
            <p className="text-lg text-white/80 font-medium">
              Join over 10,000 SMEs optimizing their inventory, sales, and accounting in one unified
              platform.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white dark:bg-[#101922] px-4 py-12 sm:px-6 lg:px-20 xl:px-24 overflow-y-auto h-screen">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="flex items-center gap-2 text-[#0d7ff2]">
              <div className="size-8">
                <svg
                  className="w-full h-full"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-[#111418] dark:text-white">Flow-ERP</span>
            </div>
          </div>
          {/* Header Text */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#111418] dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-[#60758a] dark:text-gray-400">
              Please enter your details to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-md animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              <span>{error.message}</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#111418] dark:text-gray-200">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="text-[#60758a]" size={20} />
                        </div>
                        <Input
                          placeholder="name@company.com"
                          className="pl-10 h-11 dark:bg-[#1a2632] border-[#dbe0e6] dark:border-gray-700 focus-visible:ring-[#0d7ff2]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#111418] dark:text-gray-200">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="text-[#60758a]" size={20} />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11 dark:bg-[#1a2632] border-[#dbe0e6] dark:border-gray-700 focus-visible:ring-[#0d7ff2]"
                          {...field}
                        />
                        <div
                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye
                              className="text-[#60758a] hover:text-[#111418] dark:hover:text-white transition-colors"
                              size={20}
                            />
                          ) : (
                            <EyeOff
                              className="text-[#60758a] hover:text-[#111418] dark:hover:text-white transition-colors"
                              size={20}
                            />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-sm font-bold bg-[#0d7ff2] hover:bg-[#0d7ff2]/90 text-white transition-all shadow-sm"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing in..." : "Log In"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Bottom Legal Links (Subtle) */}
        <div className="mt-16 w-full max-w-sm text-center">
          <div className="flex justify-center gap-4 text-xs text-[#9ca3af] dark:text-gray-500">
            <Link className="hover:text-[#0d7ff2]" href="#">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link className="hover:text-[#0d7ff2]" href="#">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
