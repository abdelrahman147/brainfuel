import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  FileText,
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  Cookie,
  Mail,
  Phone
} from 'lucide-react';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();

  // Set scroll to top button position
  React.useEffect(() => {
    setPosition('default');
  }, [setPosition]);

  const policySections = [
    {
      title: "Information We Collect",
      icon: Database,
      color: "from-blue-600 to-indigo-600",
      content: [
        "Personal information (name, email, university)",
        "Project submissions and content",
        "Usage data and analytics",
        "Communication preferences",
        "Profile information and settings"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      color: "from-green-600 to-teal-600",
      content: [
        "Provide and maintain our services",
        "Process project submissions",
        "Send notifications and updates",
        "Improve user experience",
        "Ensure platform security"
      ]
    },
    {
      title: "Data Protection",
      icon: Shield,
      color: "from-purple-600 to-pink-600",
      content: [
        "Encryption of sensitive data",
        "Secure data transmission",
        "Regular security audits",
        "Access control measures",
        "Data backup and recovery"
      ]
    },
    {
      title: "Information Sharing",
      icon: Users,
      color: "from-orange-600 to-red-600",
      content: [
        "We do not sell personal information",
        "Limited sharing with service providers",
        "Legal compliance requirements",
        "User consent for specific features",
        "Anonymized data for analytics"
      ]
    },
    {
      title: "Cookies and Tracking",
      icon: Cookie,
      color: "from-yellow-600 to-orange-600",
      content: [
        "Essential cookies for functionality",
        "Analytics cookies for improvement",
        "User preference cookies",
        "Third-party service cookies",
        "Cookie management options"
      ]
    },
    {
      title: "Your Rights",
      icon: Lock,
      color: "from-indigo-600 to-purple-600",
      content: [
        "Access your personal data",
        "Request data correction",
        "Delete your account",
        "Export your data",
        "Opt-out of communications"
      ]
    }
  ];

  const contactInfo = [
    { icon: Mail, text: "privacy@brainfuel.com", link: "mailto:privacy@brainfuel.com" },
    { icon: Phone, text: "+20 0123456789", link: "tel:+200123456789" },
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Privacy Policy</h1>
                <p className="text-text-secondary">How we protect and handle your data</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Your Privacy Matters</h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                At BrainFuel, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
              </p>
              <div className="text-sm text-text-muted">
                <p><strong>Last updated:</strong> January 2025</p>
                <p><strong>Effective date:</strong> January 1, 2025</p>
              </div>
            </div>
          </motion.div>

          {/* Policy Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {policySections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2 text-text-secondary">
                      <span className="text-accent-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-border-primary rounded-2xl p-8 col-span-1 lg:col-span-2"
          >
            <h3 className="text-xl font-semibold text-text-primary mb-6 text-center">
              Questions About Privacy?
            </h3>
            <p className="text-text-secondary text-center mb-6">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background-tertiary/50 cursor-pointer transition-all duration-200 group"
                >
                  <contact.icon className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
                  <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                    {contact.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
