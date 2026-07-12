import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          
          <Routes>
            <Route path="/" element={<HomePage showToast={triggerToast} onShowLogin={() => setShowLogin(true)} />} />
            <Route path="/vibes" element={<VibesPage showToast={triggerToast} />} />
            <Route path="/destination" element={<DestinationPage showToast={triggerToast} />} />
            <Route path="/bookings" element={<BookingsPage showToast={triggerToast} />} />
            <Route path="/itinerary" element={<ItineraryPage showToast={triggerToast} />} />
            <Route path="/confirmation" element={<ConfirmationPage showToast={triggerToast} />} />
          </Routes>
          
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
