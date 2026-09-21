"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Language } from "@/lib/translations";

interface BlogNavbarProps {
  currentLang?: Language;
  onLangChange?: (lang: Language) => void;
}

export default function BlogNavbar({ currentLang = "es", onLangChange }: BlogNavbarProps) {
  return <Navbar activePage="articulos" currentLang={currentLang} onLangChange={onLangChange} />;
}
