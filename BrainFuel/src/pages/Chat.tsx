import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, MessageCircle, Users, Upload, ChevronDown, X, Mic, Loader2, Trash2, 
  Smile, Paperclip, Video, Phone, MoreVertical, Star, Reply, Heart, Share2,
  Bot, User, Crown, Zap, TrendingUp
} from 'lucide-react';
import ThreeDMascot from '../components/ThreeDMascot';
import { useScrollToTop } from '../contexts/ScrollToTopContext';
import { geminiApiService, GeminiMessage } from '../services/geminiApi';

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  project?: string;
  likes: number;
  isLiked: boolean;
  replies: number;
  isPinned?: boolean;
  attachments?: Array<{
    type: 'image' | 'file' | 'video';
    url: string;
    name: string;
  }>;
}

interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  project?: string;
  isTyping?: boolean;
  lastSeen?: string;
}

const Chat = () => {
  const { setPosition } = useScrollToTop();
  const [message, setMessage] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isTyping, setIsTyping] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  
  // Support Chat States
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; message: string }[]>([]);
  const [geminiChatHistory, setGeminiChatHistory] = useState<GeminiMessage[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supportButtonRef = useRef<HTMLButtonElement>(null);



  // Online Users Data
  const [onlineUsers] = useState<OnlineUser[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      avatar: '/Dr. Sarah Chen.jpeg',
      status: 'online',
      project: 'AI Medical Diagnosis',
      isTyping: true
    },
    {
      id: '2',
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      status: 'online',
      project: 'Autonomous Robots'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      status: 'away',
      project: 'Sustainable Energy',
      lastSeen: '2 min ago'
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      status: 'busy',
      project: 'Blockchain Credentials'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      status: 'online',
      project: 'Ocean Cleanup Drones'
    }
  ]);

  // Enhanced Messages Data
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Dr. Sarah Chen',
      avatar: 'https://cdn.discordapp.com/attachments/1395159195988398252/1396534629141577748/509167625_10171995914615051_6865.jpg?ex=68826439&is=688112b9&hm=b0d047790612a8dc2f047d6a42c114a81682f90bb95efabd33e895513d79ef82&',
      text: 'Has anyone worked with neural interfaces for prosthetics? I\'m looking for collaborators on my medical AI project.',
      timestamp: '2 hours ago',
      project: 'AI-Powered Medical Diagnosis Assistant',
      likes: 12,
      isLiked: false,
      replies: 5,
      isPinned: true
    },
    {
      id: '2',
      user: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      text: "I'm working on autonomous navigation for campus robots. Anyone interested in SLAM algorithms?",
      timestamp: '1 hour ago',
      project: 'Autonomous Campus Delivery Robot',
      likes: 8,
      isLiked: true,
      replies: 3
    },
    {
      id: '3',
      user: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      text: 'Looking for partners to work on sustainable energy solutions. Check out my latest prototype!',
      timestamp: '30 minutes ago',
      project: 'Sustainable Energy Management System',
      likes: 15,
      isLiked: false,
      replies: 7,
      attachments: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
          name: 'prototype.jpg'
        }
      ]
    }
  ]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        text: message,
        timestamp: 'Just now',
        likes: 0,
        isLiked: false,
        replies: 0
      };
             setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setReplyTo(null);
    }
  };



  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1, isLiked: !msg.isLiked }
        : msg
    ));
  };

  const handleReply = (message: ChatMessage) => {
    setReplyTo(message);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
      // Here you would typically upload the file to your server
      setShowFileUpload(false);
    }
  };

  const handleVoiceChat = () => {
    console.log('Voice chat initiated');
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setGeminiChatHistory([]);
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (supportMessage.trim() && !isLoadingResponse) {
      const userMessage = supportMessage.trim();
      const newChat = { user: 'You', message: userMessage };
      
      setChatHistory(prev => [...prev, newChat]);
      setSupportMessage('');
      setIsLoadingResponse(true);

      try {
        const brainFuelPrompt = geminiApiService.createBrainFuelPrompt(userMessage);
        const response = await geminiApiService.sendMessage(brainFuelPrompt, geminiChatHistory);
        
        const aiResponse = { user: 'BrainFuel AI', message: response };
        setChatHistory(prev => [...prev, aiResponse]);
        
        setGeminiChatHistory(prev => [
          ...prev,
          { role: 'user', parts: [{ text: userMessage }] },
          { role: 'model', parts: [{ text: response }] }
        ]);
        
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorResponse = { 
          user: 'BrainFuel AI', 
          message: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' 
        };
        setChatHistory(prev => [...prev, errorResponse]);
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

     // Auto-scroll to bottom
   useEffect(() => {
     const messagesContainer = messagesEndRef.current?.parentElement;
     if (messagesContainer) {
       messagesContainer.scrollTop = messagesContainer.scrollHeight;
     }
   }, [messages]);

  // Set scroll to top button position
  useEffect(() => {
    setPosition('support');
    return () => setPosition('default');
  }, [setPosition]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Project Chat</h1>
                <p className="text-text-secondary text-sm sm:text-base">Connect with innovators worldwide</p>
              </div>
            </div>
          </div>
          

        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
                             className="bg-background-secondary/80 backdrop-blur-md border border-border-primary rounded-2xl p-4 sm:p-6 h-[500px] sm:h-[580px] flex flex-col"
            >
              

              {/* Messages Area */}
                             <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                 {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex space-x-3 ${msg.isPinned ? 'bg-accent-primary/10 border border-accent-primary/20 rounded-xl p-2' : ''}`}
                  >
                    <div className="relative">
                      <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full" />
                      {msg.isPinned && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-primary rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-text-primary">{msg.user}</span>
                        <span className="text-xs text-text-muted">{msg.timestamp}</span>
                        {msg.project && (
                          <span className="text-xs bg-accent-primary/20 text-accent-primary px-2 py-1 rounded-full">
                            {msg.project}
                          </span>
                        )}
                      </div>
                      
                                             <div className="bg-background-tertiary border border-border-primary rounded-xl p-3">
                         <p className="text-text-primary mb-2 text-sm">{msg.text}</p>
                        
                        {/* Attachments */}
                        {msg.attachments && (
                          <div className="flex space-x-2 mb-3">
                            {msg.attachments.map((attachment, index) => (
                              <div key={index} className="w-20 h-20 bg-background-secondary rounded-lg overflow-hidden">
                                <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                        
                                                 {/* Message Actions */}
                         <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-3">
                                                         <motion.button
                               whileHover={{ scale: 1.1 }}
                               whileTap={{ scale: 0.9 }}
                               onClick={() => handleLike(msg.id)}
                               className={`flex items-center space-x-1 text-xs transition-colors ${
                                 msg.isLiked ? 'text-red-400' : 'text-text-muted hover:text-red-400'
                               }`}
                             >
                               <Heart className={`w-3 h-3 ${msg.isLiked ? 'fill-current' : ''}`} />
                               <span>{msg.likes}</span>
                             </motion.button>
                            
                                                         <motion.button
                               whileHover={{ scale: 1.1 }}
                               whileTap={{ scale: 0.9 }}
                               onClick={() => handleReply(msg)}
                               className="flex items-center space-x-1 text-xs text-text-muted hover:text-accent-primary transition-colors"
                             >
                               <Reply className="w-3 h-3" />
                               <span>{msg.replies}</span>
                             </motion.button>
                            
                                                         <motion.button
                               whileHover={{ scale: 1.1 }}
                               whileTap={{ scale: 0.9 }}
                               className="text-text-muted hover:text-accent-primary transition-colors"
                             >
                               <Share2 className="w-3 h-3" />
                             </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Preview */}
              {replyTo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Reply className="w-4 h-4 text-accent-primary" />
                      <span className="text-sm text-accent-primary">Replying to {replyTo.user}</span>
                    </div>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="text-text-muted hover:text-text-primary"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-text-secondary mt-1 truncate">{replyTo.text}</p>
                </motion.div>
              )}

              {/* Message Input */}
              <form onSubmit={handleSubmit} className="flex space-x-3 items-end">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                  />
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="absolute -top-8 left-0 text-sm text-text-muted">
                      Someone is typing...
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-3 bg-background-tertiary border border-border-primary rounded-xl text-text-primary hover:bg-background-secondary transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-background-tertiary border border-border-primary rounded-xl text-text-primary hover:bg-background-secondary transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleVoiceChat}
                    className="p-3 bg-background-tertiary border border-border-primary rounded-xl text-text-primary hover:bg-background-secondary transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!message.trim()}
                    className="p-3 bg-accent-primary text-white rounded-xl hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
            </motion.div>
          </div>

          {/* Online Users Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-background-secondary/80 backdrop-blur-md border border-border-primary rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-accent-primary" />
                  <h3 className="font-semibold text-text-primary">Online Now</h3>
                  <span className="bg-accent-success text-white text-xs px-2 py-1 rounded-full">
                    {onlineUsers.filter(u => u.status === 'online').length}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {onlineUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-3 bg-background-tertiary rounded-xl hover:bg-background-primary transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background-secondary ${
                          user.status === 'online' ? 'bg-accent-success' :
                          user.status === 'away' ? 'bg-accent-warning' :
                          user.status === 'busy' ? 'bg-accent-danger' : 'bg-text-muted'
                        }`}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-text-primary truncate">{user.name}</span>
                        {user.isTyping && (
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-xs text-accent-primary"
                          >
                            typing...
                          </motion.div>
                        )}
                      </div>
                      
                      {user.project && (
                        <p className="text-xs text-text-secondary truncate">{user.project}</p>
                      )}
                      
                      {user.lastSeen && (
                        <p className="text-xs text-text-muted">{user.lastSeen}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {user.status === 'online' && <Crown className="w-3 h-3 text-yellow-400" />}
                      <MoreVertical className="w-4 h-4 text-text-muted" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
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

export default Chat;