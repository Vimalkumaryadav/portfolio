import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { portfolioData } from '../data/portfolioData';

const Portfolio: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(scrolled);
      setIsHeaderScrolled(window.scrollY > 100);
      
      // Update active section
      const sections = ['home', 'about', 'experience', 'skills', 'education', 'contact'];
      let current = 'home';
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const targetPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const downloadResume = () => {
    // In a real implementation, you would add the PDF file to the public folder
    // and link to it here
    alert('Resume download functionality would be implemented here. Please add your PDF resume file to the project.');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  const themeButtons = [
    { theme: 'light' as Theme, icon: 'fas fa-sun', title: 'Light Theme' },
    { theme: 'dark' as Theme, icon: 'fas fa-moon', title: 'Dark Theme' },
    { theme: 'blue' as Theme, icon: 'fas fa-briefcase', title: 'Blue Professional' }
  ];

  return (
    <div>
      <div 
        className="scroll-indicator" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <header className={`header ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center py-4">
            <a 
              href="#home" 
              className="text-2xl font-bold"
              style={{ color: 'var(--primary-color)' }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
            >
              VKY
            </a>
            
            <nav>
              <ul className={`flex gap-8 max-md:${isMobileMenuOpen ? 'flex' : 'hidden'} max-md:absolute max-md:top-full max-md:left-0 max-md:right-0 max-md:flex-col max-md:p-4 max-md:border-t`}
                  style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
                {navLinks.map(link => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className={`font-medium transition-colors duration-300 relative ${
                        activeSection === link.id ? 'active' : ''
                      }`}
                      style={{ 
                        color: activeSection === link.id ? 'var(--primary-color)' : 'var(--text-secondary)' 
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.id);
                      }}
                    >
                      {link.label}
                      {activeSection === link.id && (
                        <span 
                          className="absolute -bottom-2 left-0 right-0 h-0.5"
                          style={{ backgroundColor: 'var(--primary-color)' }}
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex gap-2">
              {themeButtons.map(({ theme: themeOption, icon, title }) => (
                <button
                  key={themeOption}
                  className={`p-2 border rounded-lg transition-all duration-300 ${
                    theme === themeOption ? 'active' : ''
                  }`}
                  style={{
                    borderColor: theme === themeOption ? 'var(--primary-color)' : 'var(--border-color)',
                    color: theme === themeOption ? 'var(--primary-color)' : 'var(--text-secondary)'
                  }}
                  onClick={() => setTheme(themeOption)}
                  title={title}
                >
                  <i className={icon} />
                </button>
              ))}
            </div>

            <button
              className="md:hidden text-xl"
              style={{ color: 'var(--text-primary)' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="max-w-6xl mx-auto px-8">
          <div className="fade-in text-center">
            <h1 className="hero-title">{portfolioData.personal.name}</h1>
            <p className="text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              {portfolioData.personal.title}
            </p>
            
            <div className="flex justify-center gap-8 flex-wrap mb-8">
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <i className="fas fa-envelope" style={{ color: 'var(--primary-color)' }} />
                <span>{portfolioData.personal.email}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <i className="fas fa-phone" style={{ color: 'var(--primary-color)' }} />
                <span>{portfolioData.personal.phone}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary-color)' }} />
                <span>{portfolioData.personal.location}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 border-2"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  borderColor: 'var(--primary-color)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <i className="fas fa-envelope" />
                Get In Touch
              </button>
              <button
                onClick={downloadResume}
                className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 border-2"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--primary-color)',
                  borderColor: 'var(--primary-color)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--primary-color)';
                }}
              >
                <i className="fas fa-download" />
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 fade-in" style={{ color: 'var(--primary-color)' }}>
            About Me
          </h2>
          <div className="max-w-4xl mx-auto text-center fade-in">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {portfolioData.about}
            </p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 fade-in" style={{ color: 'var(--primary-color)' }}>
            Professional Experience
          </h2>
          <div className="max-w-4xl mx-auto relative experience-timeline">
            {portfolioData.experience.map((exp, index) => (
              <div key={index} className="relative mb-12 pl-20 max-md:pl-0 experience-item fade-in">
                <div 
                  className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                  style={{
                    backgroundColor: 'var(--surface-color)',
                    boxShadow: 'var(--shadow)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow)';
                  }}
                >
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--primary-color)' }}>
                        {exp.title}
                      </h3>
                      <h4 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                        {exp.company}
                      </h4>
                    </div>
                    <span className="font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                      {exp.period}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="italic mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {exp.location}
                    </p>
                  )}
                  <ul className="list-none">
                    {exp.description.map((item, i) => (
                      <li key={i} className="mb-2 relative pl-6">
                        <span 
                          className="absolute left-0 text-xs"
                          style={{ color: 'var(--primary-color)' }}
                        >
                          ▶
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 fade-in" style={{ color: 'var(--primary-color)' }}>
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.entries(portfolioData.skills).map(([category, skills]) => (
              <div 
                key={category}
                className="p-8 rounded-2xl fade-in"
                style={{
                  backgroundColor: 'var(--surface-color)',
                  boxShadow: 'var(--shadow)'
                }}
              >
                <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--primary-color)' }}>
                  {category}
                </h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:-translate-y-1"
                      style={{
                        backgroundColor: 'var(--background-color)',
                        borderColor: 'var(--border-color)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow)';
                        e.currentTarget.style.borderColor = 'var(--primary-color)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                      }}
                    >
                      <i 
                        className={`${skill.icon} text-xl`}
                        style={{ color: 'var(--primary-color)' }}
                      />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="section">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 fade-in" style={{ color: 'var(--primary-color)' }}>
            Education
          </h2>
          <div 
            className="max-w-2xl mx-auto p-8 rounded-2xl text-center fade-in"
            style={{
              backgroundColor: 'var(--surface-color)',
              boxShadow: 'var(--shadow)'
            }}
          >
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--primary-color)' }}>
              {portfolioData.education.degree}
            </h3>
            <p className="text-lg font-medium mb-2">{portfolioData.education.field}</p>
            <p className="text-lg font-medium mb-2">{portfolioData.education.institution}</p>
            <p style={{ color: 'var(--text-secondary)' }}>{portfolioData.education.period}</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 fade-in" style={{ color: 'var(--primary-color)' }}>
            Get In Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            
            <div 
              className="p-8 rounded-2xl text-center transition-transform duration-300 hover:-translate-y-2 fade-in"
              style={{
                backgroundColor: 'var(--surface-color)',
                boxShadow: 'var(--shadow)'
              }}
            >
              <i 
                className="fas fa-envelope text-5xl mb-4"
                style={{ color: 'var(--primary-color)' }}
              />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <a 
                href={`mailto:${portfolioData.personal.email}`}
                className="transition-colors duration-300"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {portfolioData.personal.email}
              </a>
            </div>

            <div 
              className="p-8 rounded-2xl text-center transition-transform duration-300 hover:-translate-y-2 fade-in"
              style={{
                backgroundColor: 'var(--surface-color)',
                boxShadow: 'var(--shadow)'
              }}
            >
              <i 
                className="fab fa-linkedin text-5xl mb-4"
                style={{ color: 'var(--primary-color)' }}
              />
              <h3 className="text-xl font-semibold mb-2">LinkedIn</h3>
              <a 
                href={portfolioData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                linkedin.com/in/yadavvk
              </a>
            </div>

            <div 
              className="p-8 rounded-2xl text-center transition-transform duration-300 hover:-translate-y-2 fade-in"
              style={{
                backgroundColor: 'var(--surface-color)',
                boxShadow: 'var(--shadow)'
              }}
            >
              <i 
                className="fab fa-github text-5xl mb-4"
                style={{ color: 'var(--primary-color)' }}
              />
              <h3 className="text-xl font-semibold mb-2">GitHub</h3>
              <a 
                href={portfolioData.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                github.com/Vimalkumaryadav
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-8 text-center border-t"
        style={{
          backgroundColor: 'var(--surface-color)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="max-w-6xl mx-auto px-8">
          <p>&copy; 2024 {portfolioData.personal.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
