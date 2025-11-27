"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />

            {/* Animated orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-20 right-20 w-96 h-96 bg-primary-purple/30 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-teal/30 rounded-full blur-3xl"
            />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8"
                >
                    <Sparkles className="w-4 h-4 text-primary-purple" />
                    <span className="text-sm font-medium text-gray-200">AI-Powered Timetable Generation</span>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                        Your Timetable.
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent gradient-apple">
                        Simplified.
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    Transform complex university schedules into beautiful, personalized timetables.
                    Upload, customize, export. Simple as that.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/upload">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.5)" }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex items-center space-x-2 gradient-apple px-8 py-5 rounded-full font-bold text-lg text-white shadow-2xl shadow-primary-purple/50 transition-all duration-300"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-2 glass glass-hover px-8 py-5 rounded-full font-semibold text-lg text-white border-2 border-white/20"
                    >
                        <FileText className="w-5 h-5" />
                        <span>View Demo</span>
                    </motion.button>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto"
                >
                    {[
                        {
                            icon: Zap,
                            title: "Lightning Fast",
                            description: "AI-powered parsing in under 10 seconds",
                        },
                        {
                            icon: Sparkles,
                            title: "Smart Detection",
                            description: "Automatically extracts all timetable data",
                        },
                        {
                            icon: FileText,
                            title: "Multiple Formats",
                            description: "PDF, DOCX, XLSX supported",
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="glass-dark p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            <feature.icon className="w-10 h-10 text-primary-purple mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </div>
    );
}
