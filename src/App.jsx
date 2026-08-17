import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import { VibeProvider } from './context/VibeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';

import HomePage from './pages/HomePage';
import VibesPage from './pages/VibesPage';
import DestinationPage from './pages/DestinationPage';
import BookingsPage from './pages/BookingsPage';
import ItineraryPage from './pages/ItineraryPage';
import ConfirmationPage from './pages/ConfirmationPage';

import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, setShowLogin }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      setShowLogin(true);
    }
  }, [user, loading, setShowLogin]);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AnimatedRoutes({ triggerToast, setShowLogin }) {
  const location = useLocation();

  const pageTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  const PageWrapper = ({ children }) => (
    <motion.main
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.main>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage showToast={triggerToast} onShowLogin={() => setShowLogin(true)} /></PageWrapper>} />
        <Route path="/vibes" element={<PageWrapper><VibesPage showToast={triggerToast} /></PageWrapper>} />
        <Route path="/destination" element={<PageWrapper><DestinationPage showToast={triggerToast} /></PageWrapper>} />
        <Route path="/bookings" element={<ProtectedRoute setShowLogin={setShowLogin}><PageWrapper><BookingsPage showToast={triggerToast} /></PageWrapper></ProtectedRoute>} />
        <Route path="/itinerary" element={<ProtectedRoute setShowLogin={setShowLogin}><PageWrapper><ItineraryPage showToast={triggerToast} /></PageWrapper></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute setShowLogin={setShowLogin}><PageWrapper><ConfirmationPage showToast={triggerToast} /></PageWrapper></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  return (
    <AuthProvider>
      <VibeProvider>
        <Router>
          <Loader />
          <Navbar onShowLogin={() => setShowLogin(true)} />
          
          <AnimatedRoutes triggerToast={triggerToast} setShowLogin={setShowLogin} />
          
          <Footer showToast={triggerToast} onShowLogin={() => setShowLogin(true)} />
          
          <LoginModal 
            show={showLogin} 
            onClose={() => setShowLogin(false)} 
            showToast={triggerToast} 
          />
          <Toast 
            message={toastMsg} 
            show={showToast} 
            onClose={() => setShowToast(false)} 
          />
        </Router>
      </VibeProvider>
    </AuthProvider>
  );
}
