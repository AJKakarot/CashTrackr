"use client";

import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { motion } from "framer-motion";

export default function Layout() {
  return (
    <motion.div
      className="px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold tracking-tight gradient-title">
          Dashboard
        </h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <DashboardPage />
      </Suspense>
    </motion.div>
  );
}
