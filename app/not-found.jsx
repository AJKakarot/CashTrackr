"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-6 bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Animated Error Code */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-7xl md:text-9xl font-extrabold text-blue-600 drop-shadow-md"
      >
        404
      </motion.h1>

      {/* Floating Subtitle */}
      <motion.h2
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-2xl md:text-3xl font-semibold text-gray-800"
      >
        Page Not Found
      </motion.h2>

      {/* Description */}
      <p className="text-gray-600 max-w-md">
        Oops! The page you&apos;re looking for doesn&apos;t exist or might have been moved.
      </p>

      {/* CTA Button */}
      <Link href="/" passHref>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button className="mt-4 px-6 py-3 rounded-xl text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
            Return Home
          </Button>
        </motion.div>
      </Link>
    </div>
  );
}
