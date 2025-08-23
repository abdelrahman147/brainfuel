import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Shield,
  Mail,
  Phone
} from 'lucide-react';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

const TermsOfService = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();

  // Set scroll to top button position
  React.useEffect(() => {
    setPosition('default');
  }, [setPosition]);

  const termsSections = [
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      color: "from-green-600 to-teal-600",
      content: [
        "By accessing BrainFuel, you agree to these terms",
        "You must be at least 13 years old to use the service",
        "You are responsible for maintaining account security",
        "We reserve the right to modify these terms",
        "Continued use constitutes acceptance of changes"
      ]
    },
    {
      title: "User Responsibilities",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      content: [
        "Provide accurate and complete information",
        "Maintain the security of your account",
        "Respect intellectual property rights",
        "Follow community guidelines",
        "Report violations and inappropriate content"
      ]
    },
    {
      title: "Prohibited Activities",
      icon: XCircle,
      color: "from-red-600 to-pink-600",
      content: [
        "Sharing inappropriate or harmful content",
        "Violating intellectual property rights",
        "Attempting to gain unauthorized access",
        "Spamming or harassing other users",
        "Using the platform for illegal activities"
      ]
    },
    {
      title: "Content Guidelines",
      icon: FileText,
      color: "from-purple-600 to-pink-600",
      content: [
        "Projects must be original or properly attributed",
        "Content must be appropriate for all ages",
        "No hate speech or discriminatory content",
        "Respect copyright and licensing requirements",
        "Maintain academic integrity standards"
      ]
    },
    {
      title: "Intellectual Property",
      icon: Shield,
      color: "from-orange-600 to-red-600",
      content: [
        "You retain ownership of your content",
        "You grant us license to display your content",
        "We respect third-party intellectual property",
        "Report copyright violations immediately",
        "We may remove infringing content"
      ]
    },
    {
      title: "Limitation of Liability",
      icon: AlertTriangle,
      color: "from-yellow-600 to-orange-600",
      content: [
        "We provide the service 'as is'",
        "We are not liable for indirect damages",
        "Maximum liability is limited to fees paid",
        "We do not guarantee uninterrupted service",
        "You use the platform at your own risk"
      ]
    }
  ];

  const contactInfo = [
    { icon: Mail, text: "legal@brainfuel.com", link: "mailto:legal@brainfuel.com" },
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
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 bg-background-secondary rounded-full text-text-primary hover:text-accent-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Terms of Service</h1>
                <p className="text-text-secondary">Rules and guidelines for using BrainFuel</p>
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
              <h2 className="text-2xl font-bold text-text-primary mb-4">Welcome to BrainFuel</h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                These Terms of Service govern your use of BrainFuel, our student innovation platform. 
                By using our service, you agree to these terms and our community guidelines.
              </p>
              <div className="text-sm text-text-muted">
                <p><strong>Last updated:</strong> January 2025</p>
                <p><strong>Effective date:</strong> January 1, 2025</p>
              </div>
            </div>
          </motion.div>

          {/* Terms Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {termsSections.map((section, index) => (
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
            className="mt-12 bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-border-primary rounded-2xl p-8 col-span-1 lg:col-span-2"
          >
            <h3 className="text-xl font-semibold text-text-primary mb-6 text-center">
              Questions About Terms?
            </h3>
            <p className="text-text-secondary text-center mb-6">
              If you have any questions about these Terms of Service or need clarification, 
              please contact our legal team.
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

export default TermsOfService;
