import { motion, AnimatePresence } from 'framer-motion';

const Loading = () => {
  return (
    <AnimatePresence>
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-transparent z-50 overflow-hidden"
      >
        {/* Particle Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <style>
            {`
              .particle {
                position: absolute;
                background: radial-gradient(circle, rgba(139, 92, 246, 0.5) 10%, transparent 70%);
                border-radius: 50%;
                animation: float 10s infinite linear;
                pointer-events: none;
              }
              .particle:nth-child(1) { width: 8px; height: 8px; top: 20%; left: 10%; animation-duration: 8s; }
              .particle:nth-child(2) { width: 6px; height: 6px; top: 50%; left: 80%; animation-duration: 12s; }
              .particle:nth-child(3) { width: 10px; height: 10px; top: 70%; left: 30%; animation-duration: 9s; }
              .particle:nth-child(4) { width: 5px; height: 5px; top: 30%; left: 60%; animation-duration: 11s; }
              .particle:nth-child(5) { width: 7px; height: 7px; top: 10%; left: 40%; animation-duration: 10s; }
              @media (min-width: 768px) {
                .particle:nth-child(1) { width: 10px; height: 10px; }
                .particle:nth-child(2) { width: 8px; height: 8px; }
                .particle:nth-child(3) { width: 12px; height: 12px; }
                .particle:nth-child(4) { width: 6px; height: 6px; }
                .particle:nth-child(5) { width: 9px; height: 9px; }
              }
              @keyframes float {
                0% { transform: translateY(0) translateX(0); opacity: 0.5; }
                50% { opacity: 0.8; }
                100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
              }
              .shiny-text {
                color: #b5b5b5a4;
                background: linear-gradient(
                  120deg,
                  rgba(255, 255, 255, 0) 40%,
                  rgba(255, 255, 255, 0.8) 50%,
                  rgba(255, 255, 255, 0) 60%
                );
                background-size: 200% 100%;
                -webkit-background-clip: text;
                background-clip: text;
                display: inline-block;
                animation: shine 5s linear infinite;
              }
              @keyframes shine {
                0% { background-position: 100%; }
                100% { background-position: -100%; }
              }
            `}
          </style>
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>

        <div className="text-center relative z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: 360,
              transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
            }}
            className="mb-4 md:mb-6"
          >
            <svg
              className="w-20 h-20 md:w-24 md:h-24 text-accent-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Loading spinner"
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
            className="text-xl md:text-2xl text-text-primary font-bold shiny-text"
          >
            Loading BrainFuel..
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xs md:text-sm text-text-muted mt-2"
          >
            Equipping the Innovation Center
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loading;