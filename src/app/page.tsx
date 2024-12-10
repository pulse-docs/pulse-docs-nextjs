"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  // Validate if the user is authenticated


  useEffect(() => {
    const user = localStorage.getItem("user");
    if (typeof window !== "undefined" && user) {
      router.push("/dashboard/inspect"); // Change this to your desired redirect URL
    }
  }, [router]);

  return null; // Return null as the component will redirect immediately
}