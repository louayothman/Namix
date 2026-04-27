
"use client";

import React, { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface IdentityCardPreviewProps {
  user: any;
  calculatedTier: any;
  invitationLink: string;
  onAssetsLoad?: () => void;
}

/**
 * WaveLines - محرك التموجات السيادي المستخلص من كود Adobe Illustrator
 * يقوم برسم المسارات المنحنية بدقة متناهية لمحاكاة الانسيابية الفاخرة المطلوبة.
 */
const WaveLines = () => {
  return (
    <svg
      viewBox="0 0 800 800"
      className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g style={{ opacity: 0.6 }}>
        <path 
          d="M-108.296,546.441c23.067-2.259,46.15-4.448,69.106-7.651c22.959-3.124,45.789-7.379,68.149-13.454c5.545-1.671,11.152-3.141,16.617-5.064l4.121-1.37c1.373-0.46,2.755-0.893,4.101-1.429l8.125-3.069l2.031-0.767l1.996-0.856l3.991-1.711c2.654-1.156,5.348-2.223,7.926-3.545l7.811-3.797c2.586-1.301,5.143-2.665,7.703-4.021c10.236-5.43,20.383-11.052,30.843-16.075c10.453-5.01,21.219-9.499,32.462-12.464c5.628-1.422,11.316-2.651,17.081-3.367c2.871-0.447,5.767-0.663,8.657-0.941c1.444-0.148,2.897-0.174,4.345-0.267c1.45-0.065,2.898-0.186,4.349-0.184c11.609-0.287,23.225,0.481,34.723,2.023c11.509,1.491,22.907,3.71,34.227,6.218c11.317,2.528,22.571,5.323,33.788,8.25c22.436,5.848,44.725,12.225,67.183,17.933c22.453,5.697,45.099,10.758,68.046,13.898c22.922,3.18,46.175,4.43,69.258,2.638c23.055-1.771,45.951-6.719,67.305-15.698c21.387-8.861,41.528-20.634,63.41-28.529c21.886-7.827,45.405-10.752,68.556-9.206c11.583,0.682,23.11,2.202,34.498,4.407c11.382,2.242,22.642,5.057,33.792,8.237c22.311,6.364,44.084,14.391,66,21.917c10.959,3.768,21.958,7.418,33.054,10.758c11.104,3.308,22.321,6.245,33.661,8.615l4.259,0.861c1.419,0.289,2.837,0.586,4.269,0.801l8.573,1.417l8.623,1.075c1.435,0.204,2.879,0.313,4.323,0.423l4.331,0.345c11.555,0.812,23.178,0.728,34.713-0.441" 
          stroke="#6E6A63" strokeWidth="0.8" fill="none" 
        />
        <path 
          d="M-108.32,555.859c23.05-1.822,46.101-3.801,69.01-6.945c22.915-3.052,45.68-7.363,67.973-13.478l8.31-2.461l4.153-1.237l4.106-1.384l8.205-2.789l8.092-3.101c1.342-0.532,2.711-1.001,4.032-1.584l3.975-1.724l3.975-1.724c1.32-0.585,2.665-1.117,3.948-1.78c5.182-2.551,10.403-5.023,15.48-7.791c10.203-5.433,20.299-11.084,30.644-16.273c10.33-5.202,20.955-9.907,32.017-13.371c11.054-3.495,22.526-5.537,34.058-6.556c5.771-0.456,11.56-0.746,17.35-0.706" 
          stroke="#6E6A63" strokeWidth="0.8" fill="none" 
        />
        <path 
          d="M-108.343,565.277c23.058-1.392,46.111-3.163,69.007-6.252c11.456-1.472,22.853-3.378,34.191-5.565l8.484-1.741c2.832-0.563,5.627-1.294,8.442-1.932c5.64-1.244,11.193-2.829,16.774-4.306c2.784-0.76,5.529-1.658,8.297-2.476c2.763-0.834,5.532-1.651,8.248-2.631l8.188-2.815c2.707-0.999,5.385-2.078,8.078-3.113l4.035-1.568" 
          stroke="#6E6A63" strokeWidth="0.8" fill="none" 
        />
        <path 
          d="M-108.368,574.695c23.095-0.965,46.186-2.533,69.105-5.574c11.469-1.435,22.871-3.361,34.215-5.557l8.485-1.766l2.121-0.442l2.107-0.504l4.214-1.007c5.639-1.268,11.196-2.852,16.77-4.367c11.078-3.262,22.105-6.764,32.802-11.137c5.417-2.015,10.633-4.508,15.929-6.811c2.617-1.22,5.18-2.554,7.772-3.825l3.878-1.929" 
          stroke="#6E6A63" strokeWidth="0.8" fill="none" 
        />
        <path 
          d="M-108.415,593.531c23.261-0.117,46.54-1.291,69.616-4.26c11.55-1.379,23.021-3.349,34.428-5.595c5.685-1.222,11.385-2.374,17.012-3.844l4.233-1.046l2.117-0.523l2.099-0.589l8.392-2.37l2.098-0.593l2.077-0.664" 
          stroke="#6E6A63" strokeWidth="0.8" fill="none" 
        />
        <path 
          d="M-108.487,673.583l8.762-0.001l4.381-0.001l4.376-0.206l8.751-0.412l8.727-0.771l4.363-0.386l4.348-0.535l8.693-1.084l8.659-1.334c2.887-0.443,5.773-0.886,8.641-1.438c23.01-4.07,45.752-9.479,68.47-14.932c11.36-2.73,22.738-5.392,34.139-7.955" 
          stroke="#6E6A63" strokeWidth="0.8" fill="none" 
        />
        <path 
          d="M-108.559,682.412l9.056,0.575c1.51,0.089,3.018,0.206,4.528,0.273l4.537,0.051c3.024,0.023,6.049,0.092,9.073,0.077l9.067-0.332c1.511-0.068,3.024-0.082,4.532-0.195l4.522-0.362c3.014-0.254,6.032-0.455,9.041-0.753l9.008-1.079" 
          stroke="#6E6A63" strokeWidth="0.8" fill="none" 
        />
        <path 
          d="M-108.631,691.242l9.508,1.194c1.587,0.179,3.165,0.442,4.758,0.552l4.78,0.327l4.779,0.327c1.594,0.097,3.184,0.259,4.783,0.243l9.58,0.14c12.765-0.135,25.548-0.845,38.194-2.667l4.75-0.612" 
          stroke="#6E6A63" strokeWidth="0.8" fill="none" 
        />
      </g>
    </svg>
  );
};

export function IdentityCardPreview({
  user,
  invitationLink,
  onAssetsLoad
}: IdentityCardPreviewProps) {
  
  useEffect(() => {
    // إشارة الجاهزية فور رندر المكون نظراً لأنه يعتمد على محرك رسومي داخلي
    const timer = setTimeout(() => {
      onAssetsLoad?.();
    }, 800);
    return () => clearTimeout(timer);
  }, [onAssetsLoad]);

  const formatId = (id: string) => {
    if (!id) return "00 00 00 00 00";
    const cleanId = id.replace(/\s/g, '');
    const parts = [];
    for (let i = 0; i < cleanId.length; i += 2) {
      parts.push(cleanId.slice(i, i + 2));
    }
    return parts.join('   ');
  };

  return (
    <div className="w-[600px] h-[378px] relative overflow-hidden bg-[#f5f1ea] flex flex-col justify-between shadow-2xl p-0 font-sans select-none rounded-[24px]" dir="ltr">
      
      {/* Background Logic: Ivory Silk Gradient with Illustrator Waves */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#ffffff_0%,_#f5f1ea_60%,_#e9e3db_100%)]" />
        <WaveLines />
      </div>

      {/* Header: NAMIX.pro Straight Bold Edition */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <div className="flex items-baseline leading-none">
          <span className="text-[72px] font-black tracking-tighter" style={{ color: '#6E6A63', fontWeight: 950 }}>NAMIX</span>
          <span className="text-[36px] font-bold opacity-40 ml-1" style={{ color: '#6E6A63' }}>.pro</span>
        </div>
        
        {/* Nano Grid Dots: Top Right */}
        <div className="grid grid-cols-2 gap-1.5 pt-6 pr-4 opacity-[0.15]">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#6E6A63]" />
           ))}
        </div>
      </div>

      {/* Footer Identity: Name & Spaced ID */}
      <div className="px-12 pb-12 relative z-10 flex items-end justify-between w-full">
        
        <div className="space-y-4 flex-1 pr-10">
           <p className="text-[15px] font-black uppercase tracking-[0.4em] leading-none" style={{ color: 'rgba(110, 106, 99, 0.4)' }}>
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[52px] font-black tabular-nums tracking-normal leading-none whitespace-nowrap" style={{ color: '#6E6A63' }}>
              {formatId(user?.namixId)}
           </p>
        </div>

        {/* Minimal QR Node */}
        <div className="shrink-0 p-2 opacity-80 mb-1">
           <QRCodeSVG 
             value={invitationLink} 
             size={100} 
             bgColor={"transparent"} 
             fgColor={"#6E6A63"} 
             level={"M"} 
             includeMargin={false} 
           />
        </div>
      </div>
    </div>
  );
}
