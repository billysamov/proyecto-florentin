"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles, ArrowRight, ArrowUpRight, Search, ShoppingBag, Check,
  Clock, BookOpen, MessageSquare, Compass, ShieldCheck, CheckCircle2,
  Users, Award, ChevronRight, Star, Globe2, Phone, Mail, MapPin, Heart
} from "lucide-react";

export default function LandingV2Replica() {
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);

  return (
    <div className="v2-container" style={{
      backgroundColor: "#ffffff",
      color: "#0f172a",
      minHeight: "100vh",
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      WebkitFontSmoothing: "antialiased",
      overflowX: "hidden"
    }}>
      
      {/* 1. Header Navbar (Réplica Exacta del Mockup Ling+) */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
        padding: "16px 24px"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Logo Ling+ / Florentin */}
          <Link href="/v2" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
            <span style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Ling<span style={{ color: "#0066ff" }}>+</span>
            </span>
            <span style={{ fontSize: "11px", fontWeight: 800, backgroundColor: "#e0f2fe", color: "#0284c7", padding: "2px 8px", borderRadius: "20px", marginLeft: "6px" }}>
              Florentin Edition
            </span>
          </Link>

          {/* Menú de Navegación del Mockup */}
          <nav style={{ display: "flex", alignItems: "center", gap: "28px", fontSize: "14px", fontWeight: 700, color: "#334155" }} className="hidden lg:flex">
            <a href="#courses" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Courses <span style={{ fontSize: "10px" }}>▼</span>
            </a>
            <a href="#pages" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Pages <span style={{ fontSize: "10px" }}>▼</span>
            </a>
            <a href="#about" style={{ color: "inherit", textDecoration: "none" }}>About Us</a>
            <a href="#blog" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Blog <span style={{ fontSize: "10px" }}>▼</span>
            </a>
            <a href="#events" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Events <span style={{ fontSize: "10px" }}>▼</span>
            </a>
            <a href="#contact" style={{ color: "inherit", textDecoration: "none" }}>Contact Us</a>
          </nav>

          {/* Acciones del Mockup (Search, Cart, Enroll Button) */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center" }} aria-label="Search">
              <Search size={18} />
            </button>

            <div style={{ position: "relative", cursor: "pointer", color: "#475569" }}>
              <ShoppingBag size={18} />
              <span style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#0066ff", color: "#ffffff", fontSize: "10px", fontWeight: 800, width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                0
              </span>
            </div>

            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 22px",
                borderRadius: "30px",
                backgroundColor: "#0066ff",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(0, 102, 255, 0.3)"
              }}
            >
              Enroll Now
              <ArrowUpRight size={14} />
            </a>

          </div>

        </div>
      </header>

      {/* 2. Hero Section (Fondo Menta/Cyan Degradado Réplica) */}
      <section style={{
        background: "linear-gradient(180deg, #dff4f3 0%, #edf9f8 60%, #ffffff 100%)",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "center" }}>
          
          {/* Left Column: Heading & Copy */}
          <div>
            <h1 style={{
              fontSize: "clamp(44px, 5.8vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#0f172a",
              letterSpacing: "-0.035em",
              marginBottom: "20px"
            }}>
              Speak Fluently, <br />
              <span style={{ color: "#0f172a" }}>Connect Globally</span>
            </h1>

            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#475569",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              marginBottom: "32px",
              maxWidth: "520px"
            }}>
              Master a new language at your own pace with our expert-led courses. Designed for all levels, from beginners to advanced speakers.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <a
                href="#courses"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#0066ff",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  boxShadow: "0 10px 25px rgba(0, 102, 255, 0.35)",
                  transition: "transform 0.2s ease"
                }}
              >
                <ArrowUpRight size={20} />
              </a>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>Explore Courses</span>
            </div>
          </div>

          {/* Right Column: Student Portrait with Soft Mint Oval */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "460px",
              borderRadius: "40px",
              overflow: "hidden"
            }}>
              <Image
                src="/hero_student.png"
                alt="Student with books"
                width={500}
                height={550}
                style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
                priority
              />
            </div>
          </div>

        </div>

        {/* Flag Marquee Pill Bar (Superpuesto en la parte inferior) */}
        <div style={{ marginTop: "50px", overflow: "hidden", whiteSpace: "nowrap" }}>
          <div style={{ display: "inline-flex", gap: "16px", animation: "marqueeFlags 25s linear infinite" }}>
            {[
              { flag: "🇪🇸", label: "Spanish" },
              { flag: "🇫🇷", label: "French" },
              { flag: "🇩🇪", label: "German" },
              { flag: "🇮🇹", label: "Italian" },
              { flag: "🇨🇳", label: "Chinese" },
              { flag: "🇬🇧", label: "English" },
              { flag: "🇪🇸", label: "Spanish" },
              { flag: "🇫🇷", label: "French" },
              { flag: "🇩🇪", label: "German" },
              { flag: "🇮🇹", label: "Italian" },
              { flag: "🇨🇳", label: "Chinese" },
              { flag: "🇬🇧", label: "English" }
            ].map((item, i) => (
              <div key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 22px",
                borderRadius: "40px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
                fontSize: "14px",
                fontWeight: 800,
                color: "#0f172a"
              }}>
                <span style={{ fontSize: "18px" }}>{item.flag}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Cinta Azul Royal (4 Items Horizontal Checkmarks) */}
      <section style={{ backgroundColor: "#0066ff", color: "#ffffff", padding: "22px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", textAlign: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#ffffff", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>100+ Language Courses</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#ffffff", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Expert Native Tutors</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#ffffff", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Flexible Schedules</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#ffffff", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Practical Lessons</span>
          </div>

        </div>
      </section>

      {/* 4. "Unlock the World with Language Learning" (4 Bento Cards Pastel) */}
      <section style={{ padding: "90px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "flex-end", marginBottom: "50px" }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#0066ff", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                • WHY CHOOSE US
              </span>
              <h2 style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", margin: 0 }}>
                Unlock the World with Language Learning
              </h2>
            </div>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Learn from experienced native tutors with interactive, engaging courses tailored to your personal and professional goals.
              </p>
            </div>
          </div>

          {/* 4 Bento Grid Cards con botón cuadrado azul en esquina */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            
            {/* Card 1 (Soft Blue) */}
            <div style={{
              padding: "36px 28px 28px",
              borderRadius: "24px",
              backgroundColor: "#edf5ff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "260px"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(0, 102, 255, 0.15)", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <MessageSquare size={24} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Interactive Lessons</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Engage in real-time interactive lessons designed to boost your speaking and listening skills.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "24px" }}>
                <a href="#courses" style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#0066ff", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            {/* Card 2 (Soft Cyan) */}
            <div style={{
              padding: "36px 28px 28px",
              borderRadius: "24px",
              backgroundColor: "#e0f7fa",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "260px"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(8, 145, 178, 0.15)", color: "#0891b2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <Clock size={24} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Learn at Your Pace</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Flexible scheduling options that fit seamlessly into your busy daily routine.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "24px" }}>
                <a href="#courses" style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#0066ff", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            {/* Card 3 (Soft Purple) */}
            <div style={{
              padding: "36px 28px 28px",
              borderRadius: "24px",
              backgroundColor: "#f3e8ff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "260px"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(124, 58, 237, 0.15)", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <BookOpen size={24} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Self-Paced Resources</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Access comprehensive learning materials, quizzes, and recorded sessions anytime.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "24px" }}>
                <a href="#courses" style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#0066ff", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            {/* Card 4 (Soft Mint) */}
            <div style={{
              padding: "36px 28px 28px",
              borderRadius: "24px",
              backgroundColor: "#e6f4ea",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "260px"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(5, 150, 105, 0.15)", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <Award size={24} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Active Learning</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Practical exercises and real-world scenarios to ensure maximum retention and confidence.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "24px" }}>
                <a href="#courses" style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#0066ff", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Client / Partner Logos Bar */}
      <section style={{ padding: "40px 24px", backgroundColor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "24px" }}>
            TRUSTED BY 1,000+ SCHOOLS & UNIVERSITIES
          </span>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", flexWrap: "wrap", opacity: 0.6, grayscale: 1 }}>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#64748b" }}>Coursera</span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#64748b" }}>Duolingo</span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#64748b" }}>Pearson</span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#64748b" }}>McGraw Hill</span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#64748b" }}>Oxford</span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#64748b" }}>Babbel</span>
          </div>
        </div>
      </section>

      {/* 6. "Languages from the Comfort of Home" Section */}
      <section style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "50px", alignItems: "center" }}>
          
          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.06)"
            }}>
              <Image
                src="/video_student.png"
                alt="Student in online video class"
                width={550}
                height={420}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          </div>

          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0066ff", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              • FLEXIBLE ONLINE CLASSES
            </span>
            <h2 style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginBottom: "16px" }}>
              Languages from the Comfort of Home
            </h2>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#64748b", lineHeight: 1.6, marginBottom: "28px" }}>
              Experience interactive, live video sessions with dedicated native tutors designed to fit your routine.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0, marginTop: "2px" }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>Step-by-step Guidance</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Structured roadmap from absolute beginner to confident speaker.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0, marginTop: "2px" }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>Personalized Approach</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Lessons customized to your learning style, speed, and goals.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0, marginTop: "2px" }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>Flexible and Accessible</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Access lessons on desktop or mobile, anytime, anywhere.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Big Impact Outline Stat Counter */}
      <section style={{ padding: "70px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px", textAlign: "center" }}>
          
          <div>
            <div style={{
              fontSize: "72px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2.5px #0066ff",
              lineHeight: 1
            }}>
              150+
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#475569", marginTop: "12px" }}>Language Courses</div>
          </div>

          <div>
            <div style={{
              fontSize: "72px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2.5px #0066ff",
              lineHeight: 1
            }}>
              95%
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#475569", marginTop: "12px" }}>Satisfaction Rate</div>
          </div>

          <div>
            <div style={{
              fontSize: "72px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2.5px #0066ff",
              lineHeight: 1
            }}>
              1 mil+
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#475569", marginTop: "12px" }}>Lessons Completed</div>
          </div>

        </div>
      </section>

      {/* 8. "Master Any Language, Anywhere" Banner (Map & Floating Flags) */}
      <section style={{
        backgroundColor: "#e0f2fe",
        padding: "80px 24px",
        borderRadius: "32px",
        maxWidth: "1280px",
        margin: "0 auto 80px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "center" }}>
          
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "6px 16px", borderRadius: "30px", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", fontSize: "13px", fontWeight: 800, color: "#0066ff", marginBottom: "20px" }}>
              <span>👥</span> 200+ Happy Students
            </div>

            <h2 style={{ fontSize: "42px", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.1, marginBottom: "16px" }}>
              Master Any Language, <br /> Anywhere
            </h2>

            <p style={{ fontSize: "16px", fontWeight: 500, color: "#334155", marginBottom: "32px", maxWidth: "460px" }}>
              Personalized language learning plans designed to meet your exact needs.
            </p>

            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#0066ff",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(0, 102, 255, 0.35)"
              }}
            >
              <ArrowUpRight size={20} />
            </a>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            {["🇬🇧 UK", "🇫🇷 France", "🇩🇪 Germany", "🇪🇸 Spain"].map((flag, idx) => (
              <div key={idx} style={{ padding: "14px 24px", borderRadius: "20px", backgroundColor: "#ffffff", boxShadow: "0 10px 25px rgba(0,0,0,0.06)", fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                {flag}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. "Learn Fast, Speak Fluently. Explore Our Courses" Carousel */}
      <section id="courses" style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#0066ff", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                • OUR COURSES
              </span>
              <h2 style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", margin: 0 }}>
                Learn Fast, Speak Fluently. <br /> Explore Our Courses
              </h2>
            </div>

            <a href="#all" style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#0066ff", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            
            {[
              { title: "Master English for Global Success", level: "Beginner to Advanced", duration: "12 Weeks", price: "$120", img: "/course_french.png", flag: "🇬🇧" },
              { title: "Spanish for Business and Everyday Life", level: "Intermediate", duration: "8 Weeks", price: "$110", img: "/video_student.png", flag: "🇪🇸" },
              { title: "Unlock the Power of French Communication", level: "All Levels", duration: "10 Weeks", price: "$130", img: "/hero_student.png", flag: "🇫🇷" },
              { title: "German Courses for Work and Travel", level: "Beginner", duration: "6 Weeks", price: "$95", img: "/corporate_lessons.png", flag: "🇩🇪" }
            ].map((course, idx) => (
              <div key={idx} style={{
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
              }}>
                <div>
                  <div style={{ position: "relative", height: "180px" }}>
                    <Image src={course.img} alt={course.title} fill style={{ objectFit: "cover" }} />
                    <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#ffffff", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 800 }}>
                      {course.flag} Ling+
                    </span>
                  </div>

                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", marginBottom: "8px", lineHeight: 1.3 }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", margin: 0 }}>
                      {course.level} • {course.duration}
                    </p>
                  </div>
                </div>

                <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#0066ff" }}>{course.price}</span>
                  <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", fontWeight: 800, color: "#0f172a", textDecoration: "none" }}>
                    Enroll Now →
                  </a>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* 10. Scrolling Text Marquee Ticker */}
      <div style={{ backgroundColor: "#f8fafc", padding: "24px 0", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: "28px", fontWeight: 800, color: "#cbd5e1", letterSpacing: "0.02em", display: "inline-flex", gap: "24px", animation: "marqueeFlags 30s linear infinite" }}>
          <span>english + german + spanish + italian + french + english + german + spanish + italian + french</span>
        </div>
      </div>

      {/* 11. Two Feature Cards (Individual vs Corporate Lessons) */}
      <section style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          
          {/* Card 1: Individual Lessons */}
          <div style={{
            padding: "48px 36px",
            borderRadius: "32px",
            backgroundColor: "#edf5ff",
            position: "relative",
            overflow: "hidden"
          }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0066ff", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
              • PERSONALIZED TUTORING
            </span>
            <h3 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginBottom: "28px" }}>
              Individual Lessons
            </h3>
            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#0066ff",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none"
              }}
            >
              <ArrowUpRight size={20} />
            </a>
          </div>

          {/* Card 2: Corporate Lessons */}
          <div style={{
            padding: "48px 36px",
            borderRadius: "32px",
            backgroundColor: "#e6f4ea",
            position: "relative",
            overflow: "hidden"
          }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
              • FOR TEAMS & COMPANIES
            </span>
            <h3 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginBottom: "28px" }}>
              Corporate Lessons
            </h3>
            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#059669",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none"
              }}
            >
              <ArrowUpRight size={20} />
            </a>
          </div>

        </div>
      </section>

      {/* 12. Huge Dark Navy Footer (`#051329`) */}
      <footer style={{ backgroundColor: "#051329", color: "#ffffff", padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "80px" }}>
            
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginBottom: "20px" }}>Courses</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "flex", flexDirection: "column", gap: "12px" }}>
                <li>French for Beginners</li>
                <li>Spanish for Business</li>
                <li>German Conversation</li>
                <li>Italian Culture</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginBottom: "20px" }}>Contacts</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "flex", flexDirection: "column", gap: "12px" }}>
                <li>📍 Paris, France</li>
                <li>💬 WhatsApp: +33 7 44 32 13 56</li>
                <li>🌐 Online Google Meet</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginBottom: "20px" }}>Resources</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "flex", flexDirection: "column", gap: "12px" }}>
                <li>Learning Portal</li>
                <li>Student Community</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>

          </div>

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "clamp(64px, 10vw, 120px)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.04em" }}>
              Ling<span style={{ color: "#0066ff" }}>+</span>
            </span>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", textAlign: "center", fontSize: "13px", fontWeight: 500, color: "#64748b" }}>
            © {new Date().getFullYear()} Ling+ • All rights reserved.
          </div>

        </div>
      </footer>

      <style jsx global>{`
        @keyframes marqueeFlags {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
}
