import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Globe, 
  Star,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Zap,
  Shield,
  Heart,
  ArrowRight,
  Building2,
  UserCheck,
  Headphones,
  Rocket,
  ArrowLeft,
  Bot,
  X,
  Loader2,
  Trash2
} from 'lucide-react';
import ThreeDMascot from '../components/ThreeDMascot';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../contexts/ScrollToTopContext';
import { geminiApiService } from '../services/geminiApi';

// List of country codes (sample, can be expanded)
const countryCodes = [
  { code: '+20', label: 'EGY (+20)' },
  { code: '+966', label: 'KSA (+966)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+1', label: 'USA (+1)' },
  { code: '+44', label: 'UK (+44)' },
];

// FAQ Data
const faqData = [
  {
    question: "How quickly do you respond to inquiries?",
    answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, we have priority support channels available."
  },
  {
    question: "What services do you offer for teams?",
    answer: "We offer comprehensive team collaboration tools, project management solutions, AI-powered assistance, and custom development services tailored to your team's needs."
  },
  {
    question: "Do you provide technical support?",
    answer: "Yes, we provide 24/7 technical support through multiple channels including live chat, email, and phone support for all our premium users."
  },
  {
    question: "Can I schedule a demo of your platform?",
    answer: "Absolutely! You can schedule a personalized demo of our platform by contacting us through this form or using our calendar booking system."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers. We also offer flexible payment plans for enterprise customers."
  }
];

// Contact Information
const contactInfo = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    value: "support@brainfuel.com",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us directly",
    value: "+20 10 1234 5678",
    color: "text-green-400",
    bgColor: "bg-green-500/10"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our team",
    value: "Available 24/7",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "When we're available",
    value: "Mon-Fri: 9AM-6PM",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10"
  }
];

// Social Media Links
const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-500" },
  { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-600" },
  { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-500" }
];

const Contact = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    email: '',
    countryCode: countryCodes[0].code,
    phone: '',
    message: ''
  });
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; message: string }[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [geminiChatHistory, setGeminiChatHistory] = useState<{ role: "user" | "model"; parts: { text: string }[] }[]>([]);

  // Array of icons to cycle through
  const messageIcons = [Send, MessageSquare, Mail, Users];

  // Validate email with regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number (basic format: allows digits, +, -, and spaces)
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-]{8,15}$/;
    return phoneRegex.test(phone);
  };

  // Handle form submission with validation and API call
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.type.trim() || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError('Please enter a valid phone number.');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      setFormData({ type: '', name: '', email: '', countryCode: countryCodes[0].code, phone: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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



  // Set scroll to top button position
  useEffect(() => {
    setPosition('support');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => setPosition('default');
  }, [setPosition]);

  // Cycle through message icons on hover
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isHoveringSubmit) {
      intervalId = setInterval(() => {
        setCurrentIconIndex((prev) => (prev + 1) % messageIcons.length);
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [isHoveringSubmit, messageIcons.length]);

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

  // Get the current icon component
  const CurrentIcon = messageIcons[currentIconIndex];

  // Dynamic placeholder for name field based on type
  const getNamePlaceholder = () => {
    switch (formData.type) {
      case 'Team':
        return 'Enter team name';
      case 'Companies':
        return 'Enter company name';
      default:
        return 'Enter name';
    }
  };

  // Dynamic placeholder for email field
  const getEmailPlaceholder = () => {
    switch (formData.type) {
      case 'Team':
        return 'Enter team email';
      case 'Companies':
        return 'Enter company email';
      default:
        return 'Your email';
    }
  };

  // Dynamic placeholder for phone field
  const getPhonePlaceholder = () => {
    switch (formData.type) {
      case 'Team':
        return 'Enter team phone number';
      case 'Companies':
        return 'Enter company phone number';
      default:
        return 'Your phone number';
    }
  };

  // Dynamic placeholder for message field
  const getMessagePlaceholder = () => {
    switch (formData.type) {
      case 'Team':
        return 'Tell us about your team and how we can help...';
      case 'Companies':
        return 'Tell us about your company and requirements...';
      default:
        return 'Tell us how we can help you...';
    }
  };

  // Toggle FAQ
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent flex items-center justify-center p-4 sm:p-6 md:p-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background-secondary border border-border-primary rounded-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-4">Message Sent Successfully!</h2>
          <p className="text-text-secondary mb-6">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:bg-accent-secondary transition-colors"
          >
            Send Another Message
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent p-4 sm:p-6 md:p-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-accent-primary" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">Contact Us</h1>
          </div>
          <p className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
            Get in touch with our team. We're here to help you succeed with BrainFuel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-6">Get In Touch</h2>
              
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="bg-background-secondary/80 backdrop-blur-md border border-border-primary/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-1">{info.title}</h3>
                      <p className="text-text-secondary text-sm mb-2">{info.description}</p>
                      <p className="text-text-primary font-medium">{info.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Social Media Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-background-secondary/80 backdrop-blur-md border border-border-primary/50 rounded-xl p-6"
              >
                <h3 className="font-semibold text-text-primary mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 bg-background-primary rounded-lg flex items-center justify-center text-text-secondary transition-colors ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-background-secondary/80 backdrop-blur-md border border-border-primary/50 rounded-xl p-6"
              >
                <h3 className="font-semibold text-text-primary mb-4">Why Choose Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-text-secondary">24/7 Support</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-text-secondary">Secure & Reliable</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Rocket className="w-4 h-4 text-purple-400" />
                    <span className="text-text-secondary">Fast Response</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-background-secondary/80 backdrop-blur-md border border-border-primary/50 rounded-2xl p-8 shadow-lg shadow-accent-primary/10"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-text-primary mb-2">Send Us a Message</h2>
                <p className="text-text-secondary">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-400">{error}</span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Type */}
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-4 bg-background-primary/95 rounded-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 appearance-none border border-border-primary"
                    required
                  >
                    <option value="" disabled>Select contact type</option>
                    <option value="Team">Team</option>
                    <option value="Companies">Companies</option>
                    <option value="Individual">Individual</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                </div>

                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder={getNamePlaceholder()}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 bg-background-primary/95 rounded-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 border border-border-primary"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={getEmailPlaceholder()}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 bg-background-primary/95 rounded-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 border border-border-primary"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="flex space-x-2">
                  <div className="relative w-1/3">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="w-full p-4 bg-background-primary/95 rounded-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 appearance-none border border-border-primary"
                      required
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={getPhonePlaceholder()}
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 p-4 bg-background-primary/95 rounded-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 border border-border-primary"
                    required
                  />
                </div>

                {/* Message */}
                <textarea
                  name="message"
                  placeholder={getMessagePlaceholder()}
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full p-4 bg-background-primary/95 rounded-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 resize-none border border-border-primary"
                  required
                />

                                 {/* Submit Button */}
                 <motion.button
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   whileHover={{
                     scale: 1.02,
                     boxShadow: "0 0 20px rgba(139, 92, 246, 0.7)",
                   }}
                   onMouseEnter={() => setIsHoveringSubmit(true)}
                   onMouseLeave={() => {
                     setIsHoveringSubmit(false);
                     setCurrentIconIndex(0);
                   }}
                   disabled={isLoading}
                   type="submit"
                   className="w-full flex items-center justify-center px-6 py-4 rounded-xl border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isLoading ? (
                     <>
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                       <span className="text-lg font-medium">Sending...</span>
                     </>
                   ) : (
                     <>
                       <motion.div
                         key={currentIconIndex}
                         initial={{ opacity: 0, scale: 0.8, x: -20 }}
                         animate={{
                           opacity: 1,
                           scale: 1,
                           x: isHoveringSubmit ? 0 : -20,
                           transition: { type: "spring", stiffness: 200, damping: 15, duration: 0.3 },
                         }}
                         className={isHoveringSubmit ? "absolute left-1/2 transform -translate-x-1/2" : ""}
                       >
                         <CurrentIcon className="w-5 h-5" />
                       </motion.div>
                       <motion.span
                         initial={false}
                         animate={{
                           opacity: isHoveringSubmit ? 0 : 1,
                           x: isHoveringSubmit ? 20 : 0,
                           transition: { duration: 0.3, ease: "easeOut" },
                         }}
                         className="text-lg font-medium"
                       >
                         Send Message
                       </motion.span>
                     </>
                   )}
                 </motion.button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-text-secondary text-lg">
              Find answers to common questions about our services and support.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-background-secondary/80 backdrop-blur-md border border-border-primary/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-background-primary/50 transition-colors"
                >
                  <h3 className="font-semibold text-text-primary">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-accent-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-secondary" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-text-secondary">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
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
      </div>
    </div>
  );
};

export default Contact;