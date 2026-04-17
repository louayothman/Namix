
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LaurelWreath = ({ mirrored = false, className }: { mirrored?: boolean, className?: string }) => (
  <svg 
    viewBox="0 0 940 720" 
    className={cn("w-10 h-10 md:w-16 md:h-16 shrink-0", mirrored && "scale-x-[-1]", className)} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(91.8807, -228.748)" fill="currentColor">
      <path d="m 347.08869,896.4485 c -50.26221,-34.61145 -91.99091,-4.22048 -130.20466,30.14723 49.33059,13.40184 101.57182,19.4812 130.20466,-30.14723 z" fillOpacity="1" />
      <path d="m 335.00813,866.65908 c -2.23026,-60.98622 -51.52064,-76.32723 -101.9037,-86.47444 18.69136,47.57924 44.99506,93.12317 101.9037,86.47444 z" fillOpacity="1" />
      <path d="m 257.46232,868.9652 c -47.1576,-38.73528 -91.30541,-11.97944 -132.28691,19.03596 48.0217,17.52279 99.56244,27.99525 132.28691,-19.03596 z" fillOpacity="1" />
      <path d="m 213.7258,840.04725 c 29.38644,-53.48545 -5.0433,-91.94969 -43.07649,-126.51721 -8.37774,50.42759 -9.17761,103.01541 43.07649,126.51721 z" fillOpacity="1" />
      <path d="M 175.56386,838.86253 C 140.86881,788.6578 91.067409,802.24915 43.139648,820.80627 c 41.356125,30.0467 88.033542,54.28182 132.424212,18.05626 z" fillOpacity="1" />
      <path d="m 126.55834,794.08474 c 44.8942,-41.33732 24.51179,-88.76583 -0.52771,-133.64859 -24.00593,45.13149 -41.516977,94.72472 0.52771,133.64859 z" fillOpacity="1" />
      <path d="m 102.70505,789.02521 c -24.512893,-55.88718 -75.990226,-52.01603 -126.572602,-42.9134 34.88637,37.36404 76.102239,70.03469 126.572602,42.9134 z" fillOpacity="1" />
      <path d="M 61.80799,734.99691 C 113.5903,702.70348 102.35828,652.31751 86.077807,603.56935 54.11764,643.46532 27.712133,688.95024 61.80799,734.99691 z" fillOpacity="1" />
      <path d="m 43.731844,727.44265 c -13.50183,-59.5145 -64.782452,-65.44807 -116.173584,-66.07531 27.191044,43.28729 61.484952,83.16283 116.173584,66.07531 z" fillOpacity="1" />
      <path d="M 28.353512,639.98238 C 83.492962,613.83027 78.104003,562.48953 67.51225,512.19779 31.194121,548.17207 -0.24580513,590.33455 28.353512,639.98238 z" fillOpacity="1" />
      <path d="m 19.164595,656.99812 c -6.339212,-60.69651 -56.552533,-72.67739 -107.50569,-79.40263 21.858519,46.20969 51.174797,89.8752 107.50569,79.40263 z" fillOpacity="1" />
      <path d="M 28.616032,425.50229 c 60.950565,3.05215 80.496728,-44.72699 94.963058,-94.04387 -49.017377,14.50674 -96.665404,36.77334 -94.963058,94.04387 z" fillOpacity="1" />
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
      className="w-full flex flex-row items-center justify-center gap-4 md:gap-16 flex-nowrap overflow-x-auto scrollbar-none py-4"
    >
      {stats.map((stat) => (
        <div key={stat.id} className="flex items-center gap-0 group shrink-0">
          {/* FUSED LAURELS - Micro Gap Fusion */}
          <LaurelWreath mirrored className="text-[#f9a885] -mx-3 md:-mx-4 transition-transform duration-700 group-hover:rotate-[-5deg]" />
          <div className="space-y-0 text-center px-0 min-w-max relative z-10">
            <p className="text-xl md:text-5xl font-black text-[#002d4d] leading-none">No.1</p>
            <p className="text-[6px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-2">{stat.label}</p>
          </div>
          <LaurelWreath className="text-[#f9a885] -mx-3 md:-mx-4 transition-transform duration-700 group-hover:rotate-[5deg]" />
        </div>
      ))}
    </motion.div>
  );
}
