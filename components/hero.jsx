"use client";

import { Typewriter } from "react-simple-typewriter";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bannerElement = bannerRef.current;
    if (!bannerElement) return;

    const handleScroll = () => {
      bannerElement.classList.toggle("scrolled", window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-36 md:pt-40 pb-20 px-4">
      <div className="container mx-auto text-center">
        {/* 🔥 Title */}
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Intelligent Finance <br /> for a Smarter You
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Take control of your money with AI-driven insights and smarter spending.
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 shadow-md hover:shadow-lg">
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/AJKakarot/CashTrackr.git">
            <Button size="lg" variant="outline" className="px-8 shadow-md hover:shadow-lg">
              GitHub Link
            </Button>
          </Link>
        </div>

        {/* ✨ Animated Banner */}
        <div className="hero-image-wrapper mt-14 md:mt-20">
          <motion.div
            ref={bannerRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full max-w-4xl lg:max-w-6xl mx-auto 
                       h-[240px] sm:h-[300px] md:h-[360px] 
                       rounded-2xl shadow-2xl border overflow-hidden 
                       flex items-center justify-center bg-black/10"
          >
            {/* 🌈 Gradient Background */}
            <motion.div
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-800 to-cyan-700"
              style={{ backgroundSize: "300% 300%" }}
            />

            {/* Glow Overlay */}
            <div
              className="absolute inset-0 rounded-2xl blur-3xl opacity-50
                         bg-gradient-to-r from-cyan-400 via-indigo-500 to-blue-600"
            />

            {/* Floating Emojis */}
            {[
              { pos: "top-10 left-12", symbol: "💰", dur: 4 },
              { pos: "bottom-12 left-1/4", symbol: "📊", dur: 5 },
              { pos: "top-16 right-16", symbol: "🏦", dur: 6 },
            ].map((item, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className={`absolute ${item.pos} text-3xl md:text-4xl text-white/90`}
                animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: item.dur, repeat: Infinity, ease: "easeInOut" }}
              >
                {item.symbol}
              </motion.span>
            ))}

            {/* Extra Glowing Circles */}
            <motion.div
              className="absolute w-32 h-32 rounded-full bg-cyan-400/25 blur-2xl"
              animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              style={{ top: "20%", left: "10%" }}
              aria-hidden="true"
            />
            <motion.div
              className="absolute w-24 h-24 rounded-full bg-indigo-500/25 blur-2xl"
              animate={{ x: [0, -50, 50, 0], y: [0, 40, -40, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              style={{ bottom: "15%", right: "15%" }}
              aria-hidden="true"
            />

            {/* Typewriter Text */}
            <div className="relative text-center px-6">
              <h2 className="text-xl md:text-3xl font-semibold text-white drop-shadow-lg">
                <Typewriter
                  words={[
                    "Track your expenses 💸",
                    "Save smarter 🏦",
                    "Grow your wealth 📈",
                    "Plan your future 🔮",
                  ]}
                  loop
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
