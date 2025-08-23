import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, PlusCircle, Save, X, User, HelpCircle, ChevronDown, Send } from 'lucide-react';
import { ProjectCategory } from '../types';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

// List of country codes (sample, can be expanded)
const countryCodes = [
  { code: '+1', country: 'US' },
  { code: '+20', country: 'EG' },
  { code: '+966', country: 'KSA' },
  { code: '+971', country: 'UAE' },
  { code: '+44', country: 'UK' },
  // Add more country codes as needed
];

/**
 * SubmitProject Component
 * A page for submitting new projects with a form for project details and media.
 * Includes a support chat button and modal for user assistance.
 */
const SubmitProject = () => {
  const { setPosition } = useScrollToTop();
  
  // State Management for Project Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    university: '',
    category: 'AI' as ProjectCategory,
    tags: '',
    tools: '',
    youtubeLink: '',
    projectMedia: null as File | null,
    authorName: '',
    authorEmail: '',
    authorDepartment: '',
    authorAvatar: null as File | null,
    phoneNumber: '',
    country: '',
    dateOfBirth: '',
  });

  // State for selected country code
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0].code);

  const [projectMediaPreview, setProjectMediaPreview] = useState<string | null>(null);
  const [authorAvatarPreview, setAuthorAvatarPreview] = useState<string | null>(null);

  // State Management for Support Chat
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; message: string }[]>([]);
  const supportButtonRef = useRef<HTMLButtonElement>(null);

  const categories: ProjectCategory[] = [
    'AI', 'Robotics', 'Medicine', 'Engineering',
    'Computer Science', 'Environmental', 'Business', 'Arts', 'Social Impact'
  ];

  // Handle file input changes for project media and author avatar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'projectMedia' | 'authorAvatar') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
      const previewUrl = URL.createObjectURL(file);
      if (field === 'projectMedia') {
        setProjectMediaPreview(previewUrl);
      } else {
        setAuthorAvatarPreview(previewUrl);
      }
    }
  };

  // Handle file removal for project media and author avatar
  const handleRemoveFile = (field: 'projectMedia' | 'authorAvatar') => {
    setFormData({ ...formData, [field]: null });
    if (field === 'projectMedia') {
      setProjectMediaPreview(null);
    } else {
      setAuthorAvatarPreview(null);
    }
  };

  // Handle date of birth input to enforce DD/MM/YYYY format
  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9/]/g, ''); // Allow only numbers and slashes

    // Format the input as DD/MM/YYYY
    if (value.length > 2 && value[2] !== '/') {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5 && value[5] !== '/') {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }
    if (value.length > 10) {
      value = value.slice(0, 10); // Limit to DD/MM/YYYY
    }

    // Validate day (01-31) and month (01-12)
    const parts = value.split('/');
    if (parts[0] && parseInt(parts[0]) > 31) {
      parts[0] = '31';
      value = parts.join('/');
    }
    if (parts[1] && parseInt(parts[1]) > 12) {
      parts[1] = '12';
      value = parts.join('/');
    }

    setFormData({ ...formData, dateOfBirth: value });
  };

  // Handle phone number input to allow only numbers
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setFormData({ ...formData, phoneNumber: numericValue });
  };

  // Handle project form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combine country code with phone number for submission
    const fullPhoneNumber = `${selectedCountryCode}${formData.phoneNumber}`;
    console.log('Project submitted:', {
      ...formData,
      phoneNumber: fullPhoneNumber,
      projectMedia: formData.projectMedia?.name,
      authorAvatar: formData.authorAvatar?.name,
    });
    if (projectMediaPreview) URL.revokeObjectURL(projectMediaPreview);
    if (authorAvatarPreview) URL.revokeObjectURL(authorAvatarPreview);
  };

  // Handle support chat form submission
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supportMessage.trim()) {
      const newChat = { user: 'You', message: supportMessage };
      setChatHistory(prev => [...prev, newChat]);
      setTimeout(() => {
        const autoReply = {
          user: 'Support Bot',
          message: `Thank you for your message! We're looking into "${supportMessage}". We'll get back to you within 24 hours. If urgent, please email support@BrainFuel.com.`,
        };
        setChatHistory(prev => [...prev, autoReply]);
      }, 500);
      setSupportMessage('');
    }
  };

  // Set scroll to top button position for SubmitProject page (special position)
  useEffect(() => {
    setPosition('submit');
    return () => setPosition('default');
  }, [setPosition]);

  // Animation variants for the submit button
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2, ease: 'easeOut' } },
    hover: {
      scale: 1.05,
      boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent p-4 sm:p-6 md:p-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 flex items-center space-x-2 sm:space-x-3"
        >
          <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent-primary" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">Submit Your Project</h1>
        </motion.div>
        <p className="text-text-secondary mb-6 sm:mb-9 text-sm sm:text-base">Share your innovative project with the university community</p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-background-secondary border border-border-primary rounded-xl p-4 sm:p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="Enter your project title"
              />
            </div>

            {/* University */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                University *
              </label>
              <input
                type="text"
                required
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="Your university name"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-14 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Project Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none"
                placeholder="Describe your project in detail..."
              />
            </div>

            {/* Tools and Tags Side by Side */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tools (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tools}
                  onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                  className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                  placeholder="e.g., Python, TensorFlow, Arduino"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tags (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                  placeholder="e.g., Machine Learning, Healthcare, Computer Vision"
                />
              </div>
            </div>

            {/* YouTube Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                YouTube Link
              </label>
              <input
                type="url"
                value={formData.youtubeLink}
                onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="e.g., https://www.youtube.com/watch?v=example"
              />
            </div>

            {/* Project Media Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Project Image or Video or File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileChange(e, 'projectMedia')}
                  className="hidden"
                  id="projectMedia"
                  aria-label="Upload project image or video"
                />
                <label
                  htmlFor="projectMedia"
                  className="flex items-center justify-center w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary hover:bg-background-primary cursor-pointer transition-all duration-300 focus-within:ring-2 focus-within:ring-accent-primary/50"
                >
                  <Upload className="w-5 h-5 mr-2 text-text-muted" />
                  <span>{formData.projectMedia ? formData.projectMedia.name : 'Choose image or video'}</span>
                </label>
              </div>
              {projectMediaPreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  {formData.projectMedia?.type.startsWith('image') ? (
                    <img src={projectMediaPreview} alt="Project media preview" className="max-w-full h-auto rounded-lg shadow-md" />
                  ) : (
                    <video src={projectMediaPreview} controls className="max-w-full h-auto rounded-lg shadow-md" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('projectMedia')}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Author Information */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3 mb-4"
              >
                <User className="w-5 h-5 text-accent-primary" />
                <h3 className="text-lg font-semibold text-text-primary">Author Information</h3>
              </motion.div>
            </div>

            {/* Name and Email Side by Side */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Your Email *
              </label>
              <input
                type="email"
                required
                value={formData.authorEmail}
                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="Your email address"
              />
            </div>

            {/* Phone Number and Country Code */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Phone Number *
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative w-1/3">
                  <select
                    required
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 appearance-none"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.country})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="w-2/3 px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                  placeholder="1234567890"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="Your country"
              />
            </div>

            {/* Date of Birth */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date of Birth * (DD/MM/YYYY)
              </label>
              <input
                type="text"
                required
                value={formData.dateOfBirth}
                onChange={handleDateOfBirthChange}
                pattern="\d{2}/\d{2}/\d{4}"
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="DD/MM/YYYY"
                inputMode="numeric"
              />
            </div>

            {/* University and Department Side by Side */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                University *
              </label>
              <input
                type="text"
                required
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="Your university name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Department *
              </label>
              <input
                type="text"
                required
                value={formData.authorDepartment}
                onChange={(e) => setFormData({ ...formData, authorDepartment: e.target.value })}
                className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="Your department"
              />
            </div>

            {/* Author Avatar Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Profile Picture
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'authorAvatar')}
                  className="hidden"
                  id="authorAvatar"
                  aria-label="Upload profile picture"
                />
                <label
                  htmlFor="authorAvatar"
                  className="flex items-center justify-center w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary hover:bg-background-primary cursor-pointer transition-all duration-300 focus-within:ring-2 focus-within:ring-accent-primary/50"
                >
                  <Upload className="w-5 h-5 mr-2 text-text-muted" />
                  <span>{formData.authorAvatar ? formData.authorAvatar.name : 'Choose profile picture'}</span>
                </label>
              </div>
              {authorAvatarPreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <img src={authorAvatarPreview} alt="Profile picture preview" className="w-24 h-24 rounded-full shadow-md object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('authorAvatar')}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-start">
            <motion.button
              type="submit"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              className="glow-button bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-6 py-2.5 text-sm rounded-md font-medium shadow-md flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            >
              <Save className="w-5 h-5" />
              <span>Submit Project</span>
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default SubmitProject;