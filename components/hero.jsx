"use client";

import { Typewriter } from "react-simple-typewriter";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    const bannerElement = bannerRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        bannerElement?.classList.add("scrolled");
      } else {
        bannerElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-40 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Intelligent Finance for <br /> a Smarter You
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Take control of your money with AI-driven insights and smarter spending.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/AJKakarot/CashTrackr.git">
            <Button size="lg" variant="outline" className="px-8">
              Github-Link
            </Button>
          </Link>
        </div>

        {/* 🔥 Animated Banner */}
        <div className="hero-image-wrapper mt-12 md:mt-16">
          <motion.div
            ref={bannerRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full max-w-4xl lg:max-w-5xl mx-auto h-[280px] md:h-[350px] rounded-2xl shadow-xl border overflow-hidden flex items-center justify-center"
          >
            {/* 🌈 Gradient Background with Glow */}
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-800 to-cyan-700"
              style={{ backgroundSize: "300% 300%" }}
            />

            {/* ✨ Glow Aura */}
            <div className="absolute inset-0 rounded-2xl blur-3xl opacity-40 bg-gradient-to-r from-cyan-400 via-indigo-500 to-blue-600" />

            {/* Floating Money/Finance Icons */}
            <motion.span
              className="absolute top-10 left-12 text-3xl md:text-4xl text-white/90"
              animate={{ y: [0, -15, 0], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              💰
            </motion.span>

            <motion.span
              className="absolute bottom-12 left-1/4 text-3xl md:text-4xl text-white/90"
              animate={{ y: [0, -20, 0], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              📊
            </motion.span>

            <motion.span
              className="absolute top-16 right-16 text-3xl md:text-4xl text-white/90"
              animate={{ y: [0, -18, 0], rotate: [0, 12, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              🏦
            </motion.span>

            {/* 💫 Extra Glowing Circles */}
            <motion.div
              className="absolute w-32 h-32 rounded-full bg-cyan-400/30 blur-2xl"
              animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              style={{ top: "20%", left: "10%" }}
            />
            <motion.div
              className="absolute w-24 h-24 rounded-full bg-indigo-500/30 blur-2xl"
              animate={{ x: [0, -50, 50, 0], y: [0, 40, -40, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              style={{ bottom: "15%", right: "15%" }}
            />

            {/* ✍️ Typewriter */}
            <div className="relative text-center px-6">
              <h2 className="text-2xl md:text-4xl font-semibold text-white drop-shadow-lg">
                <Typewriter
                  words={[
                    "Track your expenses 💸",
                    "Save smarter 🏦",
                    "Grow your wealth 📈",
                    "Plan your future 🔮",
                  ]}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </h2>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
