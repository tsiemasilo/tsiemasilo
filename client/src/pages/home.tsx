import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView } from "framer-motion";
// Custom UI components for consistent styling
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Custom toast notifications hook
import { useToast } from "@/hooks/use-toast";
// Icon libraries for UI elements
import {
  ExternalLink,
  Github,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Menu,
  X
} from "lucide-react";
import { SiHtml5, SiFigma, SiAndroidstudio, SiCplusplus, SiIndeed, SiWhatsapp } from "react-icons/si";
// Navigation for routing
import { useLocation } from "wouter";

// Animation configurations for smooth fade-in effects
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Stagger animation for multiple elements appearing in sequence
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  // Navigation state management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeProjectCategory, setActiveProjectCategory] = useState('All');
  
  // Brand animation control states
  const [showBrandAnimation, setShowBrandAnimation] = useState(true);
  const [brandAnimationComplete, setBrandAnimationComplete] = useState(false);
  
  // Contact form state management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  // Email submission animation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showSentAnimation, setShowSentAnimation] = useState(false);
  
  // Toast notification system
  const { toast } = useToast();
  
  const [, navigate] = useLocation();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroBgY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const floatY3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set((clientX - centerX) / centerX * 20);
      mouseY.set((clientY - centerY) / centerY * 20);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Close mobile menu when navigation links are clicked
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // Secret admin access - keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Secret combination: Ctrl+Shift+A
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        navigate('/admin/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Initial brand animation controller - runs on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBrandAnimation(false);
      setBrandAnimationComplete(true);
    }, 3000); // Display brand animation for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Handle contact form submission with animation sequence
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields are filled
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
      // Try multiple endpoints as fallback
      let response;
      const emailData = {
        name: formData.name,
        email: formData.email,
        message: formData.message
      };

      // Try smtp-email first, then contact as fallback
      try {
        response = await fetch('/.netlify/functions/smtp-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData),
        });
      } catch {
        // Fallback to contact function
        response = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData),
        });
      }

      if (response.ok) {
        // Start email sent animation sequence after typewriter completes
        setTimeout(() => {
          setEmailSent(true);
          setShowSentAnimation(true);
          
          // Complete animation sequence and reset form
          setTimeout(() => {
            setShowSentAnimation(false);
            setEmailSent(false);
            setIsSubmitting(false);
            
            // Clear form fields after successful submission
            setFormData({ name: "", email: "", message: "" });
          }, 3000);
        }, 2500); // Allow typewriter animation to complete
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  // Update form data when user types in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Smooth scroll navigation to different sections
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Track which section is currently visible for navigation highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      // Check which section is currently in view
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

  const projectCategories = ['All', 'WEB DESIGN', 'GAMES', 'WEB APPLICATION', 'APPS DESIGN']; // Updated
  
  const projects = [
    {
      title: "Mint App",
      description: "A financial tools platform offering money management features designed to help users take control of their finances. Features a clean, modern interface with secure login and account creation.",
      image: "/mint-app-screenshot.png",
      technologies: ["React", "FinTech", "Financial Management", "Authentication"],
      category: "WEB APPLICATION",
      liveUrl: "https://app.mymint.co.za/",
      codeUrl: "#"
    },
    {
      title: "Face ID Recognition",
      description: "Advanced biometric authentication system featuring facial recognition technology for secure user registration and login. Modern interface with new user registration, existing user authentication, and admin panel for managing registered users.",
      image: "/face-recognition-screenshot.png",
      technologies: ["React", "Biometric Authentication", "Face Recognition", "Security", "User Management"],
      category: "WEB APPLICATION",
      liveUrl: "https://facebiometrics.netlify.app/",
      codeUrl: "#"
    },
    {
      title: "AI CHATBOT",
      description: "Intelligent conversational AI chatbot interface with natural language processing capabilities. Features modern chat UI, real-time messaging, and responsive design for seamless user interactions.",
      image: "/ai-chatbot-screenshot.png",
      technologies: ["React", "AI/ML", "Natural Language Processing", "Chat Interface"],
      category: "WEB APPLICATION",
      liveUrl: "https://tsiemasilochatbot.netlify.app/",
      codeUrl: "#"
    },
    {
      title: "Edight",
      description: "A comprehensive IT solutions company website offering services, training, and support. Features a modern professional design with stats dashboard, service showcases, and responsive layout.",
      image: "/edight-screenshot.png",
      technologies: ["React", "CSS3", "JavaScript", "Responsive Design", "UI/UX"],
      category: "WEB DESIGN",
      liveUrl: "https://edight.co.za/",
      codeUrl: "#"
    },
    {
      title: "Network Management System",
      description: "Professional network monitoring dashboard for tracking system agents, connectivity status, and network performance metrics in real-time with comprehensive health monitoring.",
      image: "/network-management-screenshot.png",
      technologies: ["React", "Network Monitoring", "Dashboard", "Real-time Analytics"],
      category: "WEB APPLICATION",
      liveUrl: "https://front-nms.netlify.app/",
      codeUrl: "#"
    },
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
      title: "ERP System Demo",
      description: "Enterprise Resource Planning system with comprehensive dashboard for business operations, inventory management, sales tracking, and customer relationship management with real-time analytics.",
      image: "/erp-system-screenshot.png",
      technologies: ["React", "ERP Integration", "Business Operations", "Dashboard Analytics"],
      category: "WEB APPLICATION",
      liveUrl: "https://erpsystemdemo.netlify.app/",
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
      title: "AI Call Analyzer",
      description: "AI-powered call center quality analysis platform with comprehensive dashboard for monitoring call quality metrics, agent performance, and real-time analytics with drag-and-drop audio file processing.",
      image: "/ai-call-analyzer-screenshot.png",
      technologies: ["React", "AI Analytics", "Audio Processing", "Dashboard UI"],
      category: "WEB APPLICATION",
      liveUrl: "https://aicallanalyzer.netlify.app/",
      codeUrl: "#"
    },
    {
      title: "Mobile Apps Portfolio",
      description: "Exciting mobile applications are in development. Check back soon for innovative app solutions featuring modern design and seamless user experiences.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["React Native", "Flutter", "Mobile UI/UX"],
      category: "APPS DESIGN",
      liveUrl: "#",
      codeUrl: "#",
      comingSoon: true
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
      description: "Modern two-player arcade ping pong game featuring smooth gameplay, real-time scoring, keyboard controls (W/S and arrow keys), and stylish gradient UI with start, pause, and restart functionality.",
      image: "/ping-pong-game-new.png",
      technologies: ["JavaScript", "HTML5 Canvas", "CSS3", "Game Physics", "2-Player"],
      category: "GAMES",
      liveUrl: "https://tsiepingpong.netlify.app/",
      codeUrl: "#"
    }
  ];

  const filteredProjects = activeProjectCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeProjectCategory);

  return (
    <div className="min-h-screen bg-dark-primary text-text-primary relative">
      {/* Startup Animation Overlay */}
      <AnimatePresence>
        {showBrandAnimation && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ background: 'radial-gradient(ellipse at center, #0a1628 0%, #050d1a 50%, #000000 100%)' }}
          >
            {/* Floating Particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 40 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 4 + 1,
                    height: Math.random() * 4 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#0088ff' : '#ffffff',
                    opacity: 0,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 0],
                    y: [0, -60 - Math.random() * 40],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Orbiting Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="absolute border border-[#00ff88]/20 rounded-full"
                style={{ width: 300, height: 300 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute border border-[#0088ff]/15 rounded-full"
                style={{ width: 400, height: 400 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute border border-[#00ff88]/10 rounded-full"
                style={{ width: 500, height: 500 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Code Brackets */}
              <div className="flex items-center gap-3 sm:gap-5">
                <motion.span
                  className="text-5xl sm:text-7xl font-mono font-light"
                  style={{ color: '#00ff88' }}
                  initial={{ x: -80, opacity: 0, rotateY: -90 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                >
                  {'<'}
                </motion.span>

                <motion.div
                  className="flex flex-col items-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.h1
                    className="text-4xl sm:text-6xl font-bold tracking-tight text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    style={{
                      textShadow: '0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 136, 255, 0.15)',
                    }}
                  >
                    Tsie Masilo
                  </motion.h1>
                </motion.div>

                <motion.span
                  className="text-5xl sm:text-7xl font-mono font-light"
                  style={{ color: '#00ff88' }}
                  initial={{ x: 80, opacity: 0, rotateY: 90 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                >
                  {'/>'}
                </motion.span>
              </div>

              {/* Subtitle with typing cursor */}
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <span className="text-sm sm:text-lg font-mono tracking-[0.3em] uppercase" style={{ color: '#0088ff' }}>
                  Full Stack Developer
                </span>
                <motion.span
                  className="inline-block w-[2px] h-5 sm:h-6 ml-1"
                  style={{ backgroundColor: '#00ff88' }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                />
              </motion.div>

              {/* Loading Bar */}
              <motion.div
                className="w-48 sm:w-64 h-[2px] rounded-full overflow-hidden mt-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #00ff88, #0088ff)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.5, duration: 1.3, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
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
                {['home', 'projects', 'about', 'services', 'contact'].map((section, index) => (
                  <motion.button
                    key={section}
                    onClick={() => scrollToSection(section)} 
                    className={`nav-item-3d px-4 py-2 transition-colors duration-200 rounded-lg capitalize relative ${
                      activeSection === section 
                        ? 'text-white bg-green-primary/20' 
                        : 'text-text-secondary hover:text-white'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      boxShadow: activeSection === section 
                        ? "0 0 20px rgba(52, 211, 153, 0.4)" 
                        : "0 0 0px rgba(52, 211, 153, 0)"
                    }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeSection === section && (
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)' }}
                        layoutId="activeSection"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{section}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 text-text-secondary transition-colors duration-200 ${mobileMenuOpen ? 'hamburger-open' : ''}`}
                onMouseEnter={(e) => e.currentTarget.style.color = '#00ff88'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-6 h-6 flex flex-col justify-center">
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden bg-dark-secondary"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {['home', 'projects', 'about', 'services', 'contact'].map((section, index) => (
                  <motion.button
                    key={section}
                    onClick={() => { scrollToSection(section); handleNavClick(); }} 
                    className="mobile-nav-item block px-3 py-2 text-text-secondary hover:text-green-primary transition-colors duration-200 w-full text-left rounded-lg hover:bg-dark-accent capitalize"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ x: 10, backgroundColor: "var(--dark-accent)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {section}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        id="home"
        className="min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 relative overflow-hidden mobile-section-padding"
      >
        {/* Parallax Background Layer */}
        <motion.div className="absolute inset-0" style={{ y: heroBgY }}>
          {/* Matrix Background */}
          <div className="matrix-container">
            <div className="matrix-pattern">
              {Array.from({ length: 60 }, (_, i) => (
                <div key={i} className="matrix-column"></div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Animated Gradient Mesh Background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: heroBgY }}
        >
          <div className="hero-gradient-mesh" />
        </motion.div>

        {/* Floating Geometric Elements - Parallax Layers */}
        <motion.div
          className="absolute top-[15%] left-[8%] w-20 h-20 sm:w-28 sm:h-28 border border-[#00ff88]/20 rounded-full"
          style={{
            y: floatY1,
            x: smoothMouseX,
            rotate: ringRotate,
          }}
        />
        <motion.div
          className="absolute top-[25%] right-[10%] w-16 h-16 sm:w-20 sm:h-20 border border-[#0088ff]/15 rounded-lg"
          style={{
            y: floatY2,
            x: smoothMouseX,
            rotate: ringRotate,
          }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[15%] w-10 h-10 sm:w-14 sm:h-14"
          style={{
            y: floatY3,
            x: smoothMouseY,
          }}
        >
          <div className="w-full h-full border border-[#00ff88]/15 rotate-45" />
        </motion.div>
        <motion.div
          className="absolute bottom-[30%] right-[12%] w-24 h-24 sm:w-32 sm:h-32 border border-[#0088ff]/10 rounded-full"
          style={{
            y: floatY1,
            rotate: ringRotate,
          }}
        />

        {/* Floating Tech Dots */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full hidden sm:block"
            style={{
              background: i % 2 === 0 ? '#00ff88' : '#0088ff',
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              y: i % 2 === 0 ? floatY2 : floatY3,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Main Hero Content - Parallax */}
        <motion.div
          className="max-w-5xl mx-auto text-center relative z-10"
          style={{
            y: heroTextY,
            opacity: heroOpacity,
            scale: heroScale,
          }}
        >
          {/* Greeting Tag */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={brandAnimationComplete ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#00ff88]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-mono text-[#00ff88]/80">Available for work</span>
          </motion.div>

          {/* Main Heading with Staggered Character Animation */}
          <motion.div
            className="overflow-hidden mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            animate={brandAnimationComplete ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight"
              initial={{ y: 80 }}
              animate={brandAnimationComplete ? { y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              Hi, I'm{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Tsie Masilo</span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-[3px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, #00ff88, #0088ff)' }}
                  initial={{ width: '0%' }}
                  animate={brandAnimationComplete ? { width: '100%' } : {}}
                  transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                />
              </span>
            </motion.h1>
          </motion.div>

          {/* Subtitle with Reveal */}
          <motion.div className="overflow-hidden mb-2 sm:mb-3">
            <motion.p
              className="text-lg sm:text-xl md:text-2xl font-light"
              style={{ color: '#00ff88' }}
              initial={{ y: 50, opacity: 0 }}
              animate={brandAnimationComplete ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Full-Stack Developer & UI/UX Designer
            </motion.p>
          </motion.div>

          <motion.div className="overflow-hidden mb-8 sm:mb-10">
            <motion.p
              className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
              initial={{ y: 40, opacity: 0 }}
              animate={brandAnimationComplete ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Passionate about creating digital experiences that matter. Turning complex problems into simple, beautiful, and intuitive solutions.
            </motion.p>
          </motion.div>

          {/* CTA Buttons with Staggered Entry */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={brandAnimationComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => scrollToSection('projects')}
                className="text-white mobile-btn font-semibold w-full sm:w-auto hero-btn-primary"
                style={{ backgroundColor: '#00ff88', padding: '14px 32px' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00dd77'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00ff88'}
              >
                View My Work
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="mobile-btn font-semibold w-full sm:w-auto hero-btn-outline"
                style={{ borderColor: '#00ff88', color: '#00ff88', padding: '14px 32px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00ff88';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#00ff88';
                }}
              >
                Get In Touch
              </Button>
            </motion.div>
          </motion.div>

          {/* Tech Stack Ticker */}
          <motion.div
            className="mt-12 sm:mt-16 flex items-center justify-center gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={brandAnimationComplete ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <span className="text-xs text-text-secondary uppercase tracking-widest">Tech Stack</span>
            <div className="flex items-center gap-4 sm:gap-5">
              {['React', 'Node.js', 'TypeScript', 'Tailwind', 'PostgreSQL'].map((tech, i) => (
                <motion.span
                  key={tech}
                  className="text-xs sm:text-sm font-mono text-text-secondary/60 hover:text-[#00ff88] transition-colors cursor-default"
                  initial={{ opacity: 0, y: 10 }}
                  animate={brandAnimationComplete ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.3 + i * 0.1 }}
                  whileHover={{ scale: 1.1, color: '#00ff88' }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: scrollIndicatorOpacity }}
          initial={{ opacity: 0 }}
          animate={brandAnimationComplete ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs text-text-secondary/50 uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-5 h-8 rounded-full border border-text-secondary/30 flex justify-center pt-1.5"
            animate={{ borderColor: ['rgba(255,255,255,0.2)', 'rgba(0,255,136,0.4)', 'rgba(255,255,255,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 rounded-full bg-[#00ff88]"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 mobile-section-padding mobile-spacing">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="text-white font-semibold mb-2 flex items-center justify-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="h-px bg-white"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <span>•</span>
              <span>Portfolio</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: '#00ff88' }}>My Creative Work</h2>
            
            {/* Project Category Navigation */}
            <motion.div 
              className="project-nav-container flex flex-wrap justify-center gap-2 sm:gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {projectCategories.map((category, index) => {
                const isActive = activeProjectCategory === category;
                
                return (
                  <motion.button
                    key={category}
                    onClick={() => setActiveProjectCategory(category)}
                    className={`project-nav-button morph-container px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 border relative overflow-hidden ${
                      isActive 
                        ? 'active text-white border-transparent' 
                        : 'text-gray-300 border-gray-600 hover:text-white hover:border-gray-500'
                    }`}
                    style={{ 
                      backgroundColor: isActive ? '#00ff88' : 'transparent',
                      boxShadow: isActive ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
                    }}
                    initial={{ 
                      opacity: 0, 
                      y: 20,
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                    }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Holographic shimmer effect */}
                    <div className="holographic-shimmer"></div>
                    
                    {/* Morphing background */}
                    <div className="morph-background"></div>
                    


                    {/* Energy pulse */}
                    {isActive && <div className="energy-pulse"></div>}



                    {/* Text with glitch effect */}
                    <span className="glitch-text relative z-10" data-text={category}>{category}</span>

                    {/* Active state indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)' }}
                        layoutId="activeProjectCategory"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            key={activeProjectCategory}
          >
            {filteredProjects.map((project, index) => (
              <motion.div 
                key={`${project.title}-${activeProjectCategory}`} 
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="project-card"
              >
                {/* Animated Blob Effect */}
                <div className="project-card-blob"></div>
                
                <div className="project-card-content">
                  <div className="project-image-container">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="project-image"
                    />
                    <div className="project-category-badge">
                      {project.category}
                    </div>
                    {project.comingSoon && (
                      <div className="coming-soon-overlay">
                        <div className="coming-soon-text">Coming Soon</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">
                      {project.description}
                    </p>
                    
                    <div className="project-tech-stack">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="project-tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="project-links mt-auto">
                      {project.comingSoon ? (
                        <div className="coming-soon-message">
                          <div className="text-sm text-text-secondary">
                            🚀 Exciting apps in development
                          </div>
                        </div>
                      ) : (
                        <>
                          <a 
                            href={project.liveUrl} 
                            className="project-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink size={16} />
                            Live Demo
                          </a>
                          <a 
                            href={project.codeUrl} 
                            className="project-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github size={16} />
                            Code
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {filteredProjects.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-text-secondary text-lg">No projects found in this category.</p>
            </motion.div>
          )}
          
          
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 px-6 sm:px-8 lg:px-12 mobile-section-padding mobile-spacing">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <motion.div
              className="h-1 mx-auto"
              style={{ backgroundColor: '#00ff88' }}
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl profile-image-container">
                <img 
                  src="/assets/profile.jpg" 
                  alt="Tsie Masilo - Professional portrait" 
                  className="w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-300 hover:scale-105"
                  style={{ objectPosition: '50% 20%', transform: 'scale(1.0)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/30 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border rounded-2xl" style={{ borderColor: 'rgba(0, 255, 136, 0.2)' }}></div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 gradient-text">Crafting Digital Solutions</h3>
              <p className="text-text-secondary mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                I'm a passionate developer with expertise in modern web technologies. I love turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you'll find me exploring new technologies or contributing to open-source projects.
              </p>
              <p className="text-text-secondary mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                With a strong foundation in both front-end and back-end development, I create end-to-end solutions that are not only functional but also provide exceptional user experiences.
              </p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { value: "15+", label: "Projects" },
                  { value: "3+", label: "Years Experience" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-3 sm:p-4 bg-dark-secondary rounded-xl border border-[#00ff88]/10 hover:border-[#00ff88]/25 transition-all duration-300"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: '#00ff88' }}>{stat.value}</div>
                    <div className="text-xs sm:text-sm text-text-secondary">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-secondary mobile-section-padding mobile-spacing relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="text-white font-semibold mb-3 flex items-center justify-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="h-px bg-[#00ff88]/50"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <span className="text-[#00ff88]/70 text-xs uppercase tracking-[0.2em] font-mono">What I Offer</span>
              <motion.div
                className="h-px bg-[#00ff88]/50"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#00ff88' }}>My Services</h2>
            <motion.p
              className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Delivering end-to-end digital solutions with a focus on quality and user experience
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full"
                >
                  <Card className="p-6 sm:p-8 border border-[#00ff88]/10 hover:border-[#00ff88]/30 transition-all duration-300 h-full service-card-glow" style={{ backgroundColor: 'hsl(213, 27%, 8%)' }}>
                    <CardContent className="p-0 flex flex-col h-full">
                      <motion.div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 relative"
                        style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)' }}
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <service.icon className="text-white" size={22} />
                        <div className="absolute inset-0 rounded-xl bg-[#00ff88]/20 blur-lg -z-10" />
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-3 text-white">{service.title}</h3>
                      <motion.div
                        className="h-0.5 mb-3 rounded-full"
                        style={{ background: 'linear-gradient(90deg, #00ff88, transparent)' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: 40 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      />
                      <p className="text-gray-400 leading-relaxed text-sm flex-grow">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 px-6 sm:px-8 lg:px-12 mobile-section-padding mobile-spacing relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent" />
          <div className="absolute top-[20%] right-[5%] w-64 h-64 bg-[#00ff88]/3 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] left-[5%] w-48 h-48 bg-[#0088ff]/3 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="flex items-center justify-center gap-2 mb-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="h-px bg-[#00ff88]/50"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <span className="text-[#00ff88]/70 text-xs uppercase tracking-[0.2em] font-mono">Contact</span>
              <motion.div
                className="h-px bg-[#00ff88]/50"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Let's Work Together</h2>
            <motion.div
              className="h-1 mx-auto mb-5 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #00ff88, transparent)' }}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 120, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
            <motion.p
              className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Have a project in mind? I'd love to hear about it. Send me a message and let's discuss how we can bring your ideas to life.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-dark-secondary/50 backdrop-blur-sm border border-[#00ff88]/10 rounded-2xl p-6 sm:p-8">
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#00ff88' }}>Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-primary/80 border border-dark-accent/50 rounded-xl focus:ring-2 focus:border-[#00ff88]/30 text-white placeholder:text-text-secondary transition-all duration-300 hover:border-[#00ff88]/20"
                      style={{ '--tw-ring-color': '#00ff88' } as React.CSSProperties}
                      placeholder="Your name"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#00ff88' }}>Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-primary/80 border border-dark-accent/50 rounded-xl focus:ring-2 focus:border-[#00ff88]/30 text-white placeholder:text-text-secondary transition-all duration-300 hover:border-[#00ff88]/20"
                      style={{ '--tw-ring-color': '#00ff88' } as React.CSSProperties}
                      placeholder="your.email@example.com"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#00ff88' }}>Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      required
                      className="w-full px-4 py-3 bg-dark-primary/80 border border-dark-accent/50 rounded-xl focus:ring-2 focus:border-[#00ff88]/30 text-white placeholder:text-text-secondary resize-none transition-all duration-300 hover:border-[#00ff88]/20"
                      style={{ '--tw-ring-color': '#00ff88' } as React.CSSProperties}
                      placeholder="Tell me about your project..."
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full text-dark-primary font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hero-btn-primary"
                      style={{ 
                        backgroundColor: isSubmitting ? '#666' : '#00ff88',
                      }}
                      onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#00dd77')}
                      onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#00ff88')}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6 gradient-text">Get In Touch</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Mail, label: "Email", value: "tsiemasilo@gmail.com" },
                      { icon: Phone, label: "Phone", value: "082 806 9569 (WhatsApp only)" },
                      { icon: MapPin, label: "Location", value: "Johannesburg/Midrand, South Africa" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center group"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                      >
                        <motion.div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 border border-[#00ff88]/20 transition-all duration-300 group-hover:border-[#00ff88]/50"
                          style={{ backgroundColor: 'rgba(0, 255, 136, 0.08)' }}
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 255, 136, 0.15)' }}
                        >
                          <item.icon style={{ color: '#00ff88' }} size={20} />
                        </motion.div>
                        <div>
                          <div className="font-medium text-sm text-text-secondary">{item.label}</div>
                          <div className="text-white">{item.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <h4 className="text-lg font-semibold mb-4">Follow Me</h4>
                  <div className="flex space-x-3">
                    {[
                      { href: "https://github.com/tsiemasilo", icon: Github, label: "GitHub" },
                      { href: "https://www.linkedin.com/in/tsie-masilo/", icon: Linkedin, label: "LinkedIn" },
                      { href: "https://profile.indeed.com/?hl=en_ZA&co=ZA&from=gnav-homepage", icon: SiIndeed, label: "Indeed" },
                      { href: "https://wa.me/27828069569", icon: SiWhatsapp, label: "WhatsApp" },
                    ].map((social, i) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-dark-primary/80 border border-[#00ff88]/15 rounded-xl flex items-center justify-center transition-all duration-300 group hover:bg-[#00ff88] hover:border-[#00ff88]"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 300 }}
                        whileHover={{ y: -4, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <social.icon className="text-text-secondary group-hover:text-white transition-colors" size={20} />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Email Animation Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            {!emailSent ? (
              // Typewriter Animation
              <>
                <div className="typewriter-loader mb-6">
                  <div className="slide">
                    <i></i>
                  </div>
                  <div className="paper"></div>
                  <div className="keyboard"></div>
                </div>
                <h3 className="text-white text-2xl font-semibold mb-2">Typing your message...</h3>
                <p className="text-gray-300">Please wait while I compose and send your email</p>
              </>
            ) : (
              // Email Sent Animation
              <>
                <div className="email-sent-loader mb-6"></div>
                <h3 className="text-white text-2xl font-semibold mb-2">Email Sent!</h3>
                <p className="text-gray-300">Your message has been delivered successfully</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <motion.footer
        className="py-8 px-4 sm:px-6 lg:px-8 border-t border-dark-accent/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto text-center relative">
          <motion.p
            className="text-text-secondary text-sm"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            © 2024 Tsie Masilo. All rights reserved. Built with passion and modern web technologies.
          </motion.p>
          
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="absolute bottom-0 right-0 w-2 h-2 bg-transparent opacity-0 hover:opacity-5 transition-opacity duration-300"
            title="Admin Dashboard"
            aria-label="Admin Dashboard Access"
          />
        </div>
      </motion.footer>
    </div>
  );
}
