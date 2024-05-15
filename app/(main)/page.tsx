import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-6">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
        This is Home Page, and there is nothing.
      </h1>
      <p className="text-2xl font-bold">Please go to Login page</p>
      <Link href="/login">
        <Button className="" size="lg">
          Start for Free
        </Button>
      </Link>
    </main>
  );
}
