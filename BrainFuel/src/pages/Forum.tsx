import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Send, Users, MessageCircle, TrendingUp, Search, Filter, 
  Heart, Share2, Bookmark, MoreVertical, User, Clock, 
  Eye, ThumbsUp, ThumbsDown, Plus, Hash, Star, 
  ArrowUp, ArrowDown, Reply, Edit, Trash2, Flag,
  Bot, X, Loader2, ChevronDown
} from 'lucide-react';
import ThreeDMascot from '../components/ThreeDMascot';
import { useScrollToTop } from '../contexts/ScrollToTopContext';
import { geminiApiService } from '../services/geminiApi';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: 'student' | 'moderator' | 'admin';
    university: string;
  };
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  views: number;
  replies: number;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isBookmarked?: boolean;
  isPinned?: boolean;
  isTrending?: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  count: number;
  description: string;
}

const Forum = () => {
  const { setPosition } = useScrollToTop();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'popular'>('latest');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  
  // Form states
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; message: string }[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [geminiChatHistory, setGeminiChatHistory] = useState<{ role: "user" | "model"; parts: { text: string }[] }[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Forum Categories
  const categories: ForumCategory[] = [
    {
      id: 'all',
      name: 'All Topics',
      icon: Hash,
      color: 'from-purple-500 to-indigo-500',
      count: 156,
      description: 'All forum discussions'
    },
    {
      id: 'general',
      name: 'General Discussion',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      count: 45,
      description: 'General questions and discussions'
    },
    {
      id: 'projects',
      name: 'Project Help',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      count: 32,
      description: 'Get help with your projects'
    },
    {
      id: 'collaboration',
      name: 'Collaboration',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      count: 28,
      description: 'Find project partners'
    },
    {
      id: 'resources',
      name: 'Resources',
      icon: Bookmark,
      color: 'from-pink-500 to-rose-500',
      count: 19,
      description: 'Share useful resources'
    },
    {
      id: 'events',
      name: 'Events',
      icon: Star,
      color: 'from-yellow-500 to-amber-500',
      count: 12,
      description: 'Upcoming events and meetups'
    }
  ];

  // Mock Forum Posts
  const [forumPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'Looking for AI/ML collaborators for medical diagnosis project',
      content: 'I\'m working on an AI-powered medical diagnosis system and looking for team members with experience in machine learning, computer vision, or medical imaging. The project aims to help doctors diagnose diseases more accurately and quickly.',
      author: {
        name: 'Dr. Sarah Chen',
        avatar: 'https://cdn.discordapp.com/attachments/1395159195988398252/1396534629141577748/509167625_10171995914615051_6865.jpg?ex=68826439&is=688112b9&hm=b0d047790612a8dc2f047d6a42c114a81682f90bb95efabd33e895513d79ef82&',
        role: 'student',
        university: 'MIT'
      },
      category: 'collaboration',
      tags: ['AI', 'Machine Learning', 'Medical', 'Computer Vision'],
      createdAt: '2 hours ago',
      views: 156,
      replies: 8,
      likes: 24,
      dislikes: 2,
      isTrending: true,
      isPinned: true
    },
    {
      id: '2',
      title: 'Best practices for autonomous robot navigation in crowded environments',
      content: 'I\'ve been working on SLAM algorithms for autonomous robots and would love to discuss best practices for navigation in dynamic, crowded environments. What sensors and algorithms have you found most effective?',
      author: {
        name: 'Alex Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        role: 'student',
        university: 'Stanford'
      },
      category: 'projects',
      tags: ['Robotics', 'SLAM', 'Navigation', 'Sensors'],
      createdAt: '4 hours ago',
      views: 89,
      replies: 12,
      likes: 18,
      dislikes: 1,
      isTrending: true
    },
    {
      id: '3',
      title: 'Sustainable energy solutions: Solar panel efficiency optimization',
      content: 'Sharing my research on improving solar panel efficiency using novel materials and tracking systems. Would love feedback and potential collaboration opportunities.',
      author: {
        name: 'Emma Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        role: 'student',
        university: 'UC Berkeley'
      },
      category: 'resources',
      tags: ['Energy', 'Solar', 'Sustainability', 'Materials'],
      createdAt: '6 hours ago',
      views: 67,
      replies: 5,
      likes: 15,
      dislikes: 0
    },
    {
      id: '4',
      title: 'Blockchain for academic credentials: Implementation challenges',
      content: 'Working on a blockchain-based system for academic credential verification. Facing challenges with scalability and user adoption. Any insights from similar projects?',
      author: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        role: 'student',
        university: 'Harvard'
      },
      category: 'projects',
      tags: ['Blockchain', 'Credentials', 'Verification', 'Scalability'],
      createdAt: '1 day ago',
      views: 134,
      replies: 9,
      likes: 22,
      dislikes: 3
    },
    {
      id: '5',
      title: 'Ocean cleanup drones: Technical specifications and deployment strategies',
      content: 'Developing autonomous drones for ocean plastic cleanup. Looking for feedback on the technical specifications and deployment strategies.',
      author: {
        name: 'Lisa Wang',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        role: 'student',
        university: 'Caltech'
      },
      category: 'projects',
      tags: ['Drones', 'Ocean Cleanup', 'Autonomous', 'Environmental'],
      createdAt: '2 days ago',
      views: 98,
      replies: 6,
      likes: 19,
      dislikes: 1
    }
  ]);

  // Filtered and sorted posts
  const filteredPosts = forumPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.likes + b.replies) - (a.likes + a.replies);
      case 'popular':
        return b.views - a.views;
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Handle post interactions
  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
  };

  const handleDislike = (postId: string) => {
    console.log('Disliked post:', postId);
  };

  const handleBookmark = (postId: string) => {
    console.log('Bookmarked post:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Shared post:', postId);
  };

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form submission
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !input.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    console.log('User input:', { name, email, message: input });
    setIsSubmitted(true);
    setInput('');
    setName('');
    setEmail('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  }, [name, email, input]);

  // Set scroll to top button position and scroll to top
  useEffect(() => {
    setPosition('support');
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => setPosition('default');
  }, [setPosition]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent p-4 sm:p-6 md:p-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-text-primary">Community Forum</h1>
            </div>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Connect with fellow innovators, share ideas, ask questions, and collaborate on amazing projects
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-4 mb-8"
          >
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search discussions, topics, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background-secondary/80 backdrop-blur-md border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-background-secondary/80 backdrop-blur-md border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 appearance-none pr-10"
              >
                <option value="latest">Latest</option>
                <option value="trending">Trending</option>
                <option value="popular">Most Popular</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
            </div>

            {/* Create Post Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreatePost(true)}
              className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl font-semibold shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Post</span>
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-background-secondary/80 backdrop-blur-md border border-border-primary rounded-2xl p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 text-accent-primary'
                          : 'hover:bg-background-tertiary text-text-secondary'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                          <category.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs opacity-70">{category.description}</div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{category.count}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Forum Posts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4"
              >
                {sortedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="bg-background-secondary/80 backdrop-blur-md border border-border-primary rounded-2xl p-6 hover:border-accent-primary/30 transition-all duration-300"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-text-primary">{post.author.name}</span>
                            {post.author.role === 'moderator' && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Mod</span>
                            )}
                            {post.author.role === 'admin' && (
                              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Admin</span>
                            )}
                          </div>
                          <div className="text-sm text-text-secondary">{post.author.university}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {post.isPinned && (
                          <div className="p-1 bg-yellow-500/20 rounded">
                            <Star className="w-4 h-4 text-yellow-400" />
                          </div>
                        )}
                        {post.isTrending && (
                          <div className="p-1 bg-orange-500/20 rounded">
                            <TrendingUp className="w-4 h-4 text-orange-400" />
                          </div>
                        )}
                        <button className="p-1 hover:bg-background-tertiary rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-text-muted" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-text-primary mb-2 hover:text-accent-primary transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-text-secondary text-sm line-clamp-3">{post.content}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-accent-primary/10 text-accent-primary text-xs rounded-full hover:bg-accent-primary/20 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Post Stats and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-text-muted">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.createdAt}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.replies}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(post.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.isLiked
                              ? 'bg-green-500/20 text-green-400'
                              : 'hover:bg-background-tertiary text-text-muted hover:text-green-400'
                          }`}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </motion.button>
                        <span className="text-sm font-medium text-text-primary min-w-[20px] text-center">
                          {post.likes - post.dislikes}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDislike(post.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.isDisliked
                              ? 'bg-red-500/20 text-red-400'
                              : 'hover:bg-background-tertiary text-text-muted hover:text-red-400'
                          }`}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleBookmark(post.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.isBookmarked
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'hover:bg-background-tertiary text-text-muted hover:text-blue-400'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShare(post.id)}
                          className="p-2 rounded-lg hover:bg-background-tertiary text-text-muted hover:text-accent-primary transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* No Results */}
              {sortedPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <MessageCircle className="w-16 h-16 text-text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">No discussions found</h3>
                  <p className="text-text-secondary">Try adjusting your search or category filters</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Contact Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Need Help?</h2>
              <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you with any questions or issues.
              </p>
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-background-secondary/80 backdrop-blur-md border border-border-primary/50 rounded-xl p-6 max-w-2xl mx-auto shadow-lg shadow-accent-primary/10"
              >
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Contact Support
                </h3>
                <p className="text-sm font-light text-text-secondary mb-4">
                  Our support team will respond to you as soon as possible.
                </p>
                {isSubmitted && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-400 mb-4"
                  >
                    Thank you! Your message has been submitted.
                  </motion.p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full p-3 bg-background-primary/95 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 border border-border-primary"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      required
                      className="w-full p-3 bg-background-primary/95 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 border border-border-primary"
                    />
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question or feedback here..."
                    required
                    rows={4}
                    className="w-full p-3 bg-background-primary/95 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 border border-border-primary resize-none"
                  />
                                     <motion.button
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     whileHover={{
                       scale: 1.05,
                       y: -3,
                       boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
                       transition: { duration: 0.15 }
                     }}
                     onMouseEnter={() => setIsHoveringSubmit(true)}
                     onMouseLeave={() => setIsHoveringSubmit(false)}
                     type="submit"
                     className="flex items-center justify-center px-4 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden w-[100px] h-[40px] mx-auto"
                   >
                     <div className="flex items-center">
                       <motion.div
                         animate={{
                           x: isHoveringSubmit ? 21 : 1,
                           rotate: isHoveringSubmit ? 45 : 0
                         }}
                         transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 0.3 }}
                       >
                         <Send className="w-5 h-5" />
                       </motion.div>
                       <motion.span
                         initial={false}
                         animate={{
                           opacity: isHoveringSubmit ? 0 : 1,
                           x: isHoveringSubmit ? 10 : 2,
                         }}
                         transition={{ duration: 0.3, ease: 'easeOut' }}
                         className="ml-1"
                       >
                         Send
                       </motion.span>
                     </div>
                   </motion.button>
                </form>
              </motion.div>
            </div>
          </motion.div>

          {/* 3D Mascot Support Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ThreeDMascot
              onClick={() => setIsSupportModalOpen(true)}
            />
          </motion.div>

          {/* Enhanced Support Chat Modal */}
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
        </>
      </div>
    </div>
  );
};

export default Forum;