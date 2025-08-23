import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, UserCog, Users, ChevronDown, Send, X, Loader2, Trash2, Bot, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useScrollToTop } from '../contexts/ScrollToTopContext';
import { geminiApiService, GeminiMessage } from '../services/geminiApi';
import ThreeDMascot from '../components/ThreeDMascot';

/**
 * Support Component
 * A page providing support options and FAQs, with a support chat button and modal for real-time user assistance.
 */
const Support = () => {
  const { setPosition } = useScrollToTop();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; message: string }[]>([]);
  const [geminiChatHistory, setGeminiChatHistory] = useState<GeminiMessage[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // Set scroll to top button position
  useEffect(() => {
    setPosition('support');
    return () => setPosition('default');
  }, [setPosition]);

  // Handle support chat submission
  const handleSupportSubmit = async () => {
    if (!supportMessage.trim() || isLoadingResponse) return;

    const userMessage = supportMessage.trim();
    setSupportMessage('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { user: 'You', message: userMessage }]);
    
    setIsLoadingResponse(true);
    
    try {
      // Add to Gemini chat history
      const newGeminiMessage: GeminiMessage = { role: 'user', parts: [{ text: userMessage }] };
      setGeminiChatHistory(prev => [...prev, newGeminiMessage]);
      
      // Get AI response
      const aiMessage = await geminiApiService.sendMessage(userMessage, geminiChatHistory);
      
      if (aiMessage) {
        setChatHistory(prev => [...prev, { user: 'AI', message: aiMessage }]);
        
        // Add AI response to Gemini chat history
        const aiGeminiMessage: GeminiMessage = { role: 'model', parts: [{ text: aiMessage }] };
        setGeminiChatHistory(prev => [...prev, aiGeminiMessage]);
      } else {
        setChatHistory(prev => [...prev, { user: 'AI', message: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatHistory(prev => [...prev, { user: 'AI', message: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (isSupportModalOpen && chatHistory.length === 0) {
      setChatHistory([
        { user: 'AI', message: 'Hello! I\'m BrainFuel AI, your innovation assistant. How can I help you today?' }
      ]);
    }
  }, [isSupportModalOpen, chatHistory.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent p-4 sm:p-6 md:p-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <HelpCircle className="w-8 h-8 text-accent-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Support Center</h1>
          </motion.div>
          <p className="text-text-secondary text-lg">
            Need help with your project or have questions about the platform? We're here to help!
          </p>
        </div>

        {/* Support Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
              className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6 text-center hover:border-accent-primary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-accent-primary" />
              </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Email Support</h3>
            <p className="text-text-secondary mb-4">Get help via email within 24 hours</p>
                <button className="text-accent-primary hover:text-accent-secondary transition-colors font-medium">
              support@BrainFuel.com
                </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
            className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6 text-center hover:border-accent-primary/50 transition-colors"
        >
            <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-accent-primary" />
          </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Live Chat</h3>
            <p className="text-text-secondary mb-4">Chat with our support team in real-time</p>
            <NavLink
              to="/chat"
              className="text-accent-primary hover:text-accent-secondary transition-colors font-medium"
            >
              Start Chat
            </NavLink>
          </motion.div>

              <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6 text-center hover:border-accent-primary/50 transition-colors"
          >
            <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCog className="w-6 h-6 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">BrainFuel Team</h3>
            <p className="text-text-secondary mb-4">Let know about BrainFuel Team 🚀</p>
            <NavLink
              to="/card"
              className="text-accent-primary hover:text-accent-secondary transition-colors font-medium"
            >
              View Team
            </NavLink>
              </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6 text-center hover:border-accent-primary/50 transition-colors"
          >
            <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-accent-primary" />
          </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Community Forum</h3>
            <p className="text-text-secondary mb-4">Ask questions in our community</p>
            <NavLink
              to="/forum"
              className="text-accent-primary hover:text-accent-secondary transition-colors font-medium"
            >
              Join Forum
            </NavLink>
          </motion.div>
        </motion.div>



        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-text-secondary text-lg max-w-3xl mx-auto">
              Find answers to common questions about using BrainFuel platform
            </p>
          </div>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-3">How do I submit my project?</h3>
              <p className="text-text-secondary">
                Navigate to the 'Submit Project' page and fill out the form with your project details, including title, description, category, and author information.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-3">What types of projects are accepted?</h3>
              <p className="text-text-secondary">
                We accept innovative projects from all academic disciplines including AI, Robotics, Medicine, Engineering, Computer Science, Environmental, Business, Arts, and Social Impact.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-3">How is project scoring calculated?</h3>
              <p className="text-text-secondary">
                Project scores are based on innovation, technical complexity, potential impact, and community engagement. Scores are updated regularly based on views and support.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-3">Can I collaborate with other students?</h3>
              <p className="text-text-secondary">
                Yes! Use the Chat feature to connect with other student innovators and discuss potential collaborations on projects.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-3">How do I get support for my project?</h3>
              <p className="text-text-secondary">
                Users can support projects by viewing, sharing, and engaging with them. Higher engagement leads to better visibility and potential funding opportunities.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Still Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 backdrop-blur-md border border-accent-primary/20 rounded-xl p-8 text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-4">Still Need Help?</h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any questions or issues you might have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/forum"
              className="glow-button bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40"
            >
              Contact Support
            </NavLink>
            <NavLink
              to="/schedule-call"
              className="px-8 py-3 border border-accent-primary text-accent-primary rounded-lg font-semibold hover:bg-accent-primary hover:text-white transition-colors"
            >
              Schedule a Call
            </NavLink>
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

        {/* AI Support Chat Modal */}
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
                        <span>AI is thinking...</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Ask me anything about BrainFuel..."
                    className="flex-1 bg-background-secondary/50 border border-border-primary rounded-lg px-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                    onKeyPress={(e) => e.key === 'Enter' && supportMessage.trim() && handleSupportSubmit()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => supportMessage.trim() && handleSupportSubmit()}
                    disabled={!supportMessage.trim() || isLoadingResponse}
                    className="px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Support;