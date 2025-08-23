import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Mail, Users, Star, Code, 
  Award, TrendingUp, Heart, MessageCircle, 
  Calendar, MapPin, ExternalLink, Download,
  ChevronDown, ChevronUp, Zap, Rocket, Brain,
  ChevronRight, ChevronLeft, RefreshCw
} from 'lucide-react';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

interface Developer {
  name: string;
  image: string;
  role: string;
  description: string;
  university: string;
  location: string;
  github: string;
  linkedin: string;
  email: string;
  skills: string[];
  achievements: string[];
  projects: {
    name: string;
    description: string;
    tech: string[];
    link?: string;
  }[];
  stats: {
    projects: number;
    contributions: number;
    experience: string;
    awards: number;
  };
}

const developers: Developer[] = [
  {
    name: 'Muhammed Saleh',
    image: '/Muhammed Saleh.jpeg',
    role: 'Lead Developer & Project Manager',
    description: 'Passionate Front-End developer with expertise in TypeScript, React, and AI integration. Leading the BrainFuel platform development with innovative solutions.',
    university: 'Faculty of Ai',
    location: 'Damietta, Egypt',
    github: 'https://github.com/muhameds7v',
    linkedin: 'https://www.linkedin.com/in/mohamed-saleh-a31038376',
    email: 'mailto:mohamedsaleh25112005@gmail.com',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Node.Js', 'AI/ML', 'Python'],
    achievements: [
      'Lead development of BrainFuel platform',
      'Implemented AI-powered system',
      'Optimized performance by 70%'
    ],
    projects: [
      {
        name: 'BrainFuel Platform',
        description: 'Innovative university projects showcase platform with AI integration',
        tech: ['React', 'TypeScript', 'Node.js', 'AI/ML'],
        link: 'https://thebrainfuel.xyz'
      },
      {
        name: 'Smart Chat Assistant',
        description: 'AI-powered chat system for student support',
        tech: ['Python', 'TensorFlow', 'React', 'WebSocket']
      }
    ],
    stats: {
      projects: 15,
      contributions: 1800,
      experience: '3+ years',
      awards: 8
    }
  },
  {
    name: 'Hesham Sabry',
    image: '/Hesham Sabry.jpeg',
    role: 'Project Coordinator',
    description: 'Experienced Front-End developer specializing in scalable architectures.',
    university: 'Faculty of Ai',
    location: 'Mansoura, Egypt',
    github: 'https://github.com/hesham-sabry',
    linkedin: 'https://www.linkedin.com/in/hesham-sabry-b54971362',
    email: 'mailto:heshamsabry@example.com',
    skills: ['HTML5', 'CSS3','JavaScript', 'Python'],
    achievements: [
      'Coordinator of BrainFuel platform',
      'Implemented AI-powered system',
      'Optimized performance by 30%'
    ],
    projects: [
      {
        name: 'BrainFuel Platform',
        description: 'Innovative university projects showcase platform with AI integration',
        tech: ['React', 'TypeScript', 'Node.js', 'AI/ML'],
        link: 'https://thebrainfuel.xyz'
      },
      {
        name: 'Smart Chat Assistant',
        description: 'AI-powered chat system for student support',
        tech: ['Python', 'TensorFlow', 'React', 'WebSocket']
      }
    ],
    stats: {
      projects: 8,
      contributions: 800,
      experience: '1+ years',
      awards: 4
    }
  },
  {
    name: 'Yousef Hares',
    image: '/Yousef Hares.jpeg',
    role: 'Project Coordinator',
    description: 'Front-End developer with a passion for beautiful user interfaces and exceptional user experiences.',
    university: 'Faculty of Ai',
    location: 'Damietta, Egypt',
    github: 'https://github.com/yousefhares-eng',
    linkedin: 'https://www.linkedin.com/in/yousef-hares-6a95a1341?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    email: 'mailto:yousefhares39@gmail.com',
    skills: ['HTML5', 'CSS3'],
    achievements: [
      'Coordinator of BrainFuel platform',
      'Implemented AI-powered system',
      'Optimized performance by 30%'
    ],
    projects: [
      {
        name: 'BrainFuel Platform',
        description: 'Innovative university projects showcase platform with AI integration',
        tech: ['React', 'TypeScript', 'Node.js', 'AI/ML'],
        link: 'https://thebrainfuel.xyz'
      },
      {
        name: 'Smart Chat Assistant',
        description: 'AI-powered chat system for student support',
        tech: ['Python', 'TensorFlow', 'React', 'WebSocket']
      }
    ],
    stats: {
      projects: 5,
      contributions: 600,
      experience: '1+ years',
      awards: 2
    }
  },
];

const Card = () => {
  const { setPosition } = useScrollToTop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Set scroll to top button position
  useEffect(() => {
    setPosition('default');
    return () => setPosition('default');
  }, [setPosition]);

  // Handle mouse movement for image parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized position (-1 to 1)
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % developers.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const currentDev = developers[currentIndex];

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-transparent z-0" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent-primary/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">BrainFuel Team</h1>
            </div>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto px-4">
              Meet the brilliant minds behind BrainFuel - Innovators, Developers, and Visionaries
            </p>
            
            {/* Team Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center space-x-8 mt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">3</div>
                <div className="text-sm text-text-secondary">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">28+</div>
                <div className="text-sm text-text-secondary">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">3200+</div>
                <div className="text-sm text-text-secondary">Contributions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">14</div>
                <div className="text-sm text-text-secondary">Awards</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Navigation Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="flex space-x-2">
              {developers.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-accent-primary scale-125'
                      : 'bg-text-muted hover:bg-text-secondary'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>

                    {/* Main Content - Card on Left, Details on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Developer Card - Left Side */}
            <motion.div
              key={currentIndex}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex justify-center lg:col-span-2"
            >
              <motion.div
                className="w-full max-w-5xl bg-background-secondary/90 backdrop-blur-md border border-border-primary rounded-2xl shadow-2xl shadow-accent-primary/10 p-8"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0px 0px 30px rgba(139, 92, 246, 0.3)',
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {/* Profile Header */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                                         <img
                       src={currentDev.image}
                       alt={currentDev.name}
                       className="w-32 h-32 rounded-full border-4 border-accent-primary/30 object-cover mx-auto mb-4"
                       ref={(el) => (imageRefs.current[currentIndex] = el)}
                       style={{ 
                         willChange: 'transform', 
                         transition: 'transform 0.1s ease-out',
                         transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
                       }}
                     />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary mb-2">{currentDev.name}</h2>
                  <p className="text-accent-primary font-semibold mb-1">{currentDev.role}</p>
                  <p className="text-text-secondary text-sm mb-3">{currentDev.description}</p>
                  
                  {/* Location & University */}
                  <div className="flex items-center justify-center space-x-4 text-sm text-text-muted">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{currentDev.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{currentDev.university}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-background-tertiary rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-accent-primary">{currentDev.stats.projects}</div>
                    <div className="text-sm text-text-secondary">Projects</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-background-tertiary rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-accent-primary">{currentDev.stats.contributions}</div>
                    <div className="text-sm text-text-secondary">Contributions</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-background-tertiary rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-accent-primary">{currentDev.stats.experience}</div>
                    <div className="text-sm text-text-secondary">Experience</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-background-tertiary rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-accent-primary">{currentDev.stats.awards}</div>
                    <div className="text-sm text-text-secondary">Awards</div>
                  </motion.div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-accent-primary" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentDev.skills.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 bg-accent-primary/10 text-accent-primary text-sm rounded-full border border-accent-primary/20"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4 mb-6">
                  <motion.a
                    href={currentDev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-background-tertiary rounded-xl text-text-muted hover:text-accent-primary transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href={currentDev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-background-tertiary rounded-xl text-text-muted hover:text-accent-primary transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href={currentDev.email}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-background-tertiary rounded-xl text-text-muted hover:text-accent-primary transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                </div>

                {/* Switch Card Button */}
                <div className="text-center">
                  <motion.button
                    onClick={handleNext}
                    disabled={isTransitioning}
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl font-semibold shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40 transition-all duration-300 flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-5 h-5 ${isTransitioning ? 'animate-spin' : ''}`} />
                    <span>Switch Card</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Details Panel - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col justify-center"
            >
              <div className="bg-background-secondary/80 backdrop-blur-md border border-border-primary rounded-2xl p-6">
                {/* Achievements */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-accent-primary" />
                    Achievements
                  </h3>
                  <div className="space-y-3">
                    {currentDev.achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-accent-primary rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-text-secondary">{achievement}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Featured Projects */}
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                    <Rocket className="w-5 h-5 mr-2 text-accent-primary" />
                    Featured Projects
                  </h3>
                  <div className="space-y-4">
                    {currentDev.projects.map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-background-tertiary rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-text-primary">{project.name}</h4>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-primary hover:text-accent-secondary transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;