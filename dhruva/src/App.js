import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';
import LoginPage from './components/login';
// import ResumeBuilder from './ResumeBuilder'; // Your resume builder component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;