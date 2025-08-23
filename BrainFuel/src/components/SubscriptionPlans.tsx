import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const SubscriptionPlans = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started with project sharing',
      features: [
        'Submit up to 3 projects',
        'Basic project analytics',
        'Community access',
        'Email support'
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      description: 'Advanced features for serious innovators',
      features: [
        'Unlimited project submissions',
        'Advanced analytics & insights',
        'Priority support',
        'Exclusive workshops',
        'Featured project placement',
        'Direct mentor access'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      description: 'Custom solutions for universities and organizations',
      features: [
        'Custom branding',
        'API access',
        'Dedicated support team',
        'Advanced reporting',
        'White-label options',
        'Custom integrations'
      ]
    }
  ]

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
          
          <Link
            to={plan.name === 'Basic' ? '/explore' : '/checkout'}
            className="relative z-10 w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-lg hover:from-accent-secondary hover:to-accent-primary transition-all duration-300 shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40"
          >
            {plan.name === 'Basic' ? 'Get Started' : 'Choose Plan'}
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default SubscriptionPlans