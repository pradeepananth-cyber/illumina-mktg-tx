import React, { useState, useEffect, useRef } from 'react';

// DNA Helix Animation Component
const DNAHelix = () => {
  return (
    <div className="dna-container">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="dna-strand" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="nucleotide left" />
          <div className="bridge" />
          <div className="nucleotide right" />
        </div>
      ))}
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Particle Field Background
const ParticleField = () => {
  return (
    <div className="particle-field">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
};

// Progress Ring Component
const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = '#00D4AA' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle
        className="progress-ring-bg"
        stroke="rgba(255,255,255,0.1)"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="progress-ring-progress"
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
      />
    </svg>
  );
};

// Main App Component
export default function IlluminaTransformation() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((scrolled / maxScroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'hero', label: 'Vision' },
    { id: 'opportunity', label: 'Opportunity' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'solution', label: 'Solution' },
    { id: 'impact', label: 'Impact' },
    { id: 'next', label: 'Next Steps' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #00D4AA;
          --primary-dim: rgba(0, 212, 170, 0.3);
          --secondary: #6366F1;
          --accent: #F472B6;
          --dark: #0A0A0F;
          --darker: #050508;
          --light: #F8FAFC;
          --muted: #64748B;
          --gradient-1: linear-gradient(135deg, #00D4AA 0%, #6366F1 100%);
          --gradient-2: linear-gradient(135deg, #6366F1 0%, #F472B6 100%);
          --gradient-radial: radial-gradient(ellipse at center, rgba(0,212,170,0.15) 0%, transparent 70%);
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Outfit', sans-serif;
          background: var(--darker);
          color: var(--light);
          overflow-x: hidden;
          line-height: 1.6;
        }

        /* Scroll Progress Bar */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: var(--gradient-1);
          z-index: 1000;
          transition: width 0.1s ease-out;
        }

        /* Navigation */
        .nav {
          position: fixed;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .nav-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-dot:hover,
        .nav-dot.active {
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: 0 0 20px var(--primary-dim);
        }

        .nav-dot::after {
          content: attr(data-label);
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          font-family: 'Space Mono', monospace;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: var(--muted);
        }

        .nav-dot:hover::after {
          opacity: 1;
        }

        /* DNA Helix Animation */
        .dna-container {
          position: fixed;
          left: 40px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 4px;
          opacity: 0.3;
          z-index: 1;
        }

        .dna-strand {
          display: flex;
          align-items: center;
          gap: 4px;
          animation: helixSpin 3s ease-in-out infinite;
        }

        .nucleotide {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .nucleotide.left {
          background: var(--primary);
        }

        .nucleotide.right {
          background: var(--secondary);
        }

        .bridge {
          width: 20px;
          height: 2px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          opacity: 0.5;
        }

        @keyframes helixSpin {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.3); }
        }

        /* Particle Field */
        .particle-field {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
          opacity: 0;
          animation: particleFloat 5s ease-in-out infinite;
        }

        @keyframes particleFloat {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 0.6; transform: translateY(-30px) scale(1); }
        }

        /* Sections */
        section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 120px;
          position: relative;
        }

        .section-content {
          max-width: 1200px;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        /* Hero Section */
        .hero {
          background: var(--darker);
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: var(--gradient-radial);
          animation: pulse 8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(0, 212, 170, 0.1);
          border: 1px solid var(--primary-dim);
          border-radius: 100px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 32px;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-badge::before {
          content: '';
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .hero h1 {
          font-size: clamp(48px, 7vw, 96px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -3px;
          margin-bottom: 32px;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .hero h1 .gradient {
          background: var(--gradient-1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 20px;
          color: var(--muted);
          max-width: 600px;
          animation: fadeInUp 0.8s ease-out 0.4s both;
          margin-bottom: 48px;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: var(--gradient-1);
          border: none;
          border-radius: 8px;
          color: var(--darker);
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 212, 170, 0.3);
        }

        .hero-cta svg {
          transition: transform 0.3s ease;
        }

        .hero-cta:hover svg {
          transform: translateX(4px);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 80px;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          transition: all 0.4s ease;
          animation: fadeInUp 0.8s ease-out both;
        }

        .stat-card:nth-child(1) { animation-delay: 0.8s; }
        .stat-card:nth-child(2) { animation-delay: 1s; }
        .stat-card:nth-child(3) { animation-delay: 1.2s; }

        .stat-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: var(--primary-dim);
          transform: translateY(-4px);
        }

        .stat-value {
          font-size: 56px;
          font-weight: 700;
          background: var(--gradient-1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Section Headers */
        .section-header {
          margin-bottom: 64px;
        }

        .section-tag {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 16px;
        }

        .section-title {
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 700;
          letter-spacing: -2px;
          line-height: 1.1;
        }

        /* Market Context Section */
        .market-context {
          background: linear-gradient(180deg, var(--darker) 0%, var(--dark) 100%);
        }

        .context-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }

        .context-card {
          padding: 40px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .context-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-1);
        }

        .context-card.challenge::before {
          background: var(--gradient-2);
        }

        .context-card h3 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .context-card ul {
          list-style: none;
        }

        .context-card li {
          padding: 12px 0;
          padding-left: 24px;
          position: relative;
          color: var(--muted);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .context-card li:last-child {
          border-bottom: none;
        }

        .context-card li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary);
          transform: translateY(-50%);
        }

        .context-card.challenge li::before {
          background: var(--accent);
        }

        /* Solution Architecture */
        .solution {
          background: var(--dark);
        }

        .architecture-visual {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 48px;
        }

        .arch-node {
          background: linear-gradient(135deg, rgba(0,212,170,0.1) 0%, rgba(99,102,241,0.1) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          position: relative;
          transition: all 0.4s ease;
        }

        .arch-node:hover {
          transform: scale(1.02);
          border-color: var(--primary);
          box-shadow: 0 0 40px rgba(0,212,170,0.2);
        }

        .arch-node-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: var(--gradient-1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .arch-node h4 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .arch-node p {
          font-size: 14px;
          color: var(--muted);
        }

        .integration-hub {
          grid-column: 1 / -1;
          background: linear-gradient(180deg, rgba(0,212,170,0.05) 0%, rgba(99,102,241,0.05) 100%);
          border: 2px solid var(--primary);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 40px;
          text-align: left;
        }

        .hub-content h4 {
          font-size: 28px;
          margin-bottom: 12px;
        }

        .hub-content p {
          color: var(--muted);
          max-width: 400px;
        }

        .hub-features {
          display: flex;
          gap: 32px;
        }

        .hub-feature {
          text-align: center;
        }

        .hub-feature-value {
          font-size: 36px;
          font-weight: 700;
          color: var(--primary);
        }

        .hub-feature-label {
          font-size: 12px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Impact Section */
        .impact {
          background: linear-gradient(180deg, var(--dark) 0%, var(--darker) 100%);
        }

        .impact-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .impact-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 48px 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .impact-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .impact-card:nth-child(1)::after { background: var(--primary); }
        .impact-card:nth-child(2)::after { background: var(--secondary); }
        .impact-card:nth-child(3)::after { background: var(--accent); }

        .impact-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .impact-value {
          font-size: 64px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .impact-card:nth-child(1) .impact-value { color: var(--primary); }
        .impact-card:nth-child(2) .impact-value { color: var(--secondary); }
        .impact-card:nth-child(3) .impact-value { color: var(--accent); }

        .impact-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .impact-description {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
        }

        /* Timeline Section */
        .timeline {
          margin-top: 80px;
        }

        .timeline-track {
          display: flex;
          justify-content: space-between;
          position: relative;
          padding: 40px 0;
        }

        .timeline-track::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255,255,255,0.1);
          transform: translateY(-50%);
        }

        .timeline-track::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 33%;
          height: 4px;
          background: var(--gradient-1);
          transform: translateY(-50%);
          animation: timelineProgress 3s ease-out forwards;
        }

        @keyframes timelineProgress {
          from { width: 0; }
          to { width: 100%; }
        }

        .timeline-point {
          position: relative;
          text-align: center;
          z-index: 1;
        }

        .timeline-dot {
          width: 24px;
          height: 24px;
          background: var(--dark);
          border: 4px solid var(--primary);
          border-radius: 50%;
          margin: 0 auto 16px;
        }

        .timeline-label {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .timeline-title {
          font-size: 16px;
          font-weight: 600;
          margin-top: 8px;
        }

        /* CTA Section */
        .cta-section {
          background: var(--darker);
          position: relative;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%);
        }

        .cta-content {
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .cta-content h2 {
          font-size: clamp(40px, 5vw, 72px);
          font-weight: 700;
          letter-spacing: -2px;
          margin-bottom: 24px;
        }

        .cta-content p {
          font-size: 20px;
          color: var(--muted);
          max-width: 600px;
          margin: 0 auto 48px;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 20px 48px;
          background: transparent;
          border: 2px solid var(--primary);
          border-radius: 12px;
          color: var(--primary);
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gradient-1);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }

        .cta-button:hover::before {
          opacity: 1;
        }

        .cta-button:hover {
          color: var(--darker);
          border-color: transparent;
          transform: scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 212, 170, 0.4);
        }

        .cta-details {
          margin-top: 48px;
          display: flex;
          justify-content: center;
          gap: 48px;
        }

        .cta-detail {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--muted);
        }

        .cta-detail svg {
          color: var(--primary);
        }

        /* Footer */
        .footer {
          padding: 40px 120px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--muted);
          font-size: 14px;
        }

        .footer-logo {
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          color: var(--light);
          letter-spacing: 2px;
        }

        /* Progress Ring */
        .progress-ring {
          transform: rotate(-90deg);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          section {
            padding: 60px 40px;
          }

          .nav {
            right: 20px;
          }

          .dna-container {
            display: none;
          }

          .stats-grid,
          .context-grid,
          .architecture-visual,
          .impact-metrics {
            grid-template-columns: 1fr;
          }

          .integration-hub {
            flex-direction: column;
            gap: 32px;
            text-align: center;
          }

          .hub-content p {
            max-width: none;
          }

          .footer {
            padding: 40px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .nav {
            display: none;
          }

          .timeline-track {
            flex-direction: column;
            gap: 32px;
          }

          .timeline-track::before,
          .timeline-track::after {
            display: none;
          }

          .cta-details {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>

      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      
      <ParticleField />
      <DNAHelix />

      <nav className="nav">
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`nav-dot ${activeSection === index ? 'active' : ''}`}
            data-label={section.label}
            onClick={() => setActiveSection(index)}
          />
        ))}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="section-content">
          <div className="hero-badge">
            <span>Marketing Transformation</span>
          </div>
          <h1>
            From Fragmented<br />
            to <span className="gradient">Unified & AI-Powered</span>
          </h1>
          <p className="hero-subtitle">
            A strategic initiative to transform Illumina's marketing ecosystem, 
            accelerating growth and expanding margins through intelligent automation 
            and unified data architecture.
          </p>
          <a href="#opportunity" className="hero-cta">
            Explore the Vision
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value"><AnimatedCounter end={2} />x</div>
              <div className="stat-label">Campaign Launches Per Quarter</div>
            </div>
            <div className="stat-card">
              <div className="stat-value"><AnimatedCounter end={20} />%</div>
              <div className="stat-label">Shorter Sales Cycles</div>
            </div>
            <div className="stat-card">
              <div className="stat-value"><AnimatedCounter end={100} />%</div>
              <div className="stat-label">More Qualified Clinical Opportunities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Context Section */}
      <section id="opportunity" className="market-context">
        <div className="section-content">
          <div className="section-header">
            <div className="section-tag">Market Context</div>
            <h2 className="section-title">The Genomics Market<br />Is Rapidly Evolving</h2>
          </div>

          <div className="context-grid">
            <div className="context-card">
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                Market Dynamics
              </h3>
              <ul>
                <li>Sequencing becoming commoditized</li>
                <li>Multiomics emerging as new growth frontier</li>
                <li>Agentic AI transforming B2B discovery</li>
                <li>Real-time data essential for pipeline generation</li>
                <li>Personalized buyer journeys now table stakes</li>
              </ul>
            </div>

            <div className="context-card challenge">
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                External Pressures
              </h3>
              <ul>
                <li>China market collapse</li>
                <li>Research funding softness</li>
                <li>Increasing pricing pressure</li>
                <li>Competitive market dynamics</li>
                <li>Evolving customer expectations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="market-context">
        <div className="section-content">
          <div className="section-header">
            <div className="section-tag">Current State</div>
            <h2 className="section-title">Material Obstacles<br />Impeding Growth</h2>
          </div>

          <div className="context-grid">
            <div className="context-card challenge">
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 9h6M9 15h6"/>
                </svg>
                Fragmented Martech Stack
              </h3>
              <ul>
                <li>Organically evolved technology landscape</li>
                <li>Critical functionality gaps</li>
                <li>Disjointed customer experience</li>
                <li>Limited campaign precision</li>
                <li>Incomplete customer view</li>
              </ul>
            </div>

            <div className="context-card challenge">
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Distributed Operations
              </h3>
              <ul>
                <li>Suboptimal time-to-market</li>
                <li>Increased operational costs</li>
                <li>Longer sales cycles</li>
                <li>Delayed revenue realization</li>
                <li>Limited pharma partner engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="solution">
        <div className="section-content">
          <div className="section-header">
            <div className="section-tag">Proposed Solution</div>
            <h2 className="section-title">Unified, Enterprise-Grade<br />Marketing Ecosystem</h2>
          </div>

          <div className="architecture-visual">
            <div className="arch-node">
              <div className="arch-node-icon">☁️</div>
              <h4>Salesforce</h4>
              <p>CRM & Sales Automation</p>
            </div>
            <div className="arch-node">
              <div className="arch-node-icon">🎨</div>
              <h4>Adobe</h4>
              <p>Experience & Content Platform</p>
            </div>
            <div className="arch-node">
              <div className="arch-node-icon">❄️</div>
              <h4>Snowflake</h4>
              <p>Data Cloud & Analytics</p>
            </div>
            <div className="arch-node integration-hub">
              <div className="hub-content">
                <h4>Integrated Marketing OS</h4>
                <p>AI-first marketing operations with dedicated cross-functional pods and autonomous tools</p>
              </div>
              <div className="hub-features">
                <div className="hub-feature">
                  <div className="hub-feature-value">360°</div>
                  <div className="hub-feature-label">Customer View</div>
                </div>
                <div className="hub-feature">
                  <div className="hub-feature-value">Real-Time</div>
                  <div className="hub-feature-label">Data Sync</div>
                </div>
                <div className="hub-feature">
                  <div className="hub-feature-value">AI-First</div>
                  <div className="hub-feature-label">Operations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="impact">
        <div className="section-content">
          <div className="section-header">
            <div className="section-tag">Expected Impact</div>
            <h2 className="section-title">Transformational<br />Business Outcomes</h2>
          </div>

          <div className="impact-metrics">
            <div className="impact-card">
              <div className="impact-icon">
                <ProgressRing progress={75} color="#00D4AA" />
              </div>
              <div className="impact-value">Days</div>
              <div className="impact-title">Speed to Market</div>
              <div className="impact-description">
                Campaign launch timelines reduced from months to days, 
                enabling 2x additional launches per quarter
              </div>
            </div>

            <div className="impact-card">
              <div className="impact-icon">
                <ProgressRing progress={80} color="#6366F1" />
              </div>
              <div className="impact-value">~20%</div>
              <div className="impact-title">Shorter Sales Cycles</div>
              <div className="impact-description">
                Decreased lead-to-close duration for priority product lines, 
                driving incremental instrument pull-through
              </div>
            </div>

            <div className="impact-card">
              <div className="impact-icon">
                <ProgressRing progress={100} color="#F472B6" />
              </div>
              <div className="impact-value">~100%</div>
              <div className="impact-title">Clinical Pipeline Growth</div>
              <div className="impact-description">
                Increased qualified clinical opportunities through 
                unified, real-time data integration
              </div>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-track">
              <div className="timeline-point">
                <div className="timeline-dot" />
                <div className="timeline-label">Phase 1</div>
                <div className="timeline-title">Foundation</div>
              </div>
              <div className="timeline-point">
                <div className="timeline-dot" />
                <div className="timeline-label">Phase 2</div>
                <div className="timeline-title">Integration</div>
              </div>
              <div className="timeline-point">
                <div className="timeline-dot" />
                <div className="timeline-label">Phase 3</div>
                <div className="timeline-title">AI Activation</div>
              </div>
              <div className="timeline-point">
                <div className="timeline-dot" />
                <div className="timeline-label">Phase 4</div>
                <div className="timeline-title">Scale & Optimize</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="next" className="cta-section">
        <div className="section-content">
          <div className="cta-content">
            <h2>Let's Define the Future</h2>
            <p>
              Schedule a 2-hour working session to define specific metrics 
              and scope the initial phases of this marketing transformation.
            </p>
            <button className="cta-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Schedule Working Session
            </button>
            <div className="cta-details">
              <div className="cta-detail">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>2-Hour Session</span>
              </div>
              <div className="cta-detail">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>Cross-Functional Leadership</span>
              </div>
              <div className="cta-detail">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <span>Define KPIs & Milestones</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">ILLUMINA × TRANSFORMATION</div>
        <div>Confidential — For Discussion Purposes Only</div>
      </footer>
    </>
  );
}