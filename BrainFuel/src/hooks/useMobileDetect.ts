import { useState, useEffect } from 'react';

const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // الكشف عن الهواتف المحمولة بناءً على عرض الشاشة
      const isMobileScreen = window.innerWidth <= 768;
      
      // الكشف عن User Agent للهواتف المحمولة
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      setIsMobile(isMobileScreen || isMobileUserAgent);
    };

    // التحقق عند التحميل
    checkMobile();

    // الاستماع لتغييرات حجم النافذة
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};

export default useMobileDetect;
