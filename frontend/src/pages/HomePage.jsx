import React from 'react';
import Layout from '../components/Layout';
import LinkCard from '../components/LinkCard';
import { Toaster } from 'react-hot-toast';

const HomePage = () => {
  const links = [
    { title: "Google", description: "Search the world's information", url: "https://google.com", icon: "🔍" },
    { title: "GitHub", description: "Build and ship software", url: "https://github.com", icon: "💻" },
    { title: "YouTube", description: "Watch videos from around the world", url: "https://youtube.com", icon: "📺" },
    { title: "Twitter", description: "See what's happening right now", url: "https://twitter.com", icon: "🐦" },
    { title: "Reddit", description: "Dive into anything", url: "https://reddit.com", icon: "🤖" },
    { title: "LinkedIn", description: "Connect with professionals", url: "https://linkedin.com", icon: "💼" },
    { title: "Instagram", description: "Share moments with friends", url: "https://instagram.com", icon: "📸" },
    { title: "Netflix", description: "Watch TV shows and movies", url: "https://netflix.com", icon: "🎬" },
    { title: "Amazon", description: "Online shopping", url: "https://amazon.com", icon: "📦" },
    { title: "Stack Overflow", description: "Developer Q&A", url: "https://stackoverflow.com", icon: "📚" }
  ];

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome to ClickTracker 🎯
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Every click you make is being tracked in real-time
          </p>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            ⚡ {links.length} popular links ready to track
          </div>
        </div>

        <div className="grid">
          {links.map((link, index) => (
            <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <LinkCard {...link} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;