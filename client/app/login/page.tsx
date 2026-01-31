import Link from 'next/link';
import { Mail, Lock, EyeOff } from 'lucide-react';

export default function LoginPage() {
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
              Join over 10,000 SMEs optimizing their inventory, sales, and
              accounting in one unified platform.
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
              <span className="text-xl font-bold text-[#111418] dark:text-white">
                Flow-ERP
              </span>
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
          {/* Form Section */}
          <div className="mt-8 space-y-6">
            <form action="#" className="space-y-6" method="POST">
              {/* Email Field */}
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-[#111418] dark:text-gray-200"
                  htmlFor="email"
                >
                  Email address
                </label>
                <div className="mt-2 relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="text-[#60758a]" size={20} />
                  </div>
                  <input
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-[#111418] dark:text-white dark:bg-[#1a2632] shadow-sm ring-1 ring-inset ring-[#dbe0e6] dark:ring-gray-700 placeholder:text-[#60758a] focus:ring-2 focus:ring-inset focus:ring-[#0d7ff2] sm:text-sm sm:leading-6"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    type="email"
                  />
                </div>
              </div>
              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    className="block text-sm font-medium leading-6 text-[#111418] dark:text-gray-200"
                    htmlFor="password"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2 relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="text-[#60758a]" size={20} />
                  </div>
                  <input
                    className="block w-full rounded-lg border-0 py-3 pl-10 pr-10 text-[#111418] dark:text-white dark:bg-[#1a2632] shadow-sm ring-1 ring-inset ring-[#dbe0e6] dark:ring-gray-700 placeholder:text-[#60758a] focus:ring-2 focus:ring-inset focus:ring-[#0d7ff2] sm:text-sm sm:leading-6"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                    <EyeOff
                      className="text-[#60758a] hover:text-[#111418] dark:hover:text-white transition-colors"
                      size={20}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <div className="text-sm">
                    <Link
                      className="font-medium text-[#0d7ff2] hover:text-[#0d7ff2]/80"
                      href="#"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div>
                <button
                  className="flex w-full justify-center rounded-lg bg-[#0d7ff2] px-3 py-3 text-sm font-bold leading-6 text-white shadow-sm hover:bg-[#0d7ff2]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d7ff2] transition-all"
                  type="submit"
                >
                  Log In
                </button>
              </div>
            </form>
            {/* Divider and Social Login REMOVED as per instructions */}

            {/* Footer Link */}
            <p className="mt-8 text-center text-sm text-[#60758a] dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                className="font-semibold leading-6 text-[#0d7ff2] hover:text-[#0d7ff2]/80 hover:underline"
                href="#"
              >
                Start your 14-day free trial
              </Link>
            </p>
          </div>
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
