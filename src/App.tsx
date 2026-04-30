/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Calendar, 
  ChevronDown, 
  Music, 
  Music2, 
  Share2, 
  Info,
  CheckCircle2,
  MailOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Background Ornament Component
const LuxuryOrnament = ({ className, rotate = 0 }: { className?: string; rotate?: number }) => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className={className}
    animate={{ rotate: [rotate, rotate + 360] }}
    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
  >
    <path 
      d="M50 0C50 0 55 20 70 30C85 40 100 50 100 50C100 50 85 60 70 70C55 80 50 100 50 100C50 100 45 80 30 70C15 60 0 50 0 50C0 50 15 40 30 30C45 20 50 0 50 0Z" 
      fill="currentColor" 
    />
    <circle cx="50" cy="50" r="10" stroke="currentColor" fill="none" strokeWidth="0.5" />
    <motion.circle 
      cx="50" cy="50" r="20" 
      stroke="currentColor" 
      fill="none" 
      strokeWidth="0.2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 5, repeat: Infinity }}
    />
  </motion.svg>
);

const EVENTS = [
  {
    title: "Haldi Ceremony",
    date: "October 24, 2026",
    time: "10:00 AM",
    location: "Royal Heritage Gardens, Jaipur",
    description: "A celebration of love and vibrant colors to kick off the festivities.",
    icon: "✨"
  },
  {
    title: "Sangeet Night",
    date: "October 24, 2026",
    time: "7:00 PM",
    location: "The Golden Ballroom",
    description: "An evening of dance, music, and celebration with family and friends.",
    icon: "💃"
  },
  {
    title: "The Wedding Ceremony",
    date: "October 25, 2026",
    time: "4:00 PM",
    location: "Sunlight Courtyard",
    description: "The main ceremony where we exchange vows under the stars.",
    icon: "💍"
  },
  {
    title: "Grand Reception",
    date: "October 26, 2026",
    time: "8:00 PM",
    location: "Palace Banquet Hall",
    description: "Join us for a grand feast to celebrate our new journey together.",
    icon: "🥂"
  }
];

const calculateTimeLeft = () => {
  const targetDate = new Date('2026-10-25T16:00:00').getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isOpened, setIsOpened] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [theme, setTheme] = useState<'modern' | 'rustic' | 'vintage'>('modern');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const moveX = useTransform(springX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-20, 20]);
  const moveY = useTransform(springY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-20, 20]);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpStatus('submitting');
    setTimeout(() => {
      setRsvpStatus('success');
      setTimeout(() => setRsvpStatus('idle'), 3000);
    }, 1500);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className={`min-h-screen bg-wedding-cream text-wedding-ink selection:bg-wedding-gold/30 transition-colors duration-1000 theme-${theme}`}>
      {/* Theme Selector */}
      <div className="fixed bottom-12 left-8 z-[150] flex flex-col gap-4">
        {[
          { id: 'modern', label: 'Modern Royale', color: '#D4AF37' },
          { id: 'rustic', label: 'Earth & Sage', color: '#8A9A5B' },
          { id: 'vintage', label: 'Petal & Parchment', color: '#B43D56' }
        ].map((t) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05, x: 8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(t.id as any)}
            className={`group flex items-center gap-4 p-2 pr-6 rounded-full border transition-all duration-700 bg-wedding-card/40 backdrop-blur-xl ${
              theme === t.id 
                ? 'border-wedding-gold shadow-2xl shadow-wedding-gold/20' 
                : 'border-wedding-gold/10 hover:border-wedding-gold/40'
            }`}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${theme === t.id ? 'scale-110 shadow-lg' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'}`}
              style={{ backgroundColor: t.color }}
            >
              <Sparkles className="w-4 h-4 text-white/50" />
            </div>
            <div className="flex flex-col items-start overflow-hidden w-0 group-hover:w-32 transition-all duration-700">
              <span className="text-[8px] uppercase tracking-widest font-black text-wedding-gold mb-0.5">Theme</span>
              <span className={`text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors ${theme === t.id ? 'text-wedding-ink' : 'text-wedding-ink/40'}`}>
                {t.label}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Custom Cursor Glow */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-wedding-gold/20 blur-xl pointer-events-none z-[200] mix-blend-screen -ml-4 -mt-4 hidden md:block"
      />
      <motion.div 
        style={{ x: springX, y: springY }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-wedding-gold pointer-events-none z-[201] -ml-[3px] -mt-[3px] hidden md:block"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <AnimatePresence mode="wait">
        {!isOpened && (
          <motion.section 
            key="intro-screen"
            exit={{ pointerEvents: "none" }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            {/* Left Curtain */}
            <motion.div 
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 2.2, ease: [0.77, 0, 0.175, 1] }}
              className="absolute left-0 top-0 w-1/2 h-full z-20"
              style={{
                background: "linear-gradient(90deg, #600000 0%, #a52a2a 60%, #400000 100%)",
                boxShadow: "inset -20px 0 60px rgba(0,0,0,0.8)"
              }}
            >
              {/* Vertical Fold Lines */}
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.4) 41px, rgba(255,255,255,0.1) 42px, transparent 43px)" }} />
              {/* Spotlight Left */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
            </motion.div>

            {/* Right Curtain */}
            <motion.div 
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 2.2, ease: [0.77, 0, 0.175, 1] }}
              className="absolute right-0 top-0 w-1/2 h-full z-20"
              style={{
                background: "linear-gradient(90deg, #400000 0%, #a52a2a 40%, #600000 100%)",
                boxShadow: "inset 20px 0 60px rgba(0,0,0,0.8)"
              }}
            >
              {/* Vertical Fold Lines */}
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.4) 41px, rgba(255,255,255,0.1) 42px, transparent 43px)" }} />
              {/* Spotlight Right */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
            </motion.div>

            {/* Background Content Behind Curtains */}
            <div className="absolute inset-0 z-0">
               <img 
                src="https://images.unsplash.com/photo-1590050752117-23a9d7fc2434?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-60"
                alt="Palace Background"
              />
              <div className="absolute inset-0 bg-wedding-ink/50 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-30 flex flex-col items-center justify-center text-center px-6 min-h-screen">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{ duration: 1.5 }}
                className="flex flex-col items-center w-full"
              >
                <div className="heading-serif text-white/50 text-[10px] md:text-xs uppercase tracking-[2em] mb-12">A Journey Together</div>
                
                <div className="flex flex-row items-center justify-center mb-20 gap-4 md:gap-12 leading-none">
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="heading-script text-white text-6xl md:text-[12rem] drop-shadow-2xl"
                  >
                    Aether
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="heading-serif text-wedding-gold italic text-4xl md:text-7xl pt-4 md:pt-10"
                  >
                    &
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                    className="heading-script text-white text-6xl md:text-[12rem] drop-shadow-2xl"
                  >
                    Celeste
                  </motion.span>
                </div>

                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
                  transition={{ delay: 2, duration: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const duration = 4 * 1000;
                    const colors = ['#D4AF37', '#ffffff', '#FFD700', '#B43D56'];

                    // Initial Burst
                    confetti({
                      particleCount: 150,
                      spread: 80,
                      origin: { y: 0.6 },
                      colors: colors,
                      zIndex: 250
                    });

                    // Side bursts for "boom" effect
                    confetti({
                      particleCount: 80,
                      angle: 60,
                      spread: 55,
                      origin: { x: 0, y: 0.8 },
                      colors: colors,
                      zIndex: 250
                    });
                    confetti({
                      particleCount: 80,
                      angle: 120,
                      spread: 55,
                      origin: { x: 1, y: 0.8 },
                      colors: colors,
                      zIndex: 250
                    });

                    setIsOpened(true);
                    setIsPlaying(true);
                  }}
                  className="group relative flex flex-col items-center gap-6"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-xl group-hover:bg-white group-hover:border-white transition-all duration-700 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    <MailOpen className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:text-wedding-ink transition-colors duration-500" />
                  </div>
                  <span className="uppercase tracking-[0.8em] text-[10px] md:text-[12px] font-bold text-white/50 group-hover:text-white transition-colors">Tap to Reveal</span>
                  
                  {/* Subtle reveal pulse */}
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 md:w-32 md:h-32 border border-white/20 rounded-full"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  />
                </motion.button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white text-[8px] uppercase tracking-[0.8em] font-medium"
              >
                Invitations sent with love
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <main className={`transition-opacity duration-1000 ${!isOpened ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'bg-wedding-cream/90 backdrop-blur-lg py-4 shadow-sm border-b border-wedding-gold/10' : 'bg-transparent py-10'}`}>
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="heading-serif text-2xl font-bold tracking-tighter"
            >
              A.C
            </motion.div>
            <div className="hidden md:flex space-x-12 text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">
              <a href="#story" className="hover:text-wedding-gold transition-colors">Story</a>
              <a href="#schedule" className="hover:text-wedding-gold transition-colors">Events</a>
              <a href="#venue" className="hover:text-wedding-gold transition-colors">Venue</a>
              <a href="#rsvp" className="hover:text-wedding-gold transition-colors">RSVP</a>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative p-3 rounded-full hover:bg-wedding-gold/5 transition-colors group"
              >
                 {isPlaying && (
                  <motion.div 
                    layoutId="music-indicator"
                    className="absolute inset-0 rounded-full border border-wedding-gold/20" 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
                {isPlaying ? <Music2 className="w-4 h-4 text-wedding-gold" /> : <Music className="w-4 h-4 text-wedding-gold/30" />}
              </button>
            </div>
          </div>
             </nav>

        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex flex-col items-center pt-24 pb-20 overflow-hidden bg-wedding-cream">
          {/* Background Palace with Dreamy Overlay */}
          <motion.div 
            style={{ opacity: heroOpacity }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-wedding-cream/40 via-wedding-cream/60 to-wedding-cream z-10" />
            <motion.img 
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop" 
              alt="Palace Backdrop"
              className="w-full h-full object-cover opacity-20 grayscale-[20%]"
            />
          </motion.div>

          {/* Cinematic Light Leaks */}
          <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
            <motion.div 
              style={{ x: moveX, y: moveY }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-wedding-gold/20 rounded-full blur-[120px]"
            />
            <motion.div 
              style={{ x: useTransform(moveX, (v) => -v), y: useTransform(moveY, (v) => -v) }}
              animate={{ 
                opacity: [0.05, 0.2, 0.05]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-wedding-accent/10 rounded-full blur-[120px]"
            />
            
            {/* Background Ornaments */}
            <LuxuryOrnament 
              className="absolute top-[10%] left-[5%] w-64 h-64 text-wedding-gold/5" 
              rotate={0}
            />
            <LuxuryOrnament 
              className="absolute bottom-[20%] right-[10%] w-96 h-96 text-wedding-accent/5" 
              rotate={45}
            />
          </div>

          {/* Grain Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none z-[6] opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

          {/* Floating Luxury Particles */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.4, 0],
                  scale: [0, Math.random() * 1 + 0.5, 0],
                  y: ["110vh", "-10vh"],
                  x: [`${Math.random() * 100}vw`, `${(Math.random() * 100) + (Math.random() - 0.5) * 10}vw`]
                }}
                transition={{ 
                  duration: 10 + Math.random() * 10, 
                  repeat: Infinity, 
                  delay: Math.random() * 15,
                  ease: "easeInOut"
                }}
                className="absolute"
              >
                {i % 3 === 0 ? (
                  <Heart className="w-2 h-2 text-wedding-accent/40 fill-current" />
                ) : i % 3 === 1 ? (
                  <div className="w-1 h-1 bg-wedding-gold/40 rounded-full blur-[1px]" />
                ) : (
                  <div className="w-2 h-2 border border-wedding-gold/20 rotate-45" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="relative z-20 w-full max-w-xl mx-auto px-6 flex flex-col items-center text-center">
            {/* Header Names - More centered and formal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="mb-14"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="heading-script text-wedding-accent text-8xl md:text-[10rem] leading-tight px-4">Aether</span>
                <div className="flex items-center gap-6 -my-4 relative z-10">
                  <div className="w-12 h-px bg-wedding-gold/30" />
                  <span className="heading-serif text-wedding-gold italic text-3xl md:text-5xl font-light">weds</span>
                  <div className="w-12 h-px bg-wedding-gold/30" />
                </div>
                <span className="heading-script text-wedding-accent text-8xl md:text-[10rem] leading-tight px-4">Celeste</span>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="mt-8 text-wedding-ink/60 heading-serif text-sm md:text-base italic max-w-xs mx-auto"
              >
                "With our whole hearts, for our whole lives."
              </motion.p>
            </motion.div>

            {/* Date Card - Elegant Card Style */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-full bg-wedding-card/80 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-10 border border-wedding-gold/10 mb-8 relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2 mb-2">
                  <Heart className="w-4 h-4 text-wedding-accent fill-wedding-accent" />
                  <Heart className="w-4 h-4 text-wedding-accent fill-wedding-accent" />
                  <Heart className="w-4 h-4 text-wedding-accent fill-wedding-accent" />
                </div>
                <div className="heading-serif text-wedding-ink text-3xl md:text-5xl font-light tracking-tight">
                  25th October, 2026
                </div>
                <div className="flex items-center gap-3 text-wedding-ink/50 uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold mt-4">
                  <MapPin className="w-3 h-3 text-wedding-gold" />
                  <span>The City Palace, Jaipur</span>
                </div>
              </div>
            </motion.div>

            {/* Map Interaction Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full mt-4 mb-16"
            >
               <button 
                onClick={() => window.open("https://maps.app.goo.gl/35uRov7vj9N6BstK7", "_blank")}
                className="w-full bg-wedding-card rounded-2xl p-4 shadow-xl shadow-black/20 border border-wedding-gold/5 hover:border-wedding-gold/30 transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-wedding-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-full h-32 rounded-xl mb-4 overflow-hidden shadow-inner">
                    <img 
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop" 
                      className="w-full h-full object-cover grayscale-[10%] group-hover:scale-110 transition-transform duration-1000"
                      alt="Map Location"
                    />
                  </div>
                  <span className="heading-serif text-wedding-ink/60 group-hover:text-wedding-ink transition-colors text-xs uppercase tracking-widest font-bold">Touch to Navigate</span>
                </div>
              </button>
            </motion.div>

            {/* Countdown Table Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="w-full px-4"
            >
              <div className="grid grid-cols-4 gap-4 md:gap-8">
                {timeLeft && (Object.entries(timeLeft) as [string, number][]).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center">
                    <motion.div 
                      key={value}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-wedding-accent text-3xl md:text-6xl font-light heading-serif leading-none"
                    >
                      {value < 10 ? `0${value}` : value}
                    </motion.div>
                    <div className="w-full h-px bg-wedding-gold/20 my-3" />
                    <span className="text-wedding-ink/40 uppercase tracking-[0.2em] text-[8px] md:text-[10px] font-bold">
                       {unit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-20 flex flex-col items-center gap-4 text-wedding-gold/40"
            >
              <span className="uppercase tracking-[0.4em] text-[10px] font-bold">Scroll Down</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Story Section - Premium Layout */}
        <section id="story" className="py-40 px-6 bg-wedding-cream overflow-hidden relative">
          {/* Scroll-Bound Background Text */}
          <motion.div 
            style={{ x: useTransform(scrollYProgress, [0.2, 0.5], [100, -100]) }}
            className="absolute top-40 left-0 text-[15rem] font-bold text-wedding-gold/[0.03] whitespace-nowrap pointer-events-none font-serif leading-none"
          >
            OUR ETERNAL STORY
          </motion.div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 relative order-2 lg:order-1">
                <motion.div 
                  initial={{ clipPath: "inset(0 100% 0 0)", scale: 1.2, opacity: 0 }}
                  whileInView={{ clipPath: "inset(0 0% 0 0)", scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl overflow-hidden shadow-2xl relative z-10"
                >
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.5 }}
                    src="https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1974&auto=format&fit=crop" 
                    alt="Story Couple" 
                    className="w-full aspect-[4/5] object-cover"
                  />
                </motion.div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -bottom-10 -left-10 w-60 h-60 bg-wedding-gold/5 rounded-full -z-10 blur-3xl" 
                />
              </div>
              
              <div className="lg:col-span-7 space-y-12 order-1 lg:order-2">
                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true, margin: "-20%" }}
                  className="space-y-8"
                >
                  <motion.div variants={fadeInUp} className="flex items-center gap-4 text-wedding-gold">
                    <Heart className="w-5 h-5" fill="currentColor" />
                    <span className="uppercase tracking-[0.4em] text-[10px] font-bold">Our Journey</span>
                  </motion.div>
                  <motion.h2 variants={fadeInUp} className="heading-serif text-5xl md:text-8xl leading-tight">Beyond the Stars &<br />Across the Oceans</motion.h2>
                  <motion.div variants={fadeInUp} className="w-20 h-1 bg-wedding-gold/20" />
                  <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-wedding-ink/70 leading-relaxed font-light first-letter:text-6xl first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:text-wedding-accent">
                    Our story didn’t begin with a grand gesture, but with a quiet understanding in a rainy bookstore in Amsterdam. A shared admiration for brittle pages and strong coffee sparked a connection that grew stronger through every sunset we shared across different continents.
                  </motion.p>
                  <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-wedding-ink/70 leading-relaxed font-light">
                    From backpacking through the Amalfi Coast to the quiet nights in our first studio apartment, we realized that "home" wasn’t a location on a map, but a feeling in each other's presence.
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section - Animated Grid */}
        <section id="schedule" className="py-20 lg:py-60 bg-wedding-gold/5 px-6 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
             <motion.div 
               style={{ rotate: scrollRotate, x: moveX, y: moveY }}
               className="absolute top-20 right-10 w-96 h-96 bg-wedding-gold/10 rounded-full blur-3xl" 
             />
             <motion.div 
               style={{ x: useTransform(moveX, (v) => -v), y: useTransform(moveY, (v) => -v) }}
               className="absolute bottom-20 left-10 w-96 h-96 bg-wedding-accent/5 rounded-full blur-3xl" 
             />
             <LuxuryOrnament 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-wedding-gold/[0.02]" 
             />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="flex flex-col md:flex-row justify-between items-end mb-32 gap-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-wedding-gold" />
                  <span className="text-wedding-gold uppercase tracking-[0.6em] text-[11px] font-bold">The Celebration</span>
                </div>
                <h2 className="heading-serif text-6xl md:text-8xl leading-none">Wedding Events</h2>
              </div>
              <p className="max-w-md text-wedding-ink/50 text-base md:text-lg italic font-serif leading-relaxed">
                "We have gathered the finest moments to celebrate our union, spanning three days of joy, culture, and dance."
              </p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {EVENTS.map((event, idx) => (
                <motion.div 
                  key={idx}
                  variants={{
                    initial: { opacity: 0, y: 50, scale: 0.9 },
                    whileInView: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
                    }
                  }}
                  className="bg-wedding-card p-12 rounded-[2.5rem] border border-wedding-gold/5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-2xl hover:shadow-wedding-gold/10 transition-all duration-700 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-9xl heading-serif pointer-events-none group-hover:opacity-[0.08] transition-all duration-1000 group-hover:scale-110">
                    0{idx + 1}
                  </div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-5xl mb-10 flex justify-center transform group-hover:scale-125 transition-transform duration-700"
                    >
                      {event.icon}
                    </motion.div>
                    
                    <h3 className="heading-serif text-3xl mb-8 text-center group-hover:text-wedding-accent transition-colors">{event.title}</h3>
                    
                    <div className="space-y-5 text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-wedding-ink/40 mb-10">
                      <div className="flex items-center gap-4 group-hover:text-wedding-ink transition-colors">
                        <div className="w-8 h-8 rounded-full bg-wedding-gold/10 flex items-center justify-center text-wedding-gold">
                          <Calendar className="w-3 h-3" />
                        </div>
                        {event.date}
                      </div>
                      <div className="flex items-center gap-4 group-hover:text-wedding-ink transition-colors">
                        <div className="w-8 h-8 rounded-full bg-wedding-gold/10 flex items-center justify-center text-wedding-gold">
                          <Clock className="w-3 h-3" />
                        </div>
                        {event.time}
                      </div>
                      <div className="flex items-center gap-4 group-hover:text-wedding-ink transition-colors">
                        <div className="w-8 h-8 rounded-full bg-wedding-gold/10 flex items-center justify-center text-wedding-gold">
                          <MapPin className="w-3 h-3" />
                        </div>
                        {event.location}
                      </div>
                    </div>
                    
                    <p className="text-sm md:text-base text-wedding-ink/60 leading-relaxed font-light border-t border-wedding-gold/10 pt-8 group-hover:text-wedding-ink transition-colors">
                      {event.description}
                    </p>
                  </div>

                  {/* Hover effect overlays */}
                  <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/0 to-wedding-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* RSVP Section - Premium Form */}
        <section id="rsvp" className="py-20 lg:py-40 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-wedding-card rounded-[4rem] overflow-hidden shadow-3xl shadow-black/40 border border-wedding-gold/10">
            <div className="relative h-full min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1519225495810-751783d9cf07?q=80&w=2070&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[30%]"
                alt="RSVP Decor"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-wedding-card via-transparent to-transparent" />
              <div className="absolute inset-0 p-16 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-4 text-wedding-gold">Response Requested</span>
                <h2 className="heading-serif text-5xl mb-6 text-wedding-ink">Can you join us?</h2>
                <p className="text-wedding-ink/60 font-light leading-relaxed">Please let us know your plans by August 15th, 2026. We can't wait to see you.</p>
              </div>
            </div>

            <div className="p-12 md:p-20 bg-wedding-card/50 backdrop-blur-sm">
              <form onSubmit={handleRSVP} className="space-y-10">
                <div className="space-y-8">
                  <div className="group border-b border-wedding-gold/30 focus-within:border-wedding-gold transition-colors pb-2">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-wedding-gold/70">Full Name</label>
                    <input required placeholder="Enter your name" className="w-full bg-transparent py-4 outline-none text-lg text-wedding-ink placeholder:text-wedding-ink/40" />
                  </div>
                  <div className="group border-b border-wedding-gold/30 focus-within:border-wedding-gold transition-colors pb-2">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-wedding-gold/70">Attendance</label>
                    <select className="w-full bg-transparent py-3 outline-none text-lg text-wedding-ink appearance-none cursor-pointer">
                      <option className="bg-[#1a1a1a]">Excitedly Attending</option>
                      <option className="bg-[#1a1a1a]">Regretfully Declining</option>
                    </select>
                  </div>
                  <div className="group border-b border-wedding-gold/30 focus-within:border-wedding-gold transition-colors pb-2">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-wedding-gold/70">Guests</label>
                    <input type="number" defaultValue="1" className="w-full bg-transparent py-4 outline-none text-lg text-wedding-ink" />
                  </div>
                </div>

                <button 
                  disabled={rsvpStatus !== 'idle'}
                  className="w-full group bg-wedding-gold text-wedding-cream py-6 rounded-2xl flex items-center justify-between px-10 overflow-hidden relative transition-all hover:bg-white hover:text-wedding-ink disabled:opacity-50"
                >
                  <span className="relative z-10 font-bold uppercase tracking-[0.3em] text-[10px]">
                    {rsvpStatus === 'submitting' ? 'Processing...' : rsvpStatus === 'success' ? 'Confirmed' : 'Submit RSVP'}
                  </span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                  <motion.div 
                    initial={false}
                    animate={rsvpStatus === 'success' ? { scale: 50, opacity: 1 } : { scale: 0, opacity: 0 }}
                    className="absolute inset-0 bg-wedding-sage rounded-full"
                  />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-32 px-6 border-t border-wedding-gold/10 text-center">
            <motion.div {...fadeInUp}>
              <Heart className="w-8 h-8 text-wedding-gold mx-auto mb-12" strokeWidth={1} />
              <h2 className="heading-serif text-5xl mb-6">Aether & Celeste</h2>
              <div className="flex justify-center gap-12 text-[10px] uppercase tracking-[0.5em] font-bold opacity-30 mb-20">
                <span>Jaipur</span>
                <span>2026</span>
                <span>Experience</span>
              </div>
              <div className="flex justify-center gap-8 text-wedding-gold">
                <Share2 className="w-5 h-5 cursor-pointer hover:text-wedding-ink transition-colors" />
                <MapPin className="w-5 h-5 cursor-pointer hover:text-wedding-ink transition-colors" />
                <Music className="w-5 h-5 cursor-pointer hover:text-wedding-ink transition-colors" />
              </div>
              <p className="mt-20 text-[9px] uppercase tracking-[0.6em] text-wedding-ink/20">Designed with Love for Eternal Ties Platform</p>
            </motion.div>
        </footer>

        {/* RSVP Success Overlay */}
        <AnimatePresence>
          {rsvpStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <div className="text-center text-white space-y-8">
                <div className="w-24 h-24 bg-wedding-gold rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="heading-serif text-5xl">Thank You!</h2>
                <p className="text-white/60 tracking-[0.2em] font-light uppercase">We have received your response.</p>
                <button 
                  onClick={() => setRsvpStatus('idle')}
                  className="mt-12 text-xs uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors underline underline-offset-8"
                >
                  Return to Invitation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
