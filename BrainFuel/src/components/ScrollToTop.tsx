import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useScrollToTop } from '../contexts/ScrollToTopContext';

const ScrollToTop = () => {
  const { position } = useScrollToTop();
  const [isVisible, setIsVisible] = useState(false);

  // التحقق من موضع التمرير
  const toggleVisibility = () => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (mainElement.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  // التمرير إلى أعلى الصفحة
  const scrollToTop = () => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', toggleVisibility);
      return () => {
        mainElement.removeEventListener('scroll', toggleVisibility);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
            transition: { duration: 0.15 },
          }}
          whileTap={{
            scale: 0.95,
            transition: { duration: 0.1 },
          }}
          onClick={scrollToTop}
          className={`fixed bottom-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-800 to-purple-800 rounded-full text-white shadow-lg shadow-purple-800/25 transition-all duration-300 ${
            position === 'support' ? 'right-28' : position === 'submit' ? 'right-8' : 'right-8'
          }`}
          aria-label="العودة إلى أعلى الصفحة"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 0 }}
            whileHover={{ rotate: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp className="w-6 h-6" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
