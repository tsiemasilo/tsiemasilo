import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Code,
  Linkedin,
  Menu,
  X
} from "lucide-react";
import { SiHtml5, SiFigma, SiAndroidstudio, SiCplusplus, SiIndeed } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Typewriter Loader Component
const TypewriterLoader = () => {
  return (
    <div className="typewriter-loader">
      <div className="typewriter">
        <div className="slide"><i /></div>
        <div className="paper" />
        <div className="keyboard" />
      </div>
    </div>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeProjectCategory, setActiveProjectCategory] = useState('All');
  const [showBrandAnimation, setShowBrandAnimation] = useState(true);
  const [brandAnimationComplete, setBrandAnimationComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Close mobile menu when clicking on links
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // Brand animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBrandAnimation(false);
      setBrandAnimationComplete(true);
    }, 3000); // Show for 3 seconds total (1s animation + 2s stay)

    return () => clearTimeout(timer);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email via Netlify Function
      const response = await fetch('/.netlify/functions/smtp-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        // Reset form
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll listener to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: SiHtml5,
      title: "Web Development", 
      description: "Continuing to enhance my knowledge of front-end and back-end technologies like JavaScript and Node.js"
    },
    {
      icon: SiFigma,
      title: "UI/UX Design",
      description: "Learning the foundations of design principles and tools like Figma to create user-friendly interfaces."
    },
    {
      icon: SiAndroidstudio,
      title: "App Development",
      description: "Exploring mobile app development through intermediate projects and tutorials in Android Studio"
    },
    {
      icon: SiCplusplus,
      title: "Problem-Solving",
      description: "Improving problem-solving skills by practicing data structures and algorithms with Java."
    }
  ];

  const projectCategories = ['All', 'WEB DESIGN', 'GAMES', 'WEB APPLICATION', 'APPS DESIGN'];
  
  const projects = [
    {
      title: "No Shedding - Load Shedding Solutions",
      description: "A comprehensive e-commerce platform for electrical equipment and UPS systems with product categories, cart functionality, and payment integration.",
      image: "/noshedding-screenshot.png",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Ozow", "JWT"],
      category: "WEB APPLICATION",
      liveUrl: "https://noshedding.co.za",
      codeUrl: "#"
    },
    {
      title: "Tsie Movie Card",
      description: "Interactive movie discovery platform featuring dynamic movie cards with detailed information, ratings, and search functionality. Modern UI with responsive design and smooth animations.",
      image: "/tsie-movie-card.png",
      technologies: ["React", "JavaScript", "CSS", "Movie API", "Responsive Design"],
      category: "WEB APPLICATION",
      liveUrl: "https://tsiemoviecard.netlify.app",
      codeUrl: "#"
    },
    {
      title: "GovTech Competition Platform",
      description: "Event management platform with QR code registration and prize draw functionality for seamless attendee experience.",
      image: "/govtech-competition.png",
      technologies: ["JavaScript", "QR Code API", "Event Management", "Responsive Design"],
      category: "WEB APPLICATION",
      liveUrl: "https://govtechcompetition.netlify.app/",
      codeUrl: "#"
    },
    {
      title: "Business LeadFinder",
      description: "Comprehensive business discovery dashboard for finding local businesses without websites, featuring automated verification, search parameters, and lead export functionality for outreach opportunities.",
      image: "/business-leadfinder-screenshot.png",
      technologies: ["React", "Business APIs", "Data Analytics", "Search Filters"],
      category: "WEB APPLICATION",
      liveUrl: "https://businessleadfinder.netlify.app/",
      codeUrl: "#"
    },
    {
      title: "Task Management App",
      description: "A mobile-first task management application with real-time synchronization and team collaboration features.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["React Native", "Firebase", "TypeScript"],
      category: "APPS DESIGN",
      liveUrl: "#",
      codeUrl: "#"
    },
    {
      title: "Masilo Web Solutions",
      description: "A modern web development agency website with responsive design, service showcases, client testimonials, and portfolio integration.",
      image: "/masilo-solutions-screenshot.png",
      technologies: ["React", "CSS3", "JavaScript", "Netlify", "Responsive Design"],
      category: "WEB DESIGN",
      liveUrl: "https://masilowebsolutions.netlify.app/",
      codeUrl: "#"
    },
    {
      title: "Lesedi 29 Construction",
      description: "Professional construction company website showcasing business areas including construction services and waste removal & collection with project galleries.",
      image: "/lesedi-construction-screenshot.png",
      technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "PHP"],
      category: "WEB DESIGN",
      liveUrl: "https://lesedi29constructions.co.za/",
      codeUrl: "#"
    },
    {
      title: "FashionFlag.SA",
      description: "Modern fashion showcase platform featuring curated style collections, outfit inspirations, and elegant fashion photography with interactive design elements.",
      image: "/fashionflag-screenshot.png",
      technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX"],
      category: "WEB DESIGN",
      liveUrl: "https://fashionflagza.netlify.app/",
      codeUrl: "#"
    },
    {
      title: "Do You Love Me?",
      description: "A playful interactive game featuring cute animated characters with engaging user interactions and charming visual design.",
      image: "/do-you-love-me-game.png",
      technologies: ["JavaScript", "HTML5", "CSS3", "Animations"],
      category: "GAMES",
      liveUrl: "https://tsieyouloveme.netlify.app",
      codeUrl: "#"
    },
    {
      title: "Ping Pong",
      description: "Classic arcade-style ping pong game with smooth controls, real-time scoring, and responsive gameplay mechanics.",
      image: "/ping-pong-game.png",
      technologies: ["JavaScript", "HTML5 Canvas", "CSS3", "Game Physics"],
      category: "GAMES",
      liveUrl: "https://tsiepingpong.netlify.app/",
      codeUrl: "#"
    },
    {
      title: "Puzzle Game",
      description: "An engaging puzzle game with multiple levels, smooth animations, and progressive difficulty.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["JavaScript", "HTML5 Canvas", "CSS3"],
      category: "GAMES",
      liveUrl: "#",
      codeUrl: "#"
    }
  ];

  const filteredProjects = activeProjectCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeProjectCategory);

  return (
    <div className="min-h-screen bg-dark-primary text-text-primary">
      {/* 4D Brand Animation Overlay */}
      <AnimatePresence>
        {showBrandAnimation && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-primary"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Matrix Background for Animation */}
            <div className="matrix-container absolute inset-0">
              <div className="matrix-pattern">
                {Array.from({ length: 60 }, (_, i) => (
                  <div key={i} className="matrix-column"></div>
                ))}
              </div>
            </div>
            
            <motion.div
              className="brand-animation-container relative z-10"
              initial={{ 
                scale: 0,
                rotateX: -90,
                rotateY: 0,
                z: -1000,
                opacity: 0
              }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotateX: [90, 0, 0],
                rotateY: [0, 360, 0],
                z: [1000, 0, 0],
                opacity: 1
              }}
              exit={{
                scale: 0.3,
                x: typeof window !== 'undefined' && window.innerWidth < 768 ? -150 : -600,
                y: typeof window !== 'undefined' && window.innerWidth < 768 ? -250 : -300,
                rotateZ: 360,
                opacity: 1
              }}
              transition={{ 
                duration: 1,
                ease: "easeOut",
                exit: { duration: 1, ease: "easeInOut" }
              }}
              style={{ 
                perspective: "1000px",
                transformStyle: "preserve-3d"
              }}
            >
              <h1 className="text-6xl sm:text-8xl font-bold gradient-text text-center">
                Hello World
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 bg-dark-primary/90 backdrop-blur-sm z-50 border-b border-dark-accent nav-3d"
        initial={{ y: -100 }}
        animate={{ y: brandAnimationComplete ? 0 : -100 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: brandAnimationComplete ? 0 : 3 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: brandAnimationComplete ? 1 : 0 }}
            >
              <span className="text-xl font-bold gradient-text nav-brand-3d cursor-pointer">Hello World</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {['home', 'about', 'services', 'projects', 'contact'].map((section, index) => (
                  <motion.button
                    key={section}
                    onClick={() => scrollToSection(section)} 
                    className={`nav-item-3d px-4 py-2 transition-colors duration-200 rounded-lg capitalize relative ${
                      activeSection === section 
                        ? 'text-green-primary bg-green-primary/10' 
                        : 'text-text-secondary hover:text-green-primary'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ 
                      opacity: brandAnimationComplete ? 1 : 0,
                      y: brandAnimationComplete ? 0 : -20
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: brandAnimationComplete ? 0.1 + index * 0.1 : 3 + index * 0.1
                    }}
                  >
                    {section}
                    {activeSection === section && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-primary"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-green-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              initial={{ opacity: 0 }}
              animate={{ opacity: brandAnimationComplete ? 1 : 0 }}
              transition={{ duration: 0.5, delay: brandAnimationComplete ? 0.6 : 3.6 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="md:hidden bg-dark-secondary"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {['home', 'about', 'services', 'projects', 'contact'].map((section) => (
                    <button
                      key={section}
                      onClick={() => { scrollToSection(section); handleNavClick(); }} 
                      className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors capitalize ${
                        activeSection === section 
                          ? 'text-green-primary bg-green-primary/10' 
                          : 'text-text-secondary hover:text-green-primary hover:bg-dark-accent'
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center hero-3d overflow-hidden">
        {/* Matrix Rain Background */}
        <div className="absolute inset-0 matrix-rain">
          {Array.from({ length: 100 }, (_, i) => (
            <div key={i} className="rain-column" style={{ left: `${i}%` }}></div>
          ))}
        </div>
        
        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: brandAnimationComplete ? 1 : 0 }}
          transition={{ duration: 1, delay: brandAnimationComplete ? 0.5 : 3.5 }}
        >
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            animate="animate"
          >
            {/* Profile Photo */}
            <motion.div 
              className="flex justify-center mb-8"
              variants={fadeInUp}
            >
              <div className="profile-photo photo-shimmer">
                <img 
                  src="/attached_assets/home.jpg"
                  alt="Tsie Masilo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
              variants={fadeInUp}
            >
              <span className="text-text-primary">Hi, I'm </span>
              <span className="gradient-text">Tsie Masilo</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              A passionate developer crafting digital experiences with modern web technologies.
              Building the future, one line of code at a time.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.button
                onClick={() => scrollToSection('projects')}
                className="btn-3d"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.button>
              
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 border-2 border-green-primary text-green-primary rounded-lg font-semibold transition-all duration-300 hover:bg-green-primary hover:text-dark-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">About Me</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              I'm a dedicated developer with a passion for creating innovative solutions 
              and learning cutting-edge technologies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <h3 className="text-2xl font-semibold mb-6 gradient-text">My Journey</h3>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  As an aspiring developer, I'm passionate about technology and its potential to solve real-world problems. 
                  My journey in programming started with curiosity and has evolved into a dedicated pursuit of excellence 
                  in web development.
                </p>
                <p>
                  I focus on building responsive, user-friendly applications using modern technologies like React, 
                  Node.js, and various frameworks. Each project teaches me something new and helps me grow as a developer.
                </p>
                <p>
                  When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, 
                  and connecting with the developer community to share knowledge and learn from others.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-6"
              {...fadeInUp}
            >
              <div className="card-3d p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-2">10+</div>
                <div className="text-text-secondary">Projects Completed</div>
              </div>
              <div className="card-3d p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-2">2+</div>
                <div className="text-text-secondary">Years Learning</div>
              </div>
              <div className="card-3d p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-2">5+</div>
                <div className="text-text-secondary">Technologies</div>
              </div>
              <div className="card-3d p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                <div className="text-text-secondary">Dedication</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-secondary/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">What I Do</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              I'm continuously learning and expanding my skills in various areas of development
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            animate="animate"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card p-8 text-center group"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div className="mb-6">
                  <service.icon 
                    size={48} 
                    className="mx-auto text-green-primary group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-text-primary">{service.title}</h3>
                <p className="text-text-secondary leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">My Projects</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Here are some of the projects I've worked on, showcasing my skills and creativity
            </p>

            {/* Project Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {projectCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveProjectCategory(category)}
                  className={`filter-btn ${activeProjectCategory === category ? 'active' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            animate="animate"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={`${project.title}-${activeProjectCategory}`}
                className="project-card group"
                variants={fadeInUp}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="project-card-blob"></div>
                <div className="project-card-content">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="project-card-image"
                  />
                  <h3 className="text-xl font-semibold mb-3 text-text-primary group-hover:text-green-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-text-secondary mb-4 leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="project-tech-stack">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="project-links">
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                    <a 
                      href={project.codeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link"
                    >
                      <Code size={16} />
                      Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-secondary/30 contact-section">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">Let's Work Together</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Have a project in mind? I'd love to hear about it and help bring your ideas to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Contact Form */}
            <motion.div {...fadeInUp}>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium mb-2">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-primary border-dark-accent focus:ring-green-primary focus:border-transparent text-white placeholder:text-text-secondary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium mb-2">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-primary border-dark-accent focus:ring-green-primary focus:border-transparent text-white placeholder:text-text-secondary"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium mb-2">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-dark-primary border-dark-accent focus:ring-green-primary focus:border-transparent text-white placeholder:text-text-secondary resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-dark-primary font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: isSubmitting ? '#00dd77' : '#00ff88' }}
                  onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#00dd77')}
                  onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#00ff88')}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <TypewriterLoader />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div {...fadeInUp}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6 gradient-text">Get In Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                        style={{ backgroundColor: 'rgba(0, 255, 136, 0.2)' }}
                      >
                        <Mail style={{ color: '#00ff88' }} size={20} />
                      </div>
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-text-secondary">tsiemasilo@gmail.com</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                        style={{ backgroundColor: 'rgba(0, 255, 136, 0.2)' }}
                      >
                        <Phone style={{ color: '#00ff88' }} size={20} />
                      </div>
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-text-secondary">082 806 9569 (WhatsApp only)</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                        style={{ backgroundColor: 'rgba(0, 255, 136, 0.2)' }}
                      >
                        <MapPin style={{ color: '#00ff88' }} size={20} />
                      </div>
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-text-secondary">Johannesburg/Midrand, South Africa</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Follow Me</h4>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-dark-primary border border-dark-accent rounded-lg flex items-center justify-center transition-all duration-200 group"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#00ff88';
                        e.currentTarget.style.borderColor = '#00ff88';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--dark-primary)';
                        e.currentTarget.style.borderColor = 'var(--dark-accent)';
                      }}
                    >
                      <Github className="text-text-secondary group-hover:text-white" size={20} />
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-dark-primary border border-dark-accent rounded-lg flex items-center justify-center transition-all duration-200 group"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#00ff88';
                        e.currentTarget.style.borderColor = '#00ff88';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--dark-primary)';
                        e.currentTarget.style.borderColor = 'var(--dark-accent)';
                      }}
                    >
                      <Linkedin className="text-text-secondary group-hover:text-white" size={20} />
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-dark-primary border border-dark-accent rounded-lg flex items-center justify-center transition-all duration-200 group"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#00ff88';
                        e.currentTarget.style.borderColor = '#00ff88';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--dark-primary)';
                        e.currentTarget.style.borderColor = 'var(--dark-accent)';
                      }}
                    >
                      <SiIndeed className="text-text-secondary group-hover:text-white" size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-dark-accent">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-text-secondary">
            © 2024 Your Name. All rights reserved. Built with passion and modern web technologies.
          </p>
        </div>
      </footer>
    </div>
  );
}