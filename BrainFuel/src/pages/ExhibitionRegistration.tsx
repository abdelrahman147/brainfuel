import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  Plus, 
  Ticket, 
  FileText, 
  CheckCircle, 
  X,
  Video,
  Save,
  Users as Team,
  FileText as Presentation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

const ExhibitionRegistration = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();
  const [activeTab, setActiveTab] = useState<'teams' | 'attendees'>('teams');
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [formData, setFormData] = useState({
    teamName: '',
    projectTitle: '',
    projectDescription: '',
    teamMembers: '',
    university: '',
    email: '',
    phone: '',
    category: '',
    videoLink: '',
    projectFiles: [] as File[]
  });

  // Set scroll to top button position
  useEffect(() => {
    setPosition('default');
    return () => setPosition('default');
  }, [setPosition]);

  const ticketTypes = [
    {
      id: 'free',
      name: 'Free Ticket',
      price: 0,
      originalPrice: 0,
      features: ['Access to all exhibitions', 'Basic networking sessions', 'Certificate of attendance'],
      available: 200,
      sold: 80
    },
    {
      id: 'regular',
      name: 'Regular Ticket',
      price: 6.99,
      originalPrice: 6.99,
      features: ['Access to all exhibitions', 'Networking sessions', 'Workshop participation', 'Certificate of attendance', 'Exhibition catalog'],
      available: 100,
      sold: 45
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 13.99,
      originalPrice: 13.99,
      features: ['Priority access to all exhibitions', 'Exclusive networking events', 'All workshop sessions', 'Premium certificate', 'Exhibition catalog', 'Meet & greet with judges', 'Lunch included'],
      available: 50,
      sold: 20
    }
  ];

  const categories = [
    'AI & Machine Learning',
    'Robotics & Automation',
    'Medicine & Healthcare',
    'Engineering & Technology',
    'Computer Science',
    'Environmental Science',
    'Business & Entrepreneurship',
    'Arts & Design',
    'Social Impact',
    'Other'
  ];

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Team submission:', formData);
    
    // Show success message
    alert(`🎉 تم تسجيل فريقك بنجاح! ستحصل على تأكيد عبر البريد الإلكتروني.\n\n🎉 Your team has been successfully registered! You will receive a confirmation email.`);
    
    // Reset form
    setFormData({
      teamName: '',
      projectTitle: '',
      projectDescription: '',
      teamMembers: '',
      university: '',
      email: '',
      phone: '',
      category: '',
      videoLink: '',
      projectFiles: []
    });
  };

  const handleTicketPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Ticket purchase:', selectedTicketType);
    
    // Validate that a ticket is selected
    if (!selectedTicketType) {
      alert('Please select a ticket type first!');
      return;
    }
    
    // Show success message
    const selectedTicket = ticketTypes.find(t => t.id === selectedTicketType);
    if (selectedTicket) {
      if (selectedTicket.price === 0) {
        alert(`🎉 تم الحجز بنجاح! ستحصل على تذكرتك المجانية للمعرض.\n\n🎉 Successfully registered! You will receive your free ticket for the exhibition.`);
      } else {
        alert(`🎉 تم الحجز بنجاح! ستحصل على تذكرتك بقيمة $${selectedTicket.price} للمعرض.\n\n🎉 Successfully registered! You will receive your ticket for $${selectedTicket.price} for the exhibition.`);
      }
      
      // Reset form
      setSelectedTicketType('');
    } else {
      alert('Error: Ticket not found!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Check file count limit
      if (formData.projectFiles.length + filesArray.length > 10) {
        alert('Maximum 10 files allowed');
        return;
      }
      
      // Check file size limit (50MB each)
      const oversizedFiles = filesArray.filter(file => file.size > 50 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        alert(`Files larger than 50MB are not allowed: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }
      
      setFormData({ ...formData, projectFiles: [...formData.projectFiles, ...filesArray] });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = formData.projectFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, projectFiles: newFiles });
  };

      return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent p-4 sm:p-6 md:p-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/exhibition')}
            className="flex items-center space-x-3 text-text-primary hover:text-accent-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Exhibition</span>
          </motion.button>
        </div>

        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <Trophy className="w-8 h-8 text-accent-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Exhibition Registration</h1>
          </motion.div>
          <p className="text-text-secondary text-lg">Join the Annual BrainFuel Exhibition 2025</p>
        </div>

        {/* Main Content */}
        {/* Event Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background-secondary border border-border-primary rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-accent-primary" />
                <div>
                  <h3 className="font-semibold text-text-primary">Date & Time</h3>
                  <p className="text-text-secondary">August 22, 2025</p>
                  <p className="text-text-secondary">9:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-accent-primary" />
                <div>
                  <h3 className="font-semibold text-text-primary">Location</h3>
                  <p className="text-text-secondary">Damietta University</p>
                  <p className="text-text-secondary">Main Horus Hall</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-accent-primary" />
                <div>
                  <h3 className="font-semibold text-text-primary">Expected Attendance</h3>
                  <p className="text-text-secondary">500+ Participants</p>
                  <p className="text-text-secondary">50+ Teams</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex space-x-1 bg-background-secondary rounded-xl p-1">
              <button
                onClick={() => setActiveTab('teams')}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'teams'
                    ? 'bg-accent-primary text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Team className="w-5 h-5" />
                <span>Teams - Submit Projects</span>
              </button>
              <button
                onClick={() => setActiveTab('attendees')}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'attendees'
                    ? 'bg-accent-primary text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Ticket className="w-5 h-5" />
                <span>Attendees - Buy Tickets</span>
              </button>
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'teams' ? (
              <motion.div
                key="teams"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-8"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
                    <Presentation className="w-6 h-6 text-accent-primary mr-3" />
                    Submit Your Project
                  </h2>
                  <p className="text-text-secondary">
                    Showcase your innovative project at the Annual BrainFuel Exhibition. 
                    Connect with fellow innovators and get recognized for your creativity.
                  </p>
                </div>

                <form onSubmit={handleTeamSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.teamName}
                        onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                        className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                        placeholder="Enter your team name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Project Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                      className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                      placeholder="Enter your project title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Project Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
                      className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none"
                      placeholder="Describe your project in detail..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Team Members *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.teamMembers}
                        onChange={(e) => setFormData({...formData, teamMembers: e.target.value})}
                        className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none"
                        placeholder="List all team members (one per line)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        University/Institution *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.university}
                        onChange={(e) => setFormData({...formData, university: e.target.value})}
                        className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                        placeholder="Enter your university/institution"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Video Link */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 flex items-center">
                      <Video className="w-4 h-4 text-accent-primary mr-2" />
                      Project Video Link
                    </label>
                    <input
                      type="url"
                      value={formData.videoLink}
                      onChange={(e) => setFormData({...formData, videoLink: e.target.value})}
                      className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                      placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Add a link to your project video (YouTube, Google Drive, etc.)
                    </p>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 flex items-center">
                      <FileText className="w-4 h-4 text-accent-primary mr-2" />
                      Project Files (Images, Documents, Videos)
                    </label>
                    <div className="border-2 border-dashed border-border-primary rounded-lg p-6 text-center hover:border-accent-primary/50 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
                          <Plus className="w-6 h-6 text-accent-primary" />
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">Click to upload files</p>
                          <p className="text-text-secondary text-sm">
                            Images, PDFs, Documents, Videos (Max 10 files, 50MB each)
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* File List */}
                    {formData.projectFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-text-primary">
                          Uploaded Files ({formData.projectFiles.length}/10):
                        </h4>
                        {formData.projectFiles.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg border border-border-primary"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-accent-primary" />
                              <div>
                                <p className="text-sm font-medium text-text-primary">{file.name}</p>
                                <p className="text-xs text-text-secondary">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
                                </p>
                              </div>
                            </div>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFile(index)}
                              className="p-1 text-red-500 hover:text-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8 flex justify-start">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                    >
                      <Save className="w-5 h-5" />
                      <span>Submit Project Application</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="attendees"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
                    <Ticket className="w-6 h-6 text-accent-primary mr-3" />
                    Get Your Exhibition Ticket
                  </h2>
                  <p className="text-text-secondary">
                    Join us for an amazing experience at the Annual BrainFuel Exhibition. 
                    Choose the ticket that best suits your needs.
                  </p>
                </div>

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   {ticketTypes.map((ticket) => (
                     <motion.div
                       key={ticket.id}
                       whileHover={{ y: -5 }}
                       className={`relative bg-background-secondary/30 backdrop-blur-md border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                         selectedTicketType === ticket.id
                           ? 'border-accent-primary shadow-lg shadow-accent-primary/25'
                           : 'border-border-primary hover:border-accent-primary/50'
                       }`}
                       onClick={() => setSelectedTicketType(ticket.id)}
                     >
                      {selectedTicketType === ticket.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-text-primary mb-2">{ticket.name}</h3>
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          {ticket.price === 0 ? (
                            <span className="text-2xl font-bold text-green-500">Free</span>
                          ) : (
                            <>
                              <span className="text-2xl font-bold text-accent-primary">${ticket.price}</span>
                              {ticket.originalPrice > ticket.price && (
                                <span className="text-text-muted line-through">${ticket.originalPrice}</span>
                              )}
                            </>
                          )}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {ticket.available - ticket.sold} tickets left
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {ticket.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="w-full bg-background-tertiary rounded-lg h-2 mb-2">
                        <div 
                          className="bg-accent-primary h-2 rounded-lg transition-all duration-300"
                          style={{ width: `${(ticket.sold / (ticket.available + ticket.sold)) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-text-secondary text-center">
                        {ticket.sold} sold
                      </div>
                    </motion.div>
                  ))}
                </div>

                                 {selectedTicketType && (
                                     <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Complete Your Purchase</h3>
                    <form onSubmit={handleTicketPurchase} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          className="px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Email Address"
                          className="px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-6 py-3 rounded-lg font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                      >
                        Complete Purchase
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      </div>
    </div>
  );
};

export default ExhibitionRegistration;
