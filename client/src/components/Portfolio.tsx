import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { portfolioData } from '../data/portfolioData';

type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange';

const Portfolio: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

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

    const handleClickOutside = (event: MouseEvent) => {
      if (isThemeDropdownOpen && !(event.target as Element).closest('.theme-dropdown-container')) {
        setIsThemeDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isThemeDropdownOpen]);

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
    const resumePath = '/portfolio/assets/VimalKumarYadav-Resume.pdf';
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'VimalKumarYadav-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  const themeOptions = [
    { theme: 'light' as Theme, label: 'Light Mode', color: '#3b82f6' },
    { theme: 'dark' as Theme, label: 'Dark Mode', color: '#1f2937' },
    { theme: 'blue' as Theme, label: 'Blue Professional', color: '#1e40af' },
    { theme: 'purple' as Theme, label: 'Purple Creative', color: '#8b5cf6' },
    { theme: 'green' as Theme, label: 'Green Nature', color: '#22c55e' },
    { theme: 'orange' as Theme, label: 'Orange Energy', color: '#f97316' }
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

            <div className="theme-dropdown-container relative">
              <button
                className="theme-dropdown-trigger flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--surface-color)',
                  color: 'var(--text-primary)'
                }}
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              >
                <div 
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    backgroundColor: themeOptions.find(opt => opt.theme === theme)?.color,
                    borderColor: 'var(--border-color)'
                  }}
                />
                <span className="text-sm font-medium">
                  {themeOptions.find(opt => opt.theme === theme)?.label}
                </span>
                <i className={`fas fa-chevron-${isThemeDropdownOpen ? 'up' : 'down'} text-xs`} />
              </button>
              
              {isThemeDropdownOpen && (
                <div 
                  className="theme-dropdown-menu absolute top-full right-0 mt-2 py-2 rounded-lg border shadow-lg min-w-48 z-50"
                  style={{
                    backgroundColor: 'var(--surface-color)',
                    borderColor: 'var(--border-color)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  {themeOptions.map((option) => (
                    <button
                      key={option.theme}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-opacity-10 transition-all duration-200"
                      style={{
                        color: 'var(--text-primary)',
                        backgroundColor: theme === option.theme ? `${option.color}15` : 'transparent'
                      }}
                      onClick={() => {
                        setTheme(option.theme);
                        setIsThemeDropdownOpen(false);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${option.color}10`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme === option.theme ? `${option.color}15` : 'transparent';
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border-2"
                        style={{
                          backgroundColor: option.color,
                          borderColor: 'var(--border-color)'
                        }}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                      {theme === option.theme && (
                        <i className="fas fa-check ml-auto text-xs" style={{ color: option.color }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
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
            <div className="mb-8 flex justify-center">
              <div className="profile-photo-container">
                <img
                  src={portfolioData.personal.photo}
                  alt={portfolioData.personal.name}
                  className="w-48 h-48 rounded-full object-cover border-4"
                  style={{ borderColor: 'var(--primary-color)' }}
                  onError={(e) => {
                    // Fallback to SVG avatar if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,${encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
                        <rect width="300" height="300" fill="#f3f4f6"/>
                        <circle cx="150" cy="120" r="50" fill="#9ca3af"/>
                        <circle cx="150" cy="250" r="80" fill="#9ca3af"/>
                        <text x="150" y="280" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">Click to add photo</text>
                      </svg>
                    `)}`;
                  }}
                />
                <button 
                  className="profile-photo-edit-btn"
                  style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                  onClick={() => {
                    // In a real implementation, this would open a file picker
                    alert('Photo upload functionality would be implemented here. You can add your profile photo to replace the placeholder.');
                  }}
                  title="Change profile photo"
                >
                  <i className="fas fa-camera text-sm" />
                </button>
              </div>
            </div>
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
