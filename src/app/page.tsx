"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      router.push("/dashboard/inspect"); // Change this to your desired redirect URL
    }
  }, [router]);

  return null; // Return null as the component will redirect immediately
}