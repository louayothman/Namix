
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * LaurelSide - المكون الفرعي للسنابل المستخلص من كود Inkscape الأصلي المرفق
 */
const LaurelSide = ({ mirrored = false, className }: { mirrored?: boolean, className?: string }) => (
  <svg 
    viewBox="0 0 940 720" 
    className={cn("w-8 h-8 sm:w-10 sm:h-10 md:w-20 md:h-20 shrink-0 transition-transform duration-700", mirrored && "scale-x-[-1]", className)} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(91.8807, -228.748)">
      <path d="m 347.08869,896.4485 c -50.26221,-34.61145 -91.99091,-4.22048 -130.20466,30.14723 49.33059,13.40184 101.57182,19.4812 130.20466,-30.14723 z" />
      <path d="m 335.00813,866.65908 c -2.23026,-60.98622 -51.52064,-76.32723 -101.9037,-86.47444 18.69136,47.57924 44.99506,93.12317 101.9037,86.47444 z" />
      <path d="m 257.46232,868.9652 c -47.1576,-38.73528 -91.30541,-11.97944 -132.28691,19.03596 48.0217,17.52279 99.56244,27.99525 132.28691,-19.03596 z" />
      <path d="m 213.7258,840.04725 c 29.38644,-53.48545 -5.0433,-91.94969 -43.07649,-126.51721 -8.37774,50.42759 -9.17761,103.01541 43.07649,126.51721 z" />
      <path d="M 175.56386,838.86253 C 140.86881,788.6578 91.067409,802.24915 43.139648,820.80627 c 41.356125,30.0467 88.033542,54.28182 132.424212,18.05626 z" />
      <path d="m 126.55834,794.08474 c 44.8942,-41.33732 24.51179,-88.76583 -0.52771,-133.64859 -24.00593,45.13149 -41.516977,94.72472 0.52771,133.64859 z" />
      <path d="m 102.70505,789.02521 c -24.512893,-55.88718 -75.990226,-52.01603 -126.572602,-42.9134 34.88637,37.36404 76.102239,70.03469 126.572602,42.9134 z" />
      <path d="M 61.80799,734.99691 C 113.5903,702.70348 102.35828,652.31751 86.077807,603.56935 54.11764,643.46532 27.712133,688.95024 61.80799,734.99691 z" />
      <path d="m 43.731844,727.44265 c -13.50183,-59.5145 -64.782452,-65.44807 -116.173584,-66.07531 27.191044,43.28729 61.484952,83.16283 116.173584,66.07531 z" />
      <path d="M 28.353512,639.98238 C 83.492962,613.83027 78.104003,562.48953 67.51225,512.19779 31.194121,548.17207 -0.24580513,590.33455 28.353512,639.98238 z" />
      <path d="m 19.164595,656.99812 c -6.339212,-60.69651 -56.552533,-72.67739 -107.50569,-79.40263 21.858519,46.20969 51.174797,89.8752 107.50569,79.40263 z" />
      <path d="M 5.1751165,540.48644 C 64.763679,527.31633 70.982683,476.06937 71.896069,424.68233 28.458188,451.63189 -11.607558,485.70325 5.1751165,540.48644 z" />
      <path d="M -6.4859483,585.25321 C 10.758728,526.7136 -31.112486,496.51915 -75.668597,470.90297 c 2.620999,51.05161 13.106722,102.5897 69.1826487,114.35024 z" />
      <path d="m 28.616032,425.50229 c 60.950565,3.05215 80.496728,-44.72699 94.963058,-94.04387 -49.017377,14.50674 -96.665404,36.77334 -94.963058,94.04387 z" />
      <path d="m -10.626514,491.19264 c 36.629046,-48.8116 7.9620893,-91.74309 -24.821398,-131.32444 -15.399078,48.74424 -23.600233,100.69481 24.821398,131.32444 z" />
      <path d="M 55.278052,338.66716 C 116.20344,335.15204 130.50209,285.54901 139.58509,234.96301 92.410592,254.6531 47.431376,281.91098 55.278052,338.66716 z" />
      <path d="M 16.389532,391.33338 C 62.166776,350.9762 42.814294,303.11817 18.750788,257.70462 -6.22507,302.30663 -24.804003,351.50973 16.389532,391.33338 z" />
    </g>
  </svg>
);

export function EliteStatsHub() {
  const stats = [
    { label: "أصول العملاء", id: "assets" },
    { label: "حجم التداول", id: "volume" },
    { label: "الاستثمارات", id: "invest" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-row items-center justify-center gap-16 sm:gap-12 md:gap-20 lg:gap-24 flex-nowrap py-4 select-none"
    >
      {stats.map((stat) => (
        <div key={stat.id} className="flex items-center gap-0 group shrink-0">
          {/* Left Wing (Mirrored) - Extreme Frame Fusion */}
          <LaurelSide 
            mirrored 
            className="text-[#f9a885] -mx-5 sm:-mx-6 md:-mx-10 transition-all duration-700 group-hover:rotate-[-8deg] group-hover:scale-110" 
          />
          
          {/* Identity Core - Royal Stamp Style */}
          <div className="space-y-0 text-center px-0 min-w-[50px] md:min-w-[120px] relative z-10 flex flex-col items-center">
            <p className="text-xl sm:text-2xl md:text-5xl font-black text-[#002d4d] leading-none tracking-tighter">No.1</p>
            <p className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-normal mt-1.5 md:mt-3 whitespace-nowrap">{stat.label}</p>
          </div>
          
          {/* Right Wing (Normal) - Extreme Frame Fusion */}
          <LaurelSide 
            className="text-[#f9a885] -mx-5 sm:-mx-6 md:-mx-10 transition-all duration-700 group-hover:rotate-[8deg] group-hover:scale-110" 
          />
        </div>
      ))}
    </motion.div>
  );
}
