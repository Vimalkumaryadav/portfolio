import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { portfolioData } from '../data/portfolioData';
import { useAnalytics } from '../hooks/useAnalytics';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

// Theme type comes from ThemeProvider; we only toggle between 'light' and 'dark'

type Recommendation = {
  name: string;
  role: string;
  relationship: string;
  text: string;
  date: string;
  linkedinUrl: string;
  avatar?: string;
};

type Appreciation = {
  title?: string;
  from?: string;
  date?: string;
  description?: string;
  image: string; // absolute or relative URL to the screenshot/image
};

const Portfolio: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { trackPageView, trackEvent } = useAnalytics();
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  // theme dropdown removed; using a simple Day/Night toggle instead
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [appreciations, setAppreciations] = useState<Appreciation[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Track initial page view
  useEffect(() => {
    trackPageView('/portfolio');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(scrolled);
      setIsHeaderScrolled(window.scrollY > 100);
      
      // Update active section
  const sections = ['home', 'about', 'experience', 'skills', 'education', 'appreciations', 'recommendations', 'contact'];
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

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Track viewport to scope mobile-only menu animations/visibility
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsSmallScreen(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Fetch recommendations from public assets and merge with any bundled ones
  useEffect(() => {
    const loadRecs = async () => {
      try {
        const sheetId = (import.meta as any)?.env?.VITE_RECOMMENDATIONS_SHEET_ID as string | undefined;
        if (sheetId) {
          // Try Google Sheets first (publish sheet to web). Expected columns:
          // name | role | relationship | text | date | linkedinUrl | avatar
          const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq=${encodeURIComponent('select *')}`;
          const text = await fetch(gvizUrl, { cache: 'no-store' }).then(r => r.text());
          const jsonStr = text.replace(/^.*setResponse\(/, '').replace(/\);\s*$/, '');
          const g = JSON.parse(jsonStr);
          const rows = (g.table?.rows || []) as any[];
          const mapped: Recommendation[] = rows.map((r) => {
            const c = r.c || [];
            return {
              name: c[0]?.v?.toString?.() || '',
              role: c[1]?.v?.toString?.() || '',
              relationship: c[2]?.v?.toString?.() || '',
              text: c[3]?.v?.toString?.() || '',
              date: c[4]?.v?.toString?.() || '',
              linkedinUrl: c[5]?.v?.toString?.() || '',
              avatar: c[6]?.v?.toString?.() || undefined,
            } as Recommendation;
          }).filter(r => r.name && r.text && r.linkedinUrl);
          if (mapped.length) {
            setRecommendations(mapped);
            return;
          }
        }

        // Fallback to static JSON file — try multiple safe paths
        const basePath = (document.querySelector('base')?.getAttribute('href')
          || (import.meta as any)?.env?.BASE_URL
          || '/');
        const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
        const baseAbs = new URL(normalizedBase, window.location.origin).toString();
        const ts = Date.now();
        const candidates = [
          // relative to current path
          `assets/recommendations.json?t=${ts}`,
          // absolute using document base
          new URL(`assets/recommendations.json?t=${ts}`, baseAbs).toString(),
          // absolute root
          `/assets/recommendations.json?t=${ts}`,
          // explicit GitHub Pages project base (common for your setup)
          `/portfolio/assets/recommendations.json?t=${ts}`,
        ];
        for (const url of candidates) {
          try {
            const res = await fetch(url, { cache: 'no-store' });
            if (res.ok) {
              const json = await res.json();
              if (Array.isArray(json) && json.length) {
                setRecommendations(json as Recommendation[]);
                break;
              }
            }
          } catch (err) {
            // move to next candidate
          }
        }
      } catch (e) {
        // ignore network errors; section will show local/static items only
      }
    };
    loadRecs();
  }, []);

  // Fetch appreciations by probing common screenshot filenames in /assets (no JSON manifest)
  useEffect(() => {
    const loadAppreciations = async () => {
      try {
        const basePath = (document.querySelector('base')?.getAttribute('href')
          || (import.meta as any)?.env?.BASE_URL
          || '/');
        const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
        const baseAbs = new URL(normalizedBase, window.location.origin).toString();
        const ts = Date.now();

        // Probe a small set of common filenames in /assets (case variants included)
        const imageNames = [
          // Preferred name
          'Appreciation.jpg', 'Appreciation.jpeg', 'Appreciation.png',
          // Lowercase variants
          'appreciation.jpg', 'appreciation.jpeg', 'appreciation.png',
          // Simple alternates
          'screenshot.jpg', 'screenshot.png', 'kudos.jpg', 'kudos.png',
        ];
        const imageCandidates: string[] = [];
        for (const name of imageNames) {
          imageCandidates.push(
            `assets/${name}?t=${ts}`,
            new URL(`assets/${name}?t=${ts}`, baseAbs).toString(),
            `/assets/${name}?t=${ts}`,
            `/portfolio/assets/${name}?t=${ts}`,
          );
        }
        for (const url of imageCandidates) {
          try {
            const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
            if (res.ok) {
              setAppreciations([{ image: url }]);
              return;
            }
          } catch (err) {
            // continue
          }
        }
      } catch (e) {
        // ignore
      }
    };
    loadAppreciations();
  }, []);

  const allRecommendations: Recommendation[] = useMemo(() => {
    // Merge static recommendations from portfolioData with fetched ones
    const staticRecs = (portfolioData as any).recommendations || [];
    return [...staticRecs, ...recommendations];
  }, [recommendations]);

  // Make sure newly rendered elements (like async recommendations) become visible
  useEffect(() => {
    if (allRecommendations.length > 0) {
      document
        .querySelectorAll('#recommendations .fade-in')
        .forEach((el) => el.classList.add('active'));
    }
  }, [allRecommendations.length]);

  // Ensure dynamically loaded appreciations animate in
  useEffect(() => {
    if (appreciations.length > 0) {
      document
        .querySelectorAll('#appreciations .fade-in')
        .forEach((el) => el.classList.add('active'));
    }
  }, [appreciations.length]);

  useEffect(() => {
    // Add click outside handler to close mobile menu
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMenuButton = target.closest('.mobile-menu-button');
      const isNavMenu = target.closest('.mobile-nav-menu');
      
      if (!isMenuButton && !isNavMenu && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add scroll handler to close mobile menu
    const handleScroll = () => {
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

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

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

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

  const downloadResume = async () => {
    try {
      const basePath = (document.querySelector('base')?.getAttribute('href')
        || (import.meta as any)?.env?.BASE_URL
        || '/');
      const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
      const baseAbs = new URL(normalizedBase, window.location.origin).toString();

      const filenames = [
        'VimalKumarYadav-Resume.pdf',
        'VimalKumarYadav-Resume_1754859839471.pdf'
      ];
      const candidates: { url: string; name: string }[] = [];
      for (const name of filenames) {
        candidates.push(
          { url: `assets/${name}`, name },
          { url: new URL(`assets/${name}`, baseAbs).toString(), name },
          { url: `/assets/${name}`, name },
          { url: `/portfolio/assets/${name}`, name },
        );
      }

      let found: { url: string; name: string } | undefined;
      for (const c of candidates) {
        try {
          const res = await fetch(c.url, { method: 'HEAD', cache: 'no-store' });
          if (res.ok) { found = c; break; }
        } catch {
          // try next
        }
      }

      if (!found) {
        // As a last resort, attempt the primary path without HEAD check
        found = { url: `${normalizedBase}assets/${filenames[0]}`, name: filenames[0] };
      }

      const link = document.createElement('a');
      link.href = found.url;
      link.download = found.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      trackEvent('download', 'resume', found.name);
    } catch (e) {
      trackEvent('error', 'resume-download', String(e));
      alert('Resume file not found. Please try again later.');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
  { id: 'appreciations', label: 'Appreciations' },
  { id: 'recommendations', label: 'Recommendations' },
    { id: 'contact', label: 'Contact' }
  ];

  const isDark = theme === 'dark';

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
            
            <nav className="relative z-50">
      <ul
                className={`mobile-nav-menu flex gap-8 max-md:${isMobileMenuOpen ? 'flex' : 'hidden'} max-md:fixed max-md:top-[72px] max-md:left-0 max-md:right-0 max-md:h-[calc(100vh-72px)] max-md:flex-col max-md:p-4 max-md:border-t`}
                style={{
                  backgroundColor: isSmallScreen ? 'var(--surface-color)' : 'transparent',
                  borderColor: isSmallScreen ? 'var(--border-color)' : 'transparent',
                  boxShadow: isSmallScreen ? 'var(--shadow-lg)' : 'none',
                  backdropFilter: isSmallScreen ? 'saturate(1.2) blur(8px)' : 'none',
                  opacity: isSmallScreen ? (isMobileMenuOpen ? '1' : '0') : '1',
                  visibility: isSmallScreen ? (isMobileMenuOpen ? 'visible' : 'hidden') : 'visible',
                  transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out'
                }}
              >
                {navLinks.map(link => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className={`font-medium transition-colors duration-300 relative ${
                        activeSection === link.id ? 'active' : ''
                      } block w-full py-2`}
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
                          className="absolute -bottom-2 left-0 right-0 h-0.5 underline-gradient"
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="relative">
              <button
                aria-label={isDark ? 'Switch to Day' : 'Switch to Night'}
                title={isDark ? 'Switch to Day' : 'Switch to Night'}
                className="flex items-center px-2 py-2 border rounded-lg transition-all duration-300"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--surface-color)',
                  color: 'var(--text-primary)'
                }}
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className={`theme-switch ${isDark ? 'dark' : 'light'}`}>
                  <div className="thumb">
                    <i className={isDark ? 'fas fa-moon' : 'fas fa-sun'} />
                  </div>
                </div>
              </button>
            </div>

            <button
              className="mobile-menu-button md:hidden text-xl z-50"
              style={{ color: 'var(--text-primary)' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
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
                className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 border-2 btn-gradient"
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
              >
                <i className="fas fa-envelope" />
                Get In Touch
              </button>
              <button
                onClick={downloadResume}
                className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 border-2 btn-ghost-gradient"
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
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
          {isSmallScreen ? (
            <Carousel className="max-w-5xl mx-auto">
              <CarouselContent>
                {Object.entries(portfolioData.skills).map(([category, skills]) => (
                  <CarouselItem key={category}>
                    <div
                      className="p-8 rounded-2xl"
                      style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow)' }}
                    >
                      <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--primary-color)' }}>
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-4 justify-center">
                        {skills.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:-translate-y-1"
                            style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = 'var(--shadow)';
                              e.currentTarget.style.borderColor = 'var(--primary-color)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                          >
                            {(() => {
                              const iconVal = String((skill as any).icon);
                              if (iconVal.startsWith('img:')) {
                                const primary = iconVal.slice(4);
                                const fallbacks: Record<string, string[]> = {
                                  githubcopilot: [
                                    'https://cdn.simpleicons.org/githubcopilot',
                                    'https://skillicons.dev/icons?i=githubcopilot'
                                  ],
                                  restassured: [
                                    'https://cdn.simpleicons.org/restassured/00A651',
                                    'https://cdn.simpleicons.org/restassured'
                                  ],
                                  selenium: [
                                    'https://cdn.simpleicons.org/selenium/43B02A',
                                    'https://cdn.simpleicons.org/selenium'
                                  ],
                                  webdriverio: [
                                    'https://unpkg.com/devicon@2.15.1/icons/webdriverio/webdriverio-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/webdriverio/webdriverio-original.svg'
                                  ],
                                  cucumber: [
                                    'https://unpkg.com/devicon@2.15.1/icons/cucumber/cucumber-plain.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/cucumber/cucumber-plain.svg'
                                  ],
                                  java: [
                                    'https://unpkg.com/devicon@2.15.1/icons/java/java-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/java/java-original.svg'
                                  ],
                                  javascript: [
                                    'https://unpkg.com/devicon@2.15.1/icons/javascript/javascript-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/javascript/javascript-original.svg'
                                  ],
                                  nodejs: [
                                    'https://unpkg.com/devicon@2.15.1/icons/nodejs/nodejs-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/nodejs/nodejs-original.svg'
                                  ],
                                  git: [
                                    'https://unpkg.com/devicon@2.15.1/icons/git/git-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/git/git-original.svg'
                                  ],
                                  apachemaven: [
                                    'https://unpkg.com/devicon@2.15.1/icons/apachemaven/apachemaven-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/apachemaven/apachemaven-original.svg'
                                  ],
                                  postman: [
                                    'https://unpkg.com/devicon@2.15.1/icons/postman/postman-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/postman/postman-original.svg'
                                  ],
                                  jira: [
                                    'https://unpkg.com/devicon@2.15.1/icons/jira/jira-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/jira/jira-original.svg'
                                  ],
                                  mysql: [
                                    'https://unpkg.com/devicon@2.15.1/icons/mysql/mysql-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/mysql/mysql-original.svg'
                                  ],
                                  perforce: [
                                    'https://unpkg.com/devicon@2.15.1/icons/perforce/perforce-original.svg',
                                    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/perforce/perforce-original.svg'
                                  ],
                                };
                                const key = Object.keys(fallbacks).find(k => primary.includes(k)) ?? '';
                                return (
                                  <img
                                    src={primary}
                                    alt={String((skill as any).name)}
                                    className="w-5 h-5"
                                    loading="lazy"
                                    onError={(e) => {
                                      const img = e.currentTarget as HTMLImageElement & { dataset: { idx?: string } };
                                      const list = key ? fallbacks[key] : [];
                                      const nextIdx = ((img.dataset.idx ? parseInt(img.dataset.idx, 10) : -1) + 1);
                                      if (key && list[nextIdx]) {
                                        img.dataset.idx = String(nextIdx);
                                        img.src = list[nextIdx];
                                      } else {
                                        img.style.display = 'none';
                                      }
                                    }}
                                  />
                                );
                              }
                              if (iconVal.startsWith('si:')) {
                                const slug = iconVal.slice(3);
                                const isLight = theme === 'light';
                                const colorHex = isLight ? '000000' : 'ffffff';
                                const src = `https://cdn.simpleicons.org/${slug}/${colorHex}`;
                                return (
                                  <img
                                    src={src}
                                    alt={String((skill as any).name)}
                                    className="w-5 h-5"
                                    loading="lazy"
                                    onError={(e) => {
                                      const img = e.currentTarget as HTMLImageElement & { dataset: { triedNoColor?: string } };
                                      if (!img.dataset.triedNoColor) {
                                        img.dataset.triedNoColor = '1';
                                        img.src = `https://cdn.simpleicons.org/${slug}`;
                                      } else {
                                        img.style.display = 'none';
                                      }
                                    }}
                                  />
                                );
                              }
                              return (
                                <i className={`${iconVal} text-xl`} style={{ color: 'var(--primary-color)' }} />
                              );
                            })()}
                            <span>{(skill as any).name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 -translate-y-1/2" />
              <CarouselNext className="right-2 -translate-y-1/2" />
            </Carousel>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {Object.entries(portfolioData.skills).map(([category, skills]) => (
                <div
                  key={category}
                  className="p-8 rounded-2xl fade-in"
                  style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow)' }}
                >
                  <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--primary-color)' }}>
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:-translate-y-1"
                        style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = 'var(--shadow)';
                          e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                      >
                        {(() => {
                          const iconVal = String((skill as any).icon);
                          if (iconVal.startsWith('img:')) {
                            const primary = iconVal.slice(4);
                            const fallbacks: Record<string, string[]> = {
                              githubcopilot: [
                                'https://cdn.simpleicons.org/githubcopilot',
                                'https://skillicons.dev/icons?i=githubcopilot'
                              ],
                              restassured: [
                                'https://cdn.simpleicons.org/restassured/00A651',
                                'https://cdn.simpleicons.org/restassured'
                              ],
                              selenium: [
                                'https://cdn.simpleicons.org/selenium/43B02A',
                                'https://cdn.simpleicons.org/selenium'
                              ],
                              webdriverio: [
                                'https://unpkg.com/devicon@2.15.1/icons/webdriverio/webdriverio-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/webdriverio/webdriverio-original.svg'
                              ],
                              cucumber: [
                                'https://unpkg.com/devicon@2.15.1/icons/cucumber/cucumber-plain.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/cucumber/cucumber-plain.svg'
                              ],
                              java: [
                                'https://unpkg.com/devicon@2.15.1/icons/java/java-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/java/java-original.svg'
                              ],
                              javascript: [
                                'https://unpkg.com/devicon@2.15.1/icons/javascript/javascript-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/javascript/javascript-original.svg'
                              ],
                              nodejs: [
                                'https://unpkg.com/devicon@2.15.1/icons/nodejs/nodejs-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/nodejs/nodejs-original.svg'
                              ],
                              git: [
                                'https://unpkg.com/devicon@2.15.1/icons/git/git-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/git/git-original.svg'
                              ],
                              apachemaven: [
                                'https://unpkg.com/devicon@2.15.1/icons/apachemaven/apachemaven-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/apachemaven/apachemaven-original.svg'
                              ],
                              postman: [
                                'https://unpkg.com/devicon@2.15.1/icons/postman/postman-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/postman/postman-original.svg'
                              ],
                              jira: [
                                'https://unpkg.com/devicon@2.15.1/icons/jira/jira-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/jira/jira-original.svg'
                              ],
                              mysql: [
                                'https://unpkg.com/devicon@2.15.1/icons/mysql/mysql-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/mysql/mysql-original.svg'
                              ],
                              perforce: [
                                'https://unpkg.com/devicon@2.15.1/icons/perforce/perforce-original.svg',
                                'https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/perforce/perforce-original.svg'
                              ],
                            };
                            const key = Object.keys(fallbacks).find(k => primary.includes(k)) ?? '';
                            return (
                              <img
                                src={primary}
                                alt={String((skill as any).name)}
                                className="w-5 h-5"
                                loading="lazy"
                                onError={(e) => {
                                  const img = e.currentTarget as HTMLImageElement & { dataset: { idx?: string } };
                                  const list = key ? fallbacks[key] : [];
                                  const nextIdx = ((img.dataset.idx ? parseInt(img.dataset.idx, 10) : -1) + 1);
                                  if (key && list[nextIdx]) {
                                    img.dataset.idx = String(nextIdx);
                                    img.src = list[nextIdx];
                                  } else {
                                    img.style.display = 'none';
                                  }
                                }}
                              />
                            );
                          }
                          if (iconVal.startsWith('si:')) {
                            const slug = iconVal.slice(3);
                            const isLight = theme === 'light';
                            const colorHex = isLight ? '000000' : 'ffffff';
                            const src = `https://cdn.simpleicons.org/${slug}/${colorHex}`;
                            return (
                              <img
                                src={src}
                                alt={String((skill as any).name)}
                                className="w-5 h-5"
                                loading="lazy"
                                onError={(e) => {
                                  const img = e.currentTarget as HTMLImageElement & { dataset: { triedNoColor?: string } };
                                  if (!img.dataset.triedNoColor) {
                                    img.dataset.triedNoColor = '1';
                                    img.src = `https://cdn.simpleicons.org/${slug}`;
                                  } else {
                                    img.style.display = 'none';
                                  }
                                }}
                              />
                            );
                          }
                          return (
                            <i className={`${iconVal} text-xl`} style={{ color: 'var(--primary-color)' }} />
                          );
                        })()}
                        <span>{(skill as any).name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Recommendations Section */}
      <section id="recommendations" className="section">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 fade-in" style={{ color: 'var(--primary-color)' }}>
            LinkedIn Recommendations
          </h2>

          {allRecommendations.length === 0 ? (
            <div 
              className="max-w-3xl mx-auto p-8 rounded-2xl text-center fade-in"
              style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow)' }}
            >
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                No public recommendations available yet. Check my profile on LinkedIn.
              </p>
              <a
                href={portfolioData.personal.linkedin + 'details/recommendations/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border"
                style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                onClick={() => trackEvent('outbound', 'linkedin-recommendations', 'profile')}
              >
                <i className="fab fa-linkedin" /> View on LinkedIn
              </a>
            </div>
          ) : (
            isSmallScreen ? (
              <Carousel className="max-w-5xl mx-auto">
                <CarouselContent>
                  {allRecommendations.map((rec, idx) => (
                    <CarouselItem key={`${rec.name}-${idx}`}>
                      <div
                        className="p-6 rounded-2xl h-full flex flex-col"
                        style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow)' }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 overflow-hidden" style={{ borderColor: 'var(--primary-color)' }} aria-hidden="true">
                            {rec.avatar ? (
                              <img src={rec.avatar} alt={rec.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-semibold" style={{ color: 'var(--primary-color)' }}>
                                {rec.name.split(' ').map(p => p[0]).slice(0,2).join('')}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{rec.name}</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{rec.role}</p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{rec.relationship} • {rec.date}</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <i className="fas fa-quote-left mr-2" style={{ color: 'var(--primary-color)' }} />
                          <span style={{ color: 'var(--text-secondary)' }}>{rec.text}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <a href={rec.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--primary-color)' }} onClick={() => trackEvent('outbound', 'linkedin-recommendation', rec.name)}>
                            <i className="fab fa-linkedin" /> View on LinkedIn
                          </a>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 -translate-y-1/2" />
                <CarouselNext className="right-2 -translate-y-1/2" />
              </Carousel>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {allRecommendations.map((rec, idx) => (
                  <div
                    key={`${rec.name}-${idx}`}
                    className="p-6 rounded-2xl fade-in h-full flex flex-col"
                    style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow)' }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 overflow-hidden" style={{ borderColor: 'var(--primary-color)' }} aria-hidden="true">
                        {rec.avatar ? (
                          <img src={rec.avatar} alt={rec.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-semibold" style={{ color: 'var(--primary-color)' }}>
                            {rec.name.split(' ').map(p => p[0]).slice(0,2).join('')}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{rec.name}</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{rec.role}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{rec.relationship} • {rec.date}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <i className="fas fa-quote-left mr-2" style={{ color: 'var(--primary-color)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{rec.text}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <a href={rec.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--primary-color)' }} onClick={() => trackEvent('outbound', 'linkedin-recommendation', rec.name)}>
                        <i className="fab fa-linkedin" /> View on LinkedIn
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      {/* Appreciations Section */}
      <section id="appreciations" className="section">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 fade-in" style={{ color: 'var(--primary-color)' }}>
            Appreciations
          </h2>

          {appreciations.length === 0 ? (
            <div
              className="max-w-3xl mx-auto p-8 rounded-2xl text-center fade-in"
              style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow)' }}
            >
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
        Drop a screenshot in <code>client/public/assets</code> named <strong>Appreciation.jpg</strong>
        (also tries appreciation.jpg/.png/.jpeg). The section will pick it up automatically.
              </p>
            </div>
          ) : (
            isSmallScreen ? (
              <Carousel className="max-w-5xl mx-auto">
                <CarouselContent>
                  {appreciations.map((a, idx) => (
                    <CarouselItem key={`appr-${idx}`}>
                      <figure className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow)' }}>
                        <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                          <img
                            src={a.image}
                            alt={a.title || a.from || `Appreciation ${idx + 1}`}
                            className="w-full h-auto object-contain"
                            loading="lazy"
                            onClick={() => trackEvent('open', 'appreciation', a.image)}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                        {(a.title || a.from || a.date || a.description) && (
                          <figcaption className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                            <div>{a.from}{a.date ? ` • ${a.date}` : ''}</div>
                            {a.description && <div className="mt-1">{a.description}</div>}
                          </figcaption>
                        )}
                      </figure>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 -translate-y-1/2" />
                <CarouselNext className="right-2 -translate-y-1/2" />
              </Carousel>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {appreciations.map((a, idx) => (
                  <figure key={`appr-${idx}`} className="p-4 rounded-2xl fade-in" style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow)' }}>
                    <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                      <img
                        src={a.image}
                        alt={a.title || a.from || `Appreciation ${idx + 1}`}
                        className="w-full h-auto object-contain"
                        loading="lazy"
                        onClick={() => trackEvent('open', 'appreciation', a.image)}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    {(a.title || a.from || a.date || a.description) && (
                      <figcaption className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                        <div>{a.from}{a.date ? ` • ${a.date}` : ''}</div>
                        {a.description && <div className="mt-1">{a.description}</div>}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )
          )}
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
