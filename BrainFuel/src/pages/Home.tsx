import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Plus, Minus, TrendingUp, Filter, Search, LogIn, Menu, ChevronDown, Send, X, Store, ChevronLeft, ChevronRight, Trash2, Loader2, GraduationCap, Facebook, Instagram, Linkedin, Bot } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { trendingProjects, mockProjects } from '../data/projects';
import { ProjectCategory } from '../types';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../contexts/ScrollToTopContext';
import { geminiApiService, GeminiMessage } from '../services/geminiApi';
import ThreeDMascot from '../components/ThreeDMascot';

/**
 * Home Component
 * The main landing page of the BrainFuel application, displaying trending projects,
 * a project gallery with filters, a support chat modal, and an interactive starry background
 * with rotating stars inspired by the Grok website.
 */
const Home = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();

  // State Management
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHoveringStore, setIsHoveringStore] = useState(false);
  const [isHoveringSearch, setIsHoveringSearch] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState<number>(4);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; message: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [geminiChatHistory, setGeminiChatHistory] = useState<GeminiMessage[]>([]);
  


  // Refs for DOM elements
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const supportButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Project categories for filtering
  const categories: (ProjectCategory | 'All')[] = [
    'All', 'AI', 'Robotics', 'Medicine', 'Engineering',
    'Computer Science', 'Environmental', 'Business', 'Arts', 'Social Impact'
  ];

  // Filtered projects based on category and search query
  const filteredProjects = mockProjects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.university.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered trending projects based on category and search query
  const filteredTrendingProjects = trendingProjects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.university.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle search button click
  const handleSearchClick = () => {
    if (isSearchBarOpen && searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchBarOpen(false);
      setSearchQuery('');
    } else {
      setIsSearchBarOpen(prev => !prev);
    }
  };

  // Handle search input Enter key press
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchBarOpen(false);
      setSearchQuery('');
    }
  };



  // Show more projects
  const handleShowMore = () => {
    setVisibleProjects(filteredProjects.length);
  };

  // Show fewer projects
  const handleShowLess = () => {
    setVisibleProjects(4);
  };

  // Clear chat history
  const clearChatHistory = () => {
    setChatHistory([]);
    setGeminiChatHistory([]);
  };











  // Handle support chat form submission
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (supportMessage.trim() && !isLoadingResponse) {
      const userMessage = supportMessage.trim();
      const newChat = { user: 'You', message: userMessage };
      setChatHistory(prev => [...prev, newChat]);
      setSupportMessage('');
      setIsLoadingResponse(true);

      try {
        const response = await geminiApiService.sendMessage(userMessage, geminiChatHistory);
        const aiChat = { user: 'BrainFuel AI', message: response };
        setChatHistory(prev => [...prev, aiChat]);
        setGeminiChatHistory(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
      } catch (error) {
        console.error('Error calling Gemini API:', error);
        const errorChat = { user: 'BrainFuel AI', message: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' };
        setChatHistory(prev => [...prev, errorChat]);
      } finally {
        setIsLoadingResponse(false);
      }
    }
  };

  // Handle project card click to navigate to project details
  const handleProjectClick = (project: any) => {
    navigate(`/project/${project.id}`);
  };

  // Set scroll to top button position for pages with support modal
  useEffect(() => {
    setPosition('support');
    return () => setPosition('default');
  }, [setPosition]);

  // Add welcome message when chat is opened for the first time
  useEffect(() => {
    if (isSupportModalOpen && chatHistory.length === 0) {
      const welcomeMessage = {
        user: 'BrainFuel AI',
        message: 'مرحباً! أنا مساعد BrainFuel الذكي 🤖\nكيف يمكنني مساعدتك اليوم؟\n\nHello! I\'m the BrainFuel AI Assistant 🤖\nHow can I help you today?'
      };
      setChatHistory([welcomeMessage]);
    }
  }, [isSupportModalOpen, chatHistory.length]);

  // Close project modal
  const handleCloseModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    setImageError(false);
    setIsImageLoading(true);
  };

  // Navigate to previous image in project modal
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? selectedProject.images.length - 1 : prev - 1));
    setImageError(false);
    setIsImageLoading(true);
  };

  // Navigate to next image in project modal
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === selectedProject.images.length - 1 ? 0 : prev + 1));
    setImageError(false);
    setIsImageLoading(true);
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  // Handle image load success
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Handle keyboard navigation for project modal
  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedProject) {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        handleCloseModal();
      }
    }
  };

  // Effect: Add keyboard event listener for project modal navigation
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  // Effect: Close project modal on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Effect: Initialize and animate shooting stars only
  useEffect(() => {
    const canvas = document.getElementById('shooting-stars-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const heroSection = canvas.parentElement?.parentElement;
    if (heroSection) {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }

    const shootingStars: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      opacity: number;
      lifetime: number;
      maxLifetime: number;
    }[] = [];

    // Create a shooting star
    const createShootingStar = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      const speed = Math.random() * 5 + 3;
      const angle = Math.random() * Math.PI / 4 + Math.PI / 8;

      if (side === 0) { // Top
        x = Math.random() * canvas.width;
        y = 0;
        vx = speed * Math.cos(angle);
        vy = speed * Math.sin(angle);
      } else if (side === 1) { // Right
        x = canvas.width;
        y = Math.random() * canvas.height;
        vx = -speed * Math.cos(angle);
        vy = speed * Math.sin(angle);
      } else if (side === 2) { // Bottom
        x = Math.random() * canvas.width;
        y = canvas.height;
        vx = speed * Math.cos(angle);
        vy = -speed * Math.sin(angle);
      } else { // Left
        x = 0;
        y = Math.random() * canvas.height;
        vx = speed * Math.cos(angle);
        vy = speed * Math.sin(angle);
      }

      shootingStars.push({
        x,
        y,
        vx,
        vy,
        length: Math.random() * 20 + 10,
        opacity: Math.random() * 0.5 + 0.5,
        lifetime: 0,
        maxLifetime: 60 + Math.random() * 60,
      });
    };

    // Draw shooting stars
    const draw = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      // Draw shooting stars with enhanced gradient tails
      shootingStars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;
        star.lifetime++;

        const fade = 1 - star.lifetime / star.maxLifetime;
        const opacity = star.opacity * fade;

        // Draw enhanced tail with multiple gradients
        const tailLength = star.length * 1.5;
        const gradient = ctx!.createLinearGradient(
          star.x,
          star.y,
          star.x - star.vx * tailLength,
          star.y - star.vy * tailLength
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.9})`);
        gradient.addColorStop(0.2, `rgba(139, 92, 246, ${opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(236, 72, 153, ${opacity * 0.6})`);
        gradient.addColorStop(0.8, `rgba(59, 130, 246, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        // Draw thick tail
        ctx!.beginPath();
        ctx!.moveTo(star.x, star.y);
        ctx!.lineTo(star.x - star.vx * tailLength, star.y - star.vy * tailLength);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 3;
        ctx!.lineCap = 'round';
        ctx!.stroke();

        // Draw thin bright line
        ctx!.beginPath();
        ctx!.moveTo(star.x, star.y);
        ctx!.lineTo(star.x - star.vx * tailLength * 0.7, star.y - star.vy * tailLength * 0.7);
        ctx!.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        // Draw star head with glow
        const headGradient = ctx!.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, 4
        );
        headGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        headGradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * 0.6})`);
        headGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, 4, 0, Math.PI * 2);
        ctx!.fillStyle = headGradient;
        ctx!.fill();

        // Draw bright center
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${opacity * 1.2})`;
        ctx!.shadowBlur = 20;
        ctx!.shadowColor = 'rgba(139, 92, 246, 0.9)';
        ctx!.fill();
      });

      // Remove expired shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        if (
          star.lifetime >= star.maxLifetime ||
          star.x < -20 || star.x > canvas.width + 20 ||
          star.y < -20 || star.y > canvas.height + 20
        ) {
          shootingStars.splice(i, 1);
        }
      }
    };

    let animationFrameId: number;

    // Animation loop
    const animate = () => {
      if (Math.random() < 0.03 && shootingStars.length < 10) {
        createShootingStar();
      }
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle canvas resize
    const handleResize = () => {
      if (heroSection) {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
      }
      shootingStars.length = 0;
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Effect: Close search bar on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsSearchBarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  // Effect: Reset visible projects when filters change
  useEffect(() => {
    setVisibleProjects(4);
  }, [selectedCategory, searchQuery]);

  // Effect: Handle footer visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const isNearBottom =
        currentScrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 200;

      if (isScrollingDown || isNearBottom) {
        setIsFooterVisible(true);
      } else {
        setIsFooterVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 200) {
      setIsFooterVisible(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <div className="min-h-screen bg-background-primary relative">
      {/* Global Styles for Shiny Text and Canvas */}
      <style>
        {`
          .shiny-text {
            color: #b5b5b5a4;
            background: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0) 40%,
              rgba(255, 255, 255, 0.8) 50%,
              rgba(255, 255, 255, 0) 60%
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            display: inline-block;
            animation: shine 5s linear infinite;
          }
          @keyframes shine {
            0% {
              background-position: 100%;
            }
            100% {
              background-position: -100%;
            }
          }
          .shiny-text.disabled {
            animation: none;
          }
          #shooting-stars-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }
        `}
      </style>

      {/* Navigation Buttons (Login and Store) */}
      <div className="absolute top-4 right-4 z-50 flex space-x-2">

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            scale: 1.05,
            y: -3,
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
            transition: { duration: 0.15 }
          }}
          onClick={() => navigate('/login')}
          className="flex items-center justify-center px-2 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden w-[40px] h-[40px]"
        >
          <LogIn className="w-5 h-5" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            scale: 1.05,
            y: -3,
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
            transition: { duration: 0.15 }
          }}
          onMouseEnter={() => setIsHoveringStore(true)}
          onMouseLeave={() => setIsHoveringStore(false)}
          onClick={() => navigate('/store')}
          className="flex items-center justify-center px-4 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden w-24 h-10"
        >
          <div className="flex items-center">
            <motion.div
              animate={{ x: isHoveringStore ? 22 : -1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 0.3 }}
            >
              <Store className="w-5 h-5" />
            </motion.div>
            <motion.span
              initial={false}
              animate={{ opacity: isHoveringStore ? 0 : 1, x: isHoveringStore ? 10 : -2 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="ml-1"
            >
              Store
            </motion.span>
          </div>
        </motion.button>
      </div>









      {/* 3D Mascot Support Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <ThreeDMascot
          onClick={() => setIsSupportModalOpen(true)}
        />
      </motion.div>

      {/* Enhanced Support Chat Modal - Same style as Chat page */}
      <AnimatePresence>
        {isSupportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsSupportModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gradient-to-br from-gray-900/95 to-gray-950/95 border border-gray-700 backdrop-blur-md rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">BrainFuel AI</h2>
                    <p className="text-xs text-text-secondary">Your Innovation Assistant</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSupportModalOpen(false)}
                  className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Chat History */}
              <div className="h-80 overflow-y-auto mb-6 p-4 bg-background-secondary/30 rounded-xl border border-border-primary">
                {chatHistory.map((chat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className={`mb-4 p-3 rounded-xl text-sm max-w-[85%] ${
                      chat.user === 'You'
                        ? 'ml-auto bg-gradient-to-br from-purple-600/80 to-indigo-600/80 text-white'
                        : 'mr-auto bg-background-tertiary text-text-primary border border-border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs">
                        {chat.user === 'You' ? 'You' : 'BrainFuel AI'}
                      </span>
                      <span className="text-xs opacity-70">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="whitespace-pre-line text-sm">{chat.message}</span>
                  </motion.div>
                ))}
                
                {isLoadingResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mr-auto p-3 rounded-xl text-sm max-w-[85%] bg-background-tertiary text-text-primary border border-border-primary"
                  >
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSupportSubmit} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Ask me anything about your project..."
                  disabled={isLoadingResponse}
                  className="flex-1 px-4 py-3 bg-background-secondary border border-border-primary rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={isLoadingResponse || !supportMessage.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/25"
                >
                  {isLoadingResponse ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </form>

              {/* Clear Chat Button */}
              {chatHistory.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearChatHistory}
                  className="mt-4 w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Clear Chat History
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-700 rounded-2xl p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button for Project Modal */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: 360, backgroundColor: '#4c1d95' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseModal}
                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-purple-800/50 rounded-full text-white transition-colors z-10"
                aria-label="Close project modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
              {/* Project Video and Images */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                {/* Project Video */}
                <div className="flex-1">
                  <iframe
                    className="w-full h-64 rounded-lg"
                    src="https://www.youtube.com/embed/DSdsNDqgZ_I"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* Project Images Carousel */}
                <div className="flex-1 relative">
                  {selectedProject.images && selectedProject.images.length > 0 ? (
                    <>
                      {isImageLoading && (
                        <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                          <span className="text-text-muted animate-pulse">Loading...</span>
                        </div>
                      )}
                      {!imageError ? (
                        <img
                          src={selectedProject.images[currentImageIndex]}
                          alt={`${selectedProject.title} preview ${currentImageIndex + 1}`}
                          className={`w-full h-64 object-contain rounded-lg ${isImageLoading ? 'hidden' : 'block'}`}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                          <span className="text-text-muted">Image failed to load</span>
                        </div>
                      )}
                      {selectedProject.images.length > 1 && (
                        <div className="absolute inset-0 flex justify-between items-center px-2">
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: '#4c1d95' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePrevImage}
                            className="bg-purple-800/50 rounded-full p-2 text-white"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: '#4c1d95' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNextImage}
                            className="bg-purple-800/50 rounded-full p-2 text-white"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </motion.button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                      <span className="text-text-muted">No images available</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Project Details */}
              <h2 className="text-2xl font-bold text-text-primary mb-4">{selectedProject.title}</h2>
              <p className="text-text-muted mb-4">{selectedProject.description}</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-text-secondary mr-2">Category:</span>
                  <span className="text-sm text-text-primary">{selectedProject.category}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-text-secondary mr-2">University:</span>
                  <span className="text-sm text-text-primary">{selectedProject.university}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-text-secondary mr-2">Author:</span>
                  <span className="text-sm text-text-primary">{selectedProject.author.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-text-secondary mr-2">Score:</span>
                  <span className="text-sm text-text-primary">{selectedProject.score}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags && selectedProject.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent-primary/20 text-accent-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 overflow-hidden">
        {/* Shooting Stars Canvas */}
        <div className="absolute inset-0 z-0" id="shooting-stars-container">
          <canvas id="shooting-stars-canvas" className="w-full h-full"></canvas>
        </div>
 
        <svg
          className="absolute top-[-50px] left-[955px] w-[300px] h-[300px] z-0"
          style={{ transform: 'rotate(225deg)', transformOrigin: '50% 50%' }}
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 20 250 Q 150 50 280 250"
            stroke="#ffffff33"
            strokeWidth="2"
            strokeDasharray="20 12"
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6"
          >
            <motion.span
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: '100% 50%' }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] bg-clip-text text-transparent"
            >
              BrainFuel
            </motion.span>
            <br />
            <span className="text-text-primary">Student Innovation Hub</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-8 max-w-2xl sm:max-w-3xl mx-auto px-4"
                    >
            Discover groundbreaking projects from university students worldwide.
            From AI breakthroughs to sustainable solutions, explore the future of innovation.
          </motion.p>
          
          {/* Stats Counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto px-4"
          >
            {/* Projects Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-3 sm:p-4 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-accent-primary mb-1">1,247</div>
              <div className="text-text-secondary font-medium text-xs sm:text-sm">Projects</div>
            </motion.div>

            {/* Visitors Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-3 sm:p-4 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-accent-secondary mb-1">45.2K</div>
              <div className="text-text-secondary font-medium text-xs sm:text-sm">Visitors</div>
            </motion.div>

            {/* Subscribers Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-3 sm:p-4 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-pink-500 mb-1">8.9K</div>
              <div className="text-text-secondary font-medium text-xs sm:text-sm">Subscribers</div>
            </motion.div>

            {/* Categories Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-3 sm:p-4 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-indigo-500 mb-1">12</div>
              <div className="text-text-secondary font-medium text-xs sm:text-sm">Categories</div>
            </motion.div>
          </motion.div>
          
 

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.05,
              y: -3,
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
              transition: { duration: 0.01 }
            }}
            transition={{ duration: 0.3, delay: 0.6 }}
            onClick={() => navigate('/submit')}
            className="glow-button bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-2xl shadow-accent-primary/25 hover:shadow-accent-primary/40"
          >
            <Plus className="w-6 h-6 inline mr-2" />
            Start a Project
          </motion.button>
        </div>
      </section>





      {/* Search and Filter Section */}
      <section className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 relative overflow-hidden">
        {/* Floating Elements in Search Section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400/25 rounded-full"
              animate={{
                x: [0, 60, 0],
                y: [0, -60, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 10 + i * 1.5,
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
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary text-sm sm:text-base"
                ref={searchInputRef}
              />
            </div>
            <div className="flex items-center space-x-2 w-full lg:w-auto">
              <Filter className="w-5 h-5 text-text-muted" />
              <div className="flex flex-wrap gap-1 sm:gap-2 w-full lg:w-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/25'
                        : 'bg-background-secondary text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>







      {/* Trending Projects Section */}
      <section className="px-8 py-12 relative overflow-hidden">
        {/* Floating Elements in Trending Projects Section */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-400/20 rounded-full"
              animate={{
                x: [0, 65, 0],
                y: [0, -65, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 9 + i * 1.6,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center space-x-3 mb-8"
          >
            <TrendingUp className="w-6 h-6 text-accent-primary" />
            <h2 className="text-3xl font-bold text-text-primary">Trending Projects</h2>
          </motion.div>
          {filteredTrendingProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-text-muted text-lg">No trending projects found for this category.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTrendingProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? 5 : -5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  whileHover={{ scale: 1.05, y: -5, rotate: index % 2 === 0 ? -5 : 5 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
                  style={{ transformOrigin: 'center' }}
                  onClick={() => handleProjectClick(project)}
                >
                  <ProjectCard project={project} isTrending={true} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Projects Section */}
      <section className="px-8 py-12 relative overflow-hidden">
        {/* Floating Elements in All Projects Section */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-indigo-400/20 rounded-full"
              animate={{
                x: [0, 80, 0],
                y: [0, -80, 0],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center space-x-3 mb-8"
          >
            <Menu className="w-6 h-6 text-accent-primary" />
            <h2 className="text-3xl font-bold text-text-primary">All Projects</h2>
          </motion.div>
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-text-muted text-lg">No projects found matching your criteria.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProjects.slice(0, visibleProjects).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? 5 : -5 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    whileHover={{ scale: 1.05, y: -5, rotate: index % 2 === 0 ? -5 : 5 }}
                    exit={{ opacity: 0, y: 20, rotate: index % 2 === 0 ? 5 : -5 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
                    style={{ transformOrigin: 'center' }}
                    onClick={() => handleProjectClick(project)}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          {filteredProjects.length > 4 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <AnimatePresence>
                {visibleProjects < filteredProjects.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                      boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
                      transition: { duration: 0.15 }
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={handleShowMore}
                    className="flex items-center justify-center px-4 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Plus className="w-5 h-5" />
                      <span className="ml-1">Show More</span>
                    </div>
                  </motion.div>
                )}
                {visibleProjects === filteredProjects.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                      boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
                      transition: { duration: 0.15 }
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={handleShowLess}
                    className="flex items-center justify-center px-4 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Minus className="w-5 h-5" />
                      <span className="ml-1">Show Less</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 relative overflow-hidden">
        {/* Floating Elements in News Section */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-pink-400/20 rounded-full"
              animate={{
                x: [0, 70, 0],
                y: [0, -70, 0],
                opacity: [0.15, 0.5, 0.15],
              }}
              transition={{
                duration: 11 + i * 1.8,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 text-accent-primary">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">News & Updates</h2>
            <span className="text-xs sm:text-sm text-accent-primary bg-accent-primary/10 px-2 sm:px-3 py-1 rounded-full">New</span>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Latest News Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4 sm:p-6 hover:border-accent-primary/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-accent-primary bg-accent-primary/10 px-2 py-1 rounded-full">News</span>
                <span className="text-xs text-text-secondary">2 hours ago</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">New AI Assistant Feature Launched</h3>
              <p className="text-text-secondary text-sm mb-4">
                We've launched our new AI assistant feature that helps students improve their projects and provides valuable suggestions.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-accent-secondary">Read More →</span>
                <div className="w-8 h-8 bg-accent-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-accent-primary text-xs">🔥</span>
                </div>
              </div>
            </motion.div>

            {/* Event Announcement Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-purple-700/30 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">Event</span>
                <span className="text-xs text-text-secondary">Tomorrow</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Annual Student Projects Exhibition 2025</h3>
              <p className="text-text-secondary text-sm mb-4">
                Join us for the annual student projects exhibition where the best innovations from various universities will be showcased.
              </p>
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/exhibition')}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  Register Now →
                </motion.button>
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 text-xs">🎉</span>
                </div>
              </div>
            </motion.div>

            {/* Update Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm border border-green-700/30 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Update</span>
                <span className="text-xs text-text-secondary">3 days ago</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">New UI Improvements Released</h3>
              <p className="text-text-secondary text-sm mb-4">
                We've added new improvements to the user interface to enhance the browsing experience and make it more user-friendly.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400">Learn More →</span>
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-xs">✨</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* View All News Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3, boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center px-4 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden cursor-pointer"
            >
              <div className="flex items-center">
                <Plus className="w-5 h-5" />
                <span className="ml-1">View All</span>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-background-primary py-12 border-border-primary relative overflow-hidden">
        {/* Floating Elements in Footer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-purple-400/30 rounded-full"
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 8 + i * 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                      transition: {
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                      },
                    }}
                  >
                    <GraduationCap className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] via-[#9f67fa] to-[#a78bfa] bg-clip-text text-transparent">
                    BrainFuel
                  </h3>
                  <p className="text-xs text-text-muted">Student Innovation Hub</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Student innovation and collaboration platform. Connecting innovators and creators from around the world.
              </p>
              <div className="flex space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-150 cursor-pointer group"
                >
                  <Facebook className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-150" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition-all duration-150 cursor-pointer group"
                >
                  <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-150" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 transition-all duration-150 cursor-pointer group"
                >
                  <Instagram className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-150" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-150 cursor-pointer group"
                >
                  <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-150" />
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <motion.div
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/explore')}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Explore Projects
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/submit')}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Submit Project
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/forum')}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Forum
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/store')}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Store
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/support')}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Support
                </motion.div>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
              <div className="space-y-2">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Artificial Intelligence
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Robotics
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Medicine
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Engineering
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-sm"
                >
                  Computer Science
                </motion.div>
              </div>
            </motion.div>

            {/* Contact & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white mb-4">Contact & Support</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <span>📧</span>
                  <span>support@brainfuel.com</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <span>📱</span>
                  <span>+20 0123456789</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <span>📍</span>
                  <span>Damietta, Egypt</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -3, boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => navigate('/support')}
                  className="flex items-center justify-center px-4 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden cursor-pointer w-3/4"
                >
                  <div className="flex items-center">
                    <span>Contact Us</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-gray-700/30 mb-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">1,247</div>
              <div className="text-gray-400 text-sm">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400 mb-1">45.2K</div>
              <div className="text-gray-400 text-sm">Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-1">8.9K</div>
              <div className="text-gray-400 text-sm">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">12</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
          </motion.div>

          {/* Bottom Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isFooterVisible ? 1 : 0, y: isFooterVisible ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-700/30 pt-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center justify-center gap-4">
                <span className="text-xs text-gray-500 font-medium">
                  Designed to make it easy for you 🤍
                </span>
                <div className="w-px h-4 bg-gray-600/50" />
                <span className="text-xs text-gray-500 font-medium">
                  Developed by Team{' '}
                  <span
                    className="text-accent-primary hover:underline cursor-pointer"
                    onClick={() => navigate('/card')}
                  >
                    BrainFuel
                  </span>{' '}
                  🚀
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span 
                  onClick={() => navigate('/privacy')}
                  className="hover:text-purple-400 cursor-pointer transition-colors"
                >
                  Privacy Policy
                </span>
                <div className="w-px h-3 bg-gray-600/50" />
                <span 
                  onClick={() => navigate('/terms')}
                  className="hover:text-purple-400 cursor-pointer transition-colors"
                >
                  Terms of Service
                </span>
                <div className="w-px h-3 bg-gray-600/50" />
                <span 
                  onClick={() => navigate('/sitemap')}
                  className="hover:text-purple-400 cursor-pointer transition-colors"
                >
                  Sitemap
                </span>
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-xs shiny-text font-medium">
                © 2025 BrainFuel. All rights reserved. Developed with love 🤍
              </span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Home;