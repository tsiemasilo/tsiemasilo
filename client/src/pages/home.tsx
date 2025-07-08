import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Code,
  Palette,
  Smartphone,
  Lightbulb,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Menu,
  X
} from "lucide-react";

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
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Continuing to enhance my knowledge of front-end and back-end technologies like JavaScript and Node.js"
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Learning the foundations of design principles and tools like Figma to create user-friendly interfaces."
    },
    {
      icon: Smartphone,
      title: "App Development",
      description: "Exploring mobile app development through intermediate projects and tutorials in Android Studio"
    },
    {
      icon: Lightbulb,
      title: "Problem-Solving",
      description: "Improving problem-solving skills by practicing data structures and algorithms with Java."
    }
  ];

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with user authentication, payment integration, and admin dashboard.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["React", "Node.js", "MongoDB"],
      liveUrl: "#",
      codeUrl: "#"
    },
    {
      title: "Task Management App",
      description: "A mobile-first task management application with real-time synchronization and team collaboration features.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["React Native", "Firebase", "TypeScript"],
      liveUrl: "#",
      codeUrl: "#"
    },
    {
      title: "Analytics Dashboard",
      description: "An interactive analytics dashboard with real-time data visualization and custom reporting features.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      technologies: ["Vue.js", "D3.js", "Python"],
      liveUrl: "#",
      codeUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-primary text-text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-dark-primary/90 backdrop-blur-sm z-50 border-b border-dark-accent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold gradient-text">Portfolio</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button onClick={() => scrollToSection('home')} className="text-text-secondary hover:text-green-primary transition-colors duration-200">Home</button>
                <button onClick={() => scrollToSection('about')} className="text-text-secondary hover:text-green-primary transition-colors duration-200">About</button>
                <button onClick={() => scrollToSection('services')} className="text-text-secondary hover:text-green-primary transition-colors duration-200">Services</button>
                <button onClick={() => scrollToSection('projects')} className="text-text-secondary hover:text-green-primary transition-colors duration-200">Projects</button>
                <button onClick={() => scrollToSection('contact')} className="text-text-secondary hover:text-green-primary transition-colors duration-200">Contact</button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-text-secondary hover:text-green-primary"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-secondary">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => { scrollToSection('home'); handleNavClick(); }} className="block px-3 py-2 text-text-secondary hover:text-green-primary transition-colors duration-200 w-full text-left">Home</button>
              <button onClick={() => { scrollToSection('about'); handleNavClick(); }} className="block px-3 py-2 text-text-secondary hover:text-green-primary transition-colors duration-200 w-full text-left">About</button>
              <button onClick={() => { scrollToSection('services'); handleNavClick(); }} className="block px-3 py-2 text-text-secondary hover:text-green-primary transition-colors duration-200 w-full text-left">Services</button>
              <button onClick={() => { scrollToSection('projects'); handleNavClick(); }} className="block px-3 py-2 text-text-secondary hover:text-green-primary transition-colors duration-200 w-full text-left">Projects</button>
              <button onClick={() => { scrollToSection('contact'); handleNavClick(); }} className="block px-3 py-2 text-text-secondary hover:text-green-primary transition-colors duration-200 w-full text-left">Contact</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Hi, I'm <span className="gradient-text">Your Name</span>
            </h1>
            <p className="text-xl sm:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Full-Stack Developer & UI/UX Designer passionate about creating digital experiences that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => scrollToSection('projects')}
                className="bg-green-primary hover:bg-green-secondary text-white px-8 py-3 font-semibold"
              >
                View My Work
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="border-green-primary text-green-primary hover:bg-green-primary hover:text-white px-8 py-3 font-semibold"
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
            <div className="w-20 h-1 bg-green-primary mx-auto"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                alt="Professional portrait" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
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
                  <div className="text-2xl font-bold text-green-primary">15+</div>
                  <div className="text-sm text-text-secondary">Projects</div>
                </div>
                <div className="text-center p-4 bg-dark-secondary rounded-lg">
                  <div className="text-2xl font-bold text-green-primary">3+</div>
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
            <div className="text-green-primary font-semibold mb-2">—— • My Services</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">What Can I Do Best ?</h2>
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
                <Card className="bg-dark-primary p-8 card-hover border-dark-accent">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-green-primary rounded-full flex items-center justify-center mb-6">
                      <service.icon className="text-white text-xl" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-white">{service.title}</h3>
                    <div className="w-8 h-0.5 bg-green-primary mb-4"></div>
                    <p className="text-text-secondary leading-relaxed">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2>
            <div className="w-20 h-1 bg-green-primary mx-auto mb-4"></div>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and experience in web development and design.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-dark-secondary rounded-xl overflow-hidden card-hover border-dark-accent">
                  <img 
                    src={project.image} 
                    alt={`${project.title} preview`} 
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                    <p className="text-text-secondary mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-green-primary/20 text-green-primary rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <a 
                        href={project.liveUrl} 
                        className="text-green-primary hover:text-green-secondary transition-colors inline-flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                      <a 
                        href={project.codeUrl} 
                        className="text-green-primary hover:text-green-secondary transition-colors inline-flex items-center gap-2"
                      >
                        <Github size={16} />
                        Code
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-center mt-12"
            {...fadeInUp}
          >
            <a 
              href="#" 
              className="inline-flex items-center text-green-primary hover:text-green-secondary transition-colors gap-2"
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
            <div className="w-20 h-1 bg-green-primary mx-auto mb-4"></div>
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
                  className="w-full bg-green-primary hover:bg-green-secondary text-white font-semibold py-3 px-6"
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
                      <div className="w-12 h-12 bg-green-primary/20 rounded-lg flex items-center justify-center mr-4">
                        <Mail className="text-green-primary" size={20} />
                      </div>
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-text-secondary">your.email@example.com</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-primary/20 rounded-lg flex items-center justify-center mr-4">
                        <MapPin className="text-green-primary" size={20} />
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
                      className="w-12 h-12 bg-dark-primary hover:bg-green-primary border border-dark-accent hover:border-green-primary rounded-lg flex items-center justify-center transition-all duration-200 group"
                    >
                      <Github className="text-text-secondary group-hover:text-white" size={20} />
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-dark-primary hover:bg-green-primary border border-dark-accent hover:border-green-primary rounded-lg flex items-center justify-center transition-all duration-200 group"
                    >
                      <Linkedin className="text-text-secondary group-hover:text-white" size={20} />
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-dark-primary hover:bg-green-primary border border-dark-accent hover:border-green-primary rounded-lg flex items-center justify-center transition-all duration-200 group"
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
