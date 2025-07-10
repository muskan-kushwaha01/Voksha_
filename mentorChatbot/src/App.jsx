import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Chatbot from "./components/Chatbot";
import MentorMatch from "./components/MentorMatch";
import SuccessStories from "./components/SuccessStories";
import AllMentors from "./components/AllMentors";
import Contact from "./components/Contact";
import DocumentScanner from "./components/DocumentScanner";

import "./index.css";

const Home = () => {
  const [activeTab, setActiveTab] = useState("documentScanner");

  const renderTab = () => {
    switch (activeTab) {
      case "chatbot":
        return <Chatbot />;
      case "mentor":
        return <MentorMatch />;
      case "stories":
        return <SuccessStories />;
      default:
        return <DocumentScanner />;
    }
  };

  return (
    <div className="app-container">
      <div className="tabs">
        <button onClick={() => setActiveTab("chatbot")}>💬 Chatbot</button>
        <button onClick={() => setActiveTab("mentor")}>👭 Mentor Matching</button>
        <button onClick={() => setActiveTab("stories")}>🌟 Success Stories</button>
      </div>
      <div className="main-content">
        <div className="main-section">{renderTab()}</div>
      </div>
    </div>
  );
};

// Navbar component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/image/voksha.png" alt="Voksha Logo" />
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/chatbot">Chatbot</Link></li>
        <li><Link to="/mentorship">Mentorship</Link></li>
        <li><Link to="/inspiration">Inspiration</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
};


const Inspiration = () => {
  return (
    <section className="inspiration-section">
      <h2>Inspiration Stories</h2>
      <div className="inspiration-grid">
        <div className="inspiration-card">
          <div className="profile-header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVVw-MKWvg5hPYN4Hj2v6Rq50lVAWuveUQKw&s" alt="Woman 1" />
            <h3>Kiran from Bihar</h3>
          </div>
          <p>Kiran used our app to decode a government subsidy form using voice guidance. Today, she runs her own small dairy farm with confidence.</p>
        </div>

        <div className="inspiration-card">
          <div className="profile-header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkutOIHfr6FOwqlAbO_mzP_I4qbOjfM8F8yQ&s" alt="Woman 2" />
            <h3>Sita from Madhya Pradesh</h3>
          </div>
          <p>After learning how to read GST and bill taxes using our platform, Sita started budgeting better and opened a small vegetable shop.</p>
        </div>

        <div className="inspiration-card">
          <div className="profile-header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVVw-MKWvg5hPYN4Hj2v6Rq50lVAWuveUQKw&s" alt="Woman 1" />
            <h3>Rekha from Rajasthan</h3>
          </div>
          <p>Mentored through our network, Rekha applied for a local loan and launched a handmade jewelry business, now mentoring others too.</p>
        </div>

        <div className="inspiration-card">
          <div className="profile-header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkutOIHfr6FOwqlAbO_mzP_I4qbOjfM8F8yQ&s" alt="Woman 2" />
            <h3>Fatima from Uttar Pradesh</h3>
          </div>
          <p>Fatima learned how to understand receipt data and government yojnas. She confidently applied for a scheme and got education support for her daughter.</p>
        </div>

        <div className="inspiration-card">
          <div className="profile-header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVVw-MKWvg5hPYN4Hj2v6Rq50lVAWuveUQKw&s" alt="Woman 1" />
            <h3>Radha from Gujarat</h3>
          </div>
          <p>Radha was afraid to enter banks. Our chatbot helped her learn key terms. She now manages her family's savings independently.</p>
        </div>

        <div className="inspiration-card">
          <div className="profile-header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkutOIHfr6FOwqlAbO_mzP_I4qbOjfM8F8yQ&s" alt="Woman 2" />
            <h3>Meena from West Bengal</h3>
          </div>
          <p>Meena used the voice explanation feature to understand her electricity bill and noticed wrong charges. She reported it and helped her neighbors do the same.</p>
        </div>
      </div>
      <SuccessStories/>
    </section>
  );
};



const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* ✅ Home route points to DocumentScanner */}
        <Route path="/" element={<DocumentScanner />} />

        {/* ✅ Optional: this can stay too, if you want separate route */}
        <Route path="/documentScanner" element={<DocumentScanner />} />

        <Route path="/chatbot" element={
          <div className="app-container">
            <Chatbot />
          </div>
        } />

        <Route path="/mentorship" element={
          <div className="app-container">
            <MentorMatch />
          </div>
        } />

        <Route path="/inspiration" element={<Inspiration />} />

        <Route path="/contact" element={
          <div className="app-container">
            <Contact />
          </div>
        } />

        <Route path="/mentors" element={<AllMentors />} />
      </Routes>
    </Router>
  );
};

export default App;
