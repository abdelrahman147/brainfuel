import { motion, AnimatePresence } from 'framer-motion';

const MobileOnlyLoading = () => {
  return (
    <AnimatePresence>
      <motion.div
        key="mobile-only-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-accent-primary/20 via-accent-secondary/10 to-transparent z-50 overflow-hidden"
      >
        {/* Mobile-specific Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <style>
            {`
              .mobile-particle {
                position: absolute;
                background: radial-gradient(circle, rgba(139, 92, 246, 0.6) 10%, transparent 70%);
                border-radius: 50%;
                animation: mobileFloat 8s infinite linear;
                pointer-events: none;
              }
              .mobile-particle:nth-child(1) { width: 6px; height: 6px; top: 15%; left: 15%; animation-duration: 6s; }
              .mobile-particle:nth-child(2) { width: 4px; height: 4px; top: 60%; left: 85%; animation-duration: 10s; }
              .mobile-particle:nth-child(3) { width: 8px; height: 8px; top: 80%; left: 25%; animation-duration: 7s; }
              .mobile-particle:nth-child(4) { width: 3px; height: 3px; top: 25%; left: 70%; animation-duration: 9s; }
              .mobile-particle:nth-child(5) { width: 5px; height: 5px; top: 5%; left: 50%; animation-duration: 8s; }
              @keyframes mobileFloat {
                0% { transform: translateY(0) translateX(0); opacity: 0.6; }
                50% { opacity: 0.9; }
                100% { transform: translateY(-100vh) translateX(15px); opacity: 0; }
              }
              .mobile-shiny-text {
                color: #ffffff;
                background: linear-gradient(
                  120deg,
                  rgba(255, 255, 255, 0) 40%,
                  rgba(255, 255, 255, 0.9) 50%,
                  rgba(255, 255, 255, 0) 60%
                );
                background-size: 200% 100%;
                -webkit-background-clip: text;
                background-clip: text;
                display: inline-block;
                animation: mobileShine 4s linear infinite;
              }
              @keyframes mobileShine {
                0% { background-position: 100%; }
                100% { background-position: -100%; }
              }
            `}
          </style>
          <div className="mobile-particle" />
          <div className="mobile-particle" />
          <div className="mobile-particle" />
          <div className="mobile-particle" />
          <div className="mobile-particle" />
        </div>

        <div className="text-center relative z-10 px-4">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: 360,
              transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
            }}
            className="mb-6"
          >
            <svg
              className="w-16 h-16 text-accent-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Mobile loading spinner"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 12a8 8 0 1116 0 8 8 0 01-16 0"
              />
            </svg>
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-text-primary font-bold mobile-shiny-text"
          >
            BrainFuel..
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-text-muted mt-3"
          >
            Equipping the Innovation Center
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xs text-text-muted mt-2"
          >
            Coming Soon on Mobile Device
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileOnlyLoading;
