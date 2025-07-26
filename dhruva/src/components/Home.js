import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const testimonials = [
    {
      name: "Priya Sharma",
      designation: "Software Engineer",
      text: "This platform helped me create a professional resume in minutes. The government backing gives it credibility!",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      designation: "Civil Services Aspirant",
      text: "Multiple language support made it easy for me to create resumes in both Hindi and English.",
      rating: 5
    },
    {
      name: "Anjali Patel",
      designation: "Fresh Graduate",
      text: "User-friendly interface and professional templates. Perfect for government job applications!",
      rating: 4
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const navigateToLogin = () => {
    console.log('Navigate to login page');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.govBranding}>
            <img 
              src="emblem.png" 
              alt="Government Logo" 
              style={styles.govLogo}
            />
            <div style={styles.navBrand}>
              <h2 style={styles.brandText}>Dhruva</h2>
            </div>
            <div style={styles.govText}>
              <div style={styles.govTitle}>Government of India</div>
              <div style={styles.govSubtitle}>Ministry of Electronics & IT</div>
            </div>
          </div>
          <nav style={styles.navbar}>
            
            <div style={styles.navLinks}>
              <a href="#home" style={styles.navLink}>Home</a>
              <a href="#features" style={styles.navLink}>Features</a>
              <a href="#templates" style={styles.navLink}>Templates</a>
              <a href="#about" style={styles.navLink}>About</a>
              <a href="#contact" style={styles.navLink}>Contact</a>
            </div>
            <button 
              style={styles.mobileMenu}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </nav>
          <button style={styles.loginBtn} onClick={navigateToLogin}>
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Build Your Professional Resume
              <span style={styles.highlight}> with Government Trust</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Create stunning, professional resumes with our AI-powered platform. 
              Trusted by millions of Indians for government and private sector opportunities.
            </p>
            <div style={styles.heroButtons}>
              <button style={styles.ctaButton} onClick={navigateToLogin}>
                Start Building Now
              </button>
              <button style={styles.secondaryButton}>
                View Templates
              </button>
            </div>
          </div>
          <div style={styles.heroImage}>
            <div style={styles.resumePreview}>
              <div style={styles.resumeHeader}></div>
              <div style={styles.resumeLine}></div>
              <div style={styles.resumeLine}></div>
              <div style={styles.resumeLine}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Make in India Section */}
      <section style={styles.makeInIndia}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>🇮🇳 Proudly Make in India</h2>
          <p style={styles.sectionText}>
            Developed with pride under the Make in India initiative, supporting 
            local innovation and digital transformation across the nation.
          </p>
          <div style={styles.makeInIndiaLogos}>
            <div style={styles.logoItem}>
              <div style={styles.makeInIndiaLogo}>🏭</div>
              <span>Local Innovation</span>
            </div>
            <div style={styles.logoItem}>
              <div style={styles.makeInIndiaLogo}>💼</div>
              <span>Job Creation</span>
            </div>
            <div style={styles.logoItem}>
              <div style={styles.makeInIndiaLogo}>🌐</div>
              <span>Global Standards</span>
            </div>
          </div>
        </div>
      </section>

      {/* Digital India Section */}
      <section style={styles.digitalIndia}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Part of Digital India Mission 🚀</h2>
          <div style={styles.digitalIndiaGrid}>
            <div style={styles.digitalCard}>
              <h3>Digital Empowerment</h3>
              <p>Empowering citizens with digital tools for career advancement</p>
            </div>
            <div style={styles.digitalCard}>
              <h3>Paperless Process</h3>
              <p>Complete resume creation and sharing without any paperwork</p>
            </div>
            <div style={styles.digitalCard}>
              <h3>Skill Development</h3>
              <p>Integrated with government skill development programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Why Choose Our Platform?</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🌏</div>
              <h3>Multilingual Support</h3>
              <p>Create resumes in Hindi, English, Tamil, Telugu, Bengali, and 18+ Indian languages</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎨</div>
              <h3>Professional Templates</h3>
              <p>Government-approved templates suitable for all sectors</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔒</div>
              <h3>Secure & Private</h3>
              <p>Government-grade security for your personal information</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⚡</div>
              <h3>AI-Powered</h3>
              <p>Smart suggestions and formatting powered by artificial intelligence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.testimonials}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>What Our Users Say</h2>
          <div style={styles.testimonialContainer}>
            <div style={styles.testimonialCard}>
              <div style={styles.testimonialText}>
                "{testimonials[currentTestimonial].text}"
              </div>
              <div style={styles.testimonialAuthor}>
                <strong>{testimonials[currentTestimonial].name}</strong>
                <br />
                <span>{testimonials[currentTestimonial].designation}</span>
              </div>
              <div style={styles.rating}>
                {'⭐'.repeat(testimonials[currentTestimonial].rating)}
              </div>
            </div>
          </div>
          <div style={styles.testimonialDots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                style={{
                  ...styles.dot,
                  ...(index === currentTestimonial ? styles.activeDot : {})
                }}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.sectionContent}>
          <h2 style={styles.ctaTitle}>Ready to Build Your Future?</h2>
          <p style={styles.ctaText}>Join millions of Indians who trust our platform</p>
          <button style={styles.ctaLargeButton} onClick={navigateToLogin}>
            Get Started Today - It's Free!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4>Resume Builder India</h4>
            <p>A Digital India Initiative</p>
            <p>Building careers, Building India</p>
          </div>
          <div style={styles.footerSection}>
            <h4>Quick Links</h4>
            <a href="#privacy" style={styles.footerLink}>Privacy Policy</a>
            <a href="#terms" style={styles.footerLink}>Terms of Service</a>
            <a href="#help" style={styles.footerLink}>Help & Support</a>
          </div>
          <div style={styles.footerSection}>
            <h4>Government Links</h4>
            <a href="#mygov" style={styles.footerLink}>MyGov.in</a>
            <a href="#india" style={styles.footerLink}>India.gov.in</a>
            <a href="#digital" style={styles.footerLink}>Digital India</a>
          </div>
          <div style={styles.footerSection}>
            <h4>Languages Supported</h4>
            <p>हिंदी • English • தமிழ் • తెలుగు • বাংলা</p>
            <p>And 15+ more Indian languages</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2024 Government of India. All rights reserved. | Last updated: July 2024</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    lineHeight: 1.6,
    color: '#333',
  },
  header: {
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '3px solid #FF6600',
  },
  headerTop: {
    background: 'linear-gradient(135deg, #FF6600 0%, #FF8533 50%, #138808 100%)',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  govBranding: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    zIndex: 2,
    position: 'relative',
  },
  govLogo: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: '2px',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
  },
  govText: {
    lineHeight: 1.3,
  },
  govTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },
  govSubtitle: {
    fontSize: '13px',
    opacity: 0.9,
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    color: '#FF6600',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: '10px 25px',
    borderRadius: '25px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    fontSize: '14px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 2,
  },
  navbar: {
    padding: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: '1',
    maxWidth: '800px',
    margin: '0 20px',
  },
  navBrand: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    letterSpacing: '1px',
  },
  brandText: {
    margin: 0,
    background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFFFFF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '28px',
    fontWeight: 'bold',
    textShadow: 'none',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  navLinks: {
    display: 'flex',
    gap: '35px',
    margin: '0 30px',
  },
  navLink: {
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    position: 'relative',
    padding: '8px 12px',
    borderRadius: '20px',
    backdropFilter: 'blur(5px)',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },
  mobileMenu: {
    display: 'none',
    background: 'rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '20px',
    padding: '8px 12px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  hero: {
    background: 'linear-gradient(135deg, #FF6600 0%, #FF8533 100%)',
    color: 'white',
    padding: '80px 20px',
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },
  heroText: {
    animation: 'slideInLeft 1s ease-out',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: 1.2,
  },
  highlight: {
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '30px',
    opacity: 0.9,
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  ctaButton: {
    backgroundColor: 'white',
    color: '#FF6600',
    border: 'none',
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: 'translateY(0)',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  heroImage: {
    display: 'flex',
    justifyContent: 'center',
    animation: 'slideInRight 1s ease-out',
  },
  resumePreview: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    width: '300px',
    animation: 'float 3s ease-in-out infinite',
  },
  resumeHeader: {
    backgroundColor: '#FF6600',
    height: '20px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  resumeLine: {
    backgroundColor: '#ddd',
    height: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    animation: 'pulse 2s ease-in-out infinite',
  },
  makeInIndia: {
    backgroundColor: '#f8f9fa',
    padding: '80px 20px',
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#FF6600',
  },
  sectionText: {
    fontSize: '18px',
    marginBottom: '40px',
    color: '#666',
    maxWidth: '800px',
    margin: '0 auto 40px',
  },
  makeInIndiaLogos: {
    display: 'flex',
    justifyContent: 'center',
    gap: '60px',
    flexWrap: 'wrap',
  },
  logoItem: {
    textAlign: 'center',
    animation: 'bounceIn 1s ease-out',
  },
  makeInIndiaLogo: {
    fontSize: '60px',
    marginBottom: '10px',
    transition: 'transform 0.3s ease',
  },
  digitalIndia: {
    backgroundColor: '#fff',
    padding: '80px 20px',
  },
  digitalIndiaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '40px',
  },
  digitalCard: {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid #e9ecef',
  },
  features: {
    backgroundColor: '#f8f9fa',
    padding: '80px 20px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '40px',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  featureIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  testimonials: {
    backgroundColor: '#FF6600',
    color: 'white',
    padding: '80px 20px',
  },
  testimonialContainer: {
    maxWidth: '800px',
    margin: '40px auto',
  },
  testimonialCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '40px',
    borderRadius: '15px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  testimonialText: {
    fontSize: '20px',
    fontStyle: 'italic',
    marginBottom: '20px',
    lineHeight: 1.6,
  },
  testimonialAuthor: {
    marginBottom: '15px',
  },
  rating: {
    fontSize: '24px',
  },
  testimonialDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '30px',
  },
  dot: {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    border: '2px solid white',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  activeDot: {
    backgroundColor: 'white',
  },
  cta: {
    backgroundColor: '#fff',
    padding: '80px 20px',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#FF6600',
  },
  ctaText: {
    fontSize: '20px',
    marginBottom: '40px',
    color: '#666',
  },
  ctaLargeButton: {
    backgroundColor: '#FF6600',
    color: 'white',
    border: 'none',
    padding: '20px 40px',
    fontSize: '20px',
    fontWeight: 'bold',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(255,102,0,0.3)',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '60px 20px 20px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
  },
  footerSection: {
    lineHeight: 1.8,
  },
  footerLink: {
    color: '#ccc',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '5px',
    transition: 'color 0.3s ease',
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '40px auto 0',
    paddingTop: '20px',
    borderTop: '1px solid #555',
    textAlign: 'center',
    fontSize: '14px',
    color: '#ccc',
  },
  // CSS Animations (using CSS-in-JS style)
  '@keyframes slideInLeft': {
    '0%': { transform: 'translateX(-100px)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 }
  },
  '@keyframes slideInRight': {
    '0%': { transform: 'translateX(100px)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 }
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' }
  },
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 }
  },
  '@keyframes bounceIn': {
    '0%': { transform: 'scale(0)', opacity: 0 },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)', opacity: 1 }
  }
};