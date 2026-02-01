import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex flex-col items-center text-center gap-8 max-w-4xl">
        <div className="flex items-center gap-3 animate-fade-in">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Flow-ERP logo"
            width={120}
            height={24}
            priority
          />
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-500">
            Flow-ERP
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white max-w-2xl bg-linear-to-b from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-300 dark:to-neutral-500 bg-clip-text text-transparent pb-4">
          Modern Mini ERP Solution
        </h1>

        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Manage inventory, sales, purchases, and accounting with a premium, high-performance
          interface built on Next.js 15 and GraphQL.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-8">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
            <a href="http://localhost:4000/graphql" target="_blank" rel="noopener noreferrer">
              GraphQL API
            </a>
          </Button>
        </div>

        <div className="mt-16 relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
            Dashboard Preview Image Placeholder
          </div>
        </div>
      </main>
    </div>
  );
}
