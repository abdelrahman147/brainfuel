import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

/**
 * SubscriptionPlans Component
 * Displays three subscription plans with modern styling and fast hover animations.
 */
const SubscriptionPlans = () => {
  const { setPosition } = useScrollToTop();
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for individuals starting out.',
      features: [
        'Access to core features',
        '1 upload projects',
        'Free browsing',
        'Email support',
        'Basic analytics',
      ],
    },
    {
      name: 'Pro',
      price: '$6.99/month',
      description: 'Ideal for professionals and small teams.',
      features: [
        'All Basic features',
        '6 projects/month',
        'Support chat with doctors ',
        'Priority email support',
        'Advanced analytics',
        'Custom branding',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      description: 'Best for large teams and businesses.',
      features: [
        'All Pro features',
        'Unlimited projects',
        '24/7 team support',
        'Support chat with doctors ',
        'Support chat with companies ',
        'Full analytics suite',
        'Dedicated account manager',
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
          whileHover={{
            scale: 1.03,
            y: -5,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
          className="relative bg-gradient-to-br from-background-secondary to-background-primary/80 p-8 rounded-2xl shadow-xl transition-all duration-300 border border-accent-primary/20 hover:border-accent-primary/40 overflow-hidden"
        >
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/10 to-transparent opacity-50" />
          
          {/* Plan badge */}
          <motion.div
            className={`absolute top-0 right-0 text-white text-xs font-semibold px-3 py-1 rounded-bl-md ${
              plan.name === 'Enterprise'
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary shadow-md'
                : 'bg-accent-primary'
            }`}
            whileHover={plan.name === 'Enterprise' ? { scale: 1.1, boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' } : {}}
            transition={{ duration: 0.2 }}
          >
            {plan.name}
          </motion.div>

          <h3 className="text-2xl font-bold text-text-primary mb-3 relative z-10">{plan.name}</h3>
          <p className="text-3xl font-extrabold text-accent-primary mb-4 relative z-10">
            {plan.price}
            {plan.price !== 'Contact Us' && (
              <span className="text-sm font-normal text-text-secondary">/mo</span>
            )}
          </p>
          <p className="text-base text-text-secondary mb-6 relative z-10">{plan.description}</p>
          <ul className="text-sm text-text-primary mb-8 space-y-3 relative z-10">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="mr-3 text-accent-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
          {plan.name === 'Basic' ? (
            <div className="w-full bg-accent-primary/10 text-accent-primary py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 relative z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Active Plan
            </div>
          ) : plan.name === 'Enterprise' ? (
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white py-3 rounded-xl font-semibold text-base border border-accent-primary/50 hover:border-accent-primary transition-colors duration-200 relative z-10 shadow-md hover:shadow-lg hover:shadow-accent-primary/30"
              >
                Contact Us
              </motion.button>
            </Link>
          ) : (
            <Link to="/checkout">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-accent-primary text-white py-3 rounded-xl font-semibold text-base hover:bg-accent-primary/90 transition-colors duration-200 relative z-10 shadow-md"
              >
                Choose Plan
              </motion.button>
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Payments Component
 */
const Payments = () => {
  const { setPosition } = useScrollToTop();

  // Set scroll to top button position for pages without support modal
  useEffect(() => {
    setPosition('default');
    return () => setPosition('default');
  }, [setPosition]);

  return (
    <div className="min-h-screen bg-background-primary bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-transparent relative overflow-hidden flex flex-col justify-center items-center py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4 flex items-center justify-center gap-2">
          <CreditCard className="w-8 h-8 text-accent-primary" />
          Choose Your Plan
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Unlock the full potential of our platform with a plan tailored to your needs.
        </p>
      </motion.div>
      <SubscriptionPlans />
    </div>
  );
};

export default Payments;
