"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  // On first load, go to /Auth
  useEffect(() => {
    router.replace("/Auth");
  }, [router]);

  return null;
}
