import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Plus, 
  DollarSign,
  MessageCircle, 
  HelpCircle,
  ArrowLeft,
  LogIn,
  ShoppingBag,
  User,
  Trophy,
  Users,
  FileText,
  Settings,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

const Sitemap = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();

  // Set scroll to top button position
  React.useEffect(() => {
    setPosition('default');
  }, [setPosition]);

  const siteSections = [
    {
      title: "Main Pages",
      icon: Home,
      color: "from-purple-600 to-pink-600",
      items: [
        { name: "Home", path: "/", description: "Main platform homepage" },
        { name: "Explore Projects", path: "/explore", description: "Browse all projects" },
        { name: "Projects Exhibition", path: "/exhibition", description: "Annual projects exhibition" },
      ]
    },
         {
       title: "Project Management",
       icon: Plus,
       color: "from-green-600 to-blue-600",
       items: [
         { name: "Submit Project", path: "/submit", description: "Submit a new project" },
       ]
     },
    {
      title: "Account & Profile",
      icon: User,
      color: "from-orange-600 to-red-600",
      items: [
        { name: "Login", path: "/login", description: "Platform login" },
        { name: "Profile", path: "/profile", description: "Manage your profile" },
        { name: "Plans & Payment", path: "/payments", description: "Subscription plans and payment" },
      ]
    },
         {
       title: "Communication & Support",
       icon: MessageCircle,
       color: "from-blue-600 to-indigo-600",
       items: [
         { name: "Chat", path: "/chat", description: "Chat with students" },
         { name: "Support", path: "/support", description: "Support center and help" },
         { name: "Forum", path: "/forum", description: "Discussion forum" },
       ]
     },
    {
      title: "Additional Services",
      icon: ShoppingBag,
      color: "from-pink-600 to-purple-600",
      items: [
        { name: "Store", path: "/store", description: "Products and services store" },
        { name: "Checkout", path: "/checkout", description: "Payment completion page" },
        { name: "Development Team", path: "/card", description: "Meet the BrainFuel team" },
      ]
    }
  ];

  const quickLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  const contactInfo = [
    { icon: Mail, text: "support@brainfuel.com", link: "mailto:support@brainfuel.com" },
    { icon: Phone, text: "+20 0123456789", link: "tel:+200123456789" },
    { icon: MapPin, text: "Damietta, Egypt", link: "#" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent">
      {/* Header */}
      <div className="border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-4 mb-6"
          >
                         <motion.button
               whileHover={{ scale: 1.05, x: -5 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/');
                }
              }}
               className="flex items-center justify-center w-10 h-10 bg-background-secondary rounded-full text-text-primary hover:text-accent-primary transition-colors"
             >
               <ArrowLeft className="w-5 h-5" />
             </motion.button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
                             <div>
                 <h1 className="text-3xl font-bold text-text-primary">Sitemap</h1>
                 <p className="text-text-secondary">Explore all pages and areas of BrainFuel</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Site Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
                         <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
               Website Sections
             </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center`}>
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">{section.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <motion.div
                        key={item.name}
                        whileHover={{ x: 5 }}
                        onClick={() => navigate(item.path)}
                        className="flex items-center justify-between p-3 rounded-lg bg-background-tertiary/50 hover:bg-background-tertiary cursor-pointer transition-all duration-200 group"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-text-secondary mt-1">
                            {item.description}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links & Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6"
            >
                             <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                 <Settings className="w-5 h-5 text-accent-primary mr-2" />
                 Quick Links
               </h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {quickLinks.map((link) => (
                   <motion.div
                     key={link.name}
                     whileHover={{ x: 5 }}
                     onClick={() => navigate(link.path)}
                     className="text-sm text-text-secondary hover:text-accent-primary cursor-pointer transition-colors p-2 rounded-lg hover:bg-background-tertiary/50"
                   >
                     {link.name}
                   </motion.div>
                 ))}
               </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6"
            >
                             <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                 <Mail className="w-5 h-5 text-accent-primary mr-2" />
                 Contact Information
               </h3>
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background-tertiary/50 cursor-pointer transition-all duration-200 group"
                  >
                    <contact.icon className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors" />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                      {contact.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Site Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-border-primary rounded-2xl p-8"
          >
                         <h3 className="text-xl font-semibold text-text-primary mb-6 text-center">
               Website Statistics
             </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                             <div className="text-center">
                 <div className="text-2xl font-bold text-purple-400 mb-1">15+</div>
                 <div className="text-gray-400 text-sm">Pages</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-pink-400 mb-1">6</div>
                 <div className="text-gray-400 text-sm">Main Sections</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-indigo-400 mb-1">12</div>
                 <div className="text-gray-400 text-sm">Project Categories</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-green-400 mb-1">24/7</div>
                 <div className="text-gray-400 text-sm">Support</div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
