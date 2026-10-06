"use client";

import React from "react";

interface SocialSidebarProps {
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function SocialSidebar({
  facebookUrl = "https://www.facebook.com/lefrancaisavecflorentin",
  instagramUrl = "https://www.instagram.com/lefrancaisavecflorentin",
}: SocialSidebarProps) {
  return (
    <aside
      aria-label="Redes sociales"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-1.5 shadow-2xl select-none"
    >
      {/* Botón Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visitar Facebook de Florentin"
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-[#1877f2] text-white rounded-l-xl shadow-md transition-all duration-300 hover:w-14 hover:shadow-xl hover:bg-[#166fe5]"
        style={{
          boxShadow: "-3px 4px 14px rgba(24, 119, 242, 0.35)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="transition-transform duration-200 group-hover:scale-110"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>

        {/* Tooltip en hover */}
        <span className="pointer-events-none absolute right-full mr-2 px-2.5 py-1 rounded-md bg-[#0c1b33] text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          Facebook
        </span>
      </a>

      {/* Botón Instagram */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visitar Instagram de Florentin"
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 text-white rounded-l-xl shadow-md transition-all duration-300 hover:w-14 hover:shadow-xl"
        style={{
          background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          boxShadow: "-3px 4px 14px rgba(220, 39, 67, 0.35)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:scale-110"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>

        {/* Tooltip en hover */}
        <span className="pointer-events-none absolute right-full mr-2 px-2.5 py-1 rounded-md bg-[#0c1b33] text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          Instagram
        </span>
      </a>
    </aside>
  );
}
