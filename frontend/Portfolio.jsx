import React from 'react';

function Portfolio() {
  const projects = [
    {
      title: "🎟️ Full-Stack BookMyShow System",
      tech: ["React.js", "Python", "Django REST Framework", "SQLite3"],
      description: "A complete movie ticketing engine featuring a live coordinate-based seating layout chart, relational database mappings, dynamic API show filtering, and server-side transaction protection rules.",
      features: [
        "Interactive row/column grid tracking live seat states (Available, Selected, Booked).",
        "Dynamic API filtering mapping Movies ➡️ Theatres ➡️ Shows.",
        "Automatic state synchronization locking out taken seats instantly upon checkout."
      ],
      github: "https://github.com/syama-57/book-my-show-portfolio" // Update with your actual URL
    }
  ];

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '0', margin: '0' }}>
      
      {/* Hero Header Section */}
      <header style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px', borderBottom: '1px solid #334155' }}>
        <p style={{ color: '#f84464', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px 0' }}>Full-Stack Developer</p>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', fontWeight: '800', color: '#ffffff' }}>Hi, I'm syama-57.</h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', lineHeight: '1.6', margin: '0' }}>
          I specialize in building robust backend APIs with **Django** and fluid, highly interactive user interfaces with **React**. I love turning complex logic into clean, production-ready code architectures.
        </p>
      </header>

      {/* Featured Projects Grid */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '40px' }}>Featured Architectural Showcases</h2>
        
        {projects.map((project, index) => (
          <div key={index} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', marginBottom: '40px' }}>
            <span style={{ backgroundColor: 'rgba(248, 68, 100, 0.1)', color: '#f84464', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Featured System Flow
            </span>
            <h3 style={{ fontSize: '24px', color: '#ffffff', marginTop: '15px', marginBottom: '10px' }}>{project.title}</h3>
            
            {/* Tech Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {project.tech.map((t, i) => (
                <span key={i} style={{ backgroundColor: '#0f172a', color: '#cbd5e1', border: '1px solid #475569', padding: '4px 10px', borderRadius: '4px', fontSize: '13px' }}>
                  {t}
                </span>
              ))}
            </div>

            <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '15px', marginBottom: '25px' }}>{project.description}</p>
            
            <h4 style={{ color: '#ffffff', fontSize: '16px', marginBottom: '10px' }}>Core Engine Milestones Implemented:</h4>
            <ul style={{ paddingLeft: '20px', color: '#94a3b8', lineHeight: '1.8', fontSize: '14px', marginBottom: '30px' }}>
              {project.features.map((feature, fIndex) => (
                <li key={fIndex} style={{ marginBottom: '8px' }}>{feature}</li>
              ))}
            </ul>

            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'inline-block', backgroundColor: '#f84464', color: '#ffffff', textDecoration: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', transition: 'background 0.2s' }}
            >
              📂 View System Code on GitHub
            </a>
          </div>
        ))}
      </main>

      {/* Footer Contact Wrapper */}
      <footer style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', textAlign: 'center', borderTop: '1px solid #334155', color: '#64748b', fontSize: '14px' }}>
        <p style={{ margin: '0' }}>Designed to demonstrate asynchronous API handling & full-stack lifecycle logic. Built by syama-57.</p>
      </footer>
    </div>
  );
}

export default Portfolio;