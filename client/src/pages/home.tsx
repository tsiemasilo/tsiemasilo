import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Menu,
  X
} from "lucide-react";
import { SiHtml5, SiFigma, SiAndroidstudio, SiCplusplus } from "react-icons/si";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  // Close mobile menu when clicking on links
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

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

    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });

    // Reset form
    setFormData({ name: "", email: "", message: "" });
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
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 bg-dark-primary/90 backdrop-blur-sm z-50 border-b border-dark-accent nav-3d"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                {['home', 'about', 'services', 'projects', 'contact'].map((section, index) => (
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
      <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Matrix Background */}
        <div className="matrix-container">
          <div className="matrix-pattern">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="matrix-column"></div>
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Hi, I'm <span className="gradient-text">Tsie Masilo</span>
            </h1>
            <p className="text-xl sm:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Full-Stack Developer & UI/UX Designer passionate about creating digital experiences that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => scrollToSection('projects')}
                className="text-white px-8 py-3 font-semibold"
                style={{ backgroundColor: '#00ff88' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00dd77'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00ff88'}
              >
                View My Work
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 font-semibold"
                style={{ borderColor: '#00ff88', color: '#00ff88' }}
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
            <div className="w-20 h-1 mx-auto" style={{ backgroundColor: '#00ff88' }}></div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              {...fadeInUp}
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl profile-image-container">
                <img 
                  src="/assets/profile.jpg" 
                  alt="Tsie Masilo - Professional portrait" 
                  className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
                  style={{ objectPosition: '50% 20%', transform: 'scale(1.0)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/30 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border rounded-2xl" style={{ borderColor: 'rgba(0, 255, 136, 0.2)' }}></div>
                <motion.div 
                  className="absolute -inset-1 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to right, #00ff88, #00dd77)' }}
                  whileHover={{ opacity: 0.2 }}
                ></motion.div>
              </div>
            </motion.div>
            
            <motion.div {...fadeInUp}>
              <h3 className="text-2xl font-semibold mb-6 gradient-text">Crafting Digital Solutions</h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                I'm a passionate developer with expertise in modern web technologies. I love turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you'll find me exploring new technologies or contributing to open-source projects.
              </p>
              <p className="text-text-secondary mb-8 leading-relaxed">
                With a strong foundation in both front-end and back-end development, I create end-to-end solutions that are not only functional but also provide exceptional user experiences.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-dark-secondary rounded-lg">
                  <div className="text-2xl font-bold" style={{ color: '#00ff88' }}>15+</div>
                  <div className="text-sm text-text-secondary">Projects</div>
                </div>
                <div className="text-center p-4 bg-dark-secondary rounded-lg">
                  <div className="text-2xl font-bold" style={{ color: '#00ff88' }}>3+</div>
                  <div className="text-sm text-text-secondary">Years Experience</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-secondary">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <div className="text-white font-semibold mb-2 flex items-center justify-center gap-2">
              <div className="w-8 h-px bg-white"></div>
              <span>•</span>
              <span>My Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#00ff88' }}>What Can I Do Best ?</h2>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-8 card-hover border-none" style={{ backgroundColor: 'hsl(213, 27%, 8%)' }}>
                  <CardContent className="p-0">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                      style={{ backgroundColor: '#00ff88' }}
                    >
                      <service.icon className="text-white text-xl" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-white">{service.title}</h3>
                    <div className="w-8 h-0.5 mb-4" style={{ backgroundColor: '#00ff88' }}></div>
                    <p className="text-gray-300 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <div className="text-white font-semibold mb-2 flex items-center justify-center gap-2">
              <div className="w-8 h-px bg-white"></div>
              <span>•</span>
              <span>Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: '#00ff88' }}>My Creative Work</h2>
            
            {/* Project Category Navigation */}
            <motion.div 
              className="project-nav-container flex flex-wrap justify-center gap-2 mb-8"
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
                    className={`project-nav-button morph-container px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 border relative overflow-hidden ${
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
            className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            key={activeProjectCategory}
          >
            {filteredProjects.map((project, index) => (
              <motion.div 
                key={`${project.title}-${activeProjectCategory}`} 
                variants={fadeInUp}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
          
          <motion.div 
            className="text-center mt-12"
            {...fadeInUp}
          >
            <a 
              href="#" 
              className="inline-flex items-center transition-colors gap-2"
              style={{ color: '#00ff88' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#00dd77'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#00ff88'}
            >
              View All Projects <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-secondary">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let's Work Together</h2>
            <div className="w-20 h-1 mx-auto mb-4" style={{ backgroundColor: '#00ff88' }}></div>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Have a project in mind? I'd love to hear about it. Send me a message and let's discuss how we can bring your ideas to life.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12">
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
                  className="w-full text-white font-semibold py-3 px-6"
                  style={{ backgroundColor: '#00ff88' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00dd77'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00ff88'}
                >
                  Send Message
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
                        <div className="text-text-secondary">your.email@example.com</div>
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
                        <div className="text-text-secondary">Your City, Country</div>
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
                      <Twitter className="text-text-secondary group-hover:text-white" size={20} />
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
