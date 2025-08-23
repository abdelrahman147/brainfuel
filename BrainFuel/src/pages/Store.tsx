import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Home, Menu, Bell, Star, Zap, Gift, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

interface StoreFeature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const Store = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();
  const [cartItems] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const cartRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  const handleViewCart = () => {
    console.log('Viewing cart');
    setIsCartOpen(false);
  };

  const handleBuy = () => {
    console.log('Proceeding to buy');
    setIsCartOpen(false);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  // Scroll handler for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // More responsive threshold
      if (scrollTop > 50) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
    };

    // Add throttling for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !(cartRef.current as any).contains(event.target)) {
        setIsCartOpen(false);
      }
      if (notificationRef.current && !(notificationRef.current as any).contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    if (isCartOpen || isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, isNotificationOpen]);

  // Set scroll to top button position for pages without support modal
  useEffect(() => {
    setPosition('default');
    return () => setPosition('default');
  }, [setPosition]);

  const rocketVariants = {
    initial: { x: 0, y: 0, rotate: 0, scale: 1 },
    animate: {
      x: [0, 5, -5, 0],
      y: [0, -5, 5, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1.1, 1],
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  };

  const bagEmojiVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [-2, 2, -2],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  const features: StoreFeature[] = [
    {
      id: '1',
      icon: <Zap className="w-6 h-6" />,
      title: 'Innovation Tools',
      description: 'Advanced AI-powered tools for creative projects',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: '2',
      icon: <Gift className="w-6 h-6" />,
      title: 'Premium Resources',
      description: 'Exclusive templates, assets, and learning materials',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: '3',
      icon: <Users className="w-6 h-6" />,
      title: 'Community Access',
      description: 'Connect with fellow innovators and experts',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '4',
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Analytics Dashboard',
      description: 'Track your progress and project performance',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const mainText = "Store Coming Soon";
  const subText = "We're building something amazing for innovators like you.";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent text-text-primary relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-transparent z-0" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/25 rounded-full"
            animate={{
              x: [0, 60, 0],
              y: [0, -60, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 10 + i * 1.5,
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

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isHeaderVisible ? 0 : -150, 
          opacity: isHeaderVisible ? 1 : 0 
        }}
        transition={{ 
          duration: 0.3, 
          ease: 'easeInOut'
        }}
        className="fixed top-2 sm:top-4 right-2 sm:right-[12%] z-50 w-[calc(100%-1rem)] sm:w-[80%] max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-3 bg-background-secondary/50 backdrop-blur-lg border border-border-primary/30 shadow-lg rounded-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/store')}
          >
            <motion.span
              variants={bagEmojiVariants}
              initial="initial"
              animate="animate"
              className="inline-block text-2xl"
            >
              🛍️
            </motion.span>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              Coming Soon
            </h1>
          </motion.div>

          <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
            <motion.div className="relative" whileHover={{ scale: 1.02 }}>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 rounded-full bg-background-tertiary/80 text-text-primary border border-border-primary/50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-background-tertiary transition-all duration-300 ease-in-out w-48 focus:w-56"
              />
              <Search className="w-5 h-5 text-text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
            </motion.div>
            
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center text-sm text-text-secondary hover:text-purple-600 transition font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5 mr-1" />
              Home
            </motion.button>

            {/* Notification Button */}
            <motion.div className="relative">
              <motion.button
                onClick={toggleNotification}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-text-secondary hover:text-purple-600 transition"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold shadow-md">
                  3
                </span>
              </motion.button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    ref={notificationRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-12 right-0 bg-background-tertiary border border-border-primary shadow-xl rounded-xl w-80 p-4 z-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-text-primary">Notifications</h3>
                      <button onClick={toggleNotification} className="text-text-muted hover:text-text-primary">
                        ×
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <p className="text-xs text-purple-400">🎉 Store launch in 2 weeks!</p>
                      </div>
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <p className="text-xs text-blue-400">📧 Early access registration open</p>
                      </div>
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <p className="text-xs text-green-400">🎁 Special discount for early birds</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="relative cursor-pointer"
              onClick={toggleCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart className="w-6 h-6 text-text-secondary hover:text-purple-600 transition" />
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md">
                {cartItems}
              </span>
            </motion.div>

            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  ref={cartRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 right-8 bg-background-tertiary border border-border-primary shadow-lg rounded-xl w-80 p-4 z-50"
                >
                  <div className="text-center text-text-muted font-semibold mb-4">
                    Store coming soon! 🛒
                  </div>
                  <div className="flex flex-row space-x-3">
                    <motion.button
                      onClick={handleViewCart}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm"
                    >
                      Notify Me
                    </motion.button>
                    <motion.button
                      onClick={handleBuy}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-semibold text-sm"
                    >
                      Learn More
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            className="md:hidden text-text-secondary hover:text-purple-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-background-secondary/50 backdrop-blur-lg border-t border-border-primary/30 p-4 rounded-b-3xl"
          >
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-background-tertiary/80 text-text-primary border border-border-primary/50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <Search className="w-5 h-5 text-text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-sm text-text-secondary hover:text-purple-600 transition font-semibold"
              >
                <Home className="w-5 h-5 mr-1" />
                Home
              </button>
              <div className="relative cursor-pointer" onClick={toggleCart}>
                <ShoppingCart className="w-6 h-6 text-text-secondary hover:text-purple-600 transition" />
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md">
                  {cartItems}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 mt-44">
        {/* Main Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-text-primary flex flex-wrap justify-center items-center">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              {mainText}
            </span>
            <motion.span
              variants={rocketVariants}
              initial="initial"
              animate="animate"
              className="inline-block ml-4"
            >
              🚀
            </motion.span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-muted mb-8 leading-relaxed">
            {subText.split('').map((char, index) => (
              <motion.span
                key={index}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </p>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: 1 }}
            className="w-full max-w-md mx-auto mb-8"
          >
            <div className="bg-background-tertiary rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 2, delay: 1.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full relative"
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </motion.div>
            </div>
            <p className="text-sm text-text-muted mt-2">75% Complete</p>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-background-secondary/50 backdrop-blur-lg border border-border-primary/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-lg">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl font-bold text-text-primary">Get Early Access</h2>
            </div>
            <p className="text-text-muted mb-6">
              Be the first to know when our store launches and get exclusive early bird discounts!
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-background-tertiary/80 border border-border-primary/50 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center"
              >
                <span>Notify Me</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            </form>

            {isSubscribed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
              >
                <p className="text-green-400 text-sm">🎉 Thanks! We'll notify you when the store launches!</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mt-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
            <div className="text-text-muted">Innovators Waiting</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-2">50+</div>
            <div className="text-text-muted">Premium Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">24/7</div>
            <div className="text-text-muted">Support Available</div>
          </div>
        </motion.div>

        {/* Additional Content for Testing Scroll */}
        <div className="w-full max-w-4xl mt-20 space-y-16">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-background-secondary/30 backdrop-blur-lg border border-border-primary/30 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">Why Choose BrainFuel Store?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-400">🎯 Quality First</h3>
                <p className="text-text-muted leading-relaxed">
                  Every tool and resource is carefully curated to ensure the highest quality and relevance for innovators.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-400">⚡ Lightning Fast</h3>
                <p className="text-text-muted leading-relaxed">
                  Optimized performance ensures you get what you need instantly, without any delays or interruptions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-500/30 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">What's Coming?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Design Tools</h3>
                <p className="text-text-muted text-sm">Professional design resources and templates</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Development</h3>
                <p className="text-text-muted text-sm">Code libraries and development tools</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Analytics</h3>
                <p className="text-text-muted text-sm">Data analysis and visualization tools</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hidden Content for Page Height */}
        <div className="w-full h-24 opacity-0 pointer-events-none">
          {/* This div is invisible but adds height to the page */}
        </div>
      </main>
    </div>
  );
};

export default Store;