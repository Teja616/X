import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 for Aadhar, 2 for OTP
  const [aadharNumber, setAadharNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Backend configuration - replace with your actual endpoint
  const BACKEND_URL = 'https://your-backend-api.com'; // Replace with your backend URL
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // Add any additional headers you need
  };

  const validateAadhar = (number) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(number.replace(/\s/g, ''));
  };

  const formatAadhar = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 12);
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadharSubmit = async (e) => {
    e.preventDefault();
    const cleanAadhar = aadharNumber.replace(/\s/g, '');
    
    if (!validateAadhar(cleanAadhar)) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/send-otp`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          aadharNumber: cleanAadhar
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
        startResendTimer();
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/verify-otp`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          aadharNumber: aadharNumber.replace(/\s/g, ''),
          otp: otp
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store authentication token if provided
        if (data.token) {
          sessionStorage.setItem('authToken', data.token);
        }
        
        // Navigate to resume building page
        console.log('Authentication successful, navigating to resume builder');
        alert('Login successful! Redirecting to resume builder...');
        navigateToResumeBuilder();
        // In a real app, use your routing solution here
        // e.g., navigate('/resume-builder');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToResumeBuilder = () => {
    navigate('/resume-builder');
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/resend-otp`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          aadharNumber: aadharNumber.replace(/\s/g, '')
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('OTP resent successfully!');
        startResendTimer();
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBackToHome = () => {
    console.log('Navigate back to home page');
    // In a real app, use your routing solution
    navigate('/');
  };

  const handleAadharChange = (e) => {
    const formatted = formatAadhar(e.target.value);
    setAadharNumber(formatted);
    setError('');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  return (
    <div style={styles.container}>
      {/* Header - Same as Home Page */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.govBranding}>
            <img 
              src="emblem.png" 
              alt="Government Logo" 
              style={styles.govLogo}
            />
            <div style={styles.govText}>
              <div style={styles.govTitle}>Government of India</div>
              <div style={styles.govSubtitle}>Ministry of Electronics & IT</div>
            </div>
          </div>
          <nav style={styles.navbar}>
            <div style={styles.navBrand}>
              <h2 style={styles.brandText}>Dhruva</h2>
            </div>
          </nav>
          <button style={styles.backBtn} onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </header>

      {/* Login Section */}
      <section style={styles.loginSection}>
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            <div style={styles.loginHeader}>
              <h1 style={styles.loginTitle}>Secure Login</h1>
              <p style={styles.loginSubtitle}>
                {step === 1 
                  ? 'Enter your Aadhar number to receive OTP'
                  : 'Enter the OTP sent to your registered mobile number'
                }
              </p>
            </div>

            {error && (
              <div style={styles.errorMessage}>
                <span style={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            {step === 1 ? (
              <div style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Aadhar Number</label>
                  <input
                    type="text"
                    value={aadharNumber}
                    onChange={handleAadharChange}
                    placeholder="XXXX XXXX XXXX"
                    style={styles.input}
                    maxLength="14"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAadharSubmit(e);
                      }
                    }}
                  />
                  <div style={styles.inputHint}>
                    Enter your 12-digit Aadhar number
                  </div>
                </div>

                <button 
                  onClick={handleAadharSubmit}
                  style={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={styles.loadingSpinner}>🔄 Sending OTP...</span>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
            ) : (
              <div style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="XXXXXX"
                    style={styles.otpInput}
                    maxLength="6"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleOtpSubmit(e);
                      }
                    }}
                  />
                  <div style={styles.inputHint}>
                    OTP sent to mobile number linked with Aadhar: 
                    <strong> {aadharNumber}</strong>
                  </div>
                </div>

                <div style={styles.otpActions}>
                  <button 
                    onClick={handleOtpSubmit}
                    style={styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <span style={styles.loadingSpinner}>🔄 Verifying...</span>
                    ) : (
                      'Verify & Login'
                    )}
                  </button>

                  <div style={styles.resendSection}>
                    <button
                      onClick={handleResendOtp}
                      style={{
                        ...styles.resendButton,
                        ...(resendTimer > 0 ? styles.resendDisabled : {})
                      }}
                      disabled={resendTimer > 0 || loading}
                    >
                      {resendTimer > 0 
                        ? `Resend OTP in ${resendTimer}s` 
                        : 'Resend OTP'
                      }
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                      setError('');
                      setResendTimer(0);
                    }}
                    style={styles.backButton}
                  >
                    ← Change Aadhar Number
                  </button>
                </div>
              </div>
            )}

            <div style={styles.securityNote}>
              <div style={styles.securityIcon}>🔒</div>
              <div>
                <strong>Your privacy is protected</strong>
                <br />
                This is a secure government platform. Your Aadhar information is encrypted and protected.
              </div>
            </div>
          </div>

          <div style={styles.loginBenefits}>
            <h3 style={styles.benefitsTitle}>Why Login with Aadhar?</h3>
            <div style={styles.benefitsList}>
              <div style={styles.benefitItem}>
                <span style={styles.benefitIcon}>✅</span>
                <span>Government verified identity</span>
              </div>
              <div style={styles.benefitItem}>
                <span style={styles.benefitIcon}>🔐</span>
                <span>Secure authentication</span>
              </div>
              <div style={styles.benefitItem}>
                <span style={styles.benefitIcon}>📱</span>
                <span>Quick OTP verification</span>
              </div>
              <div style={styles.benefitItem}>
                <span style={styles.benefitIcon}>💼</span>
                <span>Access to government job portals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Same as Home Page */}
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
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
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
  backBtn: {
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
  loginSection: {
    padding: '60px 20px',
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    maxWidth: '1000px',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'start',
  },
  loginCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef',
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  loginTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#FF6600',
    marginBottom: '10px',
  },
  loginSubtitle: {
    fontSize: '16px',
    color: '#666',
    lineHeight: 1.5,
  },
  errorMessage: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #fcc',
  },
  errorIcon: {
    fontSize: '20px',
  },
  form: {
    marginBottom: '30px',
  },
  inputGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    letterSpacing: '2px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  otpInput: {
    width: '100%',
    padding: '20px',
    fontSize: '24px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    letterSpacing: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputHint: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#FF6600',
    color: 'white',
    border: 'none',
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(255,102,0,0.3)',
    marginBottom: '15px',
  },
  otpActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  resendSection: {
    textAlign: 'center',
  },
  resendButton: {
    backgroundColor: 'transparent',
    color: '#FF6600',
    border: '2px solid #FF6600',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  resendDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  securityNote: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
    border: '1px solid #e9ecef',
  },
  securityIcon: {
    fontSize: '24px',
    marginTop: '2px',
  },
  loginBenefits: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    height: 'fit-content',
  },
  benefitsTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FF6600',
    marginBottom: '25px',
    textAlign: 'center',
  },
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontSize: '16px',
    color: '#333',
  },
  benefitIcon: {
    fontSize: '20px',
    minWidth: '24px',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '60px 20px 20px',
    marginTop: 'auto',
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
};