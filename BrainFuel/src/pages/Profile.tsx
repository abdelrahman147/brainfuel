import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Save, X, User, Edit, Upload, Bell, Trophy, Star, TrendingUp, Calendar, MapPin, Mail, Phone, Globe, Github, Linkedin, Twitter, Award, Target, Users, Eye, Heart, MessageCircle, Share2, Settings, Shield, Zap, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

interface UserProfile {
  username: string;
  bio: string;
  profilePicture: string;
  email: string;
  age: string;
  university: string;
  department: string;
  tags: string;
  location: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: Date;
  type: 'badge' | 'milestone' | 'award';
  color: string;
}

interface Activity {
  id: string;
  type: 'project' | 'comment' | 'like' | 'follow' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  views: number;
  likes: number;
  comments: number;
  status: 'draft' | 'published' | 'featured';
  createdAt: Date;
}

const Profile = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();
  const [user, setUser] = useState<UserProfile>({
    username: '',
    bio: '',
    profilePicture: '',
    email: '',
    age: '',
    university: '',
    department: '',
    tags: '',
    location: '',
    phone: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<UserProfile>({ ...user });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'achievements' | 'activity'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for achievements
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Project',
      description: 'Successfully published your first project',
      icon: '🎉',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      type: 'milestone',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: '2',
      title: 'Innovation Pioneer',
      description: 'Created 5 innovative projects',
      icon: '🚀',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      type: 'badge',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '3',
      title: 'Community Helper',
      description: 'Helped 10+ community members',
      icon: '🤝',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      type: 'award',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // Mock data for activities
  const activities: Activity[] = [
    {
      id: '1',
      type: 'project',
      title: 'Published AI Education System',
      description: 'Your project has been published successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: <Upload className="w-4 h-4" />
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Earned Innovation Pioneer Badge',
      description: 'Congratulations on your achievement!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      icon: <Trophy className="w-4 h-4" />
    },
    {
      id: '3',
      type: 'like',
      title: 'Received 15 likes',
      description: 'Your project "Smart Home System" got 15 likes',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      icon: <Heart className="w-4 h-4" />
    }
  ];

  // Mock data for projects
  const projects: Project[] = [
    {
      id: '1',
      title: 'AI Education System',
      description: 'An intelligent learning platform powered by AI',
      image: '/api/placeholder/300/200',
      views: 1250,
      likes: 89,
      comments: 23,
      status: 'featured',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
    },
    {
      id: '2',
      title: 'Smart Home Automation',
      description: 'IoT-based home automation system',
      image: '/api/placeholder/300/200',
      views: 890,
      likes: 67,
      comments: 15,
      status: 'published',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    }
  ];

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'achievement' as const,
      title: 'Congratulations! 🎉',
      message: 'You have earned the "Distinguished Innovator" badge for your outstanding project',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'Project Accepted',
      message: 'Your project "AI Education System" has been accepted for the annual exhibition',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'BrainFuel Exhibition 2025',
      message: 'Reminder: The annual exhibition starts on August 22, 2025. Make sure to update your project',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      isRead: true
    }
  ]);

  const isValidEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  useEffect(() => {
    if (isEditing) {
      setTempUser({ ...user });
    }
  }, [isEditing, user]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempUser({ ...tempUser, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [tempUser]);

  const handleSaveProfile = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tempUser.username.trim() || !tempUser.email.trim()) {
      setErrorMessage('Please fill in all required fields (Username, Email).');
      return;
    }
    if (!isValidEmail(tempUser.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setUser({ ...tempUser });
    setIsEditing(false);
    setErrorMessage('');
    setSuccessMessage('Profile saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, [tempUser, isValidEmail]);

  const handleUploadProject = () => {
    navigate('/submit');
  };

  // Notifications helper functions
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'warning':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      case 'info':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
      case 'achievement':
        return <div className="w-3 h-3 bg-purple-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US');
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  // Handle clearing all notifications
  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Handle marking single notification as read
  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    ));
  };

  // Set scroll to top button position for pages without support modal
  useEffect(() => {
    setPosition('default');
    return () => setPosition('default');
  }, [setPosition]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent p-4 sm:p-6 md:p-8 py-8 sm:py-12">
      {/* Header with Notifications */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-end">
          {/* Notifications Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-center px-2 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden w-[40px] h-[40px]"
            >
              <Bell className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                 className="absolute right-12 top-20 z-50 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl"
                 style={{ width: '350px', maxHeight: '500px' }}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
                        <p className="text-xs text-text-secondary">Latest Updates</p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNotifications(false)}
                      className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-text-secondary">Total: {notifications.length}</span>
                    <span className="text-accent-primary font-medium">Unread: {notifications.filter(n => !n.isRead).length}</span>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto">
                    <div className="space-y-3">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`relative bg-background-secondary/30 backdrop-blur-md border border-border-primary rounded-xl p-3 transition-all duration-300 cursor-pointer hover:bg-background-secondary/50 ${
                              !notification.isRead ? 'ring-2 ring-accent-primary/20' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className={`text-sm font-semibold mb-1 ${
                                  !notification.isRead ? 'text-text-primary' : 'text-text-secondary'
                                }`}>
                                  {notification.title}
                                </h3>
                                <p className="text-xs text-text-secondary mb-2 leading-relaxed">
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1 text-xs text-text-secondary">
                                      <span>{formatTimeAgo(notification.timestamp)}</span>
                                    </div>
                                    
                                    {!notification.isRead && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-accent-primary/20 text-accent-primary">
                                        New
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-8"
                        >
                          <Bell className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                          <h3 className="text-sm font-semibold text-text-secondary mb-1">
                            No new notifications
                          </h3>
                          <p className="text-xs text-text-secondary">
                            New notifications will appear here
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {notifications.length > 0 && (
                    <div className="mt-2 pt-3 border-t border-border-primary">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleMarkAllAsRead}
                          className="flex-1 px-3 py-2 bg-accent-primary/20 text-accent-primary text-xs font-medium rounded-lg hover:bg-accent-primary/30 transition-colors"
                        >
                          Mark all as read
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleClearAllNotifications}
                          className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          Clear all
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <style>
          {`
            .custom-select {
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
              background-repeat: no-repeat;
              background-position: right 14px center;
              background-size: 16px;
            }
          `}
        </style>
        
        <div className="w-full max-w-6xl mx-auto">
          {/* Profile Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="bg-gray-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 mb-8 shadow-xl shadow-purple-500/20"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile picture"
                      className="w-40 h-40 rounded-full object-cover border-4 border-purple-500/50 shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full border-4 border-purple-500/50 bg-gray-700/60 flex items-center justify-center shadow-lg">
                      <User className="w-20 h-20 text-purple-400" />
                    </div>
                  )}
                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: '#6d28d9' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="Upload new profile picture"
                    >
                      <Camera className="w-10 h-10 text-gray-100" />
                    </motion.button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-label="Profile picture upload"
                  />
                </div>
                {isEditing && (
                  <label className="block text-sm text-gray-400 mt-3 text-center">Upload new photo</label>
                )}
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 text-center lg:text-left">
                {isEditing ? (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 text-left">Username</label>
                      <input
                        type="text"
                        value={tempUser.username}
                        onChange={(e) => setTempUser({ ...tempUser, username: e.target.value })}
                        placeholder="Your Username"
                        required
                        aria-label="Username"
                        className="w-full p-4 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 text-left">Bio</label>
                      <textarea
                        value={tempUser.bio}
                        onChange={(e) => setTempUser({ ...tempUser, bio: e.target.value })}
                        placeholder="Tell us about yourself"
                        className="w-full h-28 p-4 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none transition"
                        rows={3}
                        aria-label="Bio"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-100">
                      {user.username || 'Your Username'}
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                      {user.bio || 'Add a bio to share your story and showcase your innovative projects.'}
                    </p>
                    
                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-6">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location || 'Location not set'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date().getFullYear()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{projects.length} Projects</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
                      {user.github && (
                        <motion.a
                          href={user.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition"
                        >
                          <Github className="w-5 h-5 text-gray-300" />
                        </motion.a>
                      )}
                      {user.linkedin && (
                        <motion.a
                          href={user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition"
                        >
                          <Linkedin className="w-5 h-5 text-gray-300" />
                        </motion.a>
                      )}
                      {user.twitter && (
                        <motion.a
                          href={user.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition"
                        >
                          <Twitter className="w-5 h-5 text-gray-300" />
                        </motion.a>
                      )}
                      {user.website && (
                        <motion.a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition"
                        >
                          <Globe className="w-5 h-5 text-gray-300" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-gray-100 border border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 transition"
                  aria-label={isEditing ? 'Cancel editing profile' : 'Edit profile'}
                >
                  {isEditing ? <X className="w-5 h-5 mr-2" /> : <Edit className="w-5 h-5 mr-2" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUploadProject}
                  className="flex items-center justify-center px-6 py-3 rounded-full border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Project
                </motion.button>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-700/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">{projects.length}</div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-1">{achievements.length}</div>
                <div className="text-sm text-gray-400">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-1">
                  {projects.reduce((sum, project) => sum + project.views, 0)}
                </div>
                <div className="text-sm text-gray-400">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {projects.reduce((sum, project) => sum + project.likes, 0)}
                </div>
                <div className="text-sm text-gray-400">Total Likes</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-lg border border-purple-500/30 rounded-xl p-2 mb-8"
          >
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
                { id: 'projects', label: 'Projects', icon: <Upload className="w-4 h-4" /> },
                { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
                { id: 'activity', label: 'Activity', icon: <TrendingUp className="w-4 h-4" /> }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Recent Achievements */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-xl"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-100">Recent Achievements</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {achievements.slice(0, 3).map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30"
                        >
                          <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center text-2xl`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-100 text-sm">{achievement.title}</h4>
                            <p className="text-gray-400 text-xs">{achievement.description}</p>
                            <p className="text-gray-500 text-xs mt-1">{formatTimeAgo(achievement.date)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-xl"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-100">Recent Activity</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
                        >
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <div className="text-purple-400">
                              {activity.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-100 text-sm">{activity.title}</h4>
                            <p className="text-gray-400 text-xs">{activity.description}</p>
                            <p className="text-gray-500 text-xs mt-1">{formatTimeAgo(activity.timestamp)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-xl"
                  >
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                      <div className="lg:w-1/3">
                        <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
                          <Upload className="w-16 h-16 text-purple-400" />
                        </div>
                      </div>
                      <div className="lg:flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-100 mb-2">{project.title}</h3>
                            <p className="text-gray-400 mb-3">{project.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'featured' ? 'bg-purple-500/20 text-purple-400' :
                            project.status === 'published' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{project.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{project.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{project.comments}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                          >
                            View Project
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/10 transition"
                          >
                            Edit
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-xl"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto`}>
                      {achievement.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-100 text-center mb-2">{achievement.title}</h3>
                    <p className="text-gray-400 text-sm text-center mb-4">{achievement.description}</p>
                    <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTimeAgo(achievement.date)}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <div className="text-purple-400">
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-100">{activity.title}</h4>
                        <p className="text-gray-400 text-sm">{activity.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Profile Form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="mt-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 shadow-xl"
              >
                {successMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-green-400 text-sm mb-4 text-center"
                  >
                    {successMessage}
                  </motion.p>
                )}
                {errorMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm mb-4 text-center"
                  >
                    {errorMessage}
                  </motion.p>
                )}
                
                <form onSubmit={handleSaveProfile} className="space-y-6" aria-label="Edit profile form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          value={tempUser.email}
                          onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                          placeholder="your.email@example.com"
                          required
                          aria-label="Email"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="tel"
                          value={tempUser.phone}
                          onChange={(e) => setTempUser({ ...tempUser, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          aria-label="Phone"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Age</label>
                      <input
                        type="number"
                        value={tempUser.age}
                        onChange={(e) => setTempUser({ ...tempUser, age: e.target.value })}
                        placeholder="25"
                        min="16"
                        max="100"
                        aria-label="Age"
                        className="w-full px-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={tempUser.location}
                          onChange={(e) => setTempUser({ ...tempUser, location: e.target.value })}
                          placeholder="Cairo, Egypt"
                          aria-label="Location"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">University</label>
                      <input
                        type="text"
                        value={tempUser.university}
                        onChange={(e) => setTempUser({ ...tempUser, university: e.target.value })}
                        placeholder="Cairo University"
                        aria-label="University"
                        className="w-full px-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Department</label>
                      <input
                        type="text"
                        value={tempUser.department}
                        onChange={(e) => setTempUser({ ...tempUser, department: e.target.value })}
                        placeholder="Computer Science"
                        aria-label="Department"
                        className="w-full px-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Tags</label>
                    <input
                      type="text"
                      value={tempUser.tags}
                      onChange={(e) => setTempUser({ ...tempUser, tags: e.target.value })}
                      placeholder="AI, Robotics, Research, Machine Learning"
                      aria-label="Tags"
                      className="w-full px-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Website</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="url"
                          value={tempUser.website}
                          onChange={(e) => setTempUser({ ...tempUser, website: e.target.value })}
                          placeholder="https://yourwebsite.com"
                          aria-label="Website"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">GitHub</label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="url"
                          value={tempUser.github}
                          onChange={(e) => setTempUser({ ...tempUser, github: e.target.value })}
                          placeholder="https://github.com/username"
                          aria-label="GitHub"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">LinkedIn</label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="url"
                          value={tempUser.linkedin}
                          onChange={(e) => setTempUser({ ...tempUser, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                          aria-label="LinkedIn"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Twitter</label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="url"
                          value={tempUser.twitter}
                          onChange={(e) => setTempUser({ ...tempUser, twitter: e.target.value })}
                          placeholder="https://twitter.com/username"
                          aria-label="Twitter"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900/70 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)' }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-gray-100 border border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 transition"
                      aria-label="Save profile"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save Profile
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;