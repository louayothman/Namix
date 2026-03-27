
"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل الهوية v4.0 - إصدار النقاء الرقمي
 * إعادة بناء كاملة تعتمد على مفهوم التوسع والتركيز البؤري لضمان مظهر نخبوي وعصري.
 */

export function LandingBarIntro() {
  // توقيتات الحركة المنسقة
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3 
      }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -45 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      filter: "blur(12px)",
      letterSpacing: "0.4em",
      x: -10 
    },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)",
      letterSpacing: "normal",
      x: 0,
      transition: { 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  return (
    <motion.div 
      className="flex items-center gap-3 md:gap-5 px-6 md:px-12 h-full select-none pointer-events-none"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      dir="ltr"
    >
      {/* 1. أيقونة الشبكة الذكية - مُصغرة وأنيقة */}
      <div className="relative flex items-center justify-center">
        {/* التوهج الخلفي النابض */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-10px] bg-white rounded-full blur-xl"
        />

        <motion.div 
          className="grid grid-cols-2 gap-1.5 md:gap-2 relative z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {/* توزيع النقاط بتناظر لوني فخم */}
          <motion.div variants={dotVariants} className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full bg-white shadow-sm" />
          <motion.div variants={dotVariants} className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full bg-[#f9a885] shadow-sm" />
          <motion.div variants={dotVariants} className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full bg-[#f9a885] shadow-sm" />
          <motion.div variants={dotVariants} className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full bg-white shadow-sm" />
        </motion.div>
      </div>

      {/* 2. نص الهوية - دخول انسيابي بتركيز بؤري */}
      <motion.div variants={textVariants} className="relative">
        <h1 
          className="text-white font-black text-xl md:text-3xl italic tracking-tighter leading-none"
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          NAMIX
        </h1>
        
        {/* خط ضوئي سفلي رقيق جداً يظهر مع النص */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 0.3 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="absolute -bottom-1 left-0 h-[0.5px] bg-gradient-to-r from-transparent via-white to-transparent"
        />
      </motion.div>

    </motion.div>
  );
}
