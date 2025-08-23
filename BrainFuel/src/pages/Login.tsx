import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Eye, EyeOff, Mail, Github, X, Linkedin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

const Login = () => {
  const navigate = useNavigate();
  const { setPosition } = useScrollToTop();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    phoneCountryCode: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState({
    login: false,
    signupPassword: false,
    signupConfirmPassword: false,
  });
  const [isSubmitted, setIsSubmitted] = useState<'none' | 'login' | 'signup'>('none');
  const [error, setError] = useState<string | null>(null);

  // تحقق من صحة البريد الإلكتروني
  const isValidEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const handleLoginSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setError('Please fill out all fields.');
      return;
    }
    if (!isValidEmail(loginForm.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    console.log('Login submitted:', loginForm);
    setIsSubmitted('login');
    setError(null);
    setTimeout(() => {
      setIsSubmitted('none');
      // navigate('/dashboard'); // إلغاء التعليق إذا كنت تريد إعادة توجيه بعد تسجيل الدخول
    }, 2000);
  }, [loginForm, isValidEmail]);

  const handleSignupSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !signupForm.name.trim() ||
      !signupForm.email.trim() ||
      !signupForm.password.trim() ||
      !signupForm.confirmPassword.trim() ||
      !signupForm.country.trim() ||
      !signupForm.phoneCountryCode.trim() ||
      !signupForm.phoneNumber.trim()
    ) {
      setError('Please fill out all fields.');
      return;
    }
    if (!isValidEmail(signupForm.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    console.log('Sign Up submitted:', signupForm);
    setIsSubmitted('signup');
    setError(null);
    setTimeout(() => {
      setIsSubmitted('none');
      // navigate('/dashboard'); // إلغاء التعليق إذا كنت تريد إعادة توجيه بعد التسجيل
    }, 2000);
  }, [signupForm, isValidEmail]);

  const handleSocialLogin = useCallback((provider: string) => {
    console.log(`Login with ${provider}`);
  }, []);

  // Set scroll to top button position for pages without support modal
  useEffect(() => {
    setPosition('default');
    return () => setPosition('default');
  }, [setPosition]);

  const toggleShowPassword = useCallback((field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const socialButtons = [
    { provider: 'Gmail', icon: Mail },
    { provider: 'LinkedIn', icon: Linkedin },
    { provider: 'X', icon: X },
    { provider: 'GitHub', icon: Github },
  ];

  const countryCodes = [
    { code: '+20', country: 'EGY' },
    { code: '+966', country: 'KSA' },
    { code: '+971', country: 'UAE' },
    { code: '+212', country: 'MAR' },
    { code: '+213', country: 'DZ' },
    { code: '+1', country: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-background-primary flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-transparent z-0" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent-primary/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 relative z-10"
      >
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-purple-300">
          Login to access all site features easily.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-900 border border-purple-600 rounded-lg shadow-lg shadow-purple-600/25 p-4 sm:p-6 relative z-10 mx-4"
      >
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-tl-lg rounded-bl-lg ${
              activeTab === 'login'
                ? 'bg-purple-600 text-white'
                : 'bg-background-secondary text-purple-100 hover:bg-purple-700'
            }`}
            aria-label="Switch to login tab"
          >
            <LogIn className="w-5 h-5 inline mr-2" />
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-tr-lg rounded-br-lg ${
              activeTab === 'signup'
                ? 'bg-purple-600 text-white'
                : 'bg-background-secondary text-purple-100 hover:bg-purple-700'
            }`}
            aria-label="Switch to sign up tab"
          >
            <UserPlus className="w-5 h-5 inline mr-2" />
            Sign Up
          </button>
        </div>

        <style>{`
          .custom-select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23D8B4FE' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.5rem center;
            background-size: 12px;
            padding-right: 2rem;
          }
        `}</style>

        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              {isSubmitted === 'login' && (
                <motion.div
                  initial={{ opacity: 0, y: -30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.8 }}
                  className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-purple-600/10 backdrop-blur-md border border-purple-400/40 rounded-2xl p-6 shadow-2xl shadow-purple-500/20"
                >
                  {/* Animated background elements */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-indigo-400/5 animate-pulse" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-400" />
                  
                  <div className="relative flex items-center justify-center space-x-4">
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="relative w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full animate-ping opacity-20" />
                    </motion.div>
                    
                    <div className="text-center">
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-purple-300 font-bold text-xl mb-1"
                      >
                        Login Successful!
                      </motion.p>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-purple-400/80 text-sm font-medium"
                      >
                        Welcome back to BrainFuel
                      </motion.p>
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full opacity-60"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-2 left-2 w-1 h-1 bg-indigo-400 rounded-full opacity-40"
                  />
                </motion.div>
              )}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-center"
                >
                  {error}
                </motion.p>
              )}
              <form onSubmit={handleLoginSubmit} className="space-y-4" aria-labelledby="login-form-heading">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-100">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    aria-label="Email address"
                    className="mt-1 w-full px-3 py-2 bg-background-secondary border border-purple-600 rounded-lg text-purple-100 placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-purple-100">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword.login ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      aria-label="Password"
                      className="mt-1 w-full px-3 py-2 bg-background-secondary border border-purple-600 rounded-lg text-purple-100 placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('login')}
                      aria-label={showPassword.login ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-100 hover:text-purple-300"
                    >
                      {showPassword.login ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-purple-300 hover:text-purple-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-purple-100">Or continue with</span>
                  </div>
                </div>
                <div className="flex justify-center gap-3">
                  {socialButtons.map(({ provider, icon: Icon }) => (
                    <motion.button
                      key={provider}
                      onClick={() => handleSocialLogin(provider)}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-purple-100 hover:bg-purple-600/20 rounded-full transition"
                      title={provider}
                      aria-label={`Login with ${provider}`}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
                    transition: { duration: 0.15 }
                  }}
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 transition"
                >
                  Login
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              {isSubmitted === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: -30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.8 }}
                  className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-purple-600/10 backdrop-blur-md border border-purple-400/40 rounded-2xl p-6 shadow-2xl shadow-purple-500/20"
                >
                  {/* Animated background elements */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-indigo-400/5 animate-pulse" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-400" />
                  
                  <div className="relative flex items-center justify-center space-x-4">
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="relative w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full animate-ping opacity-20" />
                    </motion.div>
                    
                    <div className="text-center">
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-purple-300 font-bold text-xl mb-1"
                      >
                        Account Created Successfully!
                      </motion.p>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-purple-400/80 text-sm font-medium"
                      >
                        Welcome to BrainFuel
                      </motion.p>
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full opacity-60"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-2 left-2 w-1 h-1 bg-indigo-400 rounded-full opacity-40"
                  />
                </motion.div>
              )}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-center"
                >
                  {error}
                </motion.p>
              )}
              <form onSubmit={handleSignupSubmit} className="space-y-4" aria-labelledby="signup-form-heading">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-purple-100">
                    Username
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                    aria-label="Username"
                    className="mt-1 w-full px-3 py-2 bg-background-secondary border border-purple-600 rounded-lg text-purple-100 placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label htmlFor="signup-country" className="block text-sm font-medium text-purple-100">
                    Country
                  </label>
                  <select
                    id="signup-country"
                    value={signupForm.country}
                    onChange={(e) => setSignupForm({ ...signupForm, country: e.target.value })}
                    required
                    aria-label="Country"
                    className="mt-1 w-full px-3 py-2 bg-background-secondary border border-purple-600 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 custom-select"
                  >
                    <option value="">Select your country</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="UAE">UAE</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <label htmlFor="signup-phone-code" className="block text-sm font-medium text-purple-100">
                      Country Code
                    </label>
                    <select
                      id="signup-phone-code"
                      value={signupForm.phoneCountryCode}
                      onChange={(e) => setSignupForm({ ...signupForm, phoneCountryCode: e.target.value })}
                      required
                      aria-label="Phone country code"
                      className="mt-1 w-full px-3 py-2 bg-background-secondary border border-purple-600 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 custom-select"
                    >
                      <option value="">Code</option>
                      {countryCodes.map(({ code, country }) => (
                        <option key={code} value={code}>
                          {code} ({country})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="signup-phone" className="block text-sm font-medium text-purple-100">
                      Phone Number
                    </label>
                    <input
                      id="signup-phone"
                      type="tel"
                      value={signupForm.phoneNumber}
                      onChange={(e) => setSignupForm({ ...signupForm, phoneNumber: e.target.value })}
                      required
                      aria-label="Phone number"
                      className="mt-1 w-full px-3 py-2 bg-background-secondary border border-purple-600 rounded-lg text-purple-100 placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-purple-100">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                    aria-label="Email address"
                    className="mt-1 w-full px-3 py-2 bg-background-secondary border border-purple-600 rounded-lg text-purple-100 placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-purple-100">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword.signupPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                      aria-label="Password"
                      className="mt-1 w-full px-3 py-2 bg-background-secondary border border-purple-600 rounded-lg text-purple-100 placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('signupPassword')}
                      aria-label={showPassword.signupPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-100 hover:text-purple-300"
                    >
                      {showPassword.signupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-purple-100">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showPassword.signupConfirmPassword ? 'text' : 'password'}
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      required
                      aria-label="Confirm password"
                      className="mt-1 w-full px-3 py-2 bg-background-secondary border border-purple-600 rounded-lg text-purple-100 placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('signupConfirmPassword')}
                      aria-label={showPassword.signupConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-100 hover:text-purple-300"
                    >
                      {showPassword.signupConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-purple-100">Or sign up with</span>
                  </div>
                </div>
                <div className="flex justify-center gap-3">
                  {socialButtons.map(({ provider, icon: Icon }) => (
                    <motion.button
                      key={provider}
                      onClick={() => handleSocialLogin(provider)}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-purple-100 hover:bg-purple-600/20 rounded-full transition"
                      title={provider}
                      aria-label={`Sign up with ${provider}`}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
                    transition: { duration: 0.15 }
                  }}
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 transition"
                >
                  Sign Up
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;