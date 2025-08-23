import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  X, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Video,
  Users,
  Star
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

/**
 * ScheduleCall Component
 * A professional page for scheduling calls with the BrainFuel team
 */
const ScheduleCall = () => {
  const { setPosition } = useScrollToTop();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    description: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ];

  // Call types
  const callTypes = [
    {
      id: 'consultation',
      title: 'Project Consultation',
      description: 'Get expert advice on your project development',
      icon: MessageSquare,
      duration: '30 min',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      description: 'Technical assistance with your project',
      icon: Users,
      duration: '45 min',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'partnership',
      title: 'Partnership Discussion',
      description: 'Explore collaboration opportunities',
      icon: Star,
      duration: '60 min',
      color: 'from-green-500 to-green-600'
    }
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === currentDate.toDateString();
      const isPast = date < currentDate;
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isPast,
        isSelected
      });
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (!date || date < new Date()) return;
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedDate && selectedTime && selectedType) {
      setCurrentStep(2);
    } else if (currentStep === 2 && formData.name && formData.email) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingConfirmed(true);
  };

  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setSelectedType('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      description: ''
    });
    setCurrentStep(1);
    setIsBookingConfirmed(false);
  };

  // Set scroll to top button position and scroll to top
  useEffect(() => {
    setPosition('default');
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setPosition]);

  const calendarDays = generateCalendarDays();

  if (isBookingConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent flex items-center justify-center p-4 sm:p-6 md:p-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 max-w-md w-full text-center mx-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-4">Booking Confirmed!</h2>
          <p className="text-text-secondary mb-6">
            Your call has been scheduled successfully. We'll send you a confirmation email with the meeting details.
          </p>
          
          <div className="bg-background-tertiary border border-border-primary rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-accent-primary" />
              <span className="font-semibold text-text-primary">
                {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-accent-primary" />
              <span className="text-text-secondary">{selectedTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-accent-primary" />
              <span className="text-text-secondary">{callTypes.find(t => t.id === selectedType)?.title}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetBooking}
              className="flex-1 px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:bg-accent-secondary transition-colors"
            >
              Schedule Another Call
            </button>
            <NavLink
              to="/"
              className="flex-1 px-6 py-3 border border-border-primary text-text-primary rounded-lg font-semibold hover:bg-background-tertiary transition-colors text-center"
            >
                              Back
            </NavLink>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <Phone className="w-8 h-8 text-accent-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Schedule a Call</h1>
          </motion.div>
          <p className="text-text-secondary text-lg">
            Book a consultation call with our expert team to discuss your project and get personalized guidance.
          </p>
        </div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center mb-8"
        >
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step 
                  ? 'bg-accent-primary text-white' 
                  : 'bg-background-tertiary text-text-secondary'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-accent-primary' : 'bg-background-tertiary'
                }`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-background-secondary border border-border-primary rounded-2xl p-8"
        >
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Call Type Selection */}
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Select Call Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {callTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTypeSelect(type.id)}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedType === type.id
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-border-primary hover:border-accent-primary/50'
                      }`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center mb-4`}>
                        <type.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-text-primary mb-2">{type.title}</h4>
                      <p className="text-text-secondary text-sm mb-3">{type.description}</p>
                      <span className="text-accent-primary text-sm font-medium">{type.duration}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Select Date</h3>
                <div className="bg-background-tertiary rounded-xl p-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h4 className="text-lg font-semibold text-text-primary">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-text-secondary py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(day.date)}
                        disabled={!day.isCurrentMonth || day.isPast}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          day.isSelected
                            ? 'bg-accent-primary text-white'
                            : day.isToday
                            ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary'
                            : day.isCurrentMonth && !day.isPast
                            ? 'hover:bg-background-secondary text-text-primary'
                            : 'text-text-muted cursor-not-allowed'
                        }`}
                      >
                        {day.date.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Select Time</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-3 rounded-lg font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-accent-primary text-white'
                            : 'bg-background-tertiary text-text-primary hover:bg-accent-primary/20'
                        }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-text-primary mb-6">Your Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Company/Organization</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                  placeholder="Brief description of what you'd like to discuss"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Additional Details</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition resize-none"
                  placeholder="Tell us more about your project or specific questions you have..."
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-text-primary mb-6">Review & Confirm</h3>
              
              <div className="bg-background-tertiary rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Call Type:</span>
                  <span className="font-semibold text-text-primary">
                    {callTypes.find(t => t.id === selectedType)?.title}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Date:</span>
                  <span className="font-semibold text-text-primary">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Time:</span>
                  <span className="font-semibold text-text-primary">{selectedTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Name:</span>
                  <span className="font-semibold text-text-primary">{formData.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Email:</span>
                  <span className="font-semibold text-text-primary">{formData.email}</span>
                </div>
                
                {formData.company && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Company:</span>
                    <span className="font-semibold text-text-primary">{formData.company}</span>
                  </div>
                )}
                
                {formData.subject && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Subject:</span>
                    <span className="font-semibold text-text-primary">{formData.subject}</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Video className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Meeting Details</h4>
                    <p className="text-text-secondary text-sm">
                      You'll receive a calendar invitation with video call details via email. 
                      The meeting will be conducted via Google Meet or Zoom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-primary">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-border-primary text-text-primary rounded-lg font-semibold hover:bg-background-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-3">
              <NavLink
                to="/support"
                className="px-6 py-3 border border-border-primary text-text-primary rounded-lg font-semibold hover:bg-background-tertiary transition-colors"
              >
                Cancel
              </NavLink>
              
              {currentStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && (!selectedDate || !selectedTime || !selectedType)) ||
                    (currentStep === 2 && (!formData.name || !formData.email))
                  }
                  className="px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:bg-accent-secondary transition-colors"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScheduleCall;
