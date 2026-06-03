"use client";

import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    window.location.href = "/employee/dashboard";
  }, []);

  return null;
}
