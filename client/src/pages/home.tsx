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

function FloatingTechIcon({ tech, index, scrollYProgress }: { tech: { name: string; left: string; top: string; size: number; color: string; speed: number; path: string }; index: number; scrollYProgress: any }) {
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -(tech.speed || 0.3) * 600]);
  const smoothParallaxY = useSpring(parallaxY, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="absolute pointer-events-none hidden sm:block"
      style={{
        left: tech.left,
        top: tech.top,
        y: smoothParallaxY,
        willChange: 'transform',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: index * 0.15 }}
    >
      <div
        className="tech-icon-float"
        style={{
          animationDuration: `${6 + index * 1.2}s`,
          animationDelay: `${index * 0.5}s`,
        }}
      >
        <svg
          width={tech.size}
          height={tech.size}
          viewBox="0 0 24 24"
          fill={tech.color}
          style={{ opacity: 0.35, filter: `drop-shadow(0 0 12px ${tech.color}80)` }}
        >
          <path d={tech.path} />
        </svg>
      </div>
    </motion.div>
  );
}

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
      title: "KANU Dashboard",
      description: "Compensation Intelligence platform for commercial body construction. Features salary benchmarking, pay scale design, remuneration structure management, and real-time analytics with pay equity scoring and market trend comparisons.",
      image: "/kanu-dashboard-screenshot.png",
      technologies: ["React", "Dashboard Analytics", "HR Tech", "Data Visualisation", "Compensation Management"],
      category: "WEB APPLICATION",
      liveUrl: "https://kanu-main.vercel.app/dashboard",
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
      title: "LS Scales",
      description: "A data-driven digital advertising agency website for Meta campaign specialists. Features bold design with campaign performance metrics, case studies, and a modern dark UI focused on e-commerce marketing.",
      image: "/ls-scales-screenshot.png",
      technologies: ["React", "CSS3", "JavaScript", "Responsive Design", "Netlify"],
      category: "WEB DESIGN",
      liveUrl: "https://ls-scales.netlify.app/",
      codeUrl: "#"
    },
    {
      title: "Zwane Financial Services",
      description: "A professional financial services platform for a 100% black-owned, registered credit provider and FSP. Features secure authentication, account management, and a clean UI focused on accessible financial services.",
      image: "/zwane-financial-screenshot.png",
      technologies: ["HTML", "CSS3", "JavaScript", "Authentication", "Responsive Design"],
      category: "WEB DESIGN",
      liveUrl: "https://zwane-official-three.vercel.app/auth/login.html",
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

        {/* Floating Tech Stack Icons */}
        {[
          { name: "React", left: "5%", top: "15%", size: 56, color: "#61DAFB", speed: 0.3, path: "M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.93-1.39C13.12 9.04 12.56 9 12 9c-.56 0-1.12.04-1.69.11-.31.39-.63.86-.93 1.39L8.57 12l.81 1.5c.3.53.62 1 .93 1.39.57.07 1.13.11 1.69.11.56 0 1.12-.04 1.69-.11.31-.39.63-.86.93-1.39M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 012.4-.36c.48-.67.99-1.31 1.51-1.9z" },
          { name: "Node", left: "88%", top: "20%", size: 50, color: "#68A063", speed: 0.5, path: "M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.46 1.71.46 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 01-.12-.21V7.71c0-.09.04-.17.12-.21l7.44-4.29c.08-.04.18-.04.27 0l7.44 4.29c.07.04.12.12.12.21v8.58c0 .08-.05.17-.12.21l-7.44 4.29c-.08.04-.17.04-.26 0l-1.9-1.12c-.07-.04-.16-.05-.23-.02-.64.28-.76.32-1.37.49-.15.04-.37.12.08.35l2.48 1.47c.24.13.5.2.78.2.27 0 .54-.07.78-.2l7.44-4.29c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2z" },
          { name: "TypeScript", left: "12%", top: "68%", size: 48, color: "#3178C6", speed: 0.2, path: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.473.597.614.957.142.36.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 01-1.012 1.085 4.38 4.38 0 01-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 01-1.84-.164 5.544 5.544 0 01-1.512-.493v-2.63a5.033 5.033 0 003.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 00-.074-1.089 2.12 2.12 0 00-.537-.5 5.597 5.597 0 00-.807-.444 27.72 27.72 0 00-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 011.47-.629 7.536 7.536 0 011.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" },
          { name: "JavaScript", left: "78%", top: "72%", size: 46, color: "#F7DF1E", speed: 0.4, path: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.405-.585-.585-.765-.63-.63-1.47-.945-2.83-.885l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.585-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" },
          { name: "Tailwind", left: "92%", top: "48%", size: 48, color: "#38BDF8", speed: 0.35, path: "M12 6C9.33 6 7.67 7.33 7 10c1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C13.4 10.85 14.5 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.6 7.15 14.5 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.4 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.6 13.15 9.5 12 7 12z" },
          { name: "Python", left: "3%", top: "42%", size: 50, color: "#3776AB", speed: 0.45, path: "M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.402 3.35-3.402h5.766s3.24.052 3.24-3.13V3.545S18.29 0 11.914 0zM8.708 2.05c.58 0 1.05.47 1.05 1.05 0 .58-.47 1.05-1.05 1.05-.58 0-1.05-.47-1.05-1.05 0-.58.47-1.05 1.05-1.05z M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826H20.1S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.402-3.35 3.402H9.451s-3.24-.052-3.24 3.13v4.985S5.71 24 12.086 24zm3.206-2.05c-.58 0-1.05-.47-1.05-1.05 0-.58.47-1.05 1.05-1.05.58 0 1.05.47 1.05 1.05 0 .58-.47 1.05-1.05 1.05z" },
          { name: "MongoDB", left: "20%", top: "82%", size: 44, color: "#47A248", speed: 0.25, path: "M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.274 0 .288 6.112.288 8.29-.167.036-.275.088-.275.088s-.122-.04-.288-.088z" },
          { name: "PostgreSQL", left: "70%", top: "12%", size: 48, color: "#4169E1", speed: 0.55, path: "M17.128 0a10.134 10.134 0 00-2.755.403l-.063.02A10.922 10.922 0 0012.6.258C11.422.238 10.41.524 9.594 1 8.79.721 7.122.24 5.364.336 4.14.403 2.804.775 1.814 1.82.825 2.865.355 4.485.497 6.633.634 8.7 2.258 12.87 4.474 15.057c.18.178.36.317.54.453.02.466.112.898.288 1.264.36.749.96 1.29 1.674 1.553.06.022.122.028.182.043-.02.191-.036.382-.036.58 0 .14.009.271.024.405-.12.15-.24.312-.354.495-.72 1.152-1.572 3.26-1.14 5.013.108.438.343.769.66 1.026.316.257.718.41 1.204.46.972.099 2.234-.268 3.467-1.26a.878.878 0 00.168-.174c.21.058.43.1.665.118a3.973 3.973 0 001.202-.08l.02.032c.182.276.39.468.606.63.646.484 1.37.703 2.062.798.369.05.728.067 1.066.06a7.472 7.472 0 001.742-.312c.017-.006.032-.013.048-.02l.09.035c.537.191 1.137.28 1.76.246.622-.034 1.27-.194 1.863-.534a4.25 4.25 0 001.8-2.115c.183-.467.276-.96.275-1.45.001-.593-.091-1.17-.23-1.703-.137-.533-.31-1.025-.48-1.44a6.075 6.075 0 00-.262-.58c.16-.37.296-.77.394-1.196.166-.724.225-1.534.078-2.333a3.872 3.872 0 00-.318-.937c.15-.263.272-.54.36-.832.142-.482.202-1.016.138-1.574a4.12 4.12 0 00-.478-1.515c-.096-.175-.218-.32-.322-.48-.104-.16-.21-.323-.342-.465C18.723 1.24 17.99.524 17.128 0z" },
          { name: "CSS3", left: "42%", top: "8%", size: 44, color: "#264DE4", speed: 0.4, path: "M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.002l5.355-1.12.814-9.056h-5.11l5.5-.013.03-4.399z" },
          { name: "HTML5", left: "55%", top: "85%", size: 46, color: "#E34F26", speed: 0.2, path: "M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.071-.787.168-1.873.012-.128H4.66l.794 8.73h7.576l-.336 3.528-1.703.463-1.683-.464-.105-1.194H6.59l.213 2.455 4.17 1.14h.012l4.151-1.14.543-5.77.06-.609.021-.234H8.53z" },
          { name: "Figma", left: "30%", top: "18%", size: 40, color: "#F24E1E", speed: 0.5, path: "M5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5zM12 2h3.5a3.5 3.5 0 110 7H12V2zm0 12.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm0-5.5h3.5a3.5 3.5 0 110 7H12V9zM5 12.5A3.5 3.5 0 018.5 9H12v7H8.5A3.5 3.5 0 015 12.5z" },
          { name: "Git", left: "65%", top: "78%", size: 44, color: "#F05032", speed: 0.3, path: "M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.66 2.66a1.838 1.838 0 11-1.103 1.03L12.84 8.902v5.367a1.838 1.838 0 11-1.512-.244V8.562a1.838 1.838 0 01-.998-2.41L7.6 3.422.452 10.57a1.55 1.55 0 000 2.188l10.48 10.48a1.55 1.55 0 002.186 0l10.43-10.12a1.55 1.55 0 000-2.188z" },
          { name: "Flutter", left: "48%", top: "22%", size: 44, color: "#02569B", speed: 0.45, path: "M14.314 0L2.3 12 6.13 15.83 22.127 0H14.314zm0 11.16L7.39 18.17l3.47 3.47L14.314 24h7.814l-7.15-6.42 6.41-6.42H14.314z" },
          { name: "Supabase", left: "38%", top: "78%", size: 48, color: "#3ECF8E", speed: 0.35, path: "M11.9 23.1c-.5.6-1.5.2-1.5-.6V13h8.8c1 0 1.5 1.1.9 1.8L11.9 23.1zM12.1.9c.5-.6 1.5-.2 1.5.6V11H4.8c-1 0-1.5-1.1-.9-1.8L12.1.9z" },
        ].map((tech, i) => (
          <FloatingTechIcon key={tech.name} tech={tech} index={i} scrollYProgress={scrollYProgress} />
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
                  { value: "30+", label: "Projects" },
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
