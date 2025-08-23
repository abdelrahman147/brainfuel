import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Menu, 
  DollarSign, 
  Banknote, 
  Wallet, 
  Lock, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Clock,
  Star,
  Zap,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  ShoppingCart,
  Package,
  Truck,
  RefreshCw
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useScrollToTop } from '../contexts/ScrollToTopContext';
import { NavLink } from 'react-router-dom';

interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
  isPopular?: boolean;
}

const Checkout = () => {
  const { setPosition } = useScrollToTop();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [showCvv, setShowCvv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Form data
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States"
  });

  // Order items (mock data)
  const orderItems: OrderItem[] = [
    {
      id: "1",
      name: "BrainFuel Pro Plan",
      description: "Full access to all features of pro plan",
      price: 6.99,
      quantity: 1,
      image: "pro-icon"
    }
  ];

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay securely with your card',
      isPopular: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'Pay with your PayPal account'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Banknote,
      description: 'Direct bank transfer'
    }
  ];

  // Array of payment-related icons to cycle through
  const paymentIcons = [CreditCard, DollarSign, Banknote, Wallet];

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0; // No tax
  const shipping = 0; // Free shipping
  const discount = isPromoApplied ? (subtotal * 0.25) : 0; // 25% discount
  const total = subtotal + tax + shipping - discount;

  // Validate card number (basic: 16 digits)
  const isValidCardNumber = (cardNumber: string) => {
    const cardRegex = /^\d{16}$/;
    return cardRegex.test(cardNumber.replace(/\s/g, ""));
  };

  // Validate expiry date (MM/YY format)
  const isValidExpiryDate = (expiryDate: string) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    return expiryRegex.test(expiryDate);
  };

  // Validate CVV (3 or 4 digits)
  const isValidCvv = (cvv: string) => {
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
  };

  // Validate email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission with validation
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    // Validate required fields
    if (!formData.cardHolder.trim() || !formData.cardNumber.trim() || 
        !formData.expiryDate.trim() || !formData.cvv.trim() ||
        !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in all required fields.");
      setIsProcessing(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      setIsProcessing(false);
      return;
    }

    if (!isValidCardNumber(formData.cardNumber)) {
      setError("Please enter a valid 16-digit card number.");
      setIsProcessing(false);
      return;
    }

    if (!isValidExpiryDate(formData.expiryDate)) {
      setError("Please enter a valid expiry date (MM/YY).");
      setIsProcessing(false);
      return;
    }

    if (!isValidCvv(formData.cvv)) {
      setError("Please enter a valid CVV (3 or 4 digits).");
      setIsProcessing(false);
      return;
    }

    try {
      // Simulate API call for payment processing
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      
      setIsSubmitted(true);
      setFormData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardHolder: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        country: "United States"
      });
      
      setTimeout(() => {
        setIsSubmitted(false);
        setCurrentStep(1);
      }, 5000);
      
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  }, [formData]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Set scroll to top button position
  useEffect(() => {
    setPosition('default');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => setPosition('default');
  }, [setPosition]);

  // Cycle through payment icons on hover
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isHovering) {
      intervalId = setInterval(() => {
        setCurrentIconIndex((prev) => (prev + 1) % paymentIcons.length);
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [isHovering, paymentIcons.length]);

  // Get the current icon component
  const CurrentIcon = paymentIcons[currentIconIndex];

  // Handle promo code application
  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'horus2025') {
      setIsPromoApplied(true);
      setPromoDiscount(subtotal * 0.25);
      alert('🎉 Promo code applied! 25% discount activated.');
    } else {
      setIsPromoApplied(false);
      setPromoDiscount(0);
      alert('❌ Invalid promo code. Please try again.');
    }
  };

  // Handle promo code input change
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent flex items-center justify-center p-4 sm:p-6 md:p-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background-secondary border border-border-primary rounded-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-4">Payment Successful!</h2>
          <p className="text-text-secondary mb-6">
            Your order has been processed successfully. You'll receive a confirmation email shortly.
          </p>
          
          <div className="bg-background-tertiary border border-border-primary rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-accent-primary" />
              <span className="font-semibold text-text-primary">Total Paid: ${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-accent-primary" />
              <span className="text-text-secondary">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-accent-primary" />
              <span className="text-text-secondary">Transaction ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <NavLink
              to="/"
              className="flex-1 px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:bg-accent-secondary transition-colors text-center"
            >
                              Back
            </NavLink>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
              className="flex-1 px-6 py-3 border border-border-primary text-text-primary rounded-lg font-semibold hover:bg-background-tertiary transition-colors"
            >
              New Order
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent p-4 sm:p-6 md:p-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <NavLink
              to="/payments"
              className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </NavLink>
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6 text-accent-primary" />
              <h1 className="text-3xl font-bold text-text-primary">Checkout</h1>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step 
                    ? 'bg-accent-primary text-white' 
                    : 'bg-background-tertiary text-text-secondary'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step ? 'bg-accent-primary' : 'bg-background-tertiary'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-background-secondary/80 backdrop-blur-md border border-border-primary/50 rounded-2xl p-6 lg:p-8 shadow-lg shadow-accent-primary/10"
            >
              {/* Payment Methods Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-border-primary hover:border-accent-primary/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <method.icon className="w-6 h-6 text-accent-primary" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-text-primary">{method.name}</span>
                            {method.isPopular && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Popular</span>
                            )}
                          </div>
                          <p className="text-sm text-text-secondary">{method.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Payment Form */}
              {selectedPaymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Card Information</h3>
                  
                  {/* Card Number */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-text-primary mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(formData.cardNumber)}
                      onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\s/g, '')})}
                      maxLength={19}
                      className="w-full p-4 pr-12 bg-background-primary/95 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 border border-border-primary"
                      required
                    />
                                         <CreditCard className="absolute right-4 bottom-4 w-5 h-5 text-accent-primary" />
                  </div>

                  {/* Card Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardHolder"
                        placeholder="John Doe"
                        value={formData.cardHolder}
                        onChange={handleChange}
                        className="w-full p-4 bg-background-primary/95 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 border border-border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        maxLength={5}
                        className="w-full p-4 bg-background-primary/95 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 border border-border-primary"
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-text-primary mb-2">CVV</label>
                      <input
                        type={showCvv ? "text" : "password"}
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        maxLength={4}
                        className="w-full p-4 pr-12 bg-background-primary/95 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 border border-border-primary"
                        required
                      />
                                             <button
                         type="button"
                         onClick={() => setShowCvv(!showCvv)}
                         className="absolute right-4 bottom-4 text-text-muted hover:text-text-primary"
                       >
                        {showCvv ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t border-border-primary pt-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-4 bg-background-primary/95 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 border border-border-primary"
                          required
                        />
                      </div>
                                             <div>
                         <label className="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
                         <input
                           type="tel"
                           name="phone"
                           placeholder="+20 10 1234 5678"
                           value={formData.phone}
                           onChange={handleChange}
                           className="w-full p-4 bg-background-primary/95 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 border border-border-primary"
                           required
                         />
                       </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-text-primary mb-1">Secure Payment</h4>
                        <p className="text-text-secondary text-sm">
                          Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-400">{error}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(139, 92, 246, 0.7)",
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => {
                      setIsHovering(false);
                      setCurrentIconIndex(0);
                    }}
                    disabled={isProcessing}
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-4 rounded-xl border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span className="text-lg font-medium">Processing...</span>
                      </>
                    ) : (
                      <>
                                                 <motion.div
                           key={currentIconIndex}
                           initial={{ opacity: 0, scale: 0.8, x: -20 }}
                           animate={{
                             opacity: 1,
                             scale: 1,
                             x: isHovering ? 0 : -20,
                             transition: { type: "spring", stiffness: 200, damping: 15, duration: 0.3 },
                           }}
                           className={isHovering ? "absolute left-1/2 transform -translate-x-1/2" : ""}
                         >
                           <CurrentIcon className="w-5 h-5" />
                         </motion.div>
                         <motion.span
                           initial={false}
                           animate={{
                             opacity: isHovering ? 0 : 1,
                             x: isHovering ? 20 : 0,
                             transition: { duration: 0.3, ease: "easeOut" },
                           }}
                           className="text-lg font-medium"
                         >
                           Pay ${total.toFixed(2)}
                         </motion.span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}

                             {/* Other Payment Methods */}
               {selectedPaymentMethod !== 'card' && (() => {
                 const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
                 const SelectedIcon = selectedMethod?.icon;
                 
                 return (
                   <div className="text-center py-12">
                     <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                       {SelectedIcon && <SelectedIcon className="w-8 h-8 text-accent-primary" />}
                     </div>
                     <h3 className="text-lg font-semibold text-text-primary mb-2">
                       {selectedMethod?.name}
                     </h3>
                     <p className="text-text-secondary mb-6">
                       {selectedMethod?.description}
                     </p>
                     <button
                       onClick={() => setSelectedPaymentMethod('card')}
                       className="px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:bg-accent-secondary transition-colors"
                     >
                       Switch to Card Payment
                     </button>
                   </div>
                 );
               })()}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-background-secondary/80 backdrop-blur-md border border-border-primary/50 rounded-2xl p-6 shadow-lg shadow-accent-primary/10 sticky top-6"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">%</span>
                  </div>
                  <h3 className="font-medium text-text-primary">Promo Code</h3>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={handlePromoCodeChange}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-sm"
                  />
                  <button 
                    onClick={handleApplyPromo}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      isPromoApplied 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-accent-primary text-white hover:bg-accent-secondary'
                    }`}
                  >
                    {isPromoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {isPromoApplied && (
                  <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 text-sm font-medium">25% discount applied!</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order Items */}
               <div className="space-y-4 mb-6">
                 {orderItems.map((item) => (
                   <div key={item.id} className="flex items-center space-x-3">
                     {item.image === "pro-icon" ? (
                       <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                         <Star className="w-6 h-6 text-white" />
                       </div>
                     ) : (
                       <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                     )}
                     <div className="flex-1">
                       <h4 className="font-medium text-text-primary">{item.name}</h4>
                       <p className="text-sm text-text-secondary">{item.description}</p>
                     </div>
                     <div className="text-right">
                       <p className="font-semibold text-text-primary">${item.price.toFixed(2)}</p>
                       <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                     </div>
                   </div>
                 ))}
               </div>

              {/* Price Breakdown */}
              <div className="border-t border-border-primary pt-4 space-y-2">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount (25%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border-primary pt-2">
                  <div className="flex justify-between text-lg font-semibold text-text-primary">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-border-primary">
                <div className="flex items-center justify-center space-x-4 text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>SSL Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>PCI Compliant</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-text-secondary">Instant Access</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-text-secondary">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-text-secondary">Premium Features</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;