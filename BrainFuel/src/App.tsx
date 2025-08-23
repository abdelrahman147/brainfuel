import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Loading from './components/Loading';
import MobileOnlyLoading from './components/MobileOnlyLoading';
import ScrollToTop from './components/ScrollToTop';
import { ScrollToTopProvider } from './contexts/ScrollToTopContext';
import useMobileDetect from './hooks/useMobileDetect';
import Home from './pages/Home';
import Explore from './pages/Explore';
import SubmitProject from "./pages/SubmitProject";
import Chat from './pages/Chat';
import Support from './pages/Support';
import Payments from './pages/Payments';
import Login from './pages/Login';
import Forum from './pages/Forum';
import Card from './pages/Card';
import Store from './pages/Store';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Checkout from "./pages/Checkout";
import ProjectDetails from './pages/ProjectDetails';
import Exhibition from './pages/Exhibition';
import ExhibitionRegistration from './pages/ExhibitionRegistration';
import ScheduleCall from './pages/ScheduleCall';
import Sitemap from './pages/Sitemap';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';



function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMobileDetect();

  useEffect(() => {
    // محاكاة وقت التحميل لمدة 1.5 ثانية
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // يمكنك تعديل المدة حسب الحاجة

    // إذا كنت بحاجة لتحميل موارد (مثل صور أو API)، يمكن إضافتها هنا
    /*
    Promise.all([
      new Promise(resolve => setTimeout(resolve, 1000)),
      // إضافة تحميل موارد مثل الصور أو بيانات API
    ]).then(() => setIsLoading(false));
    */

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTopProvider>
        {isMobile ? (
          <MobileOnlyLoading />
        ) : (
          <>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="flex h-screen bg-background-primary overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/submit" element={<SubmitProject />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/card" element={<Card />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/project/:id" element={<ProjectDetails />} />
                    <Route path="/exhibition" element={<Exhibition />} />
                    <Route path="/exhibition-registration" element={<ExhibitionRegistration />} />
                    <Route path="/schedule-call" element={<ScheduleCall />} />
                    <Route path="/sitemap" element={<Sitemap />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                  </Routes>
                </main>
                
                {/* Scroll to Top Button */}
                <ScrollToTop />
              </div>
            )}
          </>
        )}
      </ScrollToTopProvider>
    </Router>
  );
}

export default App;