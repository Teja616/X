
import { useState, useRef, useEffect } from 'react'

export default function res() {
  const [recording, setRecording] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    location: '',
    objective: '',
    technicalSkills: {
      frontend: [],
      backend: [],
      database: [],
      tools: [],
      languages: []
    },
    projects: [],
    education: {
      degree: '',
      university: '',
      year: '',
      cgpa: ''
    },
    certifications: [],
    achievements: [],
    languages: []
  })

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const resumeSteps = [
    {
      id: 'name',
      question: 'Please tell me your full name',
      placeholder: 'e.g., John Doe',
      type: 'basic'
    },
    {
      id: 'email',
      question: 'What is your email address?',
      placeholder: 'e.g., john.doe@gmail.com',
      type: 'basic'
    },
    {
      id: 'phone',
      question: 'Please provide your phone number',
      placeholder: 'e.g., +91 9876543210',
      type: 'basic'
    },
    {
      id: 'location',
      question: 'What is your current location or city?',
      placeholder: 'e.g., Hyderabad, Telangana',
      type: 'basic'
    },
    {
      id: 'github',
      question: 'What is your GitHub profile URL or username?',
      placeholder: 'e.g., github.com/johndoe',
      type: 'basic'
    },
    {
      id: 'linkedin',
      question: 'What is your LinkedIn profile URL?',
      placeholder: 'e.g., linkedin.com/in/johndoe',
      type: 'basic'
    },
    {
      id: 'education',
      question: 'Tell me about your education - degree, university name, graduation year, and CGPA if you want to include it',
      placeholder: 'e.g., B.Tech in Computer Science Engineering from ABC University, graduated in 2024 with 8.5 CGPA',
      type: 'education'
    },
    {
      id: 'objective',
      question: 'Describe your career objective or what kind of role you are seeking as a full-stack developer',
      placeholder: 'e.g., Seeking opportunities to work as a full-stack developer where I can utilize my skills in React and Node.js',
      type: 'objective'
    },
    {
      id: 'frontend',
      question: 'List your frontend technologies and skills (React, HTML, CSS, JavaScript, etc.)',
      placeholder: 'e.g., React, JavaScript, HTML5, CSS3, Tailwind CSS, Bootstrap',
      type: 'skills'
    },
    {
      id: 'backend',
      question: 'What backend technologies do you know? (Node.js, Express, Python, etc.)',
      placeholder: 'e.g., Node.js, Express.js, Python, REST APIs',
      type: 'skills'
    },
    {
      id: 'database',
      question: 'Which databases have you worked with?',
      placeholder: 'e.g., MongoDB, MySQL, PostgreSQL, Firebase',
      type: 'skills'
    },
    {
      id: 'tools',
      question: 'What development tools and technologies are you familiar with?',
      placeholder: 'e.g., Git, GitHub, VS Code, Postman, Docker, AWS',
      type: 'skills'
    },
    {
      id: 'languages',
      question: 'Which programming languages do you know?',
      placeholder: 'e.g., JavaScript, Python, Java, C++',
      type: 'skills'
    },
    {
      id: 'projects',
      question: 'Describe your projects one by one. Include project name, technologies used, and key features. Say "next project" to add another project or "done with projects" to finish.',
      placeholder: 'e.g., E-commerce Website using React, Node.js, MongoDB with features like user authentication, shopping cart, payment integration',
      type: 'projects'
    },
    {
      id: 'certifications',
      question: 'Do you have any certifications? If yes, please mention them. If no, just say "no certifications"',
      placeholder: 'e.g., AWS Cloud Practitioner, Google Cloud Associate, MongoDB Certified Developer',
      type: 'optional'
    },
    {
      id: 'achievements',
      question: 'Any achievements, hackathons, or awards you want to mention? If none, say "no achievements"',
      placeholder: 'e.g., Winner of college hackathon, Dean\'s list, published research paper',
      type: 'optional'
    },
    {
      id: 'spokenLanguages',
      question: 'Which languages can you speak? (English, Hindi, etc.)',
      placeholder: 'e.g., English, Hindi, Telugu',
      type: 'basic'
    }
  ]

  const handleMicClick = async () => {
    if (recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          const base64Audio = await blobToBase64(audioBlob)
          const transcription = await getTranscriptionFromBhashini(base64Audio)
          processTranscription(transcription)
        }

        mediaRecorder.start()
        setRecording(true)
      } catch (error) {
        console.error('Error accessing microphone:', error)
        alert('Please allow microphone access to use voice input.')
      }
    }
  }

  const processTranscription = (transcription) => {
    if (!transcription || transcription === '[No text returned]' || transcription === '[Transcription failed]') {
      return
    }

    const currentStepData = resumeSteps[currentStep]
    const cleanText = transcription.trim()

    setResumeData(prev => {
      const updated = { ...prev }
      
      switch (currentStepData.id) {
        case 'name':
          updated.name = cleanText
          break
        case 'email':
          updated.email = cleanText
          break
        case 'phone':
          updated.phone = cleanText
          break
        case 'location':
          updated.location = cleanText
          break
        case 'github':
          updated.github = cleanText.includes('github.com') ? cleanText : `github.com/${cleanText}`
          break
        case 'linkedin':
          updated.linkedin = cleanText.includes('linkedin.com') ? cleanText : `linkedin.com/in/${cleanText}`
          break
        case 'education':
          // Parse education info
          const eduText = cleanText.toLowerCase()
          updated.education = {
            degree: cleanText,
            university: '',
            year: '',
            cgpa: ''
          }
          break
        case 'objective':
          updated.objective = cleanText
          break
        case 'frontend':
          updated.technicalSkills.frontend = cleanText.split(',').map(s => s.trim()).filter(s => s)
          break
        case 'backend':
          updated.technicalSkills.backend = cleanText.split(',').map(s => s.trim()).filter(s => s)
          break
        case 'database':
          updated.technicalSkills.database = cleanText.split(',').map(s => s.trim()).filter(s => s)
          break
        case 'tools':
          updated.technicalSkills.tools = cleanText.split(',').map(s => s.trim()).filter(s => s)
          break
        case 'languages':
          updated.technicalSkills.languages = cleanText.split(',').map(s => s.trim()).filter(s => s)
          break
        case 'projects':
          if (cleanText.toLowerCase().includes('done with projects')) {
            // Move to next step
          } else if (cleanText.toLowerCase().includes('next project')) {
            // Stay on same step for next project
            return updated
          } else {
            updated.projects.push(cleanText)
          }
          break
        case 'certifications':
          if (!cleanText.toLowerCase().includes('no certifications')) {
            updated.certifications = cleanText.split(',').map(s => s.trim()).filter(s => s)
          }
          break
        case 'achievements':
          if (!cleanText.toLowerCase().includes('no achievements')) {
            updated.achievements = cleanText.split(',').map(s => s.trim()).filter(s => s)
          }
          break
        case 'spokenLanguages':
          updated.languages = cleanText.split(',').map(s => s.trim()).filter(s => s)
          break
      }
      
      return updated
    })

    // Move to next step
    if (currentStep < resumeSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const getTranscriptionFromBhashini = async (base64Audio) => {
    try {
      // Simulated response for demo - replace with actual Bhashini API call
      const mockResponses = [
        "John Doe",
        "john.doe@email.com",
        "+91 9876543210",
        "Hyderabad, Telangana",
        "github.com/johndoe",
        "linkedin.com/in/johndoe",
        "B.Tech in Computer Science Engineering from ABC University, graduated in 2024 with 8.5 CGPA",
        "Seeking a challenging role as a Full Stack Developer where I can utilize my technical skills to build scalable web applications",
        "React, JavaScript, HTML5, CSS3, Tailwind CSS, Bootstrap, TypeScript",
        "Node.js, Express.js, Python, REST APIs, GraphQL",
        "MongoDB, MySQL, PostgreSQL, Firebase",
        "Git, GitHub, VS Code, Postman, Docker, AWS, Vercel",
        "JavaScript, Python, Java, C++",
        "E-commerce Website built with React, Node.js, and MongoDB featuring user authentication, shopping cart, and payment integration",
        "AWS Cloud Practitioner, MongoDB Certified Developer",
        "Winner of college hackathon 2023, Dean's list for academic excellence",
        "English, Hindi, Telugu"
      ]
      
      return mockResponses[currentStep] || "Sample response"
      
      /* 
      // Actual Bhashini API call - uncomment and configure
      const response = await fetch('https://your-bhashini-asr-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          audioContent: base64Audio,
          config: {
            languageCode: 'en-IN'
          }
        })
      })
      const data = await response.json()
      return data.transcription || '[No text returned]'
      */
    } catch (err) {
      console.error('ASR error:', err)
      return '[Transcription failed]'
    }
  }

  const generateATSResume = () => {
    const formatSkills = (skillArray) => skillArray.join(' • ')
    
    return `${resumeData.name.toUpperCase()}
${resumeData.email} | ${resumeData.phone} | ${resumeData.location}
GitHub: ${resumeData.github} | LinkedIn: ${resumeData.linkedin}

PROFESSIONAL OBJECTIVE
${resumeData.objective}

TECHNICAL SKILLS
Frontend Technologies: ${formatSkills(resumeData.technicalSkills.frontend)}
Backend Technologies: ${formatSkills(resumeData.technicalSkills.backend)}
Databases: ${formatSkills(resumeData.technicalSkills.database)}
Programming Languages: ${formatSkills(resumeData.technicalSkills.languages)}
Development Tools: ${formatSkills(resumeData.technicalSkills.tools)}

PROJECTS
${resumeData.projects.map((project, index) => `${index + 1}. ${project}`).join('\n\n')}

EDUCATION
${resumeData.education.degree}

${resumeData.certifications.length > 0 ? `CERTIFICATIONS\n${resumeData.certifications.map((cert, index) => `• ${cert}`).join('\n')}\n\n` : ''}${resumeData.achievements.length > 0 ? `ACHIEVEMENTS\n${resumeData.achievements.map((achievement, index) => `• ${achievement}`).join('\n')}\n\n` : ''}LANGUAGES
${resumeData.languages.join(' • ')}`
  }

  const resetForm = () => {
    setCurrentStep(0)
    setIsComplete(false)
    setResumeData({
      name: '',
      email: '',
      phone: '',
      github: '',
      linkedin: '',
      location: '',
      objective: '',
      technicalSkills: {
        frontend: [],
        backend: [],
        database: [],
        tools: [],
        languages: []
      },
      projects: [],
      education: {
        degree: '',
        university: '',
        year: '',
        cgpa: ''
      },
      certifications: [],
      achievements: [],
      languages: []
    })
  }

  const skipStep = () => {
    if (currentStep < resumeSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#0f0f23',
      color: '#e2e8f0',
      overflow: 'hidden'
    },
    sidebar: {
      width: '300px',
      background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
      padding: '2rem 1.5rem',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'auto'
    },
    logo: {
      fontSize: '2rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '2rem'
    },
    progressSection: {
      marginBottom: '2rem'
    },
    progressTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#667eea'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '0.5rem'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
      width: `${((currentStep + 1) / resumeSteps.length) * 100}%`
    },
    progressText: {
      fontSize: '0.9rem',
      opacity: 0.8
    },
    nav: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    navItem: {
      marginBottom: '0.75rem'
    },
    navButton: {
      width: '100%',
      padding: '1rem 1.25rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: '#e2e8f0',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)'
    },
    micSection: {
      width: '450px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(145deg, #0f0f23 0%, #1a1a2e 100%)',
      position: 'relative',
      padding: '2rem'
    },
    questionCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      maxWidth: '100%'
    },
    questionNumber: {
      fontSize: '0.9rem',
      color: '#667eea',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    questionText: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '1rem',
      lineHeight: '1.4'
    },
    placeholder: {
      fontSize: '0.95rem',
      color: '#94a3b8',
      fontStyle: 'italic'
    },
    micButton: {
      backgroundColor: recording ? '#ef4444' : '#667eea',
      color: 'white',
      fontSize: '3rem',
      border: 'none',
      borderRadius: '50%',
      width: '120px',
      height: '120px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: recording 
        ? '0 0 40px rgba(239, 68, 68, 0.5)' 
        : '0 10px 30px rgba(102, 126, 234, 0.4)',
      animation: recording ? 'recordingPulse 1.5s ease-in-out infinite' : 'none',
      marginBottom: '1rem'
    },
    micStatus: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: recording ? '#ef4444' : '#667eea',
      marginBottom: '1rem'
    },
    controls: {
      display: 'flex',
      gap: '1rem'
    },
    skipButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: '#e2e8f0',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease'
    },
    resumeSection: {
      flex: 1,
      padding: '2rem',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      overflowY: 'auto',
      borderTopLeftRadius: '24px',
      borderBottomLeftRadius: '24px',
      boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.1)'
    },
    resumeHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #e5e7eb'
    },
    resumeTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1f2937'
    },
    resetButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    resumeContent: {
      whiteSpace: 'pre-wrap',
      fontFamily: "'Arial', sans-serif",
      fontSize: '11pt',
      lineHeight: '1.4',
      backgroundColor: '#ffffff',
      padding: '2rem',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      minHeight: '600px',
      color: '#000000'
    },
    completionCard: {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      border: '2px solid rgba(34, 197, 94, 0.3)',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'center'
    },
    completionTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#22c55e',
      marginBottom: '1rem'
    }
  }

  return (
    <>
      <style>{`
        @keyframes recordingPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .nav-button:hover {
          background-color: rgba(102, 126, 234, 0.2) !important;
          transform: translateY(-2px) !important;
        }
        
        .mic-button:hover {
          transform: scale(1.1) !important;
        }
        
        .skip-button:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .reset-button:hover {
          background-color: #5b64d4 !important;
        }
      `}</style>
      
      <main style={styles.container}>
        {/* Left Sidebar */}
        <aside style={styles.sidebar}>
          <h2 style={styles.logo}>Dhruva AI</h2>
          
          <div style={styles.progressSection}>
            <div style={styles.progressTitle}>Resume Progress</div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill}></div>
            </div>
            <div style={styles.progressText}>
              Step {currentStep + 1} of {resumeSteps.length}
            </div>
          </div>

          <ul style={styles.nav}>
            <li style={styles.navItem}>
              <button className="nav-button" style={styles.navButton}>
                📋 Resume Builder
              </button>
            </li>
            <li style={styles.navItem}>
              <button className="nav-button" style={styles.navButton}>
                📄 Templates
              </button>
            </li>
            <li style={styles.navItem}>
              <button className="nav-button" style={styles.navButton}>
                💼 Cover Letters
              </button>
            </li>
            <li style={styles.navItem}>
              <button className="nav-button" style={styles.navButton}>
                📊 ATS Analysis
              </button>
            </li>
          </ul>
        </aside>

        {/* Middle Section */}
        <section style={styles.micSection}>
          {!isComplete ? (
            <>
              <div style={styles.questionCard}>
                <div style={styles.questionNumber}>
                  Question {currentStep + 1} of {resumeSteps.length}
                </div>
                <div style={styles.questionText}>
                  {resumeSteps[currentStep]?.question}
                </div>
                <div style={styles.placeholder}>
                  {resumeSteps[currentStep]?.placeholder}
                </div>
              </div>

              <button
                className="mic-button"
                onClick={handleMicClick}
                style={styles.micButton}
              >
                {recording ? '⏹️' : '🎙️'}
              </button>

              <div style={styles.micStatus}>
                {recording ? 'Recording... Speak now' : 'Click to start recording'}
              </div>

              <div style={styles.controls}>
                <button 
                  className="skip-button"
                  onClick={skipStep}
                  style={styles.skipButton}
                >
                  Skip This Step
                </button>
              </div>
            </>
          ) : (
            <div style={styles.completionCard}>
              <div style={styles.completionTitle}>🎉 Resume Complete!</div>
              <p>Your ATS-friendly resume has been generated successfully.</p>
              <button 
                className="reset-button"
                onClick={resetForm}
                style={styles.resetButton}
              >
                Create New Resume
              </button>
            </div>
          )}
        </section>

        {/* Right Resume Section */}
        <section style={styles.resumeSection}>
          <div style={styles.resumeHeader}>
            <h3 style={styles.resumeTitle}>
              {isComplete ? 'ATS-Friendly Resume' : 'Resume Preview'}
            </h3>
            {isComplete && (
              <button 
                className="reset-button"
                onClick={resetForm}
                style={styles.resetButton}
              >
                Start Over
              </button>
            )}
          </div>
          <div style={styles.resumeContent}>
            {resumeData.name ? generateATSResume() : 
              `Building your ATS-friendly resume...
              
Please answer the questions using the microphone to populate your resume.

Current progress: ${currentStep + 1}/${resumeSteps.length} questions completed.

Your resume will appear here as you provide information through voice input.`}
          </div>
        </section>
      </main>
    </>
  )
}