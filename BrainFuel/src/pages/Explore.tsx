import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, Grid, List, Sparkles, ChevronDown, Send, X, Trash2, Loader2, Plus, Bot } from 'lucide-react';
import ThreeDMascot from '../components/ThreeDMascot';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { mockProjects } from '../data/projects';
import { ProjectCategory } from '../types';
import { useScrollToTop } from '../contexts/ScrollToTopContext';
import { geminiApiService, GeminiMessage } from '../services/geminiApi';

// تعريف نوع المشروع لضمان التوافق مع TypeScript
interface Project {
  id: string;
  title: string;
  description: string;
  university: string;
  category: ProjectCategory;
  score: number;
  supportCount: number;
  views: number;
  createdAt: string | Date;
}

const Explore = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();
  
  // State Management for Project Filtering and Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<keyof Omit<Project, 'id' | 'title' | 'description' | 'university' | 'category'>>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // State Management for Support Chat
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; message: string }[]>([]);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [geminiChatHistory, setGeminiChatHistory] = useState<GeminiMessage[]>([]);
  const supportButtonRef = useRef<HTMLButtonElement>(null);
  
  // Scroll state management
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const showMoreButtonRef = useRef<HTMLDivElement>(null);
  const isShowMoreInView = useInView(showMoreButtonRef, { once: false, amount: 0.3 });

  // Project categories for filtering
  const categories: (ProjectCategory | 'All')[] = [
    'All', 'AI', 'Robotics', 'Medicine', 'Engineering',
    'Computer Science', 'Environmental', 'Business', 'Arts', 'Social Impact'
  ];

  // Filtered and sorted projects based on category, search query, and sort options
  const filteredAndSortedProjects = useMemo(() => {
    return mockProjects
      .filter(project => {
        const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             project.university.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        // التعامل مع التواريخ إذا كان sortBy هو createdAt
        if (sortBy === 'createdAt') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
        }

        // التعامل مع الأرقام للخصائص الأخرى
        return sortOrder === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      });
  }, [searchQuery, selectedCategory, sortBy, sortOrder]);

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

  // Handle scroll events for button animations
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingDown(currentScrollY > lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-background-primary p-8 relative overflow-hidden">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 flex items-center space-x-2 sm:space-x-3"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent-primary" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">Explore Projects</h1>
        </motion.div>
        <p className="text-text-secondary mb-6 sm:mb-7 text-sm sm:text-base">Discover innovative projects from universities around the world</p>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background-secondary border border-border-primary rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search projects, universities, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Filter className="w-5 h-5 text-text-muted" />
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as ProjectCategory | 'All')}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 appearance-none text-sm sm:text-base"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as keyof Omit<Project, 'id' | 'title' | 'description' | 'university' | 'category'>)}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 appearance-none text-sm sm:text-base"
                >
                  <option value="score">Score</option>
                  <option value="supportCount">Support Count</option>
                  <option value="views">Views</option>
                  <option value="createdAt">Date Created</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary hover:bg-background-primary transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg border transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-accent-primary text-white border-accent-primary'
                    : 'bg-background-tertiary text-text-secondary border-border-primary hover:text-text-primary'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg border transition-colors ${
                  viewMode === 'list'
                    ? 'bg-accent-primary text-white border-accent-primary'
                    : 'bg-background-tertiary text-text-secondary border-border-primary hover:text-text-primary'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-text-secondary">
            Showing {filteredAndSortedProjects.length} of {mockProjects.length} projects
          </p>
        </motion.div>

        {/* Projects Grid/List */}
        {filteredAndSortedProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-text-muted text-lg mb-4">No projects found matching your criteria.</div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-accent-primary hover:text-accent-secondary transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            <AnimatePresence>
              {filteredAndSortedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? 5 : -5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  whileHover={{ scale: 1.05, y: -5, rotate: index % 2 === 0 ? -5 : 5 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
                  style={{ transformOrigin: 'center' }}
                  className={viewMode === 'list' ? 'w-full' : ''}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Show More Button */}
        {filteredAndSortedProjects.length > 0 && (
          <motion.div
            ref={showMoreButtonRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: isShowMoreInView ? 1 : 0.3,
              y: isShowMoreInView ? 0 : (isScrollingDown ? 20 : -20),
              scale: isShowMoreInView ? 1 : 0.95,
              rotate: isShowMoreInView ? 0 : (isScrollingDown ? 2 : -2)
            }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="mt-12 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: isShowMoreInView ? 0 : (isScrollingDown ? 5 : -5)
              }}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
                transition: { duration: 0.15 }
              }}
              whileInView={{
                scale: [0.8, 1.1, 1],
                transition: { duration: 0.5, ease: "easeOut" }
              }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="flex items-center justify-center px-4 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden cursor-pointer inline-flex"
            >
              <motion.div 
                className="flex items-center"
                animate={{
                  x: isShowMoreInView ? 0 : (isScrollingDown ? 3 : -3),
                  transition: { duration: 0.3, ease: "easeInOut" }
                }}
              >
                <motion.div
                  animate={{
                    rotate: isShowMoreInView ? 0 : (isScrollingDown ? 15 : -15),
                    scale: isShowMoreInView ? 1 : 0.9,
                    transition: { duration: 0.4, ease: "easeInOut" }
                  }}
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
                <motion.span 
                  className="ml-1"
                  animate={{
                    x: isShowMoreInView ? 0 : (isScrollingDown ? 2 : -2),
                    transition: { duration: 0.3, ease: "easeInOut" }
                  }}
                >
                  Show More
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

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

        {/* Upload Now Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 mb-6 text-center"
        >
          <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-600/25"
            >
              <Plus className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Ready to Share Your Project?
            </h2>
            <p className="text-text-secondary text-base mb-6 max-w-2xl mx-auto">
              Join the community of innovators and showcase your amazing project to the world. 
              Get feedback, connect with other developers, and inspire the next generation.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/submit')}
              className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-base hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-purple-600/25"
            >
              <Plus className="w-5 h-5" />
              <span>Upload Now</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;